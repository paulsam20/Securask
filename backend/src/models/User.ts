import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * IUser Interface
 * Defines the user properties and ensures TypeScript type safety for the User model.
 */
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
}

/**
 * userSchema
 * Mongoose schema for the User model.
 * Includes automatic timestamps (createdAt, updatedAt).
 */
const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

/**
 * Pre-save Middleware
 * Automatically hashes the user's password before saving to the database.
 * Only triggers if the password field has been modified.
 */
userSchema.pre('save', async function (this: IUser) {
  // skip hashing if password hasn't changed
  if (!this.isModified('password')) {
    return;
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    // If hashing fails, prevent the save operation
    throw error;
  }
});

export const User = model<IUser>('User', userSchema);