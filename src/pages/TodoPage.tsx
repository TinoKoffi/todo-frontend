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

  // Modal
  const [modalTodoId, setModalTodoId] = useState<number | null>(null);
  const [customMessage, setCustomMessage] = useState("Bravo, j'ai terminé cette tâche ! 💪");
  const [sendingComplete, setSendingComplete] = useState(false);

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

  // Ouvre le modal au lieu de compléter directement
  function openCompleteModal(id: number) {
    setModalTodoId(id);
    setCustomMessage("Bravo, j'ai terminé cette tâche ! 💪");
  }

  async function confirmComplete() {
    if (!modalTodoId) return;
    setSendingComplete(true);
    try {
      const updated = await api.completeTodo(modalTodoId, customMessage);
      setTodos(todos.map((t) => (t.id === modalTodoId ? (updated as Todo) : t)));
      setModalTodoId(null);
    } catch (err) {
      console.error("Erreur complétion todo:", err);
    } finally {
      setSendingComplete(false);
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

  const modalTodo = todos.find((t) => t.id === modalTodoId);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto flex flex-col gap-4">

        {/* Header */}
        <div className="flex justify-between items-center bg-base-300 p-4 rounded-2xl">
          <h2 className="text-lg font-bold">
            👋 Bonjour, <span className="text-primary">{username}</span>
          </h2>
          <button onClick={onLogout} className="btn btn-sm btn-soft btn-error">
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>

        {/* Input */}
        <div className="bg-base-300 p-4 rounded-2xl flex flex-col gap-3">
          <input
            type="text"
            className="input w-full"
            placeholder="Ajouter une tâche..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
          />
          <div className="flex gap-2">
            <select
              className="select flex-1"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
            >
              <option value="Urgente">🔴 Urgente</option>
              <option value="Moyenne">🟡 Moyenne</option>
              <option value="Basse">🟢 Basse</option>
            </select>
            <button
              onClick={addTodo}
              className="btn btn-primary flex-1"
              disabled={addingTodo}
            >
              {addingTodo
                ? <span className="loading loading-spinner loading-sm" />
                : "Ajouter"
              }
            </button>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-base-300 p-4 rounded-2xl flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            <button
              className={`btn btn-soft btn-sm ${filter === "Tous" ? "btn-primary" : ""}`}
              onClick={() => setFilter("Tous")}
            >
              Tous ({todos.length})
            </button>
            <button
              className={`btn btn-soft btn-sm ${filter === "Urgente" ? "btn-primary" : ""}`}
              onClick={() => setFilter("Urgente")}
            >
              🔴 Urgente ({urgentCount})
            </button>
            <button
              className={`btn btn-soft btn-sm ${filter === "Moyenne" ? "btn-primary" : ""}`}
              onClick={() => setFilter("Moyenne")}
            >
              🟡 Moyenne ({mediumCount})
            </button>
            <button
              className={`btn btn-soft btn-sm ${filter === "Basse" ? "btn-primary" : ""}`}
              onClick={() => setFilter("Basse")}
            >
              🟢 Basse ({lowCount})
            </button>
          </div>
          {selectedTodos.size > 0 && (
            <button
              onClick={finishSelected}
              className="btn btn-primary btn-sm w-full"
            >
              Finir la sélection ({selectedTodos.size})
            </button>
          )}
        </div>

        {/* Liste */}
        <div className="bg-base-300 rounded-2xl overflow-hidden">
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
                    onComplete={openCompleteModal}
                    onToggleSelect={toggleSelectTodo}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex justify-center items-center flex-col p-8 gap-2">
              <Construction strokeWidth={1} className="w-24 h-24 text-primary" />
              <p className="text-sm text-base-content/60">Aucune tâche pour ce filtre</p>
            </div>
          )}
        </div>

      </div>

      {/* Modal message personnalisé */}
      {modalTodoId && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-base-300 rounded-2xl p-6 w-full max-w-sm flex flex-col gap-4">

            <h3 className="text-lg font-bold">🎉 Tâche terminée !</h3>

            <p className="text-sm text-base-content/60">
              Tu vas marquer <span className="text-primary font-medium">"{modalTodo?.text}"</span> comme terminée.
              Un email de félicitations sera envoyé sur ton adresse mail.
            </p>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Ton message personnel :</label>
              <textarea
                className="textarea w-full"
                rows={3}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Écris ton message de félicitations..."
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setModalTodoId(null)}
                className="btn btn-ghost flex-1"
                disabled={sendingComplete}
              >
                Annuler
              </button>
              <button
                onClick={confirmComplete}
                className="btn btn-primary flex-1"
                disabled={sendingComplete}
              >
                {sendingComplete
                  ? <span className="loading loading-spinner loading-sm" />
                  : "Confirmer ✅"
                }
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default TodoPage;