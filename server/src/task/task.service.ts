import Task from "./task.model";

export class TaskService {
    constructor() {}
    static async create(data: {
        title: string;
        description: string;
        userId: string;
    }) {
        const task = await Task.create(data);
        return task;
    }
    
    static async getAll() {
        const tasks = await Task.find({});
        return tasks;
    }
    
    static async getById(id: string) {
        const task = await Task.findById(id);
        return task;
    }
    
    static async update(id: string, data: {
    }) {

    }

    static async delete(id: string) {
        const task = await Task.findByIdAndDelete(id);
        return task;
    }
    static async getByUserId(userId: string) {
        const tasks = await Task.find({ userId });
        return tasks;
    }
}