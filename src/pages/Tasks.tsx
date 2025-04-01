
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTasks } from '@/contexts/TasksContext';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';
import SwipeCard from '@/components/SwipeCard';
import TaskFilters from '@/components/TaskFilters';
import { TaskCategory } from '@/types';

const Tasks = () => {
  const { user } = useAuth();
  const { filteredTasks, acceptTask, filterTasks } = useTasks();
  const { toast } = useToast();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter only pending tasks
  const availableTasks = filteredTasks.filter(task => task.status === 'pending');

  const handleSwipeLeft = () => {
    // Skip the task
    setTimeout(() => {
      setCurrentIndex(prev => (prev + 1) % Math.max(availableTasks.length, 1));
    }, 300);
  };

  const handleSwipeRight = async () => {
    // Accept the task
    if (availableTasks.length > 0) {
      const taskId = availableTasks[currentIndex].id;
      try {
        await acceptTask(taskId);
        toast({
          title: 'Task Accepted!',
          description: 'You can now start working on this task.',
        });
        setTimeout(() => {
          setCurrentIndex(prev => (prev + 1) % Math.max(availableTasks.length, 1));
        }, 300);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to accept the task. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleFilter = (
    category?: TaskCategory,
    minAmount?: number,
    maxAmount?: number,
    deadline?: Date
  ) => {
    filterTasks(category, minAmount, maxAmount, deadline);
    setCurrentIndex(0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Available Tasks</h1>
          <p className="text-gray-600">
            Swipe right to accept, left to skip
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <TaskFilters onFilter={handleFilter} />
          </div>
          
          <div className="md:col-span-2">
            {availableTasks.length > 0 ? (
              <div className="flex flex-col items-center">
                <SwipeCard
                  task={availableTasks[currentIndex]}
                  onSwipeLeft={handleSwipeLeft}
                  onSwipeRight={handleSwipeRight}
                />
                
                <div className="mt-6 text-gray-500 text-center">
                  <p>Task {currentIndex + 1} of {availableTasks.length}</p>
                  <p className="mt-2">Swipe right to accept, left to skip</p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No available tasks
                </h3>
                <p className="text-gray-600 mb-4">
                  There are no tasks that match your filters. Try adjusting your filter settings or check back later.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Tasks;
