import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
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
}

// Helper function to map backend task to frontend task
const mapBackendTaskToFrontend = (backendTask: any): Task => {
  // Map backend status ('pending' | 'completed') to frontend status
  let frontendStatus: 'active' | 'progress' | 'completed' = 'active';
  if (backendTask.status === 'completed') {
    frontendStatus = 'completed';
  } else if (backendTask.status === 'progress') {
    frontendStatus = 'progress';
  }

  return {
    id: backendTask._id || backendTask.id,
    title: backendTask.title,
    description: backendTask.description,
    priority: backendTask.priority || 'medium',
    dueDate: backendTask.dueDate,
    status: frontendStatus,
  };
};

export default function DashboardPage({ userEmail, onLogout }: DashboardPageProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showNewTask, setShowNewTask] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    dueDate: '',
  });

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      setError('');
      const backendTasks = await taskAPI.getTasks();
      // Map backend tasks to frontend format
      const mappedTasks = Array.isArray(backendTasks)
        ? backendTasks.map(mapBackendTaskToFrontend)
        : [];
      setTasks(mappedTasks);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const activeTasks = tasks.filter((t) => t.status === 'active');
  const progressTasks = tasks.filter((t) => t.status === 'progress');
  const completedTasks = tasks.filter((t) => t.status === 'completed');

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.title.trim()) {
      try {
        setError('');
        const createdTask = await taskAPI.createTask({
          ...newTask,
          status: 'active',
        });
        const mappedTask = mapBackendTaskToFrontend(createdTask);
        setTasks([...tasks, mappedTask]);
        setNewTask({ title: '', description: '', priority: 'medium', dueDate: '' });
        setShowNewTask(false);
      } catch (err: any) {
        setError(err.message || 'Failed to create task');
        console.error('Error creating task:', err);
      }
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      setError('');
      await taskAPI.deleteTask(id);
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete task');
      console.error('Error deleting task:', err);
    }
  };

  const handleStatusChange = async (id: string, newStatus: 'active' | 'progress' | 'completed') => {
    try {
      setError('');
      await taskAPI.updateTask(id, { status: newStatus });
      setTasks(tasks.map((t) => (t.id === id ? { ...t, status: newStatus } : t)));
    } catch (err: any) {
      setError(err.message || 'Failed to update task');
      console.error('Error updating task:', err);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userEmail={userEmail} onLogout={onLogout} />

      <main className="flex-1 overflow-auto">
        <div className="pt-16 lg:pt-0 px-6 lg:px-8 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col gap-4 mb-8 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome back, {userEmail.split('@')[0]}</p>
              </div>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
              <button
                onClick={() => setShowNewTask(true)}
                className="bg-primary-500 hover:bg-primary-600 text-white font-semibold px-6 py-3 rounded-lg flex items-center gap-2 transition w-full lg:w-auto justify-center"
              >
                <Plus className="w-5 h-5" />
                New Task
              </button>
            </div>

            {showNewTask && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-primary-200">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Create New Task</h2>
                <form onSubmit={handleAddTask}>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Task Title
                      </label>
                      <input
                        type="text"
                        value={newTask.title}
                        onChange={(e) =>
                          setNewTask({ ...newTask, title: e.target.value })
                        }
                        placeholder="Enter task title"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Priority
                      </label>
                      <select
                        value={newTask.priority}
                        onChange={(e) =>
                          setNewTask({
                            ...newTask,
                            priority: e.target.value as 'high' | 'medium' | 'low',
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={newTask.description}
                        onChange={(e) =>
                          setNewTask({ ...newTask, description: e.target.value })
                        }
                        placeholder="Enter task description (optional)"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Due Date
                      </label>
                      <input
                        type="text"
                        value={newTask.dueDate}
                        onChange={(e) =>
                          setNewTask({ ...newTask, dueDate: e.target.value })
                        }
                        placeholder="e.g., Mar 20"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button
                      type="submit"
                      className="bg-primary-500 hover:bg-primary-600 text-white font-semibold px-6 py-2 rounded-lg transition"
                    >
                      Add Task
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewTask(false)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-6 py-2 rounded-lg transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading tasks...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <TaskSection
                  title="Active Tasks"
                  tasks={activeTasks}
                  onDeleteTask={handleDeleteTask}
                  onStatusChange={handleStatusChange}
                />

                <TaskSection
                  title="In Progress"
                  tasks={progressTasks}
                  onDeleteTask={handleDeleteTask}
                  onStatusChange={handleStatusChange}
                />

                <TaskSection
                  title="Completed"
                  tasks={completedTasks}
                  onDeleteTask={handleDeleteTask}
                  onStatusChange={handleStatusChange}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
