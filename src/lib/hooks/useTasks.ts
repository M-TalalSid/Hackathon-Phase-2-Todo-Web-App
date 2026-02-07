"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, ApiClientError } from "@/lib/api";
import { Task, TaskFormData } from "@/lib/schemas/task";
import { useToast } from "@/lib/contexts/ToastContext";
import { useSession } from "@/lib/auth";

/**
 * Hook to fetch all tasks for the current user
 */
export function useTasks() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useQuery<Task[]>({
    queryKey: ["tasks", userId],
    queryFn: async () => {
      if (!userId) {
        return [];
      }
      return api.get<Task[]>(`/api/${userId}/tasks`);
    },
    enabled: !!userId,
  });
}

/**
 * Hook to create a new task
 */
export function useCreateTask() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useMutation({
    mutationFn: async (data: TaskFormData) => {
      if (!userId) throw new Error("Not authenticated");
      return api.post<Task>(`/api/${userId}/tasks`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", userId] });
      addToast("success", "Task created successfully");
    },
    onError: (error: ApiClientError) => {
      addToast("error", error.message || "Failed to create task");
    },
  });
}

/**
 * Hook to update a task
 */
export function useUpdateTask() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<TaskFormData> }) => {
      if (!userId) throw new Error("Not authenticated");
      return api.put<Task>(`/api/${userId}/tasks/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", userId] });
      addToast("success", "Task updated successfully");
    },
    onError: (error: ApiClientError) => {
      addToast("error", error.message || "Failed to update task");
    },
  });
}

/**
 * Hook to delete a task
 */
export function useDeleteTask() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useMutation({
    mutationFn: async (id: string) => {
      if (!userId) throw new Error("Not authenticated");
      return api.delete(`/api/${userId}/tasks/${id}`);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", userId] });
      const previousTasks = queryClient.getQueryData<Task[]>(["tasks", userId]);
      queryClient.setQueryData<Task[]>(["tasks", userId], (old) =>
        old?.filter((task) => task.id !== id)
      );
      return { previousTasks };
    },
    onError: (error: ApiClientError, _, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks", userId], context.previousTasks);
      }
      addToast("error", error.message || "Failed to delete task");
    },
    onSuccess: () => {
      addToast("success", "Task deleted successfully");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", userId] });
    },
  });
}

/**
 * Hook to toggle task completion
 */
export function useToggleTask() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useMutation({
    mutationFn: async (id: string) => {
      if (!userId) throw new Error("Not authenticated");
      return api.patch<Task>(`/api/${userId}/tasks/${id}/complete`);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", userId] });
      const previousTasks = queryClient.getQueryData<Task[]>(["tasks", userId]);
      queryClient.setQueryData<Task[]>(["tasks", userId], (old) =>
        old?.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task
        )
      );
      return { previousTasks };
    },
    onError: (error: ApiClientError, _, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks", userId], context.previousTasks);
      }
      addToast("error", error.message || "Failed to update task");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", userId] });
    },
  });
}
