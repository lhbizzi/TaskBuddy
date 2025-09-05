import React from "react";
import "./todasTarefas.css";
import TaskForm from "../../components/TaskForm";

const TodasTarefas = () => {
  return (
    <div className="all-pages">
      <h1>Todas as Tarefas</h1>
      <div style={{ marginBottom: 32 }}>
        <TaskForm />
      </div>
      {/* Aqui você pode renderizar a lista de tarefas, se desejar */}
    </div>
  );
};

export default TodasTarefas;
