
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Task } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface TaskDetailProps {
  task: Task;
  onAccept?: () => void;
  onSkip?: () => void;
}

const TaskDetail: React.FC<TaskDetailProps> = ({ task, onAccept, onSkip }) => {
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
    <Card className="w-full shadow-lg overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">{task.title}</CardTitle>
          <Badge className={`${getCategoryColor(task.category)} text-white`}>
            {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
          </Badge>
        </div>
        <div className="text-sm text-gray-500">
          Posted {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-gray-700">{task.description}</p>
        
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-gray-50 p-3 rounded">
            <span className="text-sm text-gray-500 block">Budget</span>
            <span className="font-semibold text-primary text-lg">${task.paymentAmount}</span>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <span className="text-sm text-gray-500 block">Due</span>
            <span className="font-semibold text-gray-700">
              {formatDistanceToNow(new Date(task.deadline), { addSuffix: true })}
            </span>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <span className="text-sm text-gray-500 block">Size</span>
            <span className="font-semibold text-gray-700">{task.dimensions}</span>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <span className="text-sm text-gray-500 block">Assets</span>
            <span className="font-semibold text-gray-700">{task.assets.length || 'None'}</span>
          </div>
        </div>
      </CardContent>
      
      {(onAccept || onSkip) && (
        <CardFooter className="border-t pt-4 space-x-4">
          {onSkip && (
            <Button 
              onClick={onSkip} 
              variant="outline" 
              className="flex-1 border-red-200 text-red-500 hover:bg-red-50"
            >
              Skip
            </Button>
          )}
          {onAccept && (
            <Button 
              onClick={onAccept} 
              className="flex-1 bg-primary hover:bg-primary-dark"
            >
              Accept Task
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default TaskDetail;
