"use client"; 

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export interface Task {
  id: string;
  title: string;
  description?: string;
  beginDate?: string;
  completed: boolean;
  status: string;
}

export default function AddTask() {
  const [task, setTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    beginDate: '',
    completed: false,
    status: 'En cours'
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
  
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setTask(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setTask(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simuler un envoi (à remplacer par un appel à une API ou autre logique)
    console.log("Tâche ajoutée :", task);

    // Rediriger ou afficher un message (selon ton flow)
    router.push('/');
  };

  return (
    <div className="container mt-5">
      <h1>Ajouter une tâche</h1>
      <form onSubmit={handleSubmit} className="mt-4">

        <div className="mb-3">
          <label className="form-label">Titre</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={task.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            name="description"
            value={task.description}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Date de début</label>
          <input
            type="date"
            className="form-control"
            name="beginDate"
            value={task.beginDate}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Statut</label>
          <select
            className="form-select"
            name="status"
            value={task.status}
            onChange={handleChange}
          >
            <option value="En cours">En cours</option>
            <option value="Terminé">Terminé</option>
            <option value="En attente">En attente</option>
          </select>
        </div>

        <div className="form-check mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            name="completed"
            checked={task.completed}
            onChange={handleChange}
          />
          <label className="form-check-label">Tâche complétée</label>
        </div>

        <button type="submit" className="btn btn-primary">Enregistrer</button>
      </form>
    </div>
  );
}
