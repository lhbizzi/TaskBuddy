import React, { useEffect, useState, useRef } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendar.css";
import { RiAiGenerate2, RiDeleteBin6Line, RiEdit2Line } from "react-icons/ri";
import { Modal, Loader } from "rsuite";
import AdviceModal from "../../components/AdviceModal";
import TaskForm from "../../components/TaskForm";
import { useTaskContext } from "../../context/TaskContext";
import { getTaskAdvice, getAdviceByUserAndTask } from "../../utils/service";
import { errorMessage } from "../../utils/notifications";

const CalendarPage = () => {
  const [date, setDate] = useState(new Date());
  const [adviceSteps, setAdviceSteps] = useState([]);
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
  // adviceByTaskId agora vem do contexto global
  const [openAdvice, setOpenAdvice] = useState(false);
  const [currentAdviceTaskId, setCurrentAdviceTaskId] = useState(null);
  const [loadingAdviceId, setLoadingAdviceId] = useState(null);
  const {
    tasks,
    removeTask,
    setForm,
    setEditId,
    initialFormState,
    form,
    advice,
    setAdvice,
    setAdviceByTaskId,
  } = useTaskContext();
  // Garantir valor estável para initialFormState
  const initialFormStateRef = useRef(initialFormState);

  // Função para obter conselho da IA para uma tarefa
  const handleAdvice = async (task) => {
    // marca como loading para essa tarefa até abrir o modal
    setLoadingAdviceId(task._id);
    setCurrentAdviceTaskId(task._id);
    console.log("Buscando conselho da IA para tarefa:", task);

    // 1) Primeiro, tenta obter advice salvo no banco
    try {
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

  // Filtra tarefas do dia selecionado
  const tasksForDay = tasks.filter((task) => {
    const taskDate = task.dueDate;
    if (!taskDate) return false;
    // Normaliza para yyyy-MM-dd
    const pad = (n) => n.toString().padStart(2, "0");
    const selectedDateStr = `${date.getFullYear()}-${pad(
      date.getMonth() + 1
    )}-${pad(date.getDate())}`;
    let taskDateStr = taskDate;
    if (taskDate instanceof Date) {
      taskDateStr = `${taskDate.getFullYear()}-${pad(
        taskDate.getMonth() + 1
      )}-${pad(taskDate.getDate())}`;
    } else if (/^\d{2}\/\d{2}\/\d{4}$/.test(taskDate)) {
      const [d, m, y] = taskDate.split("/");
      taskDateStr = `${y}-${pad(m)}-${pad(d)}`;
    }
    return taskDateStr === selectedDateStr;
  });

  useEffect(() => {
    // Sempre soma +1 dia ao selecionado
    const nextDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + 1
    );
    const pad = (n) => n.toString().padStart(2, "0");
    const nextDayStr = `${nextDay.getFullYear()}-${pad(
      nextDay.getMonth() + 1
    )}-${pad(nextDay.getDate())}`;
    setForm((prev) => ({
      ...initialFormStateRef.current,
      ...prev,
      dueDate: nextDayStr,
    }));
  }, [date, setForm]);

  return (
    <div className="calendar-full">
      <aside className="calendar-sidebar">
        <h1>Calendário</h1>
        <Calendar onChange={setDate} value={date} className="google-calendar" />
      </aside>
      <main className="calendar-main">
        <header>
          <h2>
            {date.toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </h2>
        </header>
        <section className="tasks-list">
          <h3>Tarefas Vencendo o Prazo</h3>

          {tasksForDay.length === 0 ? (
            <p className="no-tasks">Nenhuma tarefa para este dia.</p>
          ) : (
            <ul>
              {tasksForDay.map((task, idx) => (
                <li key={idx} className="task-item">
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
                            cursor:
                              loadingAdviceId === task._id
                                ? "default"
                                : "pointer",
                          }}
                        >
                          {loadingAdviceId === task._id ? (
                            <Loader size="sm" />
                          ) : (
                            <RiAiGenerate2 />
                          )}
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
        </section>
        <section className="task-create">
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
            onAdviceStepsChange={setAdviceSteps}
            titleTask={form.title}
            taskId={currentAdviceTaskId}
          />
          {advice && (
            <div className="task-advice">
              <strong>Conselho da IA:</strong>
              <p>{advice}</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default CalendarPage;
