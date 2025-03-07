// État possible d'une tâche
export enum TaskStatus {
    WAITING = 'waiting',
    ONGOING = 'ongoing',
    COMPLETED = 'completed'
}

// Interface principale pour une tâche
export interface Task {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    dueDate?: string; // Date d'échéance au format
    createdAt: string;
    updatedAt: string;
    startedAt?: string;
    completedAt?: string;
}