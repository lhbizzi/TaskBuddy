const API_URL = import.meta.env.VITE_API_URL; // Ex: "http://localhost:3000"

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
  return data;
}

export async function register(email, senha) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/register`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    }
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Erro ao fazer registro");
  }
  return data;
}
