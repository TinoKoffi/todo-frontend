// src/hooks/useAuth.ts

import { useState } from "react";
import { api } from "../api/client";

type User = {
  id: number;
  username: string;
  email: string;
};

const SESSION_KEY = "app_session";
const TOKEN_KEY = "app_token";

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  });

  const [loading, setLoading] = useState(false);

  async function register(
    username: string,
    email: string,
    password: string
  ): Promise<string | null> {
    setLoading(true);
    try {
      const data = await api.register(username, email, password);
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(SESSION_KEY, JSON.stringify(data.user));
      setCurrentUser(data.user);
      return null; // pas d'erreur
    } catch (err) {
      return err instanceof Error ? err.message : "Erreur inconnue.";
    } finally {
      setLoading(false);
    }
  }

  async function login(
    email: string,
    password: string
  ): Promise<string | null> {
    setLoading(true);
    try {
      const data = await api.login(email, password);
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(SESSION_KEY, JSON.stringify(data.user));
      setCurrentUser(data.user);
      return null;
    } catch (err) {
      return err instanceof Error ? err.message : "Erreur inconnue.";
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(SESSION_KEY);
    setCurrentUser(null);
  }

  return { currentUser, loading, register, login, logout };
}