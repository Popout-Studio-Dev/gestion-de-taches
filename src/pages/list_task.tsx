"use client";

import React from 'react';
import { Task, TaskStatus } from '../interfaces/task'; 

// Données factices
export const fakeTasksData: Task[] = [
  {
    id: '1',
    title: 'Implémenter l\'authentification',
    description: 'Ajouter un système d\'authentification JWT pour sécuriser l\'API',
    status: TaskStatus.ONGOING,
    dueDate: '2025-03-15',
    createdAt: '2025-03-01T10:00:00Z',
    updatedAt: '2025-03-02T14:30:00Z',
    startedAt: '2025-03-02T14:30:00Z'
  },
  {
    id: '2',
    title: 'Créer le dashboard',
    description: 'Concevoir et implémenter le tableau de bord principal avec des statistiques',
    status: TaskStatus.WAITING,
    dueDate: '2025-03-20',
    createdAt: '2025-03-01T11:15:00Z',
    updatedAt: '2025-03-01T11:15:00Z'
  },
  {
    id: '3',
    title: 'Tester l\'API RESTful',
    description: 'Écrire des tests unitaires et d\'intégration pour l\'API',
    status: TaskStatus.COMPLETED,
    dueDate: '2025-03-05',
    createdAt: '2025-02-28T09:00:00Z',
    updatedAt: '2025-03-05T16:45:00Z',
    startedAt: '2025-02-28T10:30:00Z',
    completedAt: '2025-03-05T16:45:00Z'
  }
];

interface TaskListProps {
  tasks?: Task[];
  onTaskClick?: (task: Task) => void;
  showAddButton?: boolean;
  onAddClick?: () => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks = fakeTasksData,
  onTaskClick,
  showAddButton = true,
  onAddClick
}) => {
  // Fonction pour formater la date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Non définie';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  // Style badge pour chaque statut
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

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Liste des tâches</h1>
        {showAddButton && (
          <button 
            className="btn btn-primary" 
            onClick={onAddClick}
          >
            Ajouter une tâche
          </button>
        )}
      </div>

      {tasks.length === 0 ? (
        <div className="alert alert-info">
          Aucune tâche n&apos;a été trouvée.
        </div>
      ) : (
        <div className="row">
          {tasks.map((task) => (
            <div key={task.id} className="col-md-6 col-lg-4 mb-4">
              <div 
                className="card h-100 shadow-sm" 
                onClick={() => onTaskClick && onTaskClick(task)}
                style={{ cursor: onTaskClick ? 'pointer' : 'default' }}
              >
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">{task.title}</h5>
                  <span className={`badge ${getStatusBadgeClass(task.status)}`}>
                    {getStatusText(task.status)}
                  </span>
                </div>
                <div className="card-body">
                  <p className="card-text">
                    {task.description || 'Aucune description'}
                  </p>
                  <div className="small text-muted mb-2">
                    <strong>Date d&apos;échéance:</strong> {formatDate(task.dueDate)}
                  </div>
                  <div className="small text-muted">
                    <strong>Créée le:</strong> {formatDate(task.createdAt)}
                  </div>
                  {task.status === TaskStatus.ONGOING && task.startedAt && (
                    <div className="small text-muted">
                      <strong>Démarrée le:</strong> {formatDate(task.startedAt)}
                    </div>
                  )}
                  {task.status === TaskStatus.COMPLETED && task.completedAt && (
                    <div className="small text-muted">
                      <strong>Terminée le:</strong> {formatDate(task.completedAt)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;