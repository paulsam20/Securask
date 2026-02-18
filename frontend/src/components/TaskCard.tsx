import { Trash2, Edit2, CheckCircle2, Clock } from 'lucide-react';

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
  high: 'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-green-100 text-green-700',
};

const statusIcons = {
  active: { bg: 'bg-blue-50', border: 'border-blue-200' },
  progress: { bg: 'bg-amber-50', border: 'border-amber-200' },
  completed: { bg: 'bg-green-50', border: 'border-green-200' },
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
      className={`${statusConfig.bg} border ${statusConfig.border} rounded-lg p-4 hover:shadow-md transition`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{title}</h3>
            {description && (
              <p className="text-sm text-gray-600 mt-1">{description}</p>
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
            <span className="text-xs text-gray-600 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {dueDate}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onStatusChange && status !== 'completed' && (
            <button
              onClick={() => onStatusChange(id, getNextStatus())}
              className="p-1.5 hover:bg-white rounded-md transition"
              title="Move to next status"
            >
              <CheckCircle2 className="w-4 h-4 text-gray-600 hover:text-primary-600" />
            </button>
          )}
          <button
            onClick={() => onDelete(id)}
            className="p-1.5 hover:bg-white rounded-md transition"
            title="Delete task"
          >
            <Trash2 className="w-4 h-4 text-gray-600 hover:text-red-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
