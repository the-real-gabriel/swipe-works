
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTasks } from '@/contexts/TasksContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import TaskCard from '@/components/TaskCard';
import Navbar from '@/components/Navbar';

const Dashboard = () => {
  const { user } = useAuth();
  const { tasks } = useTasks();

  // Filter tasks based on user role
  const userTasks = tasks.filter(task => {
    if (user?.role === 'client') {
      return task.clientId === user.id;
    } else if (user?.role === 'designer') {
      return task.designerId === user.id;
    }
    return false;
  });

  // Get active tasks (pending or assigned)
  const activeTasks = userTasks.filter(
    task => task.status === 'pending' || task.status === 'assigned'
  );

  // Get completed tasks
  const completedTasks = userTasks.filter(
    task => task.status === 'completed' || task.status === 'approved'
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">
              Welcome back, {user?.name}!
            </p>
          </div>
          
          {user?.role === 'client' ? (
            <Link to="/post-task">
              <Button className="mt-4 md:mt-0 bg-primary hover:bg-primary-dark">
                Post New Task
              </Button>
            </Link>
          ) : (
            <Link to="/tasks">
              <Button className="mt-4 md:mt-0 bg-primary hover:bg-primary-dark">
                Find Tasks
              </Button>
            </Link>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="font-semibold text-lg text-gray-900">Active Tasks</h3>
            <div className="mt-2 text-3xl font-bold text-primary">{activeTasks.length}</div>
            <p className="text-gray-600 text-sm mt-1">Currently in progress</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="font-semibold text-lg text-gray-900">Completed</h3>
            <div className="mt-2 text-3xl font-bold text-green-500">{completedTasks.length}</div>
            <p className="text-gray-600 text-sm mt-1">Successfully finished</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="font-semibold text-lg text-gray-900">Earnings</h3>
            <div className="mt-2 text-3xl font-bold text-indigo-500">
              ${completedTasks.reduce((sum, task) => sum + task.paymentAmount, 0)}
            </div>
            <p className="text-gray-600 text-sm mt-1">Total {user?.role === 'designer' ? 'earned' : 'spent'}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Tasks</h2>
          
          {activeTasks.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  action="view"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No active tasks found.</p>
              {user?.role === 'client' ? (
                <Link to="/post-task">
                  <Button className="mt-4 bg-primary hover:bg-primary-dark">
                    Post a Task
                  </Button>
                </Link>
              ) : (
                <Link to="/tasks">
                  <Button className="mt-4 bg-primary hover:bg-primary-dark">
                    Find Tasks
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recently Completed</h2>
          
          {completedTasks.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedTasks.slice(0, 3).map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  action="view"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No completed tasks yet.</p>
            </div>
          )}
          
          {completedTasks.length > 3 && (
            <div className="mt-6 text-center">
              <Button variant="outline">
                View All Completed Tasks
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
