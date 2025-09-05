import React, { useEffect, useState } from "react";
import { Nav } from "rsuite";
import "./home.css";
import { getTasksByDueDate, getTasksByCreatedAt } from "../../utils/service";
import { RiAiGenerate2, RiDeleteBin6Line, RiEdit2Line } from "react-icons/ri";
import { Modal } from "rsuite";
import TaskForm from "../../components/TaskForm";
import { useTaskContext } from "../../context/TaskContext";

const Home = () => {
  const [activeKey, setActiveKey] = useState("due");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [advice, setAdvice] = useState("");
  const [adviceSteps, setAdviceSteps] = useState([]);
  const [openAdvice, setOpenAdvice] = useState(false);
  const { removeTask, setForm, setEditId } = useTaskContext();

  // Data de hoje no formato yyyy-MM-dd
  const today = new Date();
  const pad = (n) => n.toString().padStart(2, "0");
  const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(
    today.getDate()
  )}`;

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
  const handleAdvice = async (task) => {
    try {
      const ai = await import("../../utils/service").then((m) =>
        m.getTaskAdvice(task.title, task.dueDate || task.date)
      );
      if (ai && typeof ai === "object" && !Array.isArray(ai)) {
        const dicasArr = Object.values(ai).filter(Boolean);
        setAdviceSteps(dicasArr);
        setAdvice("");
      } else {
        setAdvice(ai.advice || ai);
        setAdviceSteps([]);
      }
      setOpenAdvice(true);
    } catch {
      setAdvice("Erro ao obter conselho da IA");
      setAdviceSteps([]);
      setOpenAdvice(true);
    }
  };

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
                  <div></div>
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
      </div>
      {/* Modal de conselho da IA */}
      <Modal open={openAdvice} onClose={() => setOpenAdvice(false)}>
        <Modal.Header>
          <Modal.Title>Conselho da IA</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {adviceSteps.length > 0 ? (
            <div style={{ display: "grid", gap: "8px" }}>
              {adviceSteps.map((dica, idx) => {
                const exists = tasks.some(
                  (t) =>
                    t.title &&
                    t.title.trim().toLowerCase() === dica.trim().toLowerCase()
                );
                return (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      background: exists ? "#f8d7da" : "#f4f8fb",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      opacity: exists ? 0.6 : 1,
                    }}
                  >
                    <span style={{ flex: 1 }}>{dica}</span>
                    <input
                      type="checkbox"
                      disabled={exists}
                      style={{ marginLeft: 12 }}
                    />
                    {exists && (
                      <span
                        style={{
                          color: "#c0392b",
                          marginLeft: 8,
                          fontSize: 12,
                        }}
                      >
                        Já cadastrada
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p>{advice}</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button onClick={() => setOpenAdvice(false)}>Fechar</button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Home;
