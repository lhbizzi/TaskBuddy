import React, { useEffect, useState, useRef } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendar.css";
import { RiAiGenerate2, RiDeleteBin6Line, RiEdit2Line } from "react-icons/ri";
import { Modal } from "rsuite";
import AdviceModal from "../../components/AdviceModal";
import TaskForm from "../../components/TaskForm";
import { useTaskContext } from "../../context/TaskContext";

const CalendarPage = () => {
  const [date, setDate] = useState(new Date());
  const [adviceSteps, setAdviceSteps] = useState([]);
  // adviceByTaskId agora vem do contexto global
  const [openAdvice, setOpenAdvice] = useState(false);
  const {
    tasks,
    removeTask,
    setForm,
    setEditId,
    initialFormState,
    form,
    advice,
    setAdvice,
    adviceByTaskId,
    setAdviceByTaskId,
  } = useTaskContext();
  // Garantir valor estável para initialFormState
  const initialFormStateRef = useRef(initialFormState);

  // Função para obter conselho da IA para uma tarefa
  const handleAdvice = async (task) => {
    // Checa se já existe advice para o ID da tarefa
    if (adviceByTaskId[task._id]) {
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
      setAdviceSteps(steps);
      setAdviceByTaskId((prev) => ({
        ...prev,
        [task._id]: { advice: adviceText, steps },
      }));
      setOpenAdvice(true);
    } catch {
      setAdvice("Erro ao obter conselho da IA");
      setAdviceSteps([]);
      setOpenAdvice(true);
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
        </section>
        <section className="task-create">
          <TaskForm />
          <AdviceModal
            open={openAdvice}
            onClose={() => setOpenAdvice(false)}
            advice={advice}
            adviceSteps={adviceSteps}
            tasks={tasks}
            onAdviceStepsChange={setAdviceSteps}
            titleTask={form.title}
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
