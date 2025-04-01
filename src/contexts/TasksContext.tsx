
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task, TaskCategory, TaskStatus } from '@/types';
import { useAuth } from './AuthContext';

interface TasksContextType {
  tasks: Task[];
  filteredTasks: Task[];
  loading: boolean;
  error: string | null;
  createTask: (task: Omit<Task, 'id' | 'status' | 'createdAt'>) => Promise<void>;
  acceptTask: (taskId: string) => Promise<void>;
  completeTask: (taskId: string, deliverables: string[]) => Promise<void>;
  approveTask: (taskId: string) => Promise<void>;
  filterTasks: (category?: TaskCategory, minAmount?: number, maxAmount?: number, deadline?: Date) => void;
}

const TasksContext = createContext<TasksContextType | null>(null);

// Mock tasks for MVP
const generateMockTasks = (): Task[] => {
  return [
    {
      id: '1',
      title: 'Modern Logo Design',
      description: 'Need a clean, modern logo for my tech startup. Looking for minimalist design with bold typography.',
      category: 'logo',
      clientId: 'client1',
      clientName: 'Alex Johnson',
      clientAvatar: '/placeholder.svg',
      status: 'pending',
      paymentAmount: 85,
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      dimensions: '1000x1000px',
      fileFormat: 'PNG, SVG',
      colorScheme: 'Blue and white',
      assets: [],
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
    {
      id: '2',
      title: 'Social Media Banner',
      description: 'Looking for an eye-catching banner for my Instagram and Facebook pages. Should include my brand colors (blue and orange).',
      category: 'banner',
      clientId: 'client2',
      clientName: 'Sarah Miller',
      clientAvatar: '/placeholder.svg',
      status: 'pending',
      paymentAmount: 45,
      deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      dimensions: '1500x500px',
      fileFormat: 'PNG, JPG',
      colorScheme: 'Blue and orange',
      assets: [],
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    },
    {
      id: '3',
      title: 'Business Card Design',
      description: 'Need a professional business card design for my consulting business. Should be elegant and modern.',
      category: 'business-card',
      clientId: 'client3',
      clientName: 'David Chen',
      clientAvatar: '/placeholder.svg',
      status: 'pending',
      paymentAmount: 35,
      deadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
      dimensions: '3.5x2 inches, 300dpi',
      fileFormat: 'PDF, AI',
      colorScheme: 'Black and gold',
      assets: [],
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    },
    {
      id: '4',
      title: 'Event Flyer',
      description: 'Need a vibrant flyer for my upcoming music event. Should have an energetic and youthful vibe.',
      category: 'flyer',
      clientId: 'client2',
      clientName: 'Sarah Miller',
      clientAvatar: '/placeholder.svg',
      status: 'pending',
      paymentAmount: 50,
      deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
      dimensions: '8.5x11 inches, 300dpi',
      fileFormat: 'PDF, JPG',
      colorScheme: 'Vibrant neon colors',
      assets: [],
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    },
    {
      id: '5',
      title: 'Custom Illustration',
      description: 'Looking for a custom character illustration in a cartoon style for my children\'s book.',
      category: 'illustration',
      clientId: 'client3',
      clientName: 'David Chen',
      clientAvatar: '/placeholder.svg',
      status: 'pending',
      paymentAmount: 120,
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      dimensions: '2000x2000px, 300dpi',
      fileFormat: 'PNG, PSD',
      colorScheme: 'Pastel, child-friendly',
      assets: [],
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    },
  ];
};

export const TasksProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch tasks (mock data for MVP)
    setLoading(true);
    try {
      const mockTasks = generateMockTasks();
      setTasks(mockTasks);
      setFilteredTasks(mockTasks);
    } catch (err) {
      setError('Failed to fetch tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = async (taskData: Omit<Task, 'id' | 'status' | 'createdAt'>) => {
    if (!user) throw new Error('You must be logged in to create a task');
    if (user.role !== 'client') throw new Error('Only clients can create tasks');

    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      status: 'pending',
      createdAt: new Date(),
    };

    setTasks(prev => [newTask, ...prev]);
    setFilteredTasks(prev => [newTask, ...prev]);
  };

  const acceptTask = async (taskId: string) => {
    if (!user) throw new Error('You must be logged in to accept a task');
    if (user.role !== 'designer') throw new Error('Only designers can accept tasks');

    setTasks(prev => 
      prev.map(task => 
        task.id === taskId 
          ? { ...task, status: 'assigned', designerId: user.id }
          : task
      )
    );

    setFilteredTasks(prev => 
      prev.map(task => 
        task.id === taskId 
          ? { ...task, status: 'assigned', designerId: user.id }
          : task
      )
    );
  };

  const completeTask = async (taskId: string, deliverables: string[]) => {
    if (!user) throw new Error('You must be logged in to complete a task');
    if (user.role !== 'designer') throw new Error('Only designers can complete tasks');

    setTasks(prev => 
      prev.map(task => 
        task.id === taskId && task.designerId === user.id
          ? { ...task, status: 'completed' }
          : task
      )
    );

    setFilteredTasks(prev => 
      prev.map(task => 
        task.id === taskId && task.designerId === user.id
          ? { ...task, status: 'completed' }
          : task
      )
    );
  };

  const approveTask = async (taskId: string) => {
    if (!user) throw new Error('You must be logged in to approve a task');
    if (user.role !== 'client') throw new Error('Only clients can approve tasks');

    setTasks(prev => 
      prev.map(task => 
        task.id === taskId && task.clientId === user.id
          ? { ...task, status: 'approved' }
          : task
      )
    );

    setFilteredTasks(prev => 
      prev.map(task => 
        task.id === taskId && task.clientId === user.id
          ? { ...task, status: 'approved' }
          : task
      )
    );
  };

  const filterTasks = (
    category?: TaskCategory,
    minAmount?: number,
    maxAmount?: number,
    deadline?: Date
  ) => {
    let filtered = [...tasks];

    if (category) {
      filtered = filtered.filter(task => task.category === category);
    }

    if (minAmount !== undefined) {
      filtered = filtered.filter(task => task.paymentAmount >= minAmount);
    }

    if (maxAmount !== undefined) {
      filtered = filtered.filter(task => task.paymentAmount <= maxAmount);
    }

    if (deadline) {
      filtered = filtered.filter(
        task => new Date(task.deadline) <= deadline
      );
    }

    setFilteredTasks(filtered);
  };

  return (
    <TasksContext.Provider 
      value={{ 
        tasks, 
        filteredTasks, 
        loading, 
        error, 
        createTask, 
        acceptTask, 
        completeTask, 
        approveTask, 
        filterTasks 
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
};
