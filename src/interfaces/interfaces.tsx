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
  
  
  export interface TaskMetadata {
    totalTasks: number;
    waitingTasks: number;
    ongoingTasks: number;
    completedTasks: number;
    overdueTasks: number; 
  }
  
  
  export interface TaskUpdate {
    title?: string;
    description?: string | null; 
    status?: TaskStatus;
    dueDate?: string | null; 
  }