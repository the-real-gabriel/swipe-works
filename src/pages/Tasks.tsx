
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTasks } from '@/contexts/TasksContext';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';
import SwipeCard from '@/components/SwipeCard';
import TaskCard from '@/components/TaskCard';
import HorizontalTaskFilters from '@/components/HorizontalTaskFilters';
import { TaskCategory, Task } from '@/types';
import { Button } from '@/components/ui/button';
import { Info, Grid, List, X, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Tasks = () => {
  const { user } = useAuth();
  const { filteredTasks, acceptTask, filterTasks } = useTasks();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const getSavedFilters = () => {
    try {
      const savedFilters = localStorage.getItem('designswipe_filters');
      if (savedFilters) {
        return JSON.parse(savedFilters);
      }
    } catch (error) {
      console.error('Error retrieving saved filters:', error);
    }
    return {
      category: undefined,
      minAmount: undefined,
      maxAmount: undefined,
      deadline: undefined
    };
  };
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'swipe' | 'list'>('swipe');
  const [filters, setFilters] = useState(getSavedFilters());
  
  useEffect(() => {
    filterTasks(
      filters.category,
      filters.minAmount,
      filters.maxAmount,
      filters.deadline ? new Date(filters.deadline) : undefined
    );
  }, []);
  
  const availableTasks = filteredTasks.filter(task => task.status === 'pending');

  const handleSwipeLeft = () => {
    setCurrentIndex(prev => Math.min(prev + 1, availableTasks.length - 1));
  };

  const handleSwipeRight = async () => {
    if (availableTasks.length > 0) {
      const taskId = availableTasks[currentIndex].id;
      try {
        await acceptTask(taskId);
        toast({
          title: 'Task Accepted!',
          description: 'You can now start working on this task.',
        });
        setCurrentIndex(prev => Math.min(prev + 1, availableTasks.length - 1));
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
    const newFilters = { 
      category,
      minAmount, 
      maxAmount,
      deadline: deadline ? deadline.toISOString() : undefined
    };
    setFilters(newFilters);
    
    try {
      localStorage.setItem('designswipe_filters', JSON.stringify(newFilters));
    } catch (error) {
      console.error('Error saving filters:', error);
    }
    
    filterTasks(category, minAmount, maxAmount, deadline);
    setCurrentIndex(0);
  };

  const handleAcceptTask = async (task: Task) => {
    try {
      await acceptTask(task.id);
      toast({
        title: 'Task Accepted!',
        description: 'You can now start working on this task.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to accept the task. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      
      <HorizontalTaskFilters onFilter={handleFilter} initialFilters={filters} />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
        <div className="mb-8 flex flex-wrap justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Available Tasks</h1>
            {user?.role === 'designer' ? (
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                {viewMode === 'swipe' 
                  ? 'Swipe right to accept, left to skip' 
                  : 'Browse available tasks'}
              </p>
            ) : (
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                Browse available tasks or <Button 
                  onClick={() => navigate('/post-task')} 
                  variant="link" 
                  className="text-primary p-0 h-auto font-normal"
                >
                  post your own
                </Button>
              </p>
            )}
          </div>
          
          {user?.role === 'designer' && (
            <div className="flex items-center gap-2 mt-2 sm:mt-0">
              <Button 
                variant={viewMode === 'swipe' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setViewMode('swipe')}
                className="flex items-center gap-1 h-8 text-xs"
              >
                <List size={14} />
                <span>Swipe</span>
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setViewMode('list')}
                className="flex items-center gap-1 h-8 text-xs"
              >
                <Grid size={14} />
                <span>List</span>
              </Button>
            </div>
          )}
        </div>

        {!user && (
          <div className="my-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
            <div className="flex items-start">
              <Info className="text-blue-500 mr-2 mt-0.5 flex-shrink-0" size={18} />
              <div>
                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300">Sign Up to Accept Tasks</h4>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  Register as a designer to accept tasks or as a client to post tasks.
                </p>
                <div className="mt-2 flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate('/login')} 
                    className="text-xs h-8"
                  >
                    Log In
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => navigate('/register')} 
                    className="text-xs h-8 bg-primary hover:bg-primary-dark"
                  >
                    Register
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {availableTasks.length > 0 ? (
          <>
            {viewMode === 'swipe' && user?.role === 'designer' ? (
              <div className="flex flex-col items-center py-6">
                <div className="w-full max-w-md relative mb-12">
                  {availableTasks.slice(currentIndex, currentIndex + 5).map((task, idx) => (
                    <SwipeCard
                      key={task.id}
                      task={task}
                      onSwipeLeft={handleSwipeLeft}
                      onSwipeRight={handleSwipeRight}
                      index={idx}
                      totalCards={Math.min(5, availableTasks.length - currentIndex)}
                    />
                  ))}
                </div>
                
                <div className="mt-6 text-gray-500 dark:text-gray-400 text-center">
                  <p className="text-sm">Task {currentIndex + 1} of {availableTasks.length}</p>
                  <div className="flex items-center justify-center gap-8 mt-4">
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 border-red-200 dark:border-red-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={handleSwipeLeft}
                      disabled={currentIndex >= availableTasks.length - 1}
                    >
                      <X size={16} />
                      Skip
                    </Button>
                    <Button
                      className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white"
                      onClick={handleSwipeRight}
                    >
                      <Check size={16} />
                      Accept
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {availableTasks.map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    action={user?.role === 'designer' ? 'view' : undefined}
                    onActionClick={() => handleAcceptTask(task)}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-8 text-center border border-gray-200 dark:border-gray-800">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No available tasks
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              There are no tasks that match your filters. Try adjusting your filter settings or check back later.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Tasks;
