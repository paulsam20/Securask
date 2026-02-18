import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  priority?: 'high' | 'medium' | 'low';
  dueDate?: string;
}

const TaskSchema: Schema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
  dueDate: { type: String }
}, { timestamps: true });

export default mongoose.model<ITask>('Task', TaskSchema);