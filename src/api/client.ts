// src/api/client.ts

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

function getToken(): string | null {
  return localStorage.getItem("app_token");
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Erreur serveur.");
  return data as T;
}

export const api = {
  register: (username: string, email: string, password: string) =>
    request<{ token: string; user: { id: number; username: string; email: string } }>(
      "/auth/register",
      { method: "POST", body: JSON.stringify({ username, email, password }) }
    ),

  login: (email: string, password: string) =>
    request<{ token: string; user: { id: number; username: string; email: string } }>(
      "/auth/login",
      { method: "POST", body: JSON.stringify({ email, password }) }
    ),

  getTodos: () =>
    request<{ id: number; text: string; priority: string; completed: boolean; locked: boolean; userId: number }[]>(
      "/todos"
    ),

  createTodo: (text: string, priority: string) =>
    request<{ id: number; text: string; priority: string; completed: boolean; locked: boolean; userId: number }>(
      "/todos",
      { method: "POST", body: JSON.stringify({ text, priority }) }
    ),

  updateTodo: (id: number, text: string, priority: string) =>
    request<{ id: number; text: string; priority: string; completed: boolean; locked: boolean; userId: number }>(
      `/todos/${id}`,
      { method: "PUT", body: JSON.stringify({ text, priority }) }
    ),

  completeTodo: (id: number, customMessage: string) =>
    request<{ id: number; text: string; priority: string; completed: boolean; locked: boolean; userId: number }>(
      `/todos/${id}/complete`,
      { method: "PATCH", body: JSON.stringify({ customMessage }) }
    ),

  deleteTodo: (id: number) =>
    request<{ success: boolean }>(`/todos/${id}`, { method: "DELETE" }),
};