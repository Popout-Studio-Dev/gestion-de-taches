"use client";

import { useState } from "react";
import { useTasks } from "@/context/TaskContext";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { Task, TaskStatus } from "../interfaces/task"; // Ajustez le chemin

export default function AddTask() {
  const { addTask } = useTasks();
  const router = useRouter();

  const [task, setTask] = useState<Partial<Task>>({
    title: "",
    description: "",
    status: TaskStatus.ONGOING,
    dueDate: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox" && name === "completed") {
      // Si la case "completed" est cochée, mettre à jour le statut
      const checked = (e.target as HTMLInputElement).checked;
      setTask((prev) => ({
        ...prev,
        status: checked ? TaskStatus.COMPLETED : TaskStatus.ONGOING,
      }));
    } else {
      setTask((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Création des timestamps
    const now = new Date().toISOString();
    
    // Création de la tâche complète avec les champs obligatoires
    const newTask: Task = {
      id: uuidv4(),
      title: task.title || "",
      description: task.description,
      status: task.status || TaskStatus.ONGOING,
      dueDate: task.dueDate,
      createdAt: now,
      updatedAt: now,
      // Ajout conditionnel des dates de début et de fin
      ...(task.status === TaskStatus.ONGOING && { startedAt: now }),
      ...(task.status === TaskStatus.COMPLETED && { completedAt: now }),
    };
    
    addTask(newTask);
    router.push("/");
  };

  return (
    <div className="container mt-5">
      <h1>Ajouter une tâche</h1>
      <form onSubmit={handleSubmit} className="mt-4">
        <input 
          type="text" 
          className="form-control mb-3" 
          name="title" 
          value={task.title} 
          onChange={handleChange} 
          required 
          placeholder="Titre" 
        />
        
        <textarea 
          className="form-control mb-3" 
          name="description" 
          value={task.description} 
          onChange={handleChange} 
          placeholder="Description"
        />
        
        <input 
          type="date" 
          className="form-control mb-3" 
          name="dueDate" 
          value={task.dueDate} 
          onChange={handleChange} 
          placeholder="Date d'échéance"
        />
        
        <select 
          className="form-select mb-3" 
          name="status" 
          value={task.status} 
          onChange={handleChange}
        >
          <option value={TaskStatus.WAITING}>En attente</option>
          <option value={TaskStatus.ONGOING}>En cours</option>
          <option value={TaskStatus.COMPLETED}>Terminé</option>
        </select>
        
        <div className="form-check mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            name="completed"
            checked={task.status === TaskStatus.COMPLETED}
            onChange={handleChange}
          />
          <label className="form-check-label">Tâche complétée</label>
        </div>
        
        <button type="submit" className="btn btn-primary">Enregistrer</button>
      </form>
    </div>
  );
}