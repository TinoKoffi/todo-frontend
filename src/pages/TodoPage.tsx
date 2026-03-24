// src/pages/TodoPage.tsx

import { useEffect, useState } from "react";
import TodoItem from "../TodoItem";
import { Construction, LogOut } from "lucide-react";
import type { Priority, Todo } from "../types";
import { api } from "../api/client";

type Props = {
  username: string;
  onLogout: () => void;
};

const TodoPage = ({ username, onLogout }: Props) => {
  const [input, setInput] = useState<string>("");
  const [priority, setPriority] = useState<Priority>("Moyenne");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Priority | "Tous">("Tous");
  const [selectedTodos, setSelectedTodos] = useState<Set<number>>(new Set());
  const [loadingTodos, setLoadingTodos] = useState(true);
  const [addingTodo, setAddingTodo] = useState(false);

  // Charger les todos depuis l'API au démarrage
  useEffect(() => {
    async function fetchTodos() {
      try {
        const data = await api.getTodos();
        setTodos(data as Todo[]);
      } catch (err) {
        console.error("Erreur chargement todos:", err);
      } finally {
        setLoadingTodos(false);
      }
    }
    fetchTodos();
  }, []);

  async function addTodo() {
    if (input.trim() === "") return;
    setAddingTodo(true);
    try {
      const newTodo = await api.createTodo(input.trim(), priority);
      setTodos([newTodo as Todo, ...todos]);
      setInput("");
      setPriority("Moyenne");
    } catch (err) {
      console.error("Erreur ajout todo:", err);
    } finally {
      setAddingTodo(false);
    }
  }

  async function deleteTodo(id: number) {
    try {
      await api.deleteTodo(id);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (err) {
      console.error("Erreur suppression todo:", err);
    }
  }
  async function editTodo(id: number, text: string, priority: Priority) {
  try {
    const updated = await api.updateTodo(id, text, priority);
    setTodos(todos.map((t) => (t.id === id ? (updated as Todo) : t)));
  } catch (err) {
    console.error("Erreur modification todo:", err);
  }
}
async function completeTodo(id: number) {
  try {
    const updated = await api.completeTodo(id);
    setTodos(todos.map((t) => (t.id === id ? (updated as Todo) : t)));
  } catch (err) {
    console.error("Erreur complétion todo:", err);
  }
}

  function toggleSelectTodo(id: number) {
    const newSelected = new Set(selectedTodos);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedTodos(newSelected);
  }

  async function finishSelected() {
    try {
      await Promise.all([...selectedTodos].map((id) => api.deleteTodo(id)));
      setTodos(todos.filter((todo) => !selectedTodos.has(todo.id)));
      setSelectedTodos(new Set());
    } catch (err) {
      console.error("Erreur suppression sélection:", err);
    }
  }

  const filteredTodos =
    filter === "Tous" ? todos : todos.filter((t) => t.priority === filter);

  const urgentCount = todos.filter((t) => t.priority === "Urgente").length;
  const mediumCount = todos.filter((t) => t.priority === "Moyenne").length;
  const lowCount = todos.filter((t) => t.priority === "Basse").length;

  return (
    <div className="flex justify-center">
      <div className="w-2/3 flex flex-col gap-4 my-15 bg-base-300 p-5 rounded-2xl">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">
            👋 Bonjour, <span className="text-primary">{username}</span>
          </h2>
          <button onClick={onLogout} className="btn btn-sm btn-soft btn-error">
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>

        {/* Input */}
        <div className="flex gap-4">
          <input
            type="text"
            className="input w-full"
            placeholder="Ajouter une tâche..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <select
            className="select w-full"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            <option value="Urgente">Urgente</option>
            <option value="Moyenne">Moyenne</option>
            <option value="Basse">Basse</option>
          </select>
          <button
            onClick={addTodo}
            className="btn btn-primary"
            disabled={addingTodo}
          >
            {addingTodo ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              "Ajouter"
            )}
          </button>
        </div>

        {/* Filtres + actions */}
        <div className="space-y-2 flex-1 h-fit">
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-4">
              <button
                className={`btn btn-soft ${filter === "Tous" ? "btn-primary" : ""}`}
                onClick={() => setFilter("Tous")}
              >
                Tous ({todos.length})
              </button>
              <button
                className={`btn btn-soft ${filter === "Urgente" ? "btn-primary" : ""}`}
                onClick={() => setFilter("Urgente")}
              >
                Urgente ({urgentCount})
              </button>
              <button
                className={`btn btn-soft ${filter === "Moyenne" ? "btn-primary" : ""}`}
                onClick={() => setFilter("Moyenne")}
              >
                Moyenne ({mediumCount})
              </button>
              <button
                className={`btn btn-soft ${filter === "Basse" ? "btn-primary" : ""}`}
                onClick={() => setFilter("Basse")}
              >
                Basse ({lowCount})
              </button>
            </div>
            <button
              onClick={finishSelected}
              className="btn btn-primary"
              disabled={selectedTodos.size === 0}
            >
              Finir la sélection ({selectedTodos.size})
            </button>
          </div>

          {/* Liste */}
          {loadingTodos ? (
            <div className="flex justify-center items-center p-10">
              <span className="loading loading-spinner loading-lg text-primary" />
            </div>
          ) : filteredTodos.length > 0 ? (
            <ul className="divide-y divide-primary/20">
              {filteredTodos.map((todo) => (
                <li key={todo.id}>
                  <TodoItem
                    todo={todo}
                    isSelected={selectedTodos.has(todo.id)}
                    onDelete={() => deleteTodo(todo.id)}
                    onEdit={editTodo}
                    onComplete={completeTodo}
                    onToggleSelect={toggleSelectTodo}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex justify-center items-center flex-col p-5">
              <Construction strokeWidth={1} className="w-40 h-40 text-primary" />
              <p className="text-sm">Aucune tâche pour ce filtre</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default TodoPage;