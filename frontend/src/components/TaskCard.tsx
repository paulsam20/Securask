import { useState } from 'react';
import { Trash2, CheckCircle2, Clock, GripVertical, Pencil, Check, Target } from 'lucide-react';
import { Draggable } from '@hello-pangea/dnd';
import { motion } from 'framer-motion';

interface TaskCardProps {
  id: string;
  index: number;
  title: string;
  description?: string;
  priority?: 'high' | 'medium' | 'low';
  dueDate?: string;
  status: 'active' | 'progress' | 'completed';
  onDelete: (id: string) => void;
  onStatusChange?: (id: string, newStatus: 'active' | 'progress' | 'completed') => void;
  onUpdateTask?: (id: string, updates: { title?: string; description?: string; priority?: 'high' | 'medium' | 'low'; dueDate?: string }) => void;
  onFocus?: (task: { id: string; title: string; description?: string }) => void;
}

const priorityColors = {
  high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};

const statusStyles = {
  active: {
    bg: 'bg-blue-50/50 dark:bg-blue-900/10',
    border: 'border-blue-200/50 dark:border-blue-800/50',
    glow: 'hover:shadow-blue-500/10',
    hoverBorder: 'hover:border-blue-500/30'
  },
  progress: {
    bg: 'bg-amber-50/50 dark:bg-amber-900/10',
    border: 'border-amber-200/50 dark:border-amber-800/50',
    glow: 'hover:shadow-amber-500/10',
    hoverBorder: 'hover:border-amber-500/30'
  },
  completed: {
    bg: 'bg-green-50/50 dark:bg-green-900/10',
    border: 'border-green-200/50 dark:border-green-800/50',
    glow: 'hover:shadow-green-500/10',
    hoverBorder: 'hover:border-green-500/30'
  },
};

/**
 * TaskCard Component
 * Represents an individual task in the dashboard.
 * Supports drag-and-drop, in-place editing, status transitions, and dynamic styling based on priority/status.
 */
export default function TaskCard({
  id,
  index,
  title,
  description,
  priority = 'medium',
  dueDate,
  status,
  onDelete,
  onStatusChange,
  onUpdateTask,
  onFocus,
}: TaskCardProps) {
  // Local state for in-place title/description editing
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editDescription, setEditDescription] = useState(description ?? '');

  // Current style configuration based on task status (active/progress/completed)
  const s = statusStyles[status];

  // Helper constraint: Tasks can only be edited while not completed
  const isEditable = (status === 'active' || status === 'progress') && onUpdateTask;

  /**
   * Persists edits and exits edit mode
   */
  const handleSaveEdit = () => {
    if (editTitle.trim() && onUpdateTask) {
      onUpdateTask(id, { title: editTitle.trim(), description: editDescription.trim() || undefined });
      setIsEditing(false);
    }
  };

  /**
   * Status Cycler: Determines the next logical step in the task lifecycle
   * Active -> In Progress -> Completed
   */
  const getNextStatus = (): 'active' | 'progress' | 'completed' => {
    const order: ('active' | 'progress' | 'completed')[] = ['active', 'progress', 'completed'];
    return order[(order.indexOf(status) + 1) % order.length];
  };

  return (
    <Draggable draggableId={id} index={index} isDragDisabled={isEditing}>
      {(provided, snapshot) => (
        <motion.div
          ref={provided.innerRef}
          {...provided.draggableProps}
          layout
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          onDragStart={undefined}
          whileHover={!snapshot.isDragging ? {
            scale: 1.02,
            y: -4,
            transition: { type: 'spring', stiffness: 400, damping: 25 }
          } : {}}
          className={`
            ${s.bg} border ${s.border} rounded-xl p-4
            backdrop-blur-sm transition-shadow duration-300
            ${snapshot.isDragging
              ? 'shadow-2xl scale-[1.03] rotate-1 ring-2 ring-primary-400/60 dark:ring-primary-500/60'
              : `hover:shadow-xl ${s.glow} ${s.hoverBorder}`}
            dark:text-gray-100
          `}
        >
          <div className="flex items-start justify-between mb-3">
            {/* Drag handle - hidden when editing */}
            {!isEditing && (
              <div
                {...provided.dragHandleProps}
                className="flex-shrink-0 mt-0.5 mr-2 cursor-grab active:cursor-grabbing text-gray-400 dark:text-gray-500 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                title="Drag to reorder"
              >
                <GripVertical className="w-4 h-4" />
              </div>
            )}

            <div className="flex items-start gap-2 flex-1 min-w-0">
              <div className="flex-1 min-w-0">
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                      className="w-full px-2 py-1 text-sm font-semibold rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
                      autoFocus
                    />
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="w-full px-2 py-1 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 focus:ring-2 focus:ring-primary-500 focus:outline-none resize-none"
                      rows={2}
                      placeholder="Description (optional)"
                    />
                  </div>
                ) : (
                  <>
                    <h3 className={`font-semibold text-gray-900 dark:text-white transition-colors ${status === 'completed' ? 'line-through opacity-75' : ''}`}>
                      {title}
                    </h3>
                    {description && (
                      <p className={`text-sm text-gray-600 dark:text-gray-400 mt-1 transition-colors ${status === 'completed' ? 'line-through opacity-75' : ''}`}>
                        {description}
                      </p>
                    )}
                  </>
                )}
              </div>
              <div className="flex items-center gap-1">
                {onFocus && status !== 'completed' && !isEditing && (
                  <button
                    onClick={() => onFocus({ id, title, description })}
                    className="flex-shrink-0 p-1.5 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-md transition-colors group"
                    title="Start focus mode"
                  >
                    <Target className="w-4 h-4 text-gray-400 group-hover:text-primary-500 transition-colors" />
                  </button>
                )}
                {isEditable && !isEditing && (
                  <button
                    onClick={() => {
                      setEditTitle(title);
                      setEditDescription(description ?? '');
                      setIsEditing(true);
                    }}
                    className="flex-shrink-0 p-1.5 hover:bg-white/80 dark:hover:bg-gray-700 rounded-md transition-colors"
                    title="Edit task"
                  >
                    <Pencil className="w-4 h-4 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors" />
                  </button>
                )}
                {isEditing && (
                  <button
                    onClick={handleSaveEdit}
                    className="flex-shrink-0 p-1.5 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-md transition-colors"
                    title="Save"
                  >
                    <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className={`flex items-center justify-between flex-wrap gap-2 ${status === 'completed' ? 'opacity-75' : ''}`}>
            <div className="flex items-center gap-2">
              {priority && (
                <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${priorityColors[priority]} ${status === 'completed' ? 'line-through' : ''}`}>
                  {priority}
                </span>
              )}
              {dueDate && (
                <span className={`text-[11px] font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1 transition-colors ${status === 'completed' ? 'line-through' : ''}`}>
                  <Clock className="w-3.5 h-3.5" />
                  {dueDate.includes('-') ? new Date(dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : dueDate}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              {onStatusChange && status !== 'completed' && (
                <button
                  onClick={() => onStatusChange(id, getNextStatus())}
                  className="p-1.5 hover:bg-white/80 dark:hover:bg-gray-700 rounded-md transition-colors group"
                  title="Move to next status"
                >
                  <CheckCircle2 className="w-4 h-4 text-gray-400 group-hover:text-green-500 transition-colors" />
                </button>
              )}
              <button
                onClick={() => onDelete(id)}
                className="p-1.5 hover:bg-white/80 dark:hover:bg-gray-700 rounded-md transition-colors group"
                title="Delete task"
              >
                <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </Draggable>
  );
}
