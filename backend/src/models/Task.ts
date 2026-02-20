import mongoose, { Schema, Document } from 'mongoose';

/**
 * ITask Interface
 * Represents a standard task in the system.
 */
export interface ITask extends Document {
  user: mongoose.Types.ObjectId; // Reference to the owner (User)
  title: string;
  description: string;
  status: 'active' | 'progress' | 'completed'; // Matches frontend status
  priority?: 'high' | 'medium' | 'low';
  dueDate?: string;
}

/**
 * TaskSchema
 * Defines the structure for the Task collection in MongoDB.
 */
const TaskSchema: Schema = new Schema({
  // Link each task to a specific user
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  title: { type: String, required: true },
  description: { type: String },
  // Status column for the Kanban board
  status: { type: String, enum: ['active', 'progress', 'completed'], default: 'active' },
  priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
  dueDate: { type: String }
}, { timestamps: true });

export default mongoose.model<ITask>('Task', TaskSchema);