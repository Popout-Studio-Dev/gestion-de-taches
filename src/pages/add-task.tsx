"use client";

import { useState } from "react";
import { useTasks } from "@/context/TaskContext";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { Task, TaskStatus } from "../interfaces/task"; 
import Link from "next/link";

/**
 * Renders a form for creating a new task.
 *
 * This component provides a controlled interface for entering task details including title, description, due date, and status. When the form is submitted, it generates a unique task ID and timestamps (conditionally adding start or completion times based on the selected status), adds the new task via the task context, and navigates back to the home page.
 */
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
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow task-form-container">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="page-header">Ajouter une tâche</h1>
                <Link href="/" className="btn btn-outline-secondary rounded-pill">
                  <i className="bi bi-arrow-left me-2"></i>Retour
                </Link>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="title" className="form-label fw-bold">Titre</label>
                  <input 
                    type="text" 
                    className="form-control form-control-lg" 
                    id="title"
                    name="title" 
                    value={task.title} 
                    onChange={handleChange} 
                    required 
                    placeholder="Titre de la tâche" 
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="description" className="form-label fw-bold">Description</label>
                  <textarea 
                    className="form-control" 
                    id="description"
                    name="description" 
                    value={task.description} 
                    onChange={handleChange} 
                    placeholder="Description détaillée de la tâche"
                    rows={4}
                  />
                </div>
                
                <div className="row mb-4">
                  <div className="col-md-6">
                    <label htmlFor="dueDate" className="form-label fw-bold">Date d&apos;échéance</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-calendar"></i>
                      </span>
                      <input 
                        type="date" 
                        className="form-control" 
                        id="dueDate"
                        name="dueDate" 
                        value={task.dueDate} 
                        onChange={handleChange} 
                      />
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <label htmlFor="status" className="form-label fw-bold">Statut</label>
                    <select 
                      className="form-select" 
                      id="status"
                      name="status" 
                      value={task.status} 
                      onChange={handleChange}
                    >
                      <option value={TaskStatus.WAITING}>En attente</option>
                      <option value={TaskStatus.ONGOING}>En cours</option>
                      <option value={TaskStatus.COMPLETED}>Terminé</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-check mb-4">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="completed"
                    name="completed"
                    checked={task.status === TaskStatus.COMPLETED}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="completed">Marquer comme terminée</label>
                </div>
                
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <Link href="/" className="btn btn-outline-secondary me-md-2 px-4">
                    Annuler
                  </Link>
                  <button type="submit" className="btn btn-primary px-4">
                    <i className="bi bi-save me-2"></i>Enregistrer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}