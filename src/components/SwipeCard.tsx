
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/types';
import { formatDistanceToNow, differenceInHours } from 'date-fns';
import { Star, Clock, DollarSign, AlertTriangle } from 'lucide-react';
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import TaskDetailModal from './TaskDetailModal';

interface SwipeCardProps {
  task: Task;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

const SwipeCard: React.FC<SwipeCardProps> = ({ task, onSwipeLeft, onSwipeRight }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const constraintsRef = useRef(null);

  const handleDragEnd = (event: React.PointerEvent, info: { offset: { x: number } }) => {
    const threshold = 100;
    
    if (info.offset.x > threshold) {
      onSwipeRight();
    } else if (info.offset.x < -threshold) {
      onSwipeLeft();
    }
    
    setIsDragging(false);
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

  // Check if deadline is within 24 hours
  const isUrgent = () => {
    const hoursTillDeadline = differenceInHours(new Date(task.deadline), new Date());
    return hoursTillDeadline <= 24 && hoursTillDeadline > 0;
  };

  // Get status badge details
  const getStatusBadge = () => {
    switch (task.status) {
      case 'pending':
        return { text: 'Available', color: 'bg-green-500' };
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
    <div ref={constraintsRef} className="swipe-card-container" aria-label="Task card. Swipe right to accept, left to skip">
      <div 
        className="swipe-card"
        onPointerDown={() => setIsDragging(true)}
        style={{ 
          zIndex: isDragging ? 10 : 1
        }}
      >
        <Card className="w-full h-full shadow-lg overflow-hidden flex flex-col cursor-pointer"
          onClick={() => setDetailsOpen(true)}>
          <CardHeader className="pb-3">
            {/* Status Badge and Task Type at the top */}
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-xl text-primary">
                {getFormattedCategory(task.category)}
              </h3>
              <Badge className={`${statusBadge.color} text-white`}>
                {statusBadge.text}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="flex-grow">
            <div className="space-y-4">
              {/* Short summary */}
              <p className="text-gray-700">{getShortSummary(task.description)}</p>
              
              {/* Payout and Deadline side by side */}
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <span className="font-medium">${task.paymentAmount}</span>
                </div>
                <div className="flex items-center gap-1">
                  {isUrgent() && <AlertTriangle className="h-4 w-4 text-red-500" />}
                  <Clock className={`h-4 w-4 ${isUrgent() ? 'text-red-500' : 'text-orange-500'}`} />
                  <span className={isUrgent() ? 'text-red-500 font-semibold' : ''}>
                    Due {formatDistanceToNow(new Date(task.deadline), { addSuffix: true })}
                  </span>
                </div>
              </div>

              {/* Client Reputation */}
              <div className="flex justify-end items-center text-sm gap-1">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="font-medium">4.8</span>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="border-t pt-4 bg-gray-50">
            <div className="w-full flex justify-between items-center text-sm">
              <div>
                <span className="text-red-500">⟵ Skip</span>
              </div>
              <div>
                <span className="text-green-500">Accept ⟶</span>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">{task.title}</DialogTitle>
          </DialogHeader>
          <TaskDetailModal task={task} onAccept={onSwipeRight} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SwipeCard;
