"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema, TaskFormData, Task } from "@/lib/schemas/task";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useEffect } from "react";

interface TaskFormProps {
  task?: Task | null;
  isLoading?: boolean;
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
}

export function TaskForm({ task, isLoading, onSubmit, onCancel }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title || "",
      description: task?.description || "",
    },
  });

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description || "",
      });
    } else {
      reset({
        title: "",
        description: "",
      });
    }
  }, [task, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        label="Title"
        placeholder="What needs to be done?"
        error={errors.title?.message}
        {...register("title")}
      />

      <div className="w-full">
        <label
          htmlFor="description"
          className="block text-sm font-semibold text-slate-700 mb-2"
        >
          Description <span className="text-slate-400 font-normal">(optional)</span>
        </label>
        <textarea
          id="description"
          rows={4}
          className="
            w-full px-4 py-3 text-slate-900 bg-white
            border-2 border-slate-200 rounded-xl transition-all duration-200
            focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10
            placeholder:text-slate-400 hover:border-slate-300
            disabled:bg-slate-50 disabled:cursor-not-allowed resize-none
          "
          placeholder="Add some details..."
          {...register("description")}
        />
      </div>

      <div className="flex justify-end gap-3 pt-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {task ? "Save Changes" : "Create Task"}
        </Button>
      </div>
    </form>
  );
}
