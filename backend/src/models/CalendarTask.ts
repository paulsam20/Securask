import mongoose, { Schema, Document } from 'mongoose';

export interface ICalendarTask extends Document {
    user: mongoose.Types.ObjectId;
    title: string;
    time: string;
    date: string; // Format: YYYY-MM-DD
    description?: string;
    completed: boolean;
}

const CalendarTaskSchema: Schema = new Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User', index: true },
        title: { type: String, required: true },
        time: { type: String, required: true },
        date: { type: String, required: true, index: true },
        description: { type: String },
        completed: { type: Boolean, default: false },
    },
    { timestamps: true },
);

export default mongoose.model<ICalendarTask>('CalendarTask', CalendarTaskSchema);
