import React from "react";
import { motion } from "framer-motion";
import type { Task } from "../types/task";

interface ProgressChartProps {
  tasks: Task[];
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ tasks }) => {
  const statistics = {
    active: tasks.filter((t) => t.status === "active").length,
    "in-progress": tasks.filter((t) => t.status === "in-progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
  };

  const totalTasks = tasks.length;
  const completionRate =
    totalTasks > 0 ? ((statistics.completed / totalTasks) * 100).toFixed(1) : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
      {/* Active Tasks */}
      <motion.div
        className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm"
        whileHover={{ y: -4, boxShadow: "0 16px 48px rgba(0,0,0,0.08)" }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-neutral-400 text-xs font-semibold uppercase tracking-wider">
              Active Tasks
            </p>
            <p className="text-4xl font-bold text-black mt-2 tracking-tight">
              {statistics.active}
            </p>
          </div>
          <motion.div
            className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="text-2xl">📌</div>
          </motion.div>
        </div>
        {/* Mini bar */}
        <div className="mt-4 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-amber-400 rounded-full"
            initial={{ width: 0 }}
            animate={{
              width: totalTasks > 0 ? `${(statistics.active / totalTasks) * 100}%` : "0%",
            }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </motion.div>

      {/* In Progress */}
      <motion.div
        className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm"
        whileHover={{ y: -4, boxShadow: "0 16px 48px rgba(0,0,0,0.08)" }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-neutral-400 text-xs font-semibold uppercase tracking-wider">
              In Progress
            </p>
            <p className="text-4xl font-bold text-black mt-2 tracking-tight">
              {statistics["in-progress"]}
            </p>
          </div>
          <motion.div
            className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="text-2xl">⚡</div>
          </motion.div>
        </div>
        {/* Mini bar */}
        <div className="mt-4 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-blue-400 rounded-full"
            initial={{ width: 0 }}
            animate={{
              width:
                totalTasks > 0
                  ? `${(statistics["in-progress"] / totalTasks) * 100}%`
                  : "0%",
            }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </motion.div>

      {/* Completed */}
      <motion.div
        className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm"
        whileHover={{ y: -4, boxShadow: "0 16px 48px rgba(0,0,0,0.08)" }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-neutral-400 text-xs font-semibold uppercase tracking-wider">
              Completed
            </p>
            <p className="text-4xl font-bold text-black mt-2 tracking-tight">
              {statistics.completed}
            </p>
            <p className="text-xs text-emerald-500 font-semibold mt-1">
              {completionRate}% complete
            </p>
          </div>
          <motion.div
            className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="text-2xl">✓</div>
          </motion.div>
        </div>
        {/* Mini bar */}
        <div className="mt-4 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-emerald-400 rounded-full"
            initial={{ width: 0 }}
            animate={{
              width:
                totalTasks > 0
                  ? `${(statistics.completed / totalTasks) * 100}%`
                  : "0%",
            }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </motion.div>
    </div>
  );
};
