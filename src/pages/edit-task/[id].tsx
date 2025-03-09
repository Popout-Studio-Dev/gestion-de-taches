"use client";

import { useState, useEffect } from "react";
import { Task, useTasks } from "@/context/TaskContext";
import { useRouter, useParams } from "next/navigation";

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
      // Si `prev` est nul ou undefined, on crée un objet `task` avec des valeurs par défaut
      const updatedTask: Task = prev ? { ...prev } : {
        id: '',
        title: '',
        description: '',
        beginDate: '',
        completed: false,
        status: 'En cours',
      };

      // Mettre à jour la propriété correspondante de la tâche
      return {
        ...updatedTask,
        [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
      };
    });
  };

  // Soumettre la tâche modifiée
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (task) {
      updateTask(task); // Mettre à jour la tâche dans le contexte
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
          name="beginDate"
          value={task.beginDate || ""}
          onChange={handleChange}
          className="form-control mb-3"
        />
        <select
          name="status"
          value={task.status}
          onChange={handleChange}
          className="form-control mb-3"
        >
          <option value="En cours">En cours</option>
          <option value="Terminé">Terminé</option>
          <option value="En attente">En attente</option>
        </select>
        <div className="form-check mb-3">
          <input
            type="checkbox"
            name="completed"
            checked={task.completed}
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
