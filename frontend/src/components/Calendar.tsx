import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, X, Plus, Trash2, Loader2 } from 'lucide-react';
import { calendarTaskAPI } from '../services/api';

interface Task {
  id: string;
  title: string;
  time: string;
  date: string;
  description?: string;
  completed: boolean;
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [newTask, setNewTask] = useState({
    title: '',
    time: '09:00',
    description: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  // Load tasks from cloud
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await calendarTaskAPI.list();
      const normalizedTasks = data.map((t: any) => ({
        id: t._id,
        title: t.title,
        time: t.time,
        date: t.date,
        description: t.description,
        completed: t.completed
      }));
      setTasks(normalizedTasks);
    } catch (err: any) {
      setError(err.message || 'Failed to load tasks');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handleAddTask = async () => {
    if (!newTask.title.trim() || !selectedDate) return;

    try {
      if (editingId) {
        const updatedTask = await calendarTaskAPI.update(editingId, {
          title: newTask.title,
          time: newTask.time,
          description: newTask.description,
        });

        setTasks((prev) =>
          prev.map((t) =>
            t.id === editingId
              ? {
                ...t,
                title: updatedTask.title,
                time: updatedTask.time,
                description: updatedTask.description,
              }
              : t
          )
        );
        setEditingId(null);
      } else {
        const createdTask = await calendarTaskAPI.create({
          title: newTask.title,
          time: newTask.time,
          date: selectedDate,
          description: newTask.description,
        });

        const task: Task = {
          id: createdTask._id,
          title: createdTask.title,
          time: createdTask.time,
          date: createdTask.date,
          description: createdTask.description,
          completed: createdTask.completed,
        };
        setTasks((prev) => [...prev, task]);
      }

      setNewTask({ title: '', time: '09:00', description: '' });
      setShowModal(false);
    } catch (err: any) {
      setError(err.message || 'Failed to save task');
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await calendarTaskAPI.remove(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete task');
    }
  };

  const handleToggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    try {
      const updated = await calendarTaskAPI.update(id, { completed: !task.completed });
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: updated.completed } : t))
      );
    } catch (err: any) {
      setError(err.message || 'Failed to update task');
    }
  };

  const handleEditTask = (task: Task) => {
    setSelectedDate(task.date);
    setNewTask({
      title: task.title,
      time: task.time,
      description: task.description || '',
    });
    setEditingId(task.id);
    setShowModal(true);
  };

  const openAddModal = (date: string) => {
    setSelectedDate(date);
    setNewTask({ title: '', time: '09:00', description: '' });
    setEditingId(null);
    setShowModal(true);
  };

  const getDaysArray = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days: (number | null)[] = Array(firstDay).fill(null);

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const getTasksForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return tasks.filter((t) => t.date === dateStr);
  };

  const monthYear = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const days = getDaysArray();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="w-full h-full flex flex-col gap-6 relative">
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center rounded-xl">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Loading tasks...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-xl flex items-center justify-between">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={() => setError(null)}
            className="text-red-500 hover:text-red-700 font-bold"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Calendar Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{monthYear}</h2>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setCurrentDate(
                    new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
                  )
                }
                className="p-2 hover:bg-primary-700/50 rounded-lg transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-4 py-2 hover:bg-primary-700/50 rounded-lg transition font-medium text-sm"
              >
                Today
              </button>
              <button
                onClick={() =>
                  setCurrentDate(
                    new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
                  )
                }
                className="p-2 hover:bg-primary-700/50 rounded-lg transition"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                {dayNames.map((day) => (
                  <th
                    key={day}
                    className="px-4 py-4 text-center font-bold text-gray-900 dark:text-white text-sm"
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: Math.ceil(days.length / 7) }).map((_, weekIndex) => (
                <tr
                  key={weekIndex}
                  className="border-b border-gray-200 dark:border-gray-700"
                >
                  {Array.from({ length: 7 }).map((_, dayIndex) => {
                    const day = days[weekIndex * 7 + dayIndex];
                    const dateStr =
                      day !== null
                        ? `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                        : null;
                    const dayTasks = day !== null ? getTasksForDate(day) : [];
                    const isToday =
                      day !== null &&
                      day === new Date().getDate() &&
                      currentDate.getMonth() === new Date().getMonth() &&
                      currentDate.getFullYear() === new Date().getFullYear();

                    return (
                      <td
                        key={`${weekIndex}-${dayIndex}`}
                        className={`border-r border-gray-200 dark:border-gray-700 p-3 min-h-32 align-top ${day === null
                          ? 'bg-gray-50 dark:bg-gray-800/50'
                          : isToday
                            ? 'bg-primary-50 dark:bg-primary-900/20'
                            : 'bg-white dark:bg-gray-800'
                          }`}
                      >
                        {day !== null && (
                          <div className="h-full flex flex-col">
                            <div className="flex items-center justify-between mb-2">
                              <span
                                className={`text-sm font-bold ${isToday
                                  ? 'bg-primary-500 text-white px-2 py-1 rounded-full'
                                  : 'text-gray-900 dark:text-white'
                                  }`}
                              >
                                {day}
                              </span>
                              <button
                                onClick={() => openAddModal(dateStr!)}
                                className="p-1 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded transition"
                                title="Add task"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Tasks for this date */}
                            <div className="space-y-1 flex-1 overflow-y-auto">
                              {dayTasks.map((task) => (
                                <div
                                  key={task.id}
                                  className={`text-xs p-2 rounded-lg border transition group ${task.completed
                                    ? 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400'
                                    : 'bg-primary-100 dark:bg-primary-900/40 border-primary-300 dark:border-primary-700 text-primary-900 dark:text-primary-100'
                                    }`}
                                >
                                  <div className="flex items-start gap-1.5">
                                    <input
                                      type="checkbox"
                                      checked={task.completed}
                                      onChange={() => handleToggleTask(task.id)}
                                      className="mt-0.5 w-3 h-3 rounded cursor-pointer flex-shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <p
                                        className={`font-medium truncate ${task.completed ? 'line-through' : ''
                                          }`}
                                      >
                                        {task.title}
                                      </p>
                                      <p className="text-xs opacity-75 flex items-center gap-1">
                                        <Clock className="w-2.5 h-2.5" />
                                        {task.time}
                                      </p>
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition ml-1 flex-shrink-0">
                                      <button
                                        onClick={() => handleEditTask(task)}
                                        className="p-0.5 hover:bg-primary-200 dark:hover:bg-primary-800 rounded"
                                        title="Edit"
                                      >
                                        <Plus className="w-3 h-3" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteTask(task.id)}
                                        className="p-0.5 hover:bg-red-200 dark:hover:bg-red-900 rounded text-red-600 dark:text-red-400"
                                        title="Delete"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Task Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {editingId ? 'Edit' : 'Add'} Task
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingId(null);
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Date: <span className="text-primary-600 dark:text-primary-400 font-bold">{selectedDate}</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Task Title *
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  placeholder="e.g., Team Meeting, Doctor Appointment"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  value={newTask.time}
                  onChange={(e) =>
                    setNewTask({ ...newTask, time: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                  placeholder="Add any notes or details"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAddTask}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold px-4 py-2 rounded-lg transition"
                >
                  <Plus className="w-4 h-4" />
                  {editingId ? 'Update' : 'Add'} Task
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingId(null);
                  }}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold px-4 py-2 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
