"use client";

import { Task } from "@/lib/schemas/task";
import { TaskCard } from "./TaskCard";
import { EmptyState } from "../../components/ui/EmptyState";
import { Skeleton } from "../../components/ui/Skeleton";
import { ErrorState } from "../../components/ui/ErrorState";

interface TaskListProps {
  tasks: Task[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onEdit: (task: Task) => void;
  onDelete?: (id: string) => void;
  onToggle?: (id: string) => void;
  onAddTask: () => void;
}

export function TaskList({
  tasks,
  isLoading,
  isError,
  onRetry,
  onEdit,
  onDelete,
  onToggle,
  onAddTask,
}: TaskListProps) {
  // Note: onDelete and onToggle are available for future use
  // Currently TaskCard handles delete/toggle internally via hooks
  void onDelete;
  void onToggle;
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Failed to load tasks"
        message="Something went wrong while loading your tasks."
        onRetry={onRetry}
      />
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <EmptyState
        title="No tasks yet"
        message="Create your first task to get started!"
        actionLabel="Add Task"
        onAction={onAddTask}
      />
    );
  }

  // Sort: incomplete first, then by created date (newest first)
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div className="space-y-3">
      {sortedTasks.map((task) => (
        <TaskCard key={task.id} task={task} onEdit={onEdit} />
      ))}
    </div>
  );
}
