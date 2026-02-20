import mongoose, { Schema, Document } from 'mongoose';

/**
 * ICalendarTask Interface
 * Represents an appointment or timed event displayed in the Calendar view.
 */
export interface ICalendarTask extends Document {
    user: mongoose.Types.ObjectId; // Reference to owner
    title: string;
    time: string; // HH:mm format
    date: string; // ISO format string: YYYY-MM-DD
    description?: string;
    completed: boolean;
}

/**
 * CalendarTaskSchema
 * MongoDB schema for calendar entries.
 */
const CalendarTaskSchema: Schema = new Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User', index: true },
        title: { type: String, required: true },
        time: { type: String, required: true },
        // Indexed because we filter by date range in the UI
        date: { type: String, required: true, index: true },
        description: { type: String },
        completed: { type: Boolean, default: false },
    },
    { timestamps: true },
);

export default mongoose.model<ICalendarTask>('CalendarTask', CalendarTaskSchema);
