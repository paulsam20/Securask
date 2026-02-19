import { useState } from 'react';
import { Trash2, CheckCircle2, Clock, GripVertical, Pencil, Check } from 'lucide-react';
import { Draggable } from '@hello-pangea/dnd';

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
}

const priorityColors = {
  high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};

const statusStyles = {
  active: { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800' },
  progress: { bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800' },
  completed: { bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-800' },
};

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
}: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editDescription, setEditDescription] = useState(description ?? '');
  const s = statusStyles[status];

  const isEditable = (status === 'active' || status === 'progress') && onUpdateTask;

  const handleSaveEdit = () => {
    if (editTitle.trim() && onUpdateTask) {
      onUpdateTask(id, { title: editTitle.trim(), description: editDescription.trim() || undefined });
      setIsEditing(false);
    }
  };

  const getNextStatus = (): 'active' | 'progress' | 'completed' => {
    const order: ('active' | 'progress' | 'completed')[] = ['active', 'progress', 'completed'];
    return order[(order.indexOf(status) + 1) % order.length];
  };

  return (
    <Draggable draggableId={id} index={index} isDragDisabled={isEditing}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`
            ${s.bg} border ${s.border} rounded-lg p-4
            transition-all duration-200
            ${snapshot.isDragging
              ? 'shadow-2xl scale-[1.03] rotate-1 ring-2 ring-primary-400/60 dark:ring-primary-500/60'
              : 'hover:shadow-md'}
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
                      className="w-full px-2 py-1 text-sm font-semibold rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
                      autoFocus
                    />
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="w-full px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 focus:ring-2 focus:ring-primary-500 focus:outline-none resize-none"
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
              {isEditable && !isEditing && (
                <button
                  onClick={() => {
                    setEditTitle(title);
                    setEditDescription(description ?? '');
                    setIsEditing(true);
                  }}
                  className="flex-shrink-0 p-1.5 hover:bg-white dark:hover:bg-gray-700 rounded-md transition-colors"
                  title="Edit task"
                >
                  <Pencil className="w-4 h-4 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors" />
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

          <div className={`flex items-center justify-between flex-wrap gap-2 ${status === 'completed' ? 'opacity-75' : ''}`}>
            <div className="flex items-center gap-2">
              {priority && (
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${priorityColors[priority]} ${status === 'completed' ? 'line-through' : ''}`}>
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </span>
              )}
              {dueDate && (
                <span className={`text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1 transition-colors ${status === 'completed' ? 'line-through' : ''}`}>
                  <Clock className="w-3.5 h-3.5" />
                  {dueDate.includes('-') ? new Date(dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : dueDate}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {onStatusChange && status !== 'completed' && (
                <button
                  onClick={() => onStatusChange(id, getNextStatus())}
                  className="p-1.5 hover:bg-white dark:hover:bg-gray-700 rounded-md transition-colors"
                  title="Move to next status"
                >
                  <CheckCircle2 className="w-4 h-4 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors" />
                </button>
              )}
              <button
                onClick={() => onDelete(id)}
                className="p-1.5 hover:bg-white dark:hover:bg-gray-700 rounded-md transition-colors"
                title="Delete task"
              >
                <Trash2 className="w-4 h-4 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors" />
              </button>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
