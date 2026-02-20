import Task, { ITask } from '../models/Task';

/**
 * TaskService
 * Business logic layer for task-related operations.
 * Handles data access and ownership verification.
 */
export class TaskService {
    /**
     * Fetch all tasks for a specific user ID.
     */
    static async getTasks(userId: string) {
        return await Task.find({ user: userId });
    }

    /**
     * Retrieve a single task while ensuring user ownership.
     */
    static async getTaskById(taskId: string, userId: string) {
        const task = await Task.findById(taskId);
        if (!task) throw new Error('Task not found');
        if (task.user.toString() !== userId) throw new Error('Not authorized');
        return task;
    }

    /**
     * Persist a new task associated with a user.
     */
    static async createTask(taskData: Partial<ITask>, userId: string) {
        return await Task.create({ ...taskData, user: userId });
    }

    /**
     * Update an existing task with new data.
     */
    static async updateTask(taskId: string, userId: string, updateData: Partial<ITask>) {
        const task = await Task.findById(taskId);
        if (!task) throw new Error('Task not found');
        if (task.user.toString() !== userId) throw new Error('Not authorized');

        // Apply partial updates to the task document
        Object.assign(task, updateData);
        return await task.save();
    }

    /**
     * Delete a user's task.
     */
    static async deleteTask(taskId: string, userId: string) {
        const task = await Task.findById(taskId);
        if (!task) throw new Error('Task not found');
        if (task.user.toString() !== userId) throw new Error('Not authorized');

        await task.deleteOne();
        return { message: 'Task successfully deleted' };
    }
}
