import { useEffect, useState } from "react";
import { Loader, Nav } from "rsuite";
import "./home.css";
import { getTasksByDueDate, getTasksByCreatedAt } from "../../utils/service";
import { RiAiGenerate2, RiDeleteBin6Line, RiEdit2Line } from "react-icons/ri";
import { Modal } from "rsuite";
import TaskForm from "../../components/TaskForm";
import { useTaskContext } from "../../context/TaskContext";
import AdviceModal from "../../components/AdviceModal";
import { getTaskAdvice, getAdviceByUserAndTask } from "../../utils/service";
import { errorMessage } from "../../utils/notifications";

const Home = () => {
  const [activeKey, setActiveKey] = useState("due");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [adviceSteps, setAdviceSteps] = useState([]);
  const [openAdvice, setOpenAdvice] = useState(false);
  const [currentAdviceTaskId, setCurrentAdviceTaskId] = useState(null);
  const [loadingAdviceId, setLoadingAdviceId] = useState(null);

  // normaliza steps para [{ text, checked }]
  const normalizeSteps = (arr) =>
    (arr || []).map((s) => {
      if (!s) return { text: "", checked: false };
      if (typeof s === "string") return { text: s, checked: false };
      if (typeof s === "object")
        return {
          text: s.text || s.label || String(s),
          checked: !!s.checked || !!s.done || false,
        };
      return { text: String(s), checked: false };
    });
  const {
    removeTask,
    form,
    setForm,
    setEditId,
    advice,
    setAdvice,
    adviceByTaskId,
    setAdviceByTaskId,
    reloadHome,
    setReloadHome,
    modalOpen,
    setModalOpen,
  } = useTaskContext();

  const [task, setTask] = useState(null);
  // Data de hoje no formato yyyy-MM-dd
  const today = new Date();
  const pad = (n) => n.toString().padStart(2, "0");
  const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(
    today.getDate()
  )}`;

  const handleAdvice = async (task) => {
    // marca como loading para essa tarefa até abrir o modal
    setLoadingAdviceId(task._id);
    setCurrentAdviceTaskId(task._id);
    console.log("Buscando conselho da IA para tarefa:", task);

    // 1) Primeiro, tenta obter advice salvo no banco
    try {
      // 0) verifica cache local primeiro
      const cached = adviceByTaskId && adviceByTaskId[task._id];
      if (cached) {
        setAdvice(cached.advice || "");
        setAdviceSteps(cached.steps || []);
        setOpenAdvice(true);
        setLoadingAdviceId(null);
        return;
      }

      // 1) tenta obter advice salvo no banco
      const saved = await getAdviceByUserAndTask(task._id);
      if (saved) {
        const normalizedSaved = normalizeSteps(saved.steps || []);
        setAdvice(saved.advice || "");
        setAdviceSteps(normalizedSaved);
        setAdviceByTaskId((prev) => ({
          ...prev,
          [task._id]: { advice: saved.advice || "", steps: normalizedSaved },
        }));
        setOpenAdvice(true);
        setLoadingAdviceId(null);
        return;
      }
    } catch (err) {
      errorMessage("Erro ao obter conselho salvo", err);
      setLoadingAdviceId(null);
    }

    // 2) Se não houver no banco, solicita à IA
    try {
      const dicasObj = await getTaskAdvice(
        task.title,
        task.description,
        task.dueDate || task.date,
        task._id
      );
      // dicasObj pode ser {advice: string, steps: array} ou só steps
      let steps = [];
      let adviceText = "";
      if (Array.isArray(dicasObj)) {
        steps = dicasObj.map(String);
      } else if (dicasObj && typeof dicasObj === "object") {
        if (Array.isArray(dicasObj.steps)) {
          steps = dicasObj.steps.map(String);
        } else {
          // Se for objeto tipo {dica1:..., dica2:...}, transforma em array de strings
          steps = Object.values(dicasObj)
            .filter((v) => typeof v === "string")
            .map(String);
        }
        adviceText = dicasObj.advice || "";
      }
      setAdvice(adviceText);
      const normalized = normalizeSteps(steps);
      setAdviceSteps(normalized);
      setAdviceByTaskId((prev) => ({
        ...prev,
        [task._id]: { advice: adviceText, steps: normalized },
      }));
      setOpenAdvice(true);
      // desativa loader quando o modal é aberto
      setLoadingAdviceId(null);
      setCurrentAdviceTaskId(task._id);
    } catch {
      setAdvice("Erro ao obter conselho da IA");
      setAdviceSteps([]);
      setOpenAdvice(true);
      setLoadingAdviceId(null);
    }
  };

  // Atualiza steps no estado local e no cache adviceByTaskId (inclui checked)
  const handleAdviceStepsChange = (steps) => {
    setAdviceSteps(steps || []);
    if (!currentAdviceTaskId) return;
    setAdviceByTaskId((prev) => ({
      ...prev,
      [currentAdviceTaskId]: { advice: advice || "", steps: steps || [] },
    }));
  };

  useEffect(() => {
    async function fetchTasks() {
      setLoading(true);
      setError("");
      try {
        let data = [];
        if (activeKey === "due") {
          data = await getTasksByDueDate(todayStr);
        } else {
          data = await getTasksByCreatedAt(todayStr);
        }
        setTasks(data);
      } catch (err) {
        setError(err.message || "Erro ao buscar tarefas");
      } finally {
        setLoading(false);
        setReloadHome(false);
      }
    }
    fetchTasks();
  }, [activeKey, todayStr, reloadHome, setReloadHome]);

  // Função para obter conselho da IA para uma tarefa

  return (
    <>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Modal.Header>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Você tem certeza que deseja excluir esta tarefa?</p>
        </Modal.Body>
        <Modal.Footer>
          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}
          >
            <button onClick={() => setModalOpen(false)}>Cancelar</button>
            <button appearance="primary" onClick={() => removeTask(task._id)}>
              Confirmar
            </button>
          </div>
        </Modal.Footer>
      </Modal>
      <div className="all-pages">
        <h1>Hoje</h1>
        <Nav
          appearance="tabs"
          activeKey={activeKey}
          onSelect={setActiveKey}
          style={{ marginBottom: 24 }}
        >
          <Nav.Item eventKey="due">Tarefas que encerram hoje</Nav.Item>
          <Nav.Item eventKey="created">Tarefas criadas hoje</Nav.Item>
        </Nav>
        {loading ? (
          <p>Carregando...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : tasks.length === 0 ? (
          <p>Nenhuma tarefa encontrada.</p>
        ) : (
          <ul className="home-task-list">
            {tasks.map((task) => (
              <li key={task._id} className="task-item">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                      {task.title}
                    </span>
                    <span>{task.description}</span>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <div>
                      <button
                        type="button"
                        title="Conselho da IA"
                        onClick={() => handleAdvice(task)}
                        disabled={loadingAdviceId === task._id}
                        aria-busy={loadingAdviceId === task._id}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        {loadingAdviceId === task._id ? (
                          <Loader size="sm" />
                        ) : (
                          <RiAiGenerate2 />
                        )}
                      </button>
                    </div>
                    <div>
                      <button
                        type="button"
                        title="Editar Tarefa"
                        onClick={() => {
                          setEditId(task._id);
                          setForm((prev) => ({
                            ...prev,
                            id: task._id,
                            title: task.title,
                            description: task.description,
                            dueDate: task.dueDate,
                          }));
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        <RiEdit2Line />
                      </button>
                    </div>
                    <div>
                      <button
                        type="button"
                        title="Remover Tarefa"
                        onClick={() => {
                          setModalOpen(true);
                          setTask(task);
                        }}
                      >
                        <RiDeleteBin6Line
                          style={{
                            color: "red",
                            backgroundColor: "transparent",
                          }}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div style={{ margin: "48px auto 0 auto", maxWidth: 600 }}>
          <TaskForm />
          <AdviceModal
            open={openAdvice}
            onClose={() => {
              setOpenAdvice(false);
              setCurrentAdviceTaskId(null);
            }}
            advice={advice}
            adviceSteps={adviceSteps}
            tasks={tasks}
            onAdviceStepsChange={handleAdviceStepsChange}
            titleTask={form.title}
            taskId={currentAdviceTaskId}
          />
        </div>
      </div>
    </>
  );
};

export default Home;
