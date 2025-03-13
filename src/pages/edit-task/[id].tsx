"use client";

import { useState, useEffect } from "react";
import { useTasks } from "@/context/TaskContext";
import { useRouter, useParams } from "next/navigation";
import { Task, TaskStatus } from "../../interfaces/task"; 
import Link from "next/link";

export const getServerSideProps = async () => {
  return {
    props: {}
  };
};

/**
 * Renders a form interface for editing a task.
 *
 * The component retrieves a task by its ID from the task context and displays an editable form to update task details, including the title, description, due date, and status. It also allows for task deletion with a confirmation prompt. A loading spinner is shown while the task data is being fetched, and a warning message is displayed if the task is not found.
 *
 * @param params - An object containing route parameters, including the task ID.
 */
export default function EditTask({ params }: { params: { id: string } }) {
  const { tasks, updateTask, deleteTask } = useTasks();
  const router = useRouter();
  const routeParams = useParams();
  
  // Trouver l'id à partir de multiple sources
  const id = params?.id || (routeParams && routeParams.id as string);

  // Trouver la tâche existante dans la liste des tâches
  // const existingTask = tasks.find((t) => t.id === id);

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Debug to check if tasks are loaded
    console.log("Tasks available:", tasks.length);
    console.log("Looking for task ID:", id);
    
    if (id && tasks.length > 0) {
      const existingTask = tasks.find((t) => t.id === id);
      console.log("Found task:", existingTask);
      
      if (existingTask) {
        setTask(existingTask);
      } else {
        console.log("Task not found");
      }
    }
    setLoading(false);
  }, [id, tasks]);

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
      
      // Mettre à jour les dates de début/fin
      if (task.status === TaskStatus.ONGOING && !task.startedAt) {
        updatedTask = { ...updatedTask, startedAt: now };
      } else if (task.status === TaskStatus.COMPLETED && !task.completedAt) {
        updatedTask = { ...updatedTask, completedAt: now };
      }
      
      updateTask(updatedTask);
      router.push("/");
    }
  };

  const handleDelete = () => {
    if (task && confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) {
      deleteTask(task.id);
      router.push("/");
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  
  if (!task) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-warning" role="alert">
          Tâche non trouvée
        </div>
        <Link href="/" className="btn btn-primary mt-3">
          Retour à la liste
        </Link>
      </div>
    );
  }

  // Détermine la classe et le texte du badge de statut
  const getStatusBadgeClass = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.WAITING:
        return 'bg-warning';
      case TaskStatus.ONGOING:
        return 'bg-primary';
      case TaskStatus.COMPLETED:
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  };

  const getStatusText = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.WAITING:
        return 'En attente';
      case TaskStatus.ONGOING:
        return 'En cours';
      case TaskStatus.COMPLETED:
        return 'Terminé';
      default:
        return 'Inconnu';
    }
  };

  // Formater la date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Non définie';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow task-form-container">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="page-header">Modifier la tâche</h1>
                <span className={`status-badge ${getStatusBadgeClass(task.status)}`}>
                  {getStatusText(task.status)}
                </span>
              </div>
              
              <div className="small text-muted mb-4">
                <div>Créée le: {formatDate(task.createdAt)}</div>
                <div>Dernière mise à jour: {formatDate(task.updatedAt)}</div>
                {task.startedAt && <div>Démarrage: {formatDate(task.startedAt)}</div>}
                {task.completedAt && <div>Achèvement: {formatDate(task.completedAt)}</div>}
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
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="description" className="form-label fw-bold">Description</label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    value={task.description || ""}
                    onChange={handleChange}
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
                        value={task.dueDate || ""}
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
                
                <div className="d-flex justify-content-between">
                  <button 
                    type="button" 
                    className="btn btn-outline-danger" 
                    onClick={handleDelete}
                  >
                    <i className="bi bi-trash me-2"></i>Supprimer
                  </button>
                  <div>
                    <Link href="/" className="btn btn-outline-secondary me-2">
                      Annuler
                    </Link>
                    <button type="submit" className="btn btn-success">
                      <i className="bi bi-check-lg me-2"></i>Enregistrer
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}