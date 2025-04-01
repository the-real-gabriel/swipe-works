
import React, { useState } from 'react';
import { Task } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format, formatDistanceToNow } from 'date-fns';
import { Download, Star, Clock, DollarSign, Layers, Palette, FileType, User, CheckCircle2, AlertTriangle, Hourglass, MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import parse from 'html-react-parser';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface TaskDetailModalProps {
  task: Task;
  onAccept?: () => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, onAccept }) => {
  const { user } = useAuth();
  const isDesigner = user?.role === 'designer';
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [previewAsset, setPreviewAsset] = useState<{name: string, url: string} | null>(null);
  const [messageCollapsed, setMessageCollapsed] = useState(true);
  const [message, setMessage] = useState('');
  
  // Mock description with rich text formatting
  const richDescription = task.description.length > 100
    ? task.description
    : `<p>${task.description}</p><p>We need a <strong>professional design</strong> that captures our brand's <em>essence</em> and appeal.</p><ul><li>Clean and modern aesthetic</li><li>Aligned with brand guidelines</li><li>Easy to recognize</li></ul><p>Please see our <a href="#" class="text-blue-500 underline">brand inspiration board</a> for additional context.</p>`;

  // Mock client data with response rate
  const clientData = {
    name: "Client J.",
    tasksPosted: 12,
    averageRating: 4.8,
    reviewCount: 10,
    responseRate: "90% within 24h"
  };

  // Specific requirements with file format clarity
  const requirements = {
    dimensions: task.dimensions,
    colorScheme: task.colorScheme || "No preference", 
    fileFormat: task.fileFormat,
    acceptedFormats: "PNG required, SVG optional",
    estimatedEffort: "Medium: ~3 hours"
  };

  // Mock assets for preview
  const assets = [
    { name: "brand-guidelines.pdf", size: "1.2 MB", type: "document" },
    { name: "inspiration-sketch.jpg", size: "450 KB", type: "image", url: "https://placehold.co/600x400" }
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

  const handleAcceptClick = () => {
    setConfirmOpen(true);
  };

  const handleConfirmAccept = () => {
    setConfirmOpen(false);
    if (onAccept) onAccept();
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

      {/* Estimated effort section */}
      <div className="bg-gray-50 p-3 rounded">
        <div className="flex items-start">
          <Hourglass className="text-gray-400 mr-2 mt-1 h-4 w-4" />
          <div>
            <span className="text-xs text-gray-500 block">Estimated Effort</span>
            <span className="font-medium text-gray-700">{requirements.estimatedEffort}</span>
          </div>
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
              <span className="block text-xs text-gray-500 mt-1">
                {requirements.acceptedFormats}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Assets section with previews */}
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
                <div className="flex items-center gap-2">
                  {asset.type === "image" && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs"
                      onClick={() => setPreviewAsset({ name: asset.name, url: asset.url })}
                    >
                      Preview
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" className="text-xs">
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Client History section with response rate */}
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
          <div className="mt-1 text-sm text-gray-500 flex items-center">
            <MessageSquare className="h-3 w-3 mr-1 text-blue-500" />
            Response Rate: {clientData.responseRate}
          </div>
        </div>
      </div>

      {/* Pre-acceptance messaging */}
      {isDesigner && task.status === 'pending' && (
        <Collapsible open={!messageCollapsed} onOpenChange={setMessageCollapsed} className="border rounded-md">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between flex items-center p-3 bg-gray-50">
              <span className="text-sm font-medium">Ask a question before accepting (max 3)</span>
              <span className="text-xs text-gray-500">{messageCollapsed ? 'Show' : 'Hide'}</span>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="p-3">
            <div className="space-y-3">
              <textarea
                className="w-full p-2 border rounded-md text-sm"
                rows={3}
                placeholder="Ask a question about this task..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <div className="flex justify-end">
                <Button size="sm" className="bg-primary hover:bg-primary-dark">Send Question</Button>
              </div>
              <div className="text-xs text-gray-500">
                You can send up to 3 messages before accepting this task.
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Flag as incomplete */}
      {isDesigner && task.status === 'pending' && (
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-orange-500 border-orange-200 hover:bg-orange-50"
          >
            <AlertTriangle className="h-4 w-4 mr-1" />
            Flag Incomplete Brief
          </Button>
        </div>
      )}

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
          <Button onClick={handleAcceptClick} className="bg-primary hover:bg-primary-dark">
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Accept Task
          </Button>
        </div>
      )}

      {/* Confirmation dialog */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              You're about to accept this task. Once accepted, you'll be responsible for completing it by the deadline:
              <span className="block font-medium mt-2 text-primary">
                {format(new Date(task.deadline), 'PPP, p')}
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAccept}>Accept Task</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Asset preview modal - simple implementation */}
      {previewAsset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">{previewAsset.name}</h3>
              <Button variant="ghost" size="sm" onClick={() => setPreviewAsset(null)}>Close</Button>
            </div>
            <div className="flex justify-center">
              <img src={previewAsset.url} alt={previewAsset.name} className="max-w-full max-h-[70vh]" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDetailModal;
