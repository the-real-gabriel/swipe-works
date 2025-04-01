
import React from 'react';
import { Task } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format, formatDistanceToNow } from 'date-fns';
import { Download, Star, Clock, DollarSign, Layers, Palette, FileType, User, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import parse from 'html-react-parser';

interface TaskDetailModalProps {
  task: Task;
  onAccept?: () => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, onAccept }) => {
  const { user } = useAuth();
  const isDesigner = user?.role === 'designer';
  
  // Mock description with rich text formatting
  const richDescription = task.description.length > 100
    ? task.description
    : `<p>${task.description}</p><p>We need a <strong>professional design</strong> that captures our brand's <em>essence</em> and appeal.</p><ul><li>Clean and modern aesthetic</li><li>Aligned with brand guidelines</li><li>Easy to recognize</li></ul><p>Please see our <a href="#" class="text-blue-500 underline">brand inspiration board</a> for additional context.</p>`;

  // Mock client data
  const clientData = {
    name: "Client J.",
    tasksPosted: 12,
    averageRating: 4.8,
    reviewCount: 10
  };

  // Specific requirements
  const requirements = {
    dimensions: task.dimensions,
    colorScheme: "Blue and white", // Mock data
    fileFormat: "PNG and SVG" // Mock data
  };

  // Mock assets
  const assets = [
    { name: "brand-guidelines.pdf", size: "1.2 MB" },
    { name: "inspiration-sketch.jpg", size: "450 KB" }
  ];

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
    <div className="space-y-6 py-2">
      <div className="flex flex-wrap gap-2 items-center">
        <Badge className={`${getCategoryColor(task.category)} text-white`}>
          {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
        </Badge>
        <span className="text-sm text-gray-500">
          Posted {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}
        </span>
      </div>

      {/* Description section with rich text */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-500">Description</h3>
        <div className="prose prose-sm max-w-none">
          {parse(richDescription)}
        </div>
      </div>

      {/* Requirements section */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-500">Requirements</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-3 rounded flex items-start">
            <Layers className="text-gray-400 mr-2 mt-1 h-4 w-4" />
            <div>
              <span className="text-xs text-gray-500 block">Dimensions</span>
              <span className="font-medium text-gray-700">{requirements.dimensions}</span>
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded flex items-start">
            <Palette className="text-gray-400 mr-2 mt-1 h-4 w-4" />
            <div>
              <span className="text-xs text-gray-500 block">Color Scheme</span>
              <span className="font-medium text-gray-700">{requirements.colorScheme}</span>
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded flex items-start">
            <FileType className="text-gray-400 mr-2 mt-1 h-4 w-4" />
            <div>
              <span className="text-xs text-gray-500 block">File Format</span>
              <span className="font-medium text-gray-700">{requirements.fileFormat}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Assets section */}
      {assets.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-500">Assets Provided</h3>
          <div className="space-y-2">
            {assets.map((asset, index) => (
              <div key={index} className="bg-gray-50 p-2 rounded flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-sm font-medium">{asset.name}</span>
                  <span className="text-xs text-gray-500 ml-2">({asset.size})</span>
                </div>
                <Button variant="ghost" size="sm" className="text-xs">
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Client History section */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-500">Client</h3>
        <div className="bg-gray-50 p-4 rounded">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <User className="text-gray-400 mr-2 h-5 w-5" />
              <span className="font-medium">{clientData.name}</span>
            </div>
            <div className="flex items-center">
              <Star className="text-yellow-500 fill-yellow-500 h-4 w-4" />
              <span className="font-medium ml-1">{clientData.averageRating}</span>
              <span className="text-xs text-gray-500 ml-1">({clientData.reviewCount} reviews)</span>
            </div>
          </div>
          <div className="mt-1 text-sm text-gray-500">
            Tasks Posted: {clientData.tasksPosted}
          </div>
        </div>
      </div>

      {/* Payout and Deadline section */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-3 rounded flex items-center">
          <DollarSign className="text-primary mr-2 h-5 w-5" />
          <div>
            <span className="text-xs text-gray-500 block">Payout</span>
            <span className="font-bold text-primary">${task.paymentAmount}</span>
          </div>
        </div>
        <div className="bg-gray-50 p-3 rounded flex items-center">
          <Clock className="text-orange-500 mr-2 h-5 w-5" />
          <div>
            <span className="text-xs text-gray-500 block">Deadline</span>
            <span className="font-medium text-gray-700">
              {format(new Date(task.deadline), 'PPP, p')}
            </span>
          </div>
        </div>
      </div>

      {/* Accept button - only shown for designers viewing pending tasks */}
      {isDesigner && task.status === 'pending' && onAccept && (
        <div className="pt-2 flex justify-end">
          <Button onClick={onAccept} className="bg-primary hover:bg-primary-dark">
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Accept Task
          </Button>
        </div>
      )}
    </div>
  );
};

export default TaskDetailModal;
