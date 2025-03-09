"use client";

import { useState } from "react";
import { useTasks } from "@/context/TaskContext";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export default function AddTask() {
  const { addTask } = useTasks();
  const router = useRouter();

  const [task, setTask] = useState({
    title: "",
    description: "",
    beginDate: "",
    completed: false,
    status: "En cours",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setTask((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTask({ id: uuidv4(), ...task });
    router.push("/");
  };

  return (
    <div className="container mt-5">
      <h1>Ajouter une tâche</h1>
      <form onSubmit={handleSubmit} className="mt-4">
        <input type="text" className="form-control mb-3" name="title" value={task.title} onChange={handleChange} required placeholder="Titre" />
        <textarea className="form-control mb-3" name="description" value={task.description} onChange={handleChange} placeholder="Description"></textarea>
        <input type="date" className="form-control mb-3" name="beginDate" value={task.beginDate} onChange={handleChange} />
        <select className="form-select mb-3" name="status" value={task.status} onChange={handleChange}>
          <option value="En cours">En cours</option>
          <option value="Terminé">Terminé</option>
          <option value="En attente">En attente</option>
        </select>
        <button type="submit" className="btn btn-primary">Enregistrer</button>
      </form>
    </div>
  );
}
