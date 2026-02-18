import React from "react";
import { motion } from "framer-motion";
import type { Task, TaskStatus } from "../types/task";
import { TaskCard } from "./TaskCard";

interface KanbanColumnProps {
  status: TaskStatus;
  title: string;
  tasks: Task[];
  onDelete: (id: string) => void;
  color: {
    bg: string;
    border: string;
    icon: string;
  };
}

const statusColors: Record<TaskStatus, { bg: string; border: string; icon: string }> = {
  active: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: "📌",
  },
  "in-progress": {
    bg: "bg-blue-50",
    border: "border-blue-200",
    icon: "⚡",
  },
  completed: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    icon: "✓",
  },
};

import { Droppable, Draggable } from "@hello-pangea/dnd";

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  status,
  title,
  tasks,
  onDelete,
  color = statusColors[status],
}) => {
  return (
    <div className={`flex-1 min-w-80 ${color.bg} border ${color.border} rounded-2xl p-5 min-h-96`}>
      {/* Column header */}
      <div className="flex items-center gap-3 mb-5">
        <span className="text-xl">{color.icon}</span>
        <h2 className="text-lg font-bold text-black tracking-tight">{title}</h2>
        <motion.div
          className="ml-auto px-3 py-1 rounded-full text-sm font-semibold bg-white/80 text-neutral-600 border border-neutral-200"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {tasks.length}
        </motion.div>
      </div>

      {/* Tasks list */}
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`space-y-3 min-h-[200px] transition-colors rounded-xl p-1 ${snapshot.isDraggingOver ? "bg-white/50" : ""
              }`}
          >
            {tasks.length === 0 && !snapshot.isDraggingOver ? (
              <motion.div
                className="flex items-center justify-center py-12 text-neutral-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
              >
                <p className="text-sm font-medium">No tasks yet</p>
              </motion.div>
            ) : (
              tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided) => (
                    <TaskCard
                      task={task}
                      onDelete={onDelete}
                      innerRef={provided.innerRef}
                      draggableProps={provided.draggableProps}
                      dragHandleProps={provided.dragHandleProps}
                    />
                  )}
                </Draggable>
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};
