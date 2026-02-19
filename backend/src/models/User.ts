import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

// Strict Type Safety: Define the interface 
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

// Modern Async Hook: No 'next' parameter means no 'SaveOptions' error
userSchema.pre('save', async function (this: IUser) {
  // Only hash if modified [cite: 6]
  if (!this.isModified('password')) {
    return;
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    // Throwing here effectively stops the save and returns an error
    throw error;
  }
});

export const User = model<IUser>('User', userSchema);