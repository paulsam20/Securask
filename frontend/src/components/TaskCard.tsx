import { Trash2, CheckCircle2, Clock } from 'lucide-react';

interface TaskCardProps {
  id: string;
  title: string;
  description?: string;
  priority?: 'high' | 'medium' | 'low';
  dueDate?: string;
  status: 'active' | 'progress' | 'completed';
  onDelete: (id: string) => void;
  onStatusChange?: (id: string, newStatus: 'active' | 'progress' | 'completed') => void;
}

const priorityColors = {
  high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};

const statusIcons = {
  active: { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800' },
  progress: { bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800' },
  completed: { bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-800' },
};

export default function TaskCard({
  id,
  title,
  description,
  priority = 'medium',
  dueDate,
  status,
  onDelete,
  onStatusChange,
}: TaskCardProps) {
  const statusConfig = statusIcons[status];

  const getNextStatus = () => {
    const statuses: ('active' | 'progress' | 'completed')[] = ['active', 'progress', 'completed'];
    const currentIndex = statuses.indexOf(status);
    return statuses[(currentIndex + 1) % statuses.length];
  };

  return (
    <div
      className={`${statusConfig.bg} border ${statusConfig.border} rounded-lg p-4 hover:shadow-md transition-all duration-300 dark:text-gray-100`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white transition-colors">{title}</h3>
            {description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 transition-colors">{description}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          {priority && (
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${priorityColors[priority]}`}>
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </span>
          )}
          {dueDate && (
            <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1 transition-colors">
              <Clock className="w-3.5 h-3.5" />
              {dueDate}
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
  );
}
