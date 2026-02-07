"use client";

import { useState } from "react";
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask, useToggleTask } from "@/lib/hooks/useTasks";
import { Task, TaskFormData } from "@/lib/schemas/task";
import { TaskList } from "@/components/tasks/TaskList";
import { TaskForm } from "@/components/tasks/TaskForm";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Footer } from "@/components/ui/Footer";
import { MobileDrawer } from "@/components/layout/MobileDrawer";
import Link from "next/link";
import { signOut, useSession } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();
  const { data: tasks, isLoading, isError, refetch } = useTasks();
  const createMutation = useCreateTask();
  const updateMutation = useUpdateTask();
  const deleteMutation = useDeleteTask();
  const toggleMutation = useToggleTask();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleOpenCreate = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleSubmit = async (data: TaskFormData) => {
    if (editingTask) {
      await updateMutation.mutateAsync({ id: editingTask.id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
    handleClose();
  };

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  const handleToggle = async (id: string) => {
    await toggleMutation.mutateAsync(id);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const completedCount = tasks?.filter((t) => t.completed).length || 0;
  const totalCount = tasks?.length || 0;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Loading state - Premium
  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-mesh-subtle flex items-center justify-center">
        <div className="floating-shapes">
          <div className="shape shape-1" />
          <div className="shape shape-2" />
        </div>
        <div className="text-center relative z-10 animate-fade-in">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full bg-linear-to-br from-primary to-accent opacity-20 blur-xl animate-pulse" />
            <div className="relative w-16 h-16 border-4 border-slate-200 border-t-primary rounded-full animate-spin shadow-xl" />
          </div>
          <p className="text-base font-semibold text-slate-600 mb-2">Loading your workspace</p>
          <p className="text-sm text-slate-500">Getting everything ready...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!session?.user) {
    router.push("/sign-in");
    return null;
  }

  return (
    <div className="min-h-screen bg-mesh-subtle flex flex-col">
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </div>

      {/* Header - Premium */}
      <header className="relative z-20 top-0 bg-white/95 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MobileDrawer />
            
            <Link href="/dashboard" className="flex items-center gap-2.5 group">
              <div className="relative">
                <div className="absolute inset-0 rounded-xl bg-linear-to-br from-primary to-accent opacity-50 blur-md group-hover:opacity-75 transition-opacity duration-300" />
                <div className="relative w-9 h-9 rounded-xl bg-linear-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/25 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-primary/35 transition-all duration-300">
                  <svg className="w-4.5 h-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
              </div>
              <span className="hidden sm:block text-lg font-bold bg-linear-to-br from-slate-900 to-slate-700 bg-clip-text text-transparent">TaskFlow</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-linear-to-br from-slate-50 to-white border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-7 h-7 rounded-lg bg-linear-to-br from-primary to-accent flex items-center justify-center shadow-md shadow-primary/20">
                <span className="text-xs font-bold text-white">
                  {session.user.email?.[0]?.toUpperCase()}
                </span>
              </div>
              <span className="text-sm font-semibold text-slate-700 max-w-[120px] truncate">
                {session.user.email}
              </span>
            </div>
            <button
              onClick={handleSignOut}
              className="text-sm font-semibold text-slate-500 hover:text-slate-700 px-3.5 py-2 rounded-xl hover:bg-linear-to-br hover:from-slate-50 hover:to-slate-100 transition-all duration-300 active:scale-95"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main - Premium */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-10 flex-1 w-full">
        <div className="space-y-8 animate-fade-in-up">
          {/* Header - Enhanced */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-4 rounded-full bg-linear-to-br from-primary-lighter to-accent-light border border-primary/20 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-sm shadow-primary/50 animate-pulse-gentle" />
                <span className="text-xs font-bold text-primary tracking-wide">DASHBOARD</span>
              </div>
              <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">My Tasks</h1>
              {totalCount > 0 && (
                <p className="text-base text-slate-600 font-medium leading-relaxed">
                  {completedCount} of {totalCount} completed • {progressPercent}% done
                </p>
              )}
            </div>
            <Button onClick={handleOpenCreate} size="lg" className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Task
            </Button>
          </div>

          {/* Progress bar - Premium */}
          {totalCount > 0 && (
            <div className="relative p-5 rounded-2xl bg-linear-to-br from-white to-slate-50 border border-slate-200/60 shadow-sm">
              <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-linear-to-r from-primary via-accent to-primary rounded-full transition-all duration-700 ease-out shadow-lg"
                  style={{ 
                    width: `${progressPercent}%`,
                    backgroundSize: '200% 100%',
                    animation: progressPercent < 100 ? 'shimmer 3s infinite' : 'none'
                  }}
                />
              </div>
              <div 
                className="absolute top-5 -translate-y-1/2 w-5 h-5 bg-white border-3 border-primary rounded-full shadow-lg shadow-primary/30 transition-all duration-700"
                style={{ left: `calc(${progressPercent}% + 12px)` }}
              />
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs font-semibold text-slate-500">Progress</span>
                <span className="text-sm font-bold text-primary">{progressPercent}%</span>
              </div>
            </div>
          )}

          {/* Task List */}
          <TaskList
            tasks={tasks}
            isLoading={isLoading}
            isError={isError}
            onRetry={refetch}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
            onToggle={handleToggle}
            onAddTask={handleOpenCreate}
          />

          {/* Modal */}
          <Modal
            isOpen={isModalOpen}
            onClose={handleClose}
            title={editingTask ? "Edit Task" : "Create Task"}
          >
            <TaskForm
              task={editingTask}
              isLoading={createMutation.isPending || updateMutation.isPending}
              onSubmit={handleSubmit}
              onCancel={handleClose}
            />
          </Modal>
        </div>
      </main>

      {/* Footer */}
      <Footer variant="dashboard" />
    </div>
  );
}
