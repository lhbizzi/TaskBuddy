// Buscar tarefas por data de encerramento (dueDate)
export async function getTasksByDueDate(dueDate) {
  const response = await fetch(
    `${API_URL}/tasks/by-due-date?dueDate=${encodeURIComponent(dueDate)}`
  );
  const data = await response.json();
  if (!response.ok)
    throw new Error(
      handleError({
        status: response.status,
        statusText: response.statusText,
        message: data.message,
      })
    );
  return data;
}

// Buscar tarefas por data de criação (createdAt)
export async function getTasksByCreatedAt(createdAt) {
  const response = await fetch(
    `${API_URL}/tasks/by-created-at?createdAt=${encodeURIComponent(createdAt)}`
  );
  const data = await response.json();
  if (!response.ok)
    throw new Error(
      handleError({
        status: response.status,
        statusText: response.statusText,
        message: data.message,
      })
    );
  return data;
}
import { handleError } from "./errors";

const API_URL = import.meta.env.VITE_API_URL;

export async function login(email, senha) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(
      handleError({
        status: response.status,
        statusText: response.statusText,
        message: data.message,
      })
    );
  }
  if (data.token) {
    sessionStorage.setItem("token", data.token);
  }
  if (data.user) {
    sessionStorage.setItem("id", JSON.stringify(data.user.id));
    sessionStorage.setItem("nome", JSON.stringify(data.user.nome));
    sessionStorage.setItem("sobrenome", JSON.stringify(data.user.sobrenome));
    sessionStorage.setItem("email", JSON.stringify(data.user.email));
  }
  return data;
}

export async function register(nome, sobrenome, email, senha) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/register`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, sobrenome, email, senha }),
    }
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(
      handleError({
        status: response.status,
        statusText: response.statusText,
        message: data.message,
      })
    );
  }
  if (data.token) {
    sessionStorage.setItem("token", data.token);
  }
  if (data.user) {
    sessionStorage.setItem("id", JSON.stringify(data.user.id));
    sessionStorage.setItem("nome", JSON.stringify(data.user.nome));
    sessionStorage.setItem("sobrenome", JSON.stringify(data.user.sobrenome));
    sessionStorage.setItem("email", JSON.stringify(data.user.email));
  }
  return data;
}

export async function getTaskById(id) {
  const response = await fetch(`${API_URL}/tasks/user/${id}`);
  const data = await response.json();
  if (!response.ok)
    throw new Error(
      handleError({
        status: response.status,
        statusText: response.statusText,
        message: data.message,
      })
    );
  return data;
}

export async function createTask(task) {
  const token = sessionStorage.getItem("token");
  const response = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(task),
  });
  const data = await response.json();
  if (!response.ok)
    throw new Error(
      handleError({
        status: response.status,
        statusText: response.statusText,
        message: data.message,
      })
    );
  return data;
}

export async function updateTask(id, task) {
  const token = sessionStorage.getItem("token");
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(task),
  });
  const data = await response.json();
  if (!response.ok)
    throw new Error(
      handleError({
        status: response.status,
        statusText: response.statusText,
        message: data.message,
      })
    );
  return data;
}

export async function deleteTask(id) {
  const token = sessionStorage.getItem("token");
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok)
    throw new Error(
      handleError({
        status: response.status,
        statusText: response.statusText,
        message: response.message,
      })
    );
  // Não chama response.json() pois resposta é vazia (204)
  return true;
}

// Função para consumir o conselho de tarefa via OpenAI
export async function getTaskAdvice(tarefa, deadline) {
  const response = await fetch(`${API_URL}/tasks/advice`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tarefa, deadline }),
  });
  const data = await response.json();
  if (!response.ok)
    throw new Error(
      handleError({
        status: response.status,
        statusText: response.statusText,
        message: data.message,
      })
    );
  return data;
}
