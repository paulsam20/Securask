import mongoose, { Schema, Document } from 'mongoose';

/**
 * IStickyNote Interface
 * Represents a quick note displayed in the side panel.
 */
export interface IStickyNote extends Document {
  user: mongoose.Types.ObjectId; // Owner of the note
  text: string;
  color: 'yellow' | 'pink' | 'blue' | 'green' | 'purple' | 'gray';
  order: number; // Tracking the display order for drag-and-drop
}

/**
 * StickyNoteSchema
 * MongoDB schema for sticky notes.
 */
const StickyNoteSchema: Schema = new Schema(
  {
    // Indexed for fast retrieval by user
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User', index: true },
    text: { type: String, default: '' },
    // Only pre-defined colors allowed
    color: {
      type: String,
      enum: ['yellow', 'pink', 'blue', 'green', 'purple', 'gray'],
      default: 'yellow',
    },
    // Indexed because we sort by order frequently
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true },
);

export default mongoose.model<IStickyNote>('StickyNote', StickyNoteSchema);
