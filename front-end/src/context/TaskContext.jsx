/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "../utils/service";
import { errorMessage, successMessage } from "../utils/notifications";

const TaskContext = createContext();

export const useTaskContext = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editId, setEditId] = useState(null);

  const initialFormState = {
    title: "",
    description: "",
    dueDate: "",
    status: "pendente",
  };
  const [form, setForm] = useState(initialFormState);

  const handleChange = (e, name) => {
    if (name) {
      // Para SelectPicker e componentes que passam valor e nome
      setForm({ ...form, [name]: e });
      return;
    }
    if (e && e.target) {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const userId = JSON.parse(sessionStorage.getItem("id"));
      const data = await getTaskById(userId);
      setTasks(data);
    } catch (err) {
      setError(err.message || "Erro ao buscar tarefas");
      errorMessage(err.message || "Erro ao criar tarefa");
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (task) => {
    setLoading(true);
    setError(null);
    try {
      const newTask = await createTask(task);
      setTasks((prev) => [...prev, newTask]);
      successMessage("Tarefa criada com sucesso");
    } catch (err) {
      setError(err.message || "Erro ao criar tarefa");
      errorMessage(err.message || "Erro ao criar tarefa");
    } finally {
      setLoading(false);
    }
  };

  const editTask = async (id, updates) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await updateTask(id, updates);
      setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
      successMessage("Tarefa atualizada com sucesso");
    } catch (err) {
      setError(err.message || "Erro ao atualizar tarefa");
      errorMessage(err.message || "Erro ao criar tarefa");
    } finally {
      setLoading(false);
    }
  };

  const removeTask = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      successMessage("Tarefa deletada com sucesso");
    } catch (err) {
      setError(err.message || "Erro ao deletar tarefa");
      errorMessage(err.message || "Erro ao criar tarefa");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        error,
        fetchTasks,
        addTask,
        editTask,
        removeTask,
        form,
        setForm,
        handleChange,
        initialFormState,
        editId,
        setEditId,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
