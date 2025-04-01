
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/types';
import { formatDistanceToNow, differenceInHours } from 'date-fns';
import { Star, Clock, DollarSign, AlertTriangle, X, Check } from 'lucide-react';
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import TaskDetailModal from './TaskDetailModal';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface SwipeCardProps {
  task: Task;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  index: number;
  totalCards: number;
}

const SwipeCard: React.FC<SwipeCardProps> = ({ 
  task, 
  onSwipeLeft, 
  onSwipeRight, 
  index,
  totalCards
}) => {
  const [swipeDirection, setSwipeDirection] = useState<null | 'left' | 'right'>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDragEnd = (
    event: any, 
    info: { offset: { x: number; }; velocity: { x: number; }; }
  ) => {
    const threshold = 100;
    const velocity = Math.abs(info.velocity.x);
    const isSwipeLeft = info.offset.x < -threshold;
    const isSwipeRight = info.offset.x > threshold;
    
    if (isSwipeLeft || (velocity > 0.5 && info.offset.x < 0)) {
      setSwipeDirection('left');
      setTimeout(() => {
        onSwipeLeft();
        setSwipeDirection(null);
      }, 200);
    } else if (isSwipeRight || (velocity > 0.5 && info.offset.x > 0)) {
      setSwipeDirection('right');
      setTimeout(() => {
        onSwipeRight();
        setSwipeDirection(null);
      }, 200);
    }
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

  const getShortSummary = (description: string): string => {
    if (description.length <= 100) return description;
    return description.substring(0, 97) + '...';
  };

  const isUrgent = () => {
    const hoursTillDeadline = differenceInHours(new Date(task.deadline), new Date());
    return hoursTillDeadline <= 24 && hoursTillDeadline > 0;
  };

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
  
  // Enhanced card styling for more realistic deck appearance
  const getCardStyle = () => {
    // Base styles for all cards
    const baseStyle = {
      boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
      transition: 'all 0.2s ease',
    };
    
    // Current/active card styling (at front of stack)
    if (index === 0) {
      return {
        ...baseStyle,
        zIndex: 50,
        boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
        position: 'relative' as const,
      };
    }
    
    // Stacked cards behind the active card
    const offset = 4 * Math.min(index, 3);
    return {
      ...baseStyle,
      position: 'absolute' as const,
      top: `${offset}px`,
      left: `${offset}px`,
      right: `${-offset}px`,
      zIndex: 40 - index,
      opacity: index < 4 ? 1 - (index * 0.15) : 0,
      transform: `scale(${1 - (index * 0.03)})`,
      pointerEvents: 'none',
    };
  };

  // Get client initials for avatar fallback
  const getClientInitials = (name: string = 'Client') => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div 
      className="w-full max-w-md mx-auto relative" 
      style={{ height: '550px' }}
      aria-label="Task card. Swipe right to accept, left to skip"
    >
      <motion.div 
        ref={cardRef}
        style={getCardStyle()}
        drag={index === 0 ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.8}
        onDragEnd={handleDragEnd}
        whileDrag={{ scale: 1.02, rotate: 0 }}
        animate={
          swipeDirection === 'left' 
            ? { x: -1000, rotate: -10, transition: { duration: 0.2 } }
            : swipeDirection === 'right'
              ? { x: 1000, rotate: 10, transition: { duration: 0.2 } }
              : { x: 0, rotate: 0 }
        }
        className="absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing"
      >
        <Card 
          className="w-full h-full bg-white dark:bg-gray-900 shadow-lg overflow-hidden flex flex-col border-gray-200 dark:border-gray-800 rounded-lg"
          onClick={() => setDetailsOpen(true)}
        >
          {index === 0 && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
              <div className="absolute left-4 p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                <X className="h-8 w-8 text-red-500" />
              </div>
              <div className="absolute right-4 p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                <Check className="h-8 w-8 text-green-500" />
              </div>
            </div>
          )}

          <CardHeader className="pb-2 pt-5">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">
                {getFormattedCategory(task.category)}
              </h3>
              <Badge className={`${statusBadge.color} text-white`}>
                {statusBadge.text}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="flex-grow pb-3">
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">{getShortSummary(task.description)}</p>
              
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="font-medium text-gray-800 dark:text-gray-200">${task.paymentAmount}</span>
                </div>
                <div className="flex items-center gap-1">
                  {isUrgent() && <AlertTriangle className="h-4 w-4 text-red-500" />}
                  <Clock className={`h-4 w-4 ${isUrgent() ? 'text-red-500' : 'text-amber-500'}`} />
                  <span className={isUrgent() ? 'text-red-500 font-semibold' : 'text-gray-600 dark:text-gray-400'}>
                    Due {formatDistanceToNow(new Date(task.deadline), { addSuffix: true })}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={task.clientAvatar || "/placeholder.svg"} alt="Client" />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {getClientInitials(task.clientName)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {task.clientName || "Client"}
                  </span>
                </div>

                <div className="flex items-center text-sm gap-1">
                  <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                  <span className="font-medium text-gray-700 dark:text-gray-300">4.8</span>
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="border-t border-gray-100 dark:border-gray-800 pt-4 pb-5 bg-gray-50 dark:bg-gray-900">
            <div className="w-full flex justify-between items-center text-sm">
              <div>
                <span className="text-red-500 dark:text-red-400">← Skip</span>
              </div>
              <div>
                <span className="text-emerald-500 dark:text-emerald-400">Accept →</span>
              </div>
            </div>
          </CardFooter>
        </Card>
      </motion.div>

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
