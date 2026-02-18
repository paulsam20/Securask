import TaskCard from './TaskCard';

interface Task {
  id: string;
  title: string;
  description?: string;
  priority?: 'high' | 'medium' | 'low';
  dueDate?: string;
  status: 'active' | 'progress' | 'completed';
}

interface TaskSectionProps {
  title: string;
  tasks: Task[];
  onDeleteTask: (id: string) => void;
  onStatusChange: (id: string, newStatus: 'active' | 'progress' | 'completed') => void;
}

export default function TaskSection({
  title,
  tasks,
  onDeleteTask,
  onStatusChange,
}: TaskSectionProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">
          {title}
          <span className="ml-2 text-sm font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-2.5 py-1 rounded-full inline-block transition-colors">
            {tasks.length}
          </span>
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {tasks.length === 0 ? (
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center transition-colors">
            <p className="text-gray-500 dark:text-gray-400 font-medium">No tasks yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">Add a new task to get started</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                {...task}
                onDelete={onDeleteTask}
                onStatusChange={onStatusChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
