
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Task } from '@/types';
import { formatDistanceToNow, format } from 'date-fns';
import { Link } from 'react-router-dom';
import { Eye, Star, Clock, DollarSign } from 'lucide-react';
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import TaskDetailModal from './TaskDetailModal';

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

  const getFormattedCategory = (category: string) => {
    const formatted = {
      'logo': 'Logo Design',
      'banner': 'Banner Design',
      'social-media': 'Social Media Graphic',
      'flyer': 'Flyer Design',
      'business-card': 'Business Card Design',
      'illustration': 'Illustration',
      'other': 'Other Design'
    };
    
    return formatted[category as keyof typeof formatted] || 'Design Task';
  };

  // Create a short summary from the description (max 100 chars)
  const getShortSummary = (description: string): string => {
    if (description.length <= 100) return description;
    return description.substring(0, 97) + '...';
  };

  return (
    <>
      <Card className="w-full overflow-hidden transition-transform hover:scale-105 duration-200 shadow-md">
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Task Type at the top in bold, large font */}
            <h3 className="font-bold text-lg text-primary">
              {getFormattedCategory(task.category)}
            </h3>
            
            {/* Short summary */}
            <p className="text-gray-700 text-sm">{getShortSummary(task.description)}</p>
            
            {/* Payout and Deadline side by side */}
            <div className="flex justify-between items-center text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4 text-primary" />
                <span className="font-medium">${task.paymentAmount}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-orange-500" />
                <span>Due {formatDistanceToNow(new Date(task.deadline), { addSuffix: true })}</span>
              </div>
            </div>

            {/* Client Reputation */}
            <div className="flex justify-end items-center text-sm gap-1">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span className="font-medium">4.8</span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="bg-gray-50 p-3 flex justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setDetailsOpen(true)} 
            className="flex items-center gap-1 text-xs"
          >
            <Eye size={14} />
            <span>View Details</span>
          </Button>
          
          {action === 'view' && (
            <Link to={`/tasks/${task.id}`}>
              <Button variant="outline" size="sm" className="text-xs">
                Open
              </Button>
            </Link>
          )}
        </CardFooter>
      </Card>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">{task.title}</DialogTitle>
          </DialogHeader>
          <TaskDetailModal task={task} onAccept={onActionClick} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TaskCard;
