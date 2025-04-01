import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Task } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import TaskDetail from './TaskDetail';

interface TaskCardProps {
  task: Task;
  action?: 'view' | 'complete' | 'approve';
  onActionClick?: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, action, onActionClick }) => {
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'logo': 'bg-blue-500',
      'banner': 'bg-green-500',
      'social-media': 'bg-purple-500',
      'flyer': 'bg-yellow-500',
      'business-card': 'bg-indigo-500',
      'illustration': 'bg-pink-500',
      'other': 'bg-gray-500'
    };
    
    return colors[category] || colors.other;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'assigned': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'approved': 'bg-purple-100 text-purple-800',
      'disputed': 'bg-red-100 text-red-800'
    };
    
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getActionButton = () => {
    if (!action) return null;

    switch (action) {
      case 'view':
        return (
          <Link to={`/tasks/${task.id}`}>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </Link>
        );
      case 'complete':
        return (
          <Button 
            onClick={onActionClick} 
            className="bg-primary hover:bg-primary-dark" 
            size="sm"
          >
            Mark Complete
          </Button>
        );
      case 'approve':
        return (
          <Button 
            onClick={onActionClick} 
            className="bg-success hover:bg-success/90" 
            size="sm"
          >
            Approve & Pay
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Card className="w-full overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg leading-tight">{task.title}</h3>
              <p className="text-sm text-gray-500">
                Due {formatDistanceToNow(new Date(task.deadline), { addSuffix: true })}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge className={getCategoryColor(task.category) + " text-white"}>
                {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
              </Badge>
              <Badge className={getStatusColor(task.status)}>
                {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pb-2">
          <div className="flex justify-between items-center">
            <div className="bg-gray-50 px-3 py-1 rounded">
              <span className="font-medium text-primary">${task.paymentAmount}</span>
            </div>
            <div className="text-sm text-gray-500">
              {task.dimensions}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="pt-2 flex justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setDetailsOpen(true)} 
            className="flex items-center gap-1"
          >
            <Eye size={16} />
            <span>Details</span>
          </Button>
          {getActionButton()}
        </CardFooter>
      </Card>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Task Details</DialogTitle>
            <DialogDescription>
              Detailed information about the task
            </DialogDescription>
          </DialogHeader>
          <TaskDetail task={task} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TaskCard;
