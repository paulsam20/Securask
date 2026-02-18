import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";
import { Layout } from "../components/Layout";
import { KanbanColumn } from "../components/KanbanColumn";
import { ProgressChart } from "../components/ProgressChart";
import { Background } from "../components/Background";
import { useTasks } from "../hooks/useTasks";
import type { TaskStatus } from "../types/task";

import { DragDropContext } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";

export default function Dashboard() {
  const { tasks, fetchTasks, createTask, updateTask, deleteTask } = useTasks();
  const [searchValue, setSearchValue] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium" as "low" | "medium" | "high",
    status: "active" as TaskStatus,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
  });

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Filter tasks based on search
  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      task.description.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Organize tasks by status
  const activeTasks = filteredTasks.filter((t) => t.status === "active");
  const inProgressTasks = filteredTasks.filter((t) => t.status === "in-progress");
  const completedTasks = filteredTasks.filter((t) => t.status === "completed");

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTask({
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        dueDate: formData.dueDate,
      });
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        status: "active",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      });
      setShowCreateModal(false);
    } catch {
      alert("Failed to create task");
    }
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStatus = destination.droppableId as TaskStatus;

    try {
      await updateTask(draggableId, { status: newStatus });
    } catch {
      alert("Failed to update task status");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Background />

      <Layout searchValue={searchValue} onSearchChange={setSearchValue}>
        {/* Header */}
        <motion.div
          className="mb-8 flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-4xl font-bold text-black mb-1 tracking-tight">
              Task Dashboard
            </h1>
            <p className="text-neutral-400 text-sm font-medium">
              Organize and track your tasks efficiently
            </p>
          </div>

          <motion.button
            onClick={() => setShowCreateModal(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 bg-black hover:bg-neutral-800 text-white font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-xl"
          >
            <Plus size={20} />
            New Task
          </motion.button>
        </motion.div>

        {/* Progress charts */}
        <ProgressChart tasks={filteredTasks} />

        {/* Kanban board */}
        <DragDropContext onDragEnd={onDragEnd}>
          <motion.div
            className="flex gap-6 overflow-x-auto pb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <KanbanColumn
              status="active"
              title="Active"
              tasks={activeTasks}
              onDelete={deleteTask}
              color={{
                bg: "bg-amber-50",
                border: "border-amber-200",
                icon: "📌",
              }}
            />

            <KanbanColumn
              status="in-progress"
              title="In Progress"
              tasks={inProgressTasks}
              onDelete={deleteTask}
              color={{
                bg: "bg-blue-50",
                border: "border-blue-200",
                icon: "⚡",
              }}
            />

            <KanbanColumn
              status="completed"
              title="Completed"
              tasks={completedTasks}
              onDelete={deleteTask}
              color={{
                bg: "bg-emerald-50",
                border: "border-emerald-200",
                icon: "✓",
              }}
            />
          </motion.div>
        </DragDropContext>
      </Layout>

      {/* Create task modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              className="bg-white border border-neutral-200 rounded-2xl p-8 w-full max-w-md shadow-2xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-black tracking-tight">
                  Create New Task
                </h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1.5 hover:bg-neutral-100 rounded-xl transition-colors"
                >
                  <X size={22} className="text-neutral-400" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleCreateTask} className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-600 mb-2">
                    Task Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Enter task title"
                    maxLength={100}
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-black text-black placeholder-neutral-400 transition-all duration-300 text-sm"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-600 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Enter task description"
                    maxLength={500}
                    rows={3}
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-black text-black placeholder-neutral-400 transition-all duration-300 resize-none text-sm"
                  />
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-600 mb-2">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        priority: e.target.value as "low" | "medium" | "high",
                      })
                    }
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-black text-black transition-all duration-300 text-sm"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-600 mb-2">
                    Initial Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as TaskStatus,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-black text-black transition-all duration-300 text-sm"
                  >
                    <option value="active">Active</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                {/* Due date */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-600 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) =>
                      setFormData({ ...formData, dueDate: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-black text-black transition-all duration-300 text-sm"
                    required
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 font-semibold rounded-xl transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-4 py-2.5 bg-black hover:bg-neutral-800 text-white font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-xl text-sm"
                  >
                    Create Task
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
