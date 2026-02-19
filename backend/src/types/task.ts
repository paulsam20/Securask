export enum TaskStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
}

export enum TaskPriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
}

export interface TaskType {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate?: Date;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}
