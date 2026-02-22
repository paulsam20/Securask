import { useState, memo } from 'react';
import { Trash2, CheckCircle2, Clock, GripVertical, Pencil, Target, X } from 'lucide-react';
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
    bg: 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-200/50 dark:border-blue-800/50',
    glow: 'hover:shadow-blue-500/10',
    hoverBorder: 'hover:border-blue-500/30'
  },
  progress: {
    bg: 'bg-amber-50/50 dark:bg-amber-900/10 border-amber-200/50 dark:border-amber-800/50',
    glow: 'hover:shadow-amber-500/10',
    hoverBorder: 'hover:border-amber-500/30'
  },
  completed: {
    bg: 'bg-green-50/50 dark:bg-green-900/10 border-green-200/50 dark:border-green-800/50',
    glow: 'hover:shadow-green-500/10',
    hoverBorder: 'hover:border-green-500/30'
  },
};

const TaskCard = ({
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
}: TaskCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editDescription, setEditDescription] = useState(description ?? '');

  const styles = statusStyles[status];
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
          style={provided.draggableProps.style}
          className="outline-none mb-3 last:mb-0"
        >
          {/* 
              Scale and Shadow are applied to this inner wrapper 
              to keep the Draggable's style (transform) pure.
          */}
          <motion.div
            initial={false}
            animate={snapshot.isDragging ? {
              scale: 1.03,
              rotate: 1,
              boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
            } : {
              scale: 1,
              rotate: 0,
              boxShadow: "0 0px 0px 0px transparent"
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={`
              ${styles.bg} border rounded-xl p-4
              backdrop-blur-sm transition-colors duration-300 group
              ${snapshot.isDragging ? 'ring-2 ring-primary-500/50 z-50' : `hover:border-primary-500/30 dark:text-gray-100 flex flex-col gap-3`}
            `}
          >
            <div className="flex items-start justify-between">
              {!isEditing && (
                <div
                  {...provided.dragHandleProps}
                  className="flex-shrink-0 mt-0.5 mr-2 cursor-grab active:cursor-grabbing text-gray-400 hover:text-primary-500 transition-colors"
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
                        className="w-full px-2 py-1 text-sm font-semibold rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
                        autoFocus
                      />
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="w-full px-2 py-1 text-sm rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 focus:ring-2 focus:ring-primary-500 resize-none h-20"
                      />
                    </div>
                  ) : (
                    <>
                      <h3 className={`font-semibold text-gray-900 dark:text-white ${status === 'completed' ? 'line-through opacity-75' : ''}`}>
                        {title}
                      </h3>
                      {description && (
                        <p className={`text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2 ${status === 'completed' ? 'line-through opacity-75' : ''}`}>
                          {description}
                        </p>
                      )}
                    </>
                  )}
                </div>
                {!isEditing && (
                  <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                    {onFocus && status !== 'completed' && (
                      <button
                        onClick={() => onFocus({ id, title, description })}
                        className="p-1.5 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-md transition-colors"
                        title="Focus Mode"
                      >
                        <Target className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                      </button>
                    )}
                    {isEditable && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                        title="Edit Task"
                      >
                        <Pencil className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                    )}
                  </div>
                )}
                {isEditing && (
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={handleSaveEdit}
                      className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-md transition-colors"
                      title="Save"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditTitle(title);
                        setEditDescription(description ?? '');
                      }}
                      className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors"
                      title="Cancel"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className={`flex items-center justify-between flex-wrap pt-2 border-t border-gray-100 dark:border-gray-800 ${status === 'completed' ? 'opacity-75' : ''}`}>
              <div className="flex items-center gap-2">
                {priority && (
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${priorityColors[priority]}`}>
                    {priority}
                  </span>
                )}
                {dueDate && (
                  <span className={`text-[11px] font-medium text-gray-500 flex items-center gap-1`}>
                    <Clock className="w-3.5 h-3.5" />
                    {dueDate.includes('-') ? new Date(dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : dueDate}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1">
                {onStatusChange && status !== 'completed' && (
                  <button
                    onClick={() => onStatusChange(id, getNextStatus())}
                    className="p-1.5 hover:bg-white dark:hover:bg-gray-700 rounded-md transition-colors"
                    title="Mark Next Status"
                  >
                    <CheckCircle2 className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400" />
                  </button>
                )}
                <button
                  onClick={() => onDelete(id)}
                  className="p-1.5 hover:bg-white dark:hover:bg-gray-700 rounded-md transition-colors text-gray-500 dark:text-gray-400"
                  title="Delete Task"
                >
                  <Trash2 className="w-4 h-4 hover:text-red-500 transition-colors" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </Draggable>
  );
};

export default memo(TaskCard);
