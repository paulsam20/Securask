import Task, { ITask } from '../models/Task';

export class TaskService {
    static async getTasks(userId: string) {
        return await Task.find({ user: userId });
    }

    static async getTaskById(taskId: string, userId: string) {
        const task = await Task.findById(taskId);
        if (!task) throw new Error('Task not found');
        if (task.user.toString() !== userId) throw new Error('Not authorized');
        return task;
    }

    static async createTask(taskData: Partial<ITask>, userId: string) {
        return await Task.create({ ...taskData, user: userId });
    }

    static async updateTask(taskId: string, userId: string, updateData: Partial<ITask>) {
        const task = await Task.findById(taskId);
        if (!task) throw new Error('Task not found');
        if (task.user.toString() !== userId) throw new Error('Not authorized');

        Object.assign(task, updateData);
        return await task.save();
    }

    static async deleteTask(taskId: string, userId: string) {
        const task = await Task.findById(taskId);
        if (!task) throw new Error('Task not found');
        if (task.user.toString() !== userId) throw new Error('Not authorized');

        await task.deleteOne();
        return { message: 'Task successfully deleted' };
    }
}
