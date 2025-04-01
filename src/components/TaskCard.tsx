
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Task } from '@/types';
import { formatDistanceToNow, differenceInHours } from 'date-fns';
import { Link } from 'react-router-dom';
import { Eye, Star, Clock, DollarSign, AlertTriangle } from 'lucide-react';
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

  // Check if deadline is within 24 hours
  const isUrgent = () => {
    const hoursTillDeadline = differenceInHours(new Date(task.deadline), new Date());
    return hoursTillDeadline <= 24 && hoursTillDeadline > 0;
  };

  // Get status badge details
  const getStatusBadge = () => {
    switch (task.status) {
      case 'pending':
        return { text: 'Available', color: 'bg-emerald-500' };
      case 'assigned':
        return { text: 'In Progress', color: 'bg-blue-500' };
      case 'completed':
        return { text: 'Completed', color: 'bg-orange-500' };
      case 'approved':
        return { text: 'Approved', color: 'bg-purple-500' };
      default:
        return { text: 'Unknown', color: 'bg-gray-500' };
    }
  };

  const statusBadge = getStatusBadge();

  return (
    <>
      <Card className="w-full overflow-hidden transition-all duration-200 hover:shadow-md border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Status Badge */}
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-gray-900 dark:text-gray-100">
                {getFormattedCategory(task.category)}
              </h3>
              <Badge className={`${statusBadge.color} text-white`} aria-label={`Task status: ${statusBadge.text}`}>
                {statusBadge.text}
              </Badge>
            </div>
            
            {/* Short summary */}
            <p className="text-gray-700 dark:text-gray-300 text-sm">{getShortSummary(task.description)}</p>
            
            {/* Payout and Deadline side by side */}
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="font-medium text-gray-800 dark:text-gray-200">${task.paymentAmount}</span>
              </div>
              <div className="flex items-center gap-1">
                {isUrgent() && <AlertTriangle className="h-4 w-4 text-red-500" aria-label="Urgent task" />}
                <Clock className={`h-4 w-4 ${isUrgent() ? 'text-red-500' : 'text-amber-500'}`} />
                <span className={isUrgent() ? 'text-red-500 font-semibold' : 'text-gray-600 dark:text-gray-400'}>
                  Due {formatDistanceToNow(new Date(task.deadline), { addSuffix: true })}
                </span>
              </div>
            </div>

            {/* Client Reputation */}
            <div className="flex justify-end items-center text-sm gap-1">
              <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
              <span className="font-medium text-gray-700 dark:text-gray-300">4.8</span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="bg-gray-50 dark:bg-gray-800/50 p-3 flex justify-between border-t border-gray-100 dark:border-gray-800">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setDetailsOpen(true)} 
            className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            <Eye size={14} />
            <span>Details</span>
          </Button>
          
          {action === 'view' && (
            <Link to={`/tasks/${task.id}`}>
              <Button variant="outline" size="sm" className="text-xs h-8">
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
