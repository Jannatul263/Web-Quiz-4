import { Model, model, models, Schema } from 'mongoose';

export interface ITask {
    title: string;
    description?: string;
    userId: string;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const TaskSchema = new Schema<ITask>({
    title: { type: String, required: true },
    description: { type: String },
    completed: { type: Boolean, default: false },
    userId: { type: String, required: true },
}, { timestamps: true });

const Task = models?.task as Model<ITask> || model('task', TaskSchema);

export default Task;
