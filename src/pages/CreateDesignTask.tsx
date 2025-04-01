
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTasks } from '@/contexts/TasksContext';
import { useToast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, PenLine } from 'lucide-react';
import { cn } from '@/lib/utils';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { TaskCategory } from '@/types';

// Define the form schema
const designTaskSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters' }).max(100),
  description: z.string().min(20, { message: 'Description must be at least 20 characters' }).max(500),
  category: z.enum(['logo', 'banner', 'social-media', 'flyer', 'business-card', 'illustration', 'other']),
  budget: z.coerce.number().min(10, { message: 'Minimum budget is $10' }),
  deadline: z.date({
    required_error: "Please select a deadline date",
  }),
  dimensions: z.string().min(3, { message: 'Please specify dimensions' }),
  fileFormat: z.string().min(1, { message: 'Please specify file format' }),
  colorScheme: z.string().optional(),
});

type DesignTaskFormValues = z.infer<typeof designTaskSchema>;

const CreateDesignTask = () => {
  const { user } = useAuth();
  const { createTask } = useTasks();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<DesignTaskFormValues>({
    resolver: zodResolver(designTaskSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'logo',
      budget: 50,
      dimensions: '',
      fileFormat: 'PNG',
      colorScheme: '',
    },
  });

  const categoryOptions: { value: TaskCategory; label: string }[] = [
    { value: 'logo', label: 'Logo Design' },
    { value: 'banner', label: 'Banner' },
    { value: 'social-media', label: 'Social Media Graphics' },
    { value: 'flyer', label: 'Flyer' },
    { value: 'business-card', label: 'Business Card' },
    { value: 'illustration', label: 'Illustration' },
    { value: 'other', label: 'Other' },
  ];

  const onSubmit = async (data: DesignTaskFormValues) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to post a task',
        variant: 'destructive',
      });
      return;
    }

    if (user.role !== 'client') {
      toast({
        title: 'Error',
        description: 'Only clients can post tasks',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await createTask({
        title: data.title,
        description: data.description,
        category: data.category,
        clientId: user.id,
        paymentAmount: data.budget,
        deadline: data.deadline,
        dimensions: data.dimensions,
        fileFormat: data.fileFormat,
        colorScheme: data.colorScheme || 'Not specified',
        assets: [], // For MVP, we don't handle file uploads yet
      });

      toast({
        title: 'Task Posted!',
        description: 'Your design task has been successfully posted.',
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to post task. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-3xl py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
          <PenLine className="h-8 w-8" />
          Create Design Task
        </h1>
        <p className="text-gray-600 mt-2">
          Post a new design task for our talented community of designers
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Title</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g., Modern Logo Design for Tech Startup" {...field} />
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
                    <Textarea 
                      placeholder="Describe what you need in detail... Include any specific requirements or preferences."
                      className="min-h-32"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categoryOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget ($)</FormLabel>
                    <FormControl>
                      <Input type="number" min="10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Deadline</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date() || date > new Date(new Date().setMonth(new Date().getMonth() + 3))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dimensions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dimensions</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g., 1920x1080px or 3.5x2 inches" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fileFormat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>File Format</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g., PNG, SVG, PSD" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="colorScheme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color Scheme (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g., Blue and white, Company colors" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Posting...' : 'Post Design Task'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateDesignTask;
