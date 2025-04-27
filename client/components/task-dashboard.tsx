"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Trash2, Edit } from "lucide-react";
import TaskForm from "@/components/task-form";
import { useRouter } from "next/navigation";
import type { Task } from "@/types/task";
import { SERVER_URL } from "@/lib/const";

export default function TaskDashboard() {
  const { token, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState<"add" | "edit" | "">("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    fetchTasks();
  }, [isAuthenticated, router, token]);

  const fetchTasks = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const response = await fetch(SERVER_URL + "/api/task", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data = await response.json();
      setTasks(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load tasks. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (task: {
    title: string;
    description: string;
  }) => {
    if (!token) return;

    try {
      const response = await fetch(SERVER_URL + "/api/task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(task),
      });

      if (!response.ok) {
        throw new Error("Failed to add task");
      }

      toast({
        title: "Success",
        description: "Task added successfully",
      });
      setShow("");
      fetchTasks();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add task. Please try again.",
      });
    }
  };

  const handleUpdateTask = async (data: {
    title: string;
    description: string;
  }) => {
    if (!token || !editingTask) return;

    try {
      const response = await fetch(
        `${SERVER_URL}/api/task/${editingTask._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: data.title,
            description: data.description,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      toast({
        title: "Success",
        description: "Task updated successfully",
      });
      setEditingTask(null);
      fetchTasks();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update task. Please try again.",
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    if (!token) return;

    try {
      const response = await fetch(`${SERVER_URL}/api/task/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
      fetchTasks();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete task. Please try again.",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Your Tasks</h1>
        <Button onClick={() => setShow("add")}>
          <Plus className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </div>

      {show ? (
        <Card>
          <CardHeader>
            <CardTitle>Add New Task</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskForm onSubmit={handleAddTask} onCancel={() => setShow("")} />
          </CardContent>
        </Card>
      ) : editingTask ? (
        <Card>
          <CardHeader>
            <CardTitle>Edit Task</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskForm
              initialData={editingTask}
              onSubmit={handleUpdateTask}
              onCancel={() => setEditingTask(null)}
            />
          </CardContent>
        </Card>
      ) : tasks.length === 0 ? (
        <div className="text-center p-10 bg-muted rounded-lg">
          <p className="text-muted-foreground">
            No tasks found. Create your first task!
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <Card key={task._id}>
              <CardHeader className="pb-2">
                <div className="justify-end flex space-x-1">
                    <Button className="px-2" onClick={() => setEditingTask(task)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button className="px-2" onClick={() => handleDeleteTask(task._id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{task.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{task.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
