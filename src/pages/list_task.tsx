"use client";

import React from 'react';
import { Task, TaskStatus } from '../interfaces/task'; 
import Link from 'next/link';

interface TaskListProps {
  tasks?: Task[];
  onTaskClick?: (task: Task) => void;
  showAddButton?: boolean;
  onAddClick?: () => void;
  onDeleteTask?: (id: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks = [],
  onTaskClick,
  showAddButton = true,
  onDeleteTask
}) => {
  // Fonction pour formater la date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Non définie';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  // Fonction pour déterminer si une date est proche
  const isDueSoon = (dueDate?: string) => {
    if (!dueDate) return false;
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
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

  // Classe pour le card border
  const getCardClass = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.WAITING:
        return 'waiting';
      case TaskStatus.ONGOING:
        return 'ongoing';
      case TaskStatus.COMPLETED:
        return 'completed';
      default:
        return '';
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
    <div className="container-fluid mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-header">Liste des tâches</h2>
        {showAddButton && (
          <Link href="/add-task" className="btn btn-primary rounded-pill px-4 py-2 d-flex align-items-center">
            <i className="bi bi-plus-circle me-2"></i>
            Nouvelle tâche
          </Link>
        )}
      </div>

      <div className="row">
        {tasks.length === 0 ? (
          <div className="col-12">
            <div className="alert alert-info d-flex align-items-center" role="alert">
              <i className="bi bi-info-circle-fill me-2"></i>
              <div>Aucune tâche n&apos;a été trouvée.</div>
            </div>
          </div>
        ) : (
          <>
            {tasks.map((task) => (
              <div key={task.id} className="col-md-6 col-lg-4 mb-4">
                <div className={`card h-100 shadow-sm task-card ${getCardClass(task.status)}`}>
                  <div className="card-header d-flex justify-content-between align-items-center bg-transparent border-bottom-0 pt-3 pb-0">
                    <span className={`status-badge ${getStatusBadgeClass(task.status)}`}>
                      {getStatusText(task.status)}
                    </span>
                    <div className="task-actions">
                      <button 
                        className="btn btn-sm btn-outline-warning me-2 task-action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          void (onTaskClick && onTaskClick(task));
                        }}
                      >
                        <i className="bi bi-pencil-fill"></i>
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger task-action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          void (onDeleteTask && onDeleteTask(task.id));
                        }}
                      >
                        <i className="bi bi-trash-fill"></i>
                      </button>
                    </div>
                  </div>
                  <div 
                    className="card-body" 
                    onClick={() => onTaskClick && onTaskClick(task)}
                    style={{ cursor: onTaskClick ? 'pointer' : 'default' }}
                  >
                    <h5 className={`card-title mb-3 ${task.status === TaskStatus.COMPLETED ? 'text-decoration-line-through text-muted' : ''}`}>
                      {task.title}
                    </h5>
                    <p className="card-text text-secondary mb-3">
                      {task.description || 'Aucune description'}
                    </p>
                    <div className="mt-3">
                      <div className={`d-flex align-items-center mb-2 ${isDueSoon(task.dueDate) ? 'due-soon' : ''}`}>
                        <i className="bi bi-calendar-event me-2"></i>
                        <span>{task.dueDate ? formatDate(task.dueDate) : 'Pas de date limite'}</span>
                        {isDueSoon(task.dueDate) && <span className="ms-2 badge bg-danger">Bientôt</span>}
                      </div>
                      <div className="d-flex align-items-center small text-muted">
                        <i className="bi bi-clock-history me-2"></i>
                        <span>Créée le {formatDate(task.createdAt)}</span>
                      </div>
                      {task.status === TaskStatus.ONGOING && task.startedAt && (
                        <div className="d-flex align-items-center small text-muted mt-1">
                          <i className="bi bi-play-circle me-2"></i>
                          <span>Démarrée le {formatDate(task.startedAt)}</span>
                        </div>
                      )}
                      {task.status === TaskStatus.COMPLETED && task.completedAt && (
                        <div className="d-flex align-items-center small text-muted mt-1">
                          <i className="bi bi-check-circle me-2"></i>
                          <span>Terminée le {formatDate(task.completedAt)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default TaskList;