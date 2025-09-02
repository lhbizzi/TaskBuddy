const API_URL = import.meta.env.VITE_API_URL;

export async function login(email, senha) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Erro ao fazer login");
  }
  if (data.token) {
    localStorage.setItem("token", data.token);
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
    throw new Error(data.message || "Erro ao fazer registro");
  }
  if (data.token) {
    localStorage.setItem("token", data.token);
  }
  return data;
}
// CRUD de tarefas
export async function getTasks() {
  const response = await fetch(`${API_URL}/tasks`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Erro ao buscar tarefas");
  return data;
}

export async function getTaskById(id) {
  const response = await fetch(`${API_URL}/tasks/${id}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Erro ao buscar tarefa");
  return data;
}

export async function createTask(task) {
  const response = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Erro ao criar tarefa");
  return data;
}

export async function updateTask(id, task) {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Erro ao atualizar tarefa");
  return data;
}

export async function deleteTask(id) {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Erro ao deletar tarefa");
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
    throw new Error(data.message || "Erro ao obter conselho da IA");
  return data;
}
