import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendar.css";
import { getTaskById, createTask, getTaskAdvice } from "../../utils/service";
import { errorMessage } from "../../utils/notifications";
import { RiAiGenerate2 } from "react-icons/ri";
import { Modal } from "rsuite";

const CalendarPage = () => {
  const [date, setDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [description, setDescription] = useState("");
  const [advice, setAdvice] = useState("");
  const [openAdvice, setOpenAdvice] = useState(false);

  useEffect(() => {
    const userId = JSON.parse(sessionStorage.getItem("id"));
    async function fetchTasks() {
      try {
        const data = await getTaskById(userId);
        setTasks(data);
      } catch (err) {
        // Trate erro se necessário\
        errorMessage(err.message);
      }
    }
    fetchTasks();
  }, []);

  // Filtra tarefas do dia selecionado
  const tasksForDay = tasks.filter(
    (task) =>
      new Date(task.dueDate || task.date).toDateString() === date.toDateString()
  );

  const handleCreateTask = async (e, taskTitle, taskDate) => {
    if (e) e.preventDefault();
    const title = taskTitle || newTask;
    const dueDate = taskDate || date;
    if (!title.trim() || !description.trim()) return;
    const taskObj = {
      title,
      description,
      dueDate,
      status: "pendente",
    };
    try {
      const created = await createTask(taskObj);
      setTasks([...tasks, created]);
      setNewTask("");
      setDescription("");
      // Chama IA para conselho
      const ai = await getTaskAdvice(
        title,
        dueDate.toLocaleDateString("pt-BR")
      );
      setAdvice(ai.advice);
    } catch (err) {
      errorMessage(err.message);
    }
  };

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
          <h3>Tarefas do dia</h3>

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
                    <div>
                      <button
                        onClick={() =>
                          handleCreateTask(
                            null,
                            task.title,
                            new Date(task.dueDate || task.date)
                          )
                        }
                      >
                        <RiAiGenerate2 />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="task-create">
          <form className="task-form" onSubmit={handleCreateTask}>
            <input
              type="text"
              placeholder="Nova tarefa..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <input
              type="text"
              placeholder="Descrição da tarefa..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button type="submit">Criar tarefa</button>
          </form>
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
