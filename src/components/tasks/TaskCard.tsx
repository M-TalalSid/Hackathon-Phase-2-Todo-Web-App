"use client";

import { Task } from "@/lib/schemas/task";
import { useToggleTask, useDeleteTask } from "@/lib/hooks/useTasks";
import { useState } from "react";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export function TaskCard({ task, onEdit }: TaskCardProps) {
  const toggleMutation = useToggleTask();
  const deleteMutation = useDeleteTask();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleToggle = () => {
    toggleMutation.mutate(task.id);
  };

  const handleDelete = () => {
    deleteMutation.mutate(task.id);
    setShowDeleteConfirm(false);
  };

  return (
    <div
      className={`
        group relative bg-white rounded-2xl border transition-all duration-200
        ${
          task.completed
            ? "border-emerald-100 bg-linear-to-r from-emerald-50/50 to-teal-50/30"
            : "border-slate-200 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-0.5"
        }
      `}
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Premium Checkbox */}
          <button
            onClick={handleToggle}
            disabled={toggleMutation.isPending}
            className={`
              mt-0.5 w-6 h-6 rounded-lg border-2 shrink-0
              flex items-center justify-center transition-all duration-200
              ${
                task.completed
                  ? "bg-linear-to-br from-emerald-400 to-teal-500 border-transparent shadow-md shadow-emerald-500/25"
                  : "border-slate-300 hover:border-indigo-400 hover:shadow-md hover:shadow-indigo-500/10 hover:scale-105"
              }
              disabled:opacity-50 disabled:hover:scale-100
            `}
            aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
          >
            {task.completed && (
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
            {toggleMutation.isPending && (
              <div className="w-3.5 h-3.5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            )}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3
              className={`
                font-semibold text-[15px] leading-snug transition-all duration-200
                ${task.completed ? "line-through text-slate-400" : "text-slate-800"}
              `}
            >
              {task.title}
            </h3>
            {task.description && (
              <p className="mt-1.5 text-sm text-slate-500 line-clamp-2 leading-relaxed">
                {task.description}
              </p>
            )}
            <div className="mt-3 flex items-center gap-3">
              {task.completed && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Done
                </span>
              )}
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(task.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
            <button
              onClick={() => onEdit(task)}
              className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-200 hover:scale-105"
              aria-label="Edit task"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            {showDeleteConfirm ? (
              <div className="flex items-center gap-1.5 animate-fade-in">
                <button
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-linear-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 rounded-lg transition-all duration-200 shadow-md shadow-rose-500/20 disabled:opacity-50"
                >
                  {deleteMutation.isPending ? "..." : "Delete"}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all duration-200 hover:scale-105"
                aria-label="Delete task"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
