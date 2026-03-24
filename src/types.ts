// src/types.ts

export type Priority = "Urgente" | "Moyenne" | "Basse";

export type Todo = {
  id: number;
  text: string;
  priority: Priority;
  completed: boolean;
};

export type User = {
  id: string;
  username: string;
  password: string; // stocké en clair (localStorage local, pas de vrai backend)
};