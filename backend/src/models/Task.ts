import mongoose, { Schema, Document } from 'mongoose';

// Interface defining the structure of a Task document
export interface ITask extends Document {
  title: string;
  description: string;
  completed: boolean;
  user: mongoose.Types.ObjectId; // Reference to the User model
  createdAt: Date;
}

const TaskSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    completed: { type: Boolean, default: false },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // For Auth
  },
  { timestamps: true }
);

export default mongoose.model<ITask>('Task', TaskSchema);