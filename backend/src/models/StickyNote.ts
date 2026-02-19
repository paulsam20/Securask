import mongoose, { Schema, Document } from 'mongoose';

export interface IStickyNote extends Document {
  user: mongoose.Types.ObjectId;
  text: string;
  color: 'yellow' | 'pink' | 'blue' | 'green' | 'purple' | 'gray';
  order: number;
}

const StickyNoteSchema: Schema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User', index: true },
    text: { type: String, default: '' },
    color: {
      type: String,
      enum: ['yellow', 'pink', 'blue', 'green', 'purple', 'gray'],
      default: 'yellow',
    },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true },
);

export default mongoose.model<IStickyNote>('StickyNote', StickyNoteSchema);

