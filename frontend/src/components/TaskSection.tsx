import { Droppable } from '@hello-pangea/dnd';
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
  droppableId: string;
  title: string;
  tasks: Task[];
  onDeleteTask: (id: string) => void;
  onStatusChange: (id: string, newStatus: 'active' | 'progress' | 'completed') => void;
  onUpdateTask?: (id: string, updates: { title?: string; description?: string; priority?: 'high' | 'medium' | 'low'; dueDate?: string }) => void;
}

const columnAccent: Record<string, string> = {
  active: 'from-blue-500/10  to-blue-400/5  dark:from-blue-800/20 dark:to-blue-900/10  border-blue-200   dark:border-blue-800',
  progress: 'from-amber-500/10 to-amber-400/5 dark:from-amber-800/20 dark:to-amber-900/10 border-amber-200  dark:border-amber-800',
  completed: 'from-green-500/10 to-green-400/5 dark:from-green-800/20 dark:to-green-900/10 border-green-200 dark:border-green-800',
};

const headerAccent: Record<string, string> = {
  active: 'text-blue-600   dark:text-blue-400   bg-blue-100   dark:bg-blue-900/30',
  progress: 'text-amber-600  dark:text-amber-400  bg-amber-100  dark:bg-amber-900/30',
  completed: 'text-green-600  dark:text-green-400  bg-green-100  dark:bg-green-900/30',
};

export default function TaskSection({
  droppableId,
  title,
  tasks,
  onDeleteTask,
  onStatusChange,
  onUpdateTask,
}: TaskSectionProps) {
  const accent = columnAccent[droppableId] ?? columnAccent.active;
  const header = headerAccent[droppableId] ?? headerAccent.active;

  return (
    <div className={`flex flex-col h-full bg-gradient-to-b ${accent} border rounded-xl p-4 transition-colors duration-300`}>
      {/* Column header */}
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white transition-colors flex items-center gap-2">
          {title}
          <span className={`text-sm font-semibold px-2.5 py-1 rounded-full ${header}`}>
            {tasks.length}
          </span>
        </h2>
      </div>

      {/* Drop zone */}
      <Droppable droppableId={droppableId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`
              flex-1 min-h-[120px] overflow-y-auto rounded-lg transition-all duration-200
              ${snapshot.isDraggingOver
                ? 'bg-white/50 dark:bg-white/5 ring-2 ring-primary-400/50 dark:ring-primary-500/40'
                : ''}
            `}
          >
            {tasks.length === 0 && !snapshot.isDraggingOver ? (
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center transition-colors h-full flex flex-col items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400 font-medium">No tasks yet</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  Drop a task here or add a new one
                </p>
              </div>
            ) : (
              <div className="grid gap-3">
                {tasks.map((task, index) => (
                  <TaskCard
                    key={task.id}
                    index={index}
                    {...task}
                    onDelete={onDeleteTask}
                    onStatusChange={onStatusChange}
                    onUpdateTask={onUpdateTask}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
            {tasks.length > 0 && provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
