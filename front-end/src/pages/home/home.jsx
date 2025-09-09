import React, { useEffect, useState } from "react";
import { Nav } from "rsuite";
import "./home.css";
import { getTasksByDueDate, getTasksByCreatedAt } from "../../utils/service";
import { RiAiGenerate2, RiDeleteBin6Line, RiEdit2Line } from "react-icons/ri";
import { Modal } from "rsuite";
import TaskForm from "../../components/TaskForm";
import { useTaskContext } from "../../context/TaskContext";
import AdviceModal from "../../components/AdviceModal";

const Home = () => {
  const [activeKey, setActiveKey] = useState("due");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [adviceSteps, setAdviceSteps] = useState([]);
  const [openAdvice, setOpenAdvice] = useState(false);
  const {
    removeTask,
    setForm,
    setEditId,
    advice,
    setAdvice,
    adviceByTaskId,
    setAdviceByTaskId,
  } = useTaskContext();

  // Data de hoje no formato yyyy-MM-dd
  const today = new Date();
  const pad = (n) => n.toString().padStart(2, "0");
  const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(
    today.getDate()
  )}`;

  const handleAdvice = async (task) => {
    // Checa se já existe advice para o ID da tarefa
    if (adviceByTaskId && adviceByTaskId[task._id]) {
      setAdvice(adviceByTaskId[task._id].advice);
      setAdviceSteps(adviceByTaskId[task._id].steps);
      setOpenAdvice(true);
      return;
    }
    try {
      // Busca do backend
      const service = await import("../../utils/service");
      const dicasObj = await service.getTaskAdvice(
        task.title,
        task.description,
        task.dueDate || task.date,
        task._id
      );
      let steps = [];
      let adviceText = "";
      if (Array.isArray(dicasObj)) {
        steps = dicasObj.map(String);
      } else if (dicasObj && typeof dicasObj === "object") {
        if (Array.isArray(dicasObj.steps)) {
          steps = dicasObj.steps.map(String);
        } else {
          steps = Object.values(dicasObj)
            .filter((v) => typeof v === "string")
            .map(String);
        }
        adviceText = dicasObj.advice || "";
      }
      setAdvice(adviceText);
      setAdviceSteps(steps);
      setAdviceByTaskId((prev) => ({
        ...prev,
        [task._id]: { advice: adviceText, steps },
      }));
      setOpenAdvice(true);
    } catch {
      setAdvice("Erro ao obter conselho da IA");
      setAdviceSteps(["Erro ao obter conselho da IA"]);
      setOpenAdvice(true);
    }
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
      }
    }
    fetchTasks();
  }, [activeKey, todayStr]);

  // Função para obter conselho da IA para uma tarefa

  return (
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
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      <RiAiGenerate2 />
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
                      onClick={() => removeTask(task._id)}
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
          onClose={() => setOpenAdvice(false)}
          advice={advice}
          adviceSteps={adviceSteps}
          tasks={tasks}
          onAdviceStepsChange={setAdviceSteps}
        />
      </div>
    </div>
  );
};

export default Home;
