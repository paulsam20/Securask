import React from "react";
import { motion } from "framer-motion";
import type {
  DraggableProvidedDraggableProps,
  DraggableProvidedDragHandleProps,
} from "@hello-pangea/dnd";
import { Trash2, Calendar, Flag } from "lucide-react";
import type { Task, TaskPriority } from "../types/task";

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  innerRef?: React.Ref<HTMLDivElement>;
  draggableProps?: DraggableProvidedDraggableProps;
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
}

const priorityColors: Record<
  TaskPriority,
  { bg: string; text: string; border: string; badge: string }
> = {
  low: {
    bg: "bg-white",
    text: "text-blue-600",
    border: "border-neutral-200",
    badge: "bg-blue-50 text-blue-600",
  },
  medium: {
    bg: "bg-white",
    text: "text-amber-600",
    border: "border-neutral-200",
    badge: "bg-amber-50 text-amber-600",
  },
  high: {
    bg: "bg-white",
    text: "text-red-600",
    border: "border-neutral-200",
    badge: "bg-red-50 text-red-600",
  },
};

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onDelete,
  innerRef,
  draggableProps,
  dragHandleProps,
}) => {
  const priorityColor = priorityColors[task.priority];
  const isOverdue =
    new Date(task.dueDate) < new Date() && task.status !== "completed";

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      ref={innerRef}
      {...draggableProps}
      {...dragHandleProps}
      className="mb-3"
      style={{ ...draggableProps?.style }}
    >
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className={`${priorityColor.bg} border ${priorityColor.border} rounded-xl p-4 cursor-move group card-hover shadow-sm`}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        {/* Card header */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-sm font-semibold text-black flex-1 break-words">
            {task.title}
          </h3>
          <motion.button
            onClick={() => onDelete(task.id)}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.95 }}
            className="ml-2 p-1 rounded-lg hover:bg-red-50 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 size={16} />
          </motion.button>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-xs text-neutral-400 mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Priority badge */}
        <div className="mb-3 flex items-center gap-2">
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${priorityColor.badge}`}
          >
            <Flag size={12} />
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </div>
          {isOverdue && (
            <div className="px-2 py-1 rounded-lg text-xs font-semibold bg-red-50 text-red-500">
              Overdue
            </div>
          )}
        </div>

        {/* Due date */}
        <div className="flex items-center gap-2 text-xs text-neutral-400 font-medium">
          <Calendar size={14} />
          <span
            className={
              isOverdue && task.status !== "completed" ? "text-red-500" : ""
            }
          >
            {formatDate(task.dueDate)}
          </span>
        </div>
      </motion.div>
    </div>
  );
};
