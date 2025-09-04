import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendar.css";
import { RiAiGenerate2, RiDeleteBin6Line } from "react-icons/ri";
import { Modal } from "rsuite";
import TaskForm from "../../components/TaskForm";
import { useTaskContext } from "../../context/TaskContext";

const CalendarPage = () => {
  const [date, setDate] = useState(new Date());
  const [advice, setAdvice] = useState("");
  const [openAdvice, setOpenAdvice] = useState(false);
  const { tasks, removeTask } = useTaskContext();

  // Função para obter conselho da IA para uma tarefa
  const handleAdvice = async (task) => {
    try {
      const ai = await import("../../utils/service").then((m) =>
        m.getTaskAdvice(task.title, task.dueDate || task.date)
      );
      setAdvice(ai.advice);
      setOpenAdvice(true);
    } catch (err) {
      setAdvice("Erro ao obter conselho da IA", err);
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
          <Modal open={openAdvice} onClose={() => setOpenAdvice(false)}>
            <Modal.Header>
              <Modal.Title>Conselho da IA</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>{advice}</p>
            </Modal.Body>
            <Modal.Footer>
              <button onClick={() => setOpenAdvice(false)}>Fechar</button>
            </Modal.Footer>
          </Modal>
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
