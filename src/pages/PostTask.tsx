
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTasks } from '@/contexts/TasksContext';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';
import TaskForm from '@/components/TaskForm';

const PostTask = () => {
  const { user } = useAuth();
  const { createTask } = useTasks();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: any) => {
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

    setIsLoading(true);
    try {
      await createTask({
        title: data.title,
        description: data.description,
        category: data.category,
        clientId: user.id,
        paymentAmount: data.paymentAmount,
        deadline: new Date(data.deadline),
        dimensions: data.dimensions,
        assets: [], // For MVP, we don't handle file uploads yet
      });

      toast({
        title: 'Task Posted!',
        description: 'Your task has been successfully posted.',
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to post task. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Post a New Task</h1>
          <p className="text-gray-600">
            Provide clear details to help designers understand your needs
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <TaskForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
};

export default PostTask;
