import { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import Sidebar from '../components/Sidebar';
import TaskSection from '../components/TaskSection';
import { taskAPI } from '../services/api';

interface Task {
  id: string;
  _id?: string;
  title: string;
  description?: string;
  priority?: 'high' | 'medium' | 'low';
  dueDate?: string;
  status: 'active' | 'progress' | 'completed';
}

interface DashboardPageProps {
  userEmail: string;
  onLogout: () => void;
  isNotesOpen?: boolean;
}

// Helper: map backend task to frontend Task
const mapBackendTaskToFrontend = (backendTask: any): Task => {
  let frontendStatus: 'active' | 'progress' | 'completed' = 'active';
  if (backendTask.status === 'completed') frontendStatus = 'completed';
  else if (backendTask.status === 'progress') frontendStatus = 'progress';

  return {
    id: backendTask._id || backendTask.id,
    title: backendTask.title,
    description: backendTask.description,
    priority: backendTask.priority || 'medium',
    dueDate: backendTask.dueDate,
    status: frontendStatus,
  };
};

export default function DashboardPage({ userEmail, onLogout, isNotesOpen = false }: DashboardPageProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showNewTask, setShowNewTask] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    dueDate: '',
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      setError('');
      const backendTasks = await taskAPI.getTasks();
      const mapped = Array.isArray(backendTasks) ? backendTasks.map(mapBackendTaskToFrontend) : [];
      setTasks(mapped);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  };

  // Derived per-column task lists (ordered)
  const activeTasks = tasks.filter((t) => t.status === 'active');
  const progressTasks = tasks.filter((t) => t.status === 'progress');
  const completedTasks = tasks.filter((t) => t.status === 'completed');

  // ── Drag & Drop ────────────────────────────────────────────────────────────
  const onDragEnd = useCallback(
    async (result: DropResult) => {
      const { source, destination, draggableId } = result;
      if (!destination) return;

      const srcCol = source.droppableId as 'active' | 'progress' | 'completed';
      const destCol = destination.droppableId as 'active' | 'progress' | 'completed';

      // Build ordered column snapshots
      const cols: Record<string, Task[]> = {
        active: [...activeTasks],
        progress: [...progressTasks],
        completed: [...completedTasks],
      };

      const movedTask = cols[srcCol].find((t) => t.id === draggableId);
      if (!movedTask) return;

      // Remove from source & insert into destination
      cols[srcCol].splice(source.index, 1);
      const updatedTask = { ...movedTask, status: destCol };
      cols[destCol].splice(destination.index, 0, updatedTask);

      // Optimistically update UI
      setTasks([...cols.active, ...cols.progress, ...cols.completed]);

      // Persist to backend only if column changed
      if (srcCol !== destCol) {
        try {
          await taskAPI.updateTask(draggableId, { status: destCol });
        } catch (err: any) {
          setError(err.message || 'Failed to update task');
          fetchTasks(); // revert on failure
        }
      }
    },
    [activeTasks, progressTasks, completedTasks],
  );
  // ──────────────────────────────────────────────────────────────────────────

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    try {
      setError('');
      const created = await taskAPI.createTask({ ...newTask, status: 'active' });
      setTasks((prev) => [...prev, mapBackendTaskToFrontend(created)]);
      setNewTask({ title: '', description: '', priority: 'medium', dueDate: '' });
      setShowNewTask(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create task');
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      setError('');
      await taskAPI.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete task');
    }
  };

  const handleStatusChange = async (id: string, newStatus: 'active' | 'progress' | 'completed') => {
    try {
      setError('');
      await taskAPI.updateTask(id, { status: newStatus });
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t)));
    } catch (err: any) {
      setError(err.message || 'Failed to update task');
    }
  };

  const handleUpdateTask = async (
    id: string,
    updates: { title?: string; description?: string; priority?: 'high' | 'medium' | 'low'; dueDate?: string },
  ) => {
    try {
      setError('');
      await taskAPI.updateTask(id, updates);
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updates } : t)),
      );
    } catch (err: any) {
      setError(err.message || 'Failed to update task');
    }
  };

  const progressPercent = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  return (
    <div className="flex h-screen bg-gradient-to-br from-primary-600/8 via-gray-50/85 to-violet-600/8 dark:from-primary-900/15 dark:via-gray-900/85 dark:to-violet-900/15 transition-colors duration-300">
      <Sidebar
        userEmail={userEmail}
        onLogout={onLogout}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((o) => !o)}
        hideToggle={isNotesOpen}
      />

      <main
        className={`flex-1 overflow-auto transition-[padding] duration-300 ${
          sidebarOpen ? 'lg:pl-[280px]' : 'lg:pl-14'
        }`}
      >
        <div className="pt-16 lg:pt-0 px-6 lg:px-8 py-8">
          <div className="max-w-7xl mx-auto">

            {/* Header */}
            <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between pr-14 lg:pr-16">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">
                  Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1 transition-colors">
                  Welcome back, {userEmail.split('@')[0]}
                </p>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <button
                onClick={() => setShowNewTask(true)}
                className="bg-primary-500 hover:bg-primary-600 text-white font-semibold px-6 py-3 rounded-lg flex items-center gap-2 transition w-full lg:w-auto justify-center shadow-lg shadow-primary-500/30"
              >
                <Plus className="w-5 h-5" />
                New Task
              </button>
            </div>

            {/* Progress bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Task Progress</span>
                <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">{progressPercent}% Complete</span>
              </div>
              <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-500 to-violet-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* New Task Form */}
            {showNewTask && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 border border-primary-200 dark:border-primary-800 transition-colors duration-300">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Create New Task</h2>
                <form onSubmit={handleAddTask}>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Task Title
                      </label>
                      <input
                        type="text"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        placeholder="Enter task title"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Priority
                      </label>
                      <div className="relative">
                        <select
                          value={newTask.priority}
                          onChange={(e) =>
                            setNewTask({ ...newTask, priority: e.target.value as 'high' | 'medium' | 'low' })
                          }
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors appearance-none"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        placeholder="Enter task description (optional)"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Due Date
                      </label>
                      <input
                        type="text"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                        placeholder="e.g., Mar 20"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button
                      type="submit"
                      className="bg-primary-500 hover:bg-primary-600 text-white font-semibold px-6 py-2 rounded-lg transition shadow-lg shadow-primary-500/30"
                    >
                      Add Task
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewTask(false)}
                      className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold px-6 py-2 rounded-lg transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Kanban Board */}
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">Loading tasks…</p>
              </div>
            ) : (
              <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <TaskSection
                    droppableId="active"
                    title="Active"
                    tasks={activeTasks}
                    onDeleteTask={handleDeleteTask}
                    onStatusChange={handleStatusChange}
                    onUpdateTask={handleUpdateTask}
                  />
                  <TaskSection
                    droppableId="progress"
                    title="In Progress"
                    tasks={progressTasks}
                    onDeleteTask={handleDeleteTask}
                    onStatusChange={handleStatusChange}
                    onUpdateTask={handleUpdateTask}
                  />
                  <TaskSection
                    droppableId="completed"
                    title="Completed"
                    tasks={completedTasks}
                    onDeleteTask={handleDeleteTask}
                    onStatusChange={handleStatusChange}
                  />
                </div>
              </DragDropContext>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}
