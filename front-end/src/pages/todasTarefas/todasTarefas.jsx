// ...existing code...
// Adicione o controle de adviceSteps e onAdviceStepsChange se AdviceModal for usado nesta página.
import React, { useState } from "react";
import { RiAiGenerate2, RiDeleteBin6Line, RiEdit2Line } from "react-icons/ri";
import "./todasTarefas.css";
import TaskForm from "../../components/TaskForm";
import AdviceModal from "../../components/AdviceModal";
import { useTaskContext } from "../../context/TaskContext";

const TodasTarefas = () => {
  const {
    tasks,
    setEditId,
    setForm,
    removeTask,
    adviceByTaskId,
    setAdviceByTaskId,
    advice,
    setAdvice,
    // Os dois abaixo são locais para o modal
  } = useTaskContext();
  const [adviceSteps, setAdviceSteps] = useState([]);
  const [openAdvice, setOpenAdvice] = useState(false);

  const groupTasksByDate = (tasks) => {
    const grouped = {};
    tasks.forEach((task) => {
      const date = task.dueDate || "Sem data";
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(task);
    });
    return grouped;
  };

  const formatDate = (dateStr) => {
    if (!dateStr || dateStr === "Sem data") return "Sem data";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleAdvice = async (task) => {
    if (adviceByTaskId && adviceByTaskId[task._id]) {
      setAdvice(adviceByTaskId[task._id].advice);
      setAdviceSteps(adviceByTaskId[task._id].steps);
      setOpenAdvice(true);
      return;
    }
    try {
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

  const grouped = groupTasksByDate(tasks);
  const sortedDates = Object.keys(grouped).sort();
  return (
    <div className="all-pages">
      <h1>Todas as Tarefas</h1>
      <div
        className="todas-tarefas-list"
        style={{ maxHeight: 400, overflowY: "auto", paddingRight: 8 }}
      >
        {sortedDates.length === 0 ? (
          <p>Nenhuma tarefa encontrada.</p>
        ) : (
          sortedDates.map((date) => (
            <div key={date} style={{ marginBottom: 0 }}>
              <h3 style={{ marginBottom: 8 }}>{formatDate(date)}</h3>
              <ul>
                {grouped[date].map((task) => (
                  <li
                    key={task._id}
                    className="task-item"
                    style={{ marginBottom: 0 }}
                  >
                    <span style={{ fontWeight: "bold", marginRight: 8 }}>
                      {task.title}
                    </span>
                    <span>{task.description}</span>
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        justifyContent: "flex-end",
                        width: "100%",
                      }}
                    >
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
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
      <AdviceModal
        open={openAdvice}
        onClose={() => setOpenAdvice(false)}
        advice={advice}
        adviceSteps={adviceSteps}
        onAdviceStepsChange={setAdviceSteps}
        tasks={tasks}
        titleTask={null}
      />
      <div style={{ marginBottom: 32 }}>
        <TaskForm />
      </div>
    </div>
  );
};

export default TodasTarefas;
