
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTasks } from '@/contexts/TasksContext';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';
import SwipeCard from '@/components/SwipeCard';
import TaskCard from '@/components/TaskCard';
import TaskFilters from '@/components/TaskFilters';
import { TaskCategory, Task } from '@/types';
import { Button } from '@/components/ui/button';
import { Info, Grid, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Tasks = () => {
  const { user } = useAuth();
  const { filteredTasks, acceptTask, filterTasks } = useTasks();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'swipe' | 'list'>('swipe');
  
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
        <div className="mb-8 flex flex-wrap justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Available Tasks</h1>
            {user?.role === 'designer' ? (
              <p className="text-gray-600">
                {viewMode === 'swipe' ? 'Swipe right to accept, left to skip' : 'Browse available tasks'}
              </p>
            ) : (
              <p className="text-gray-600">
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
                className="flex items-center gap-1"
              >
                <List size={16} />
                <span>Swipe</span>
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setViewMode('list')}
                className="flex items-center gap-1"
              >
                <Grid size={16} />
                <span>List</span>
              </Button>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <TaskFilters onFilter={handleFilter} />
            
            {!user && (
              <div className="mt-4 bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <div className="flex items-start">
                  <Info className="text-blue-500 mr-2 mt-0.5" size={18} />
                  <div>
                    <h4 className="text-sm font-medium text-blue-800">Sign Up to Accept Tasks</h4>
                    <p className="text-xs text-blue-600 mt-1">
                      Register as a designer to accept tasks or as a client to post tasks.
                    </p>
                    <div className="mt-2 flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => navigate('/login')} 
                        className="text-xs"
                      >
                        Log In
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => navigate('/register')} 
                        className="text-xs bg-primary hover:bg-primary-dark"
                      >
                        Register
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="md:col-span-2">
            {availableTasks.length > 0 ? (
              <>
                {viewMode === 'swipe' && user?.role === 'designer' ? (
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
