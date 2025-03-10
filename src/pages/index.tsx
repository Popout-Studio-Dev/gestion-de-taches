"use client";

import { useTasks } from "@/context/TaskContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TaskStatus } from "@/interfaces/task"; // Importation correcte de TaskStatus

export default function Home() {
  const { tasks, deleteTask } = useTasks();
  const router = useRouter();

  // Fonction pour obtenir le label du statut en français
  const getStatusLabel = (status: TaskStatus): string => {
    switch (status) {
      case TaskStatus.WAITING:
        return "En attente";
      case TaskStatus.ONGOING:
        return "En cours";
      case TaskStatus.COMPLETED:
        return "Terminé";
      default:
        return status;
    }
  };

  // Fonction pour obtenir la classe CSS en fonction du statut
  const getStatusClass = (status: TaskStatus): string => {
    switch (status) {
      case TaskStatus.WAITING:
        return "text-warning";
      case TaskStatus.ONGOING:
        return "text-primary";
      case TaskStatus.COMPLETED:
        return "text-decoration-line-through text-muted";
      default:
        return "";
    }
  };

  return (
    <div className="container mt-5">
      <h1>Liste des Tâches</h1>
      <Link href="/add-task" className="btn btn-primary mb-3">+ Ajouter une tâche</Link>

      {tasks.length === 0 ? (
        <p>Aucune tâche pour le moment.</p>
      ) : (
        <ul className="list-group">
          {tasks.map((task) => (
            <li key={task.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div 
                onClick={() => router.push(`/edit-task/${task.id}`)}
                style={{ cursor: "pointer" }}
                className="d-flex flex-column"
              >
                <span className={getStatusClass(task.status)}>
                  {task.title}
                </span>
                <small className="text-muted">
                  {getStatusLabel(task.status)}
                  {task.dueDate && ` - Échéance: ${new Date(task.dueDate).toLocaleDateString()}`}
                </small>
              </div>
              <div>
                <button onClick={() => router.push(`/edit-task/${task.id}`)} className="btn btn-warning me-2">✏️</button>
                <button onClick={() => deleteTask(task.id)} className="btn btn-danger">❌</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}