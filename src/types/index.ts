
export type UserRole = 'client' | 'designer';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  profileImage?: string;
  createdAt: Date;
}

export type TaskCategory = 
  | 'logo' 
  | 'banner' 
  | 'social-media' 
  | 'flyer' 
  | 'business-card' 
  | 'illustration' 
  | 'other';

export type TaskStatus = 
  | 'pending' 
  | 'assigned' 
  | 'completed' 
  | 'approved' 
  | 'disputed';

export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  clientId: string;
  designerId?: string;
  status: TaskStatus;
  paymentAmount: number;
  deadline: Date;
  dimensions: string;
  assets: string[];
  createdAt: Date;
}

export interface Rating {
  id: string;
  taskId: string;
  raterId: string;
  ratedId: string;
  isPositive: boolean;
  createdAt: Date;
}

export interface Message {
  id: string;
  taskId: string;
  senderId: string;
  content: string;
  createdAt: Date;
}
