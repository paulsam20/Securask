import { useMemo, useState, useEffect, useCallback } from 'react';
import { Plus, X, Calendar as CalendarIcon, Clock, AlertCircle } from 'lucide-react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
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
  onNavigate?: (page: string) => void;
  currentPage?: string;
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const childVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function DashboardPage({ userEmail, onLogout, isNotesOpen = false, onNavigate, currentPage }: DashboardPageProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showNewTask, setShowNewTask] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [now, setNow] = useState(() => new Date());
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    dueDate: '',
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(t);
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
  const pendingCount = activeTasks.length + progressTasks.length;

  const priorityCounts = useMemo(() => {
    const counts = { high: 0, medium: 0, low: 0 } as { high: number; medium: number; low: number };
    for (const t of tasks) {
      if (t.status === 'completed') continue; // Exclude completed tasks from priority counts
      const p = (t.priority ?? 'medium') as 'high' | 'medium' | 'low';
      counts[p] += 1;
    }
    return counts;
  }, [tasks]);

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
        onNavigate={onNavigate}
        currentPage={currentPage}
        counts={{
          active: activeTasks.length,
          progress: progressTasks.length,
          completed: completedTasks.length,
          priority: priorityCounts,
        }}
      />

      <main
        className={`flex-1 overflow-auto custom-scrollbar transition-[padding] duration-300 ${sidebarOpen ? 'lg:pl-[280px]' : 'lg:pl-14'
          }`}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="pt-16 lg:pt-0 px-6 lg:px-8 py-8 pb-24"
        >
          <div className="max-w-7xl mx-auto">

            {/* Header */}
            <motion.div variants={childVariants} className="flex flex-col gap-4 mb-8 lg:flex-row lg:items-center lg:justify-between pr-14 lg:pr-16">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">
                  Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1 transition-colors">
                  Welcome back, {userEmail.split('@')[0]}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-6">
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-center gap-2"
                    >
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="hidden md:flex items-center gap-2 rounded-xl px-4 py-2 bg-white/50 dark:bg-gray-800/40 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm text-sm text-gray-700 dark:text-gray-300"
                >
                  <CalendarIcon className="w-3.5 h-3.5 text-primary-500" />
                  <span className="font-semibold">
                    {now.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                  </span>
                  <span className="text-gray-400 dark:text-gray-600">•</span>
                  <Clock className="w-3.5 h-3.5 text-violet-500" />
                  <span className="tabular-nums font-bold">
                    {now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowNewTask(true)}
                  className="bg-primary-500 hover:bg-primary-600 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition w-full lg:w-auto justify-center shadow-lg shadow-primary-500/30"
                >
                  <Plus className="w-5 h-5" />
                  New Task
                </motion.button>
              </div>
            </motion.div>

            {/* Daily Summary & Progress Bar - Only shown on main dashboard */}
            {currentPage === 'dashboard' && (
              <>
                <motion.div variants={childVariants} className="mb-6">
                  <div className="rounded-2xl border border-gray-200/70 dark:border-gray-800/70 bg-white/75 dark:bg-gray-900/40 backdrop-blur-md p-5 shadow-sm">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <motion.div variants={childVariants}>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          Good {now.getHours() < 12 ? 'morning' : now.getHours() < 18 ? 'afternoon' : 'evening'}, {userEmail.split('@')[0]}.
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          You have <span className="font-semibold text-primary-700 dark:text-primary-300">{pendingCount}</span> pending task{pendingCount === 1 ? '' : 's'} left today.
                        </p>
                      </motion.div>

                      <div className="flex items-center gap-3">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="rounded-xl px-4 py-3 bg-gradient-to-br from-primary-500/10 to-violet-500/10 dark:from-primary-400/10 dark:to-violet-400/10 border border-primary-200/40 dark:border-primary-800/40"
                        >
                          <p className="text-[11px] text-gray-500 dark:text-gray-400">Completion</p>
                          <p className="text-xl font-extrabold text-gray-900 dark:text-white leading-tight">{progressPercent}%</p>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="rounded-xl px-4 py-3 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-400/10 dark:to-teal-400/10 border border-emerald-200/40 dark:border-emerald-800/40"
                        >
                          <p className="text-[11px] text-gray-500 dark:text-gray-400">Completed</p>
                          <p className="text-xl font-extrabold text-gray-900 dark:text-white leading-tight">{completedTasks.length}</p>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={childVariants} className="mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Task Progress</span>
                    <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">{progressPercent}% Complete</span>
                  </div>
                  <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-primary-500 to-violet-500 rounded-full"
                    />
                  </div>
                </motion.div>
              </>
            )}

            {/* New Task Form */}
            <AnimatePresence>
              {showNewTask && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 mb-8 border border-primary-500/20 dark:border-primary-500/20 transition-colors duration-300"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create New Task</h2>
                    <button
                      onClick={() => setShowNewTask(false)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>

                  <form onSubmit={handleAddTask}>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Task Title
                        </label>
                        <input
                          type="text"
                          value={newTask.title}
                          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                          placeholder="What needs to be done?"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all font-medium"
                          required
                          autoFocus
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Priority Level
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {['low', 'medium', 'high'].map((p) => (
                            <button
                              key={p}
                              type="button"
                              onClick={() => setNewTask({ ...newTask, priority: p as any })}
                              className={`py-3 rounded-xl border text-sm font-bold capitalize transition-all ${newTask.priority === p
                                ? 'bg-primary-500 border-primary-500 text-white shadow-md'
                                : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary-500/50'
                                }`}
                            >
                              {p}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Description
                        </label>
                        <textarea
                          value={newTask.description}
                          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                          placeholder="Add more details about this task..."
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all min-h-[100px]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Due Date
                        </label>
                        <div className="relative">
                          <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            value={newTask.dueDate}
                            onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                            placeholder="e.g., Mar 20"
                            className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4 mt-8">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 rounded-xl transition shadow-lg shadow-primary-500/30 flex items-center justify-center gap-2"
                      >
                        <Plus className="w-5 h-5" />
                        Create Task
                      </motion.button>
                      <button
                        type="button"
                        onClick={() => setShowNewTask(false)}
                        className="px-8 py-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-bold rounded-xl transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Kanban Board */}
            {isLoading ? (
              <div className="text-center py-24">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="inline-block w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mb-4"
                />
                <p className="text-gray-600 dark:text-gray-400 font-medium">Loading your workspace…</p>
              </div>
            ) : (
              <LayoutGroup>
                <DragDropContext onDragEnd={onDragEnd}>
                  <motion.div
                    layout
                    variants={containerVariants}
                    className={`grid gap-6 ${currentPage === 'dashboard' ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'
                      }`}
                  >
                    {(currentPage === 'dashboard' || currentPage === 'active') && (
                      <TaskSection
                        droppableId="active"
                        title="Active"
                        tasks={activeTasks}
                        onDeleteTask={handleDeleteTask}
                        onStatusChange={handleStatusChange}
                        onUpdateTask={handleUpdateTask}
                        isFullWidth={currentPage === 'active'}
                      />
                    )}
                    {(currentPage === 'dashboard' || currentPage === 'progress') && (
                      <TaskSection
                        droppableId="progress"
                        title="In Progress"
                        tasks={progressTasks}
                        onDeleteTask={handleDeleteTask}
                        onStatusChange={handleStatusChange}
                        onUpdateTask={handleUpdateTask}
                        isFullWidth={currentPage === 'progress'}
                      />
                    )}
                    {(currentPage === 'dashboard' || currentPage === 'completed') && (
                      <TaskSection
                        droppableId="completed"
                        title="Completed"
                        tasks={completedTasks}
                        onDeleteTask={handleDeleteTask}
                        onStatusChange={handleStatusChange}
                        isFullWidth={currentPage === 'completed'}
                      />
                    )}
                  </motion.div>
                </DragDropContext>
              </LayoutGroup>
            )}

          </div>
        </motion.div>
      </main>
    </div>
  );
}
