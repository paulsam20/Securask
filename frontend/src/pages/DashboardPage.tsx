import { useMemo, useState, useEffect, useCallback, memo } from 'react';
import { Plus, X, Calendar as CalendarIcon, Clock, AlertCircle } from 'lucide-react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import TaskSection from '../components/TaskSection';
import FocusMode from '../components/FocusMode';
import { taskAPI } from '../services/api';

/**
 * Isolated Clock Component
 * Prevents the entire Dashboard from re-rendering every second.
 */
const TimeDisplay = memo(() => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="hidden md:flex items-center gap-2 rounded-xl px-4 py-2 bg-white/50 dark:bg-gray-800/40 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm text-sm text-gray-700 dark:text-gray-300">
      <CalendarIcon className="w-3.5 h-3.5 text-primary-500" />
      <span className="font-semibold">
        {now.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
      </span>
      <span className="text-gray-400 dark:text-gray-600">•</span>
      <Clock className="w-3.5 h-3.5 text-violet-500" />
      <span className="tabular-nums font-bold">
        {now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  );
});

/**
 * Isolated Greeting Component
 * Uses an interval but only updates time-of-day greeting.
 */
const UserGreeting = memo(({ email, pendingCount }: { email: string; pendingCount: number }) => {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) setGreeting('morning');
      else if (hour < 18) setGreeting('afternoon');
      else setGreeting('evening');
    };
    updateGreeting();
    const t = setInterval(updateGreeting, 60000); // Only check every minute
    return () => clearInterval(t);
  }, []);

  return (
    <div>
      <p className="text-sm font-semibold text-gray-900 dark:text-white">
        Good {greeting}, {email.split('@')[0]}.
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
        You have <span className="font-semibold text-primary-700 dark:text-primary-300">{pendingCount}</span> pending task{pendingCount === 1 ? '' : 's'} left today.
      </p>
    </div>
  );
});

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
  const [focusedTask, setFocusedTask] = useState<{ id: string; title: string; description?: string } | null>(null);
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

  const activeTasks = useMemo(() => tasks.filter((t) => t.status === 'active'), [tasks]);
  const progressTasks = useMemo(() => tasks.filter((t) => t.status === 'progress'), [tasks]);
  const completedTasks = useMemo(() => tasks.filter((t) => t.status === 'completed'), [tasks]);
  const pendingCount = useMemo(() => activeTasks.length + progressTasks.length, [activeTasks, progressTasks]);

  const priorityCounts = useMemo(() => {
    const counts = { high: 0, medium: 0, low: 0 } as { high: number; medium: number; low: number };
    for (const t of tasks) {
      if (t.status === 'completed') continue;
      const p = (t.priority ?? 'medium') as 'high' | 'medium' | 'low';
      counts[p] += 1;
    }
    return counts;
  }, [tasks]);

  const handleDeleteTask = useCallback(async (id: string) => {
    try {
      setError('');
      await taskAPI.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete task');
    }
  }, []);

  const handleStatusChange = useCallback(async (id: string, newStatus: 'active' | 'progress' | 'completed') => {
    try {
      setError('');
      await taskAPI.updateTask(id, { status: newStatus });
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t)));
    } catch (err: any) {
      setError(err.message || 'Failed to update task');
    }
  }, []);

  const handleUpdateTask = useCallback(async (
    id: string,
    updates: { title?: string; description?: string; priority?: 'high' | 'medium' | 'low'; dueDate?: string },
  ) => {
    try {
      setError('');
      await taskAPI.updateTask(id, updates);
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    } catch (err: any) {
      setError(err.message || 'Failed to update task');
    }
  }, []);

  const onDragEnd = useCallback(
    async (result: DropResult) => {
      const { source, destination, draggableId } = result;
      if (!destination) return;

      const srcCol = source.droppableId as 'active' | 'progress' | 'completed';
      const destCol = destination.droppableId as 'active' | 'progress' | 'completed';

      if (srcCol === destCol && source.index === destination.index) return;

      const cols = {
        active: [...activeTasks],
        progress: [...progressTasks],
        completed: [...completedTasks],
      };

      const movedTaskIdx = cols[srcCol].findIndex(t => t.id === draggableId);
      if (movedTaskIdx === -1) return;

      const movedTask = cols[srcCol][movedTaskIdx];
      cols[srcCol].splice(movedTaskIdx, 1);

      const updatedTask = { ...movedTask, status: destCol };
      cols[destCol].splice(destination.index, 0, updatedTask);

      setTasks([...cols.active, ...cols.progress, ...cols.completed]);

      if (srcCol !== destCol) {
        try {
          await taskAPI.updateTask(draggableId, { status: destCol });
        } catch (err: any) {
          setError(err.message || 'Failed to sync task');
          fetchTasks();
        }
      }
    },
    [activeTasks, progressTasks, completedTasks],
  );

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

  const progressPercent = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  // Memoize counts to prevent sidebar re-renders
  const sidebarCounts = useMemo(() => ({
    active: activeTasks.length,
    progress: progressTasks.length,
    completed: completedTasks.length,
    priority: priorityCounts,
  }), [activeTasks.length, progressTasks.length, completedTasks.length, priorityCounts]);

  return (
    <div className="flex h-screen bg-gradient-to-br from-primary-600/8 via-gray-50/85 to-violet-600/8 dark:from-primary-900/15 dark:via-gray-900/85 dark:to-violet-900/15">
      <Sidebar
        userEmail={userEmail}
        onLogout={onLogout}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((o) => !o)}
        hideToggle={isNotesOpen}
        onNavigate={onNavigate}
        currentPage={currentPage}
        counts={sidebarCounts}
      />

      <main className={`flex-1 overflow-auto custom-scrollbar transition-[padding] duration-300 ${sidebarOpen ? 'lg:pl-[280px]' : 'lg:pl-14'}`}>
        <div className="pt-16 lg:pt-0 px-6 lg:px-8 py-8 pb-24">
          <div className="max-w-7xl mx-auto">

            {/* Header */}
            <div className="flex flex-col gap-4 mb-8 lg:flex-row lg:items-center lg:justify-between pr-14 lg:pr-16">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1 transition-colors">Welcome back, {userEmail.split('@')[0]}</p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-6">
                <AnimatePresence>
                  {error && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <TimeDisplay />

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowNewTask(true)}
                  className="bg-primary-500 hover:bg-primary-600 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition w-full lg:w-auto justify-center shadow-lg shadow-primary-500/30"
                >
                  <Plus className="w-5 h-5" /> New Task
                </motion.button>
              </div>
            </div>

            {currentPage === 'dashboard' && (
              <>
                <motion.div variants={childVariants} className="mb-6">
                  <div className="rounded-2xl border border-gray-200/70 dark:border-gray-800/70 bg-white/75 dark:bg-gray-900/40 backdrop-blur-md p-5 shadow-sm">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <UserGreeting email={userEmail} pendingCount={pendingCount} />
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl px-4 py-3 bg-gradient-to-br from-primary-500/10 to-violet-500/10 dark:from-primary-400/10 dark:to-violet-400/10 border border-primary-200/40 dark:border-primary-800/40">
                          <p className="text-[11px] text-gray-500 dark:text-gray-400">Completion</p>
                          <p className="text-xl font-extrabold text-gray-900 dark:text-white leading-tight">{progressPercent}%</p>
                        </div>
                        <div className="rounded-xl px-4 py-3 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-400/10 dark:to-teal-400/10 border border-emerald-200/40 dark:border-emerald-800/40">
                          <p className="text-[11px] text-gray-500 dark:text-gray-400">Completed</p>
                          <p className="text-xl font-extrabold text-gray-900 dark:text-white leading-tight">{completedTasks.length}</p>
                        </div>
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
                <motion.div initial={{ opacity: 0, y: -20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.95 }} className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 mb-8 border border-primary-500/20 transition-colors">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create New Task</h2>
                    <button onClick={() => setShowNewTask(false)} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
                  </div>
                  <form onSubmit={handleAddTask} className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Task Title</label>
                      <input type="text" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} className="w-full px-4 py-3 border rounded-xl dark:bg-gray-700 dark:text-white" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Priority</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['low', 'medium', 'high'].map(p => (
                          <button key={p} type="button" onClick={() => setNewTask({ ...newTask, priority: p as any })} className={`py-3 rounded-xl border text-sm font-bold capitalize ${newTask.priority === p ? 'bg-primary-500 text-white' : ''}`}>{p}</button>
                        ))}
                      </div>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Description</label>
                      <textarea value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} className="w-full px-4 py-3 border rounded-xl dark:bg-gray-700 dark:text-white min-h-[100px]" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Due Date</label>
                      <input type="date" value={newTask.dueDate} onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })} className="w-full px-4 py-3 border rounded-xl dark:bg-gray-700 dark:text-white" required />
                    </div>
                    <div className="md:col-span-2 flex gap-4 mt-8">
                      <button type="submit" className="flex-1 bg-primary-500 text-white font-bold py-4 rounded-xl shadow-lg">Create Task</button>
                      <button type="button" onClick={() => setShowNewTask(false)} className="px-8 py-4 bg-gray-100 dark:bg-gray-700 rounded-xl">Cancel</button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Kanban Board - Performance Optimized */}
            {isLoading ? (
              <div className="text-center py-24"><div className="inline-block w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>
            ) : (
              <DragDropContext onDragEnd={onDragEnd}>
                <div className={`grid gap-6 ${currentPage === 'dashboard' ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'}`}>
                  {(currentPage === 'dashboard' || currentPage === 'active') && (
                    <TaskSection droppableId="active" title="Active" tasks={activeTasks} onDeleteTask={handleDeleteTask} onStatusChange={handleStatusChange} onUpdateTask={handleUpdateTask} onFocus={setFocusedTask} isFullWidth={currentPage === 'active'} />
                  )}
                  {(currentPage === 'dashboard' || currentPage === 'progress') && (
                    <TaskSection droppableId="progress" title="In Progress" tasks={progressTasks} onDeleteTask={handleDeleteTask} onStatusChange={handleStatusChange} onUpdateTask={handleUpdateTask} onFocus={setFocusedTask} isFullWidth={currentPage === 'progress'} />
                  )}
                  {(currentPage === 'dashboard' || currentPage === 'completed') && (
                    <TaskSection droppableId="completed" title="Completed" tasks={completedTasks} onDeleteTask={handleDeleteTask} onStatusChange={handleStatusChange} isFullWidth={currentPage === 'completed'} />
                  )}
                </div>
              </DragDropContext>
            )}

          </div>
        </div>
      </main>

      <AnimatePresence>
        {focusedTask && (
          <FocusMode
            task={focusedTask}
            onComplete={async (taskId) => {
              await handleStatusChange(taskId, 'completed');
              setFocusedTask(null);
            }}
            onCancel={() => setFocusedTask(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
