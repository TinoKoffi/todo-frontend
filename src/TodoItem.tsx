// src/TodoItem.tsx

import { useState } from "react";
import { Trash, Pencil, Check, X } from "lucide-react";
import type { Priority, Todo } from "./types";

type Props = {
  todo: Todo;
  onDelete: () => void;
  onEdit: (id: number, text: string, priority: Priority) => void;
  onComplete: (id: number) => void;
  isSelected?: boolean;
  onToggleSelect?: (id: number) => void;
};

const TodoItem = ({ todo, onDelete, onEdit, onComplete, isSelected, onToggleSelect }: Props) => {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editPriority, setEditPriority] = useState<Priority>(todo.priority);

  function handleSave() {
    if (editText.trim() === "") return;
    onEdit(todo.id, editText.trim(), editPriority);
    setEditing(false);
  }

  function handleCancel() {
    setEditText(todo.text);
    setEditPriority(todo.priority);
    setEditing(false);
  }

  if (editing) {
    return (
      <li className="p-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            className="input input-sm w-full"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            autoFocus
          />
          <select
            className="select select-sm"
            value={editPriority}
            onChange={(e) => setEditPriority(e.target.value as Priority)}
          >
            <option value="Urgente">Urgente</option>
            <option value="Moyenne">Moyenne</option>
            <option value="Basse">Basse</option>
          </select>
          <button onClick={handleSave} className="btn btn-sm btn-success btn-soft">
            <Check className="w-4 h-4" />
          </button>
          <button onClick={handleCancel} className="btn btn-sm btn-ghost">
            <X className="w-4 h-4" />
          </button>
        </div>
      </li>
    );
  }

  return (
    <li className="p-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            className="checkbox checkbox-primary checkbox-sm"
            checked={!!isSelected}
            onChange={() => onToggleSelect?.(todo.id)}
          />
          <span
            className={`text-md font-bold transition-all ${
              todo.completed ? "line-through text-base-content/40" : ""
            }`}
          >
            {todo.text}
          </span>
          {!todo.completed && (
            <span
              className={`badge badge-sm badge-soft ${
                todo.priority === "Urgente"
                  ? "badge-error"
                  : todo.priority === "Moyenne"
                  ? "badge-warning"
                  : "badge-success"
              }`}
            >
              {todo.priority}
            </span>
          )}
          {todo.completed && (
            <span className="badge badge-sm badge-soft badge-success">
              Terminée ✓
            </span>
          )}
        </div>

        <div className="flex gap-2">
          {/* Bouton compléter */}
          <button
            onClick={() => onComplete(todo.id)}
            className={`btn btn-sm btn-soft ${
              todo.completed ? "btn-warning" : "btn-success"
            }`}
            title={todo.completed ? "Marquer comme non terminée" : "Marquer comme terminée"}
          >
            <Check className="w-4 h-4" />
          </button>

          {/* Bouton éditer — désactivé si complétée */}
          {!todo.completed && (
            <button
              onClick={() => setEditing(true)}
              className="btn btn-sm btn-soft btn-info"
            >
              <Pencil className="w-4 h-4" />
            </button>
          )}

          {/* Bouton supprimer */}
          <button onClick={onDelete} className="btn btn-sm btn-error btn-soft">
            <Trash className="w-4 h-4" />
          </button>
        </div>
      </div>
    </li>
  );
};

export default TodoItem;