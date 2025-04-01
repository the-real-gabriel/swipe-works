
import React, { useState, useRef } from 'react';
import { motion, PanInfo, useAnimation } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface SwipeCardProps {
  task: Task;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

const SwipeCard: React.FC<SwipeCardProps> = ({ task, onSwipeLeft, onSwipeRight }) => {
  const [isDragging, setIsDragging] = useState(false);
  const controls = useAnimation();
  const constraintsRef = useRef(null);

  const handleDragEnd = async (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;
    
    if (info.offset.x > threshold) {
      await controls.start({ x: 500, opacity: 0, transition: { duration: 0.3 } });
      onSwipeRight();
    } else if (info.offset.x < -threshold) {
      await controls.start({ x: -500, opacity: 0, transition: { duration: 0.3 } });
      onSwipeLeft();
    } else {
      controls.start({ x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 20 } });
    }
    
    setIsDragging(false);
  };

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

  return (
    <div ref={constraintsRef} className="swipe-card-container">
      <motion.div
        className="swipe-card"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ 
          rotateZ: isDragging ? 0 : 0,
          zIndex: isDragging ? 10 : 1
        }}
        whileTap={{ scale: 1.02 }}
      >
        <Card className="w-full h-full shadow-lg overflow-hidden flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg font-bold">{task.title}</CardTitle>
              <Badge className={`${getCategoryColor(task.category)} text-white`}>
                {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
              </Badge>
            </div>
            <div className="text-sm text-gray-500">
              Posted {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}
            </div>
          </CardHeader>
          
          <CardContent className="flex-grow">
            <div className="space-y-4">
              <p className="text-sm text-gray-700">{task.description}</p>
              
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-xs text-gray-500 block">Budget</span>
                  <span className="font-semibold text-primary">${task.paymentAmount}</span>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-xs text-gray-500 block">Due</span>
                  <span className="font-semibold text-gray-700">
                    {formatDistanceToNow(new Date(task.deadline), { addSuffix: true })}
                  </span>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-xs text-gray-500 block">Size</span>
                  <span className="font-semibold text-gray-700">{task.dimensions}</span>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-xs text-gray-500 block">Assets</span>
                  <span className="font-semibold text-gray-700">{task.assets.length || 'None'}</span>
                </div>
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
      </motion.div>
    </div>
  );
};

export default SwipeCard;
