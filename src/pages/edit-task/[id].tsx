"use client";

import { useState, useEffect } from "react";
import { useTasks } from "@/context/TaskContext";
import { useRouter, useParams } from "next/navigation";
import { Task, TaskStatus } from "../../interfaces/task"; // Ajustez le chemin

export default function EditTask() {
  const { tasks, updateTask } = useTasks();
  const router = useRouter();
  const { id } = useParams();

  // Trouver la tâche existante dans la liste des tâches
  const existingTask = tasks.find((t) => t.id === id);

  const [task, setTask] = useState<Task | null>(null);

  // Mettre à jour l'état `task` lorsqu'une tâche existante est trouvée
  useEffect(() => {
    if (existingTask) {
      setTask(existingTask);
    } else {
      router.push("/"); // Rediriger si la tâche n'existe pas
    }
  }, [existingTask, router]);

  // Gérer le changement de valeur des champs du formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    setTask((prev) => {
      if (!prev) return null;

      if (type === "checkbox" && name === "completed") {
        // Si la case "completed" est cochée, mettre à jour le statut
        const checked = (e.target as HTMLInputElement).checked;
        const now = new Date().toISOString();
        
        return {
          ...prev,
          status: checked ? TaskStatus.COMPLETED : TaskStatus.ONGOING,
          updatedAt: now,
          // Mettre à jour les dates de statut
          ...(checked ? { completedAt: now } : { startedAt: prev.startedAt || now }),
        };
      } else {
        return {
          ...prev,
          [name]: value,
          updatedAt: new Date().toISOString(),
        };
      }
    });
  };

  // Soumettre la tâche modifiée
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (task) {
      // Si le statut change, mettre à jour les timestamps
      const now = new Date().toISOString();
      let updatedTask = {
        ...task,
        updatedAt: now,
      };
      
      // Mettre à jour les dates de début/fin en fonction du statut
      if (task.status === TaskStatus.ONGOING && !task.startedAt) {
        updatedTask = { ...updatedTask, startedAt: now };
      } else if (task.status === TaskStatus.COMPLETED && !task.completedAt) {
        updatedTask = { ...updatedTask, completedAt: now };
      }
      
      updateTask(updatedTask);
    } else {
      console.error("Task is undefined");
    }

    router.push("/"); // Rediriger vers la page d'accueil
  };

  // Si `task` est toujours null ou undefined, on ne rend rien
  if (!task) return null;

  return (
    <div className="container mt-5">
      <h1>Modifier la tâche</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={task.title}
          onChange={handleChange}
          className="form-control mb-3"
        />
        <textarea
          name="description"
          value={task.description || ""}
          onChange={handleChange}
          className="form-control mb-3"
        />
        <input
          type="date"
          name="dueDate"
          value={task.dueDate || ""}
          onChange={handleChange}
          className="form-control mb-3"
        />
        <select
          name="status"
          value={task.status}
          onChange={handleChange}
          className="form-control mb-3"
        >
          <option value={TaskStatus.WAITING}>En attente</option>
          <option value={TaskStatus.ONGOING}>En cours</option>
          <option value={TaskStatus.COMPLETED}>Terminé</option>
        </select>
        <div className="form-check mb-3">
          <input
            type="checkbox"
            name="completed"
            checked={task.status === TaskStatus.COMPLETED}
            onChange={handleChange}
            className="form-check-input"
          />
          <label className="form-check-label">Tâche complétée</label>
        </div>
        <button type="submit" className="btn btn-success">✔ Enregistrer</button>
        <button type="button" onClick={() => router.push("/")} className="btn btn-danger ms-3">✖ Annuler</button>
      </form>
    </div>
  );
}