
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTasks } from '@/contexts/TasksContext';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';
import TaskDetail from '@/components/TaskDetail';
import RatingButton from '@/components/RatingButton';
import { Button } from '@/components/ui/button';

const TaskDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { tasks, completeTask, approveTask } = useTasks();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Find the task by ID
  const task = tasks.find(t => t.id === id);

  const handleComplete = async () => {
    if (!task || !user) return;
    if (task.designerId !== user.id) {
      toast({
        title: 'Error',
        description: 'You are not assigned to this task',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await completeTask(task.id, []);
      toast({
        title: 'Task Completed!',
        description: 'The client will review your submission.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to mark task as complete',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprove = async () => {
    if (!task || !user) return;
    if (task.clientId !== user.id) {
      toast({
        title: 'Error',
        description: 'You are not the client for this task',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await approveTask(task.id);
      toast({
        title: 'Task Approved!',
        description: 'Payment has been released to the designer.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to approve task',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRate = (isPositive: boolean) => {
    toast({
      title: isPositive ? 'Positive Rating Submitted' : 'Negative Rating Submitted',
      description: 'Thank you for your feedback.',
    });
    navigate('/dashboard');
  };

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Task Not Found</h1>
            <p className="text-gray-600 mb-6">The task you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Task Details</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-6">
          <TaskDetail task={task} />
        </div>

        {/* Action Buttons based on user role and task status */}
        {user && (
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            {user.role === 'designer' && task.designerId === user.id && task.status === 'assigned' && (
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-4">Task Actions</h3>
                <Button 
                  onClick={handleComplete} 
                  className="w-full bg-primary hover:bg-primary-dark"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Mark as Complete'}
                </Button>
              </div>
            )}

            {user.role === 'client' && task.clientId === user.id && task.status === 'completed' && (
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-4">Task Actions</h3>
                <Button 
                  onClick={handleApprove} 
                  className="w-full bg-success hover:bg-success/90 mb-4"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : 'Approve & Release Payment'}
                </Button>
                <p className="text-sm text-gray-500 text-center">
                  Payment will be automatically released in 48 hours if no action is taken.
                </p>
              </div>
            )}

            {((user.role === 'client' && task.clientId === user.id) || 
              (user.role === 'designer' && task.designerId === user.id)) && 
              task.status === 'approved' && (
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-4">Rate Your Experience</h3>
                <RatingButton onRate={handleRate} />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default TaskDetailPage;
