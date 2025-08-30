import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendar.css";

const CalendarPage = () => {
  const [date, setDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  // Filtra tarefas do dia selecionado
  const tasksForDay = tasks.filter(
    (task) => new Date(task.date).toDateString() === date.toDateString()
  );

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks([...tasks, { text: newTask, date: date }]);
    setNewTask("");
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
                  <span>{task.text}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="task-create">
          <form onSubmit={handleCreateTask} className="task-form">
            <input
              type="text"
              placeholder="Nova tarefa..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <button type="submit">Criar tarefa</button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default CalendarPage;
