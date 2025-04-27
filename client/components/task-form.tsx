"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { Task } from "@/types/task"

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters",
  }),
  description: z.string().min(5, {
    message: "Description must be at least 5 characters",
  }),
})

interface TaskFormProps {
  initialData?: Task
  onSubmit: (data: z.infer<typeof formSchema>) => void
  onCancel: () => void
}

export default function TaskForm({ initialData, onSubmit, onCancel }: TaskFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Task title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe your task" className="min-h-[100px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2">
          <Button type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{initialData ? "Update Task" : "Add Task"}</Button>
        </div>
      </form>
    </Form>
  )
}
