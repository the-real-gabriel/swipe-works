
import React from 'react';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface RatingButtonProps {
  onRate: (isPositive: boolean) => void;
}

const RatingButton: React.FC<RatingButtonProps> = ({ onRate }) => {
  return (
    <div className="flex gap-4">
      <Button
        onClick={() => onRate(true)}
        variant="outline"
        className="flex-1 border-green-200 hover:bg-green-50"
      >
        <ThumbsUp className="w-5 h-5 mr-2 text-green-500" />
        <span className="text-green-600">Good Job</span>
      </Button>
      <Button
        onClick={() => onRate(false)}
        variant="outline"
        className="flex-1 border-red-200 hover:bg-red-50"
      >
        <ThumbsDown className="w-5 h-5 mr-2 text-red-500" />
        <span className="text-red-600">Not Satisfied</span>
      </Button>
    </div>
  );
};

export default RatingButton;
