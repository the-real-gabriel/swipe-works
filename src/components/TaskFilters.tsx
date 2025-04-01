
import React from 'react';
import { TaskCategory } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface TaskFiltersProps {
  onFilter: (category?: TaskCategory, minAmount?: number, maxAmount?: number, deadline?: Date) => void;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({ onFilter }) => {
  const [category, setCategory] = React.useState<TaskCategory | undefined>(undefined);
  const [priceRange, setPriceRange] = React.useState<[number, number]>([0, 200]);
  const [deadline, setDeadline] = React.useState<string>('');

  const handleFilter = () => {
    const deadlineDate = deadline ? new Date(deadline) : undefined;
    onFilter(category, priceRange[0], priceRange[1], deadlineDate);
  };

  const clearFilters = () => {
    setCategory(undefined);
    setPriceRange([0, 200]);
    setDeadline('');
    onFilter();
  };

  const categoryOptions: { value: TaskCategory; label: string }[] = [
    { value: 'logo', label: 'Logo Design' },
    { value: 'banner', label: 'Banner' },
    { value: 'social-media', label: 'Social Media Graphics' },
    { value: 'flyer', label: 'Flyer' },
    { value: 'business-card', label: 'Business Card' },
    { value: 'illustration', label: 'Illustration' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <h3 className="font-medium text-lg mb-4">Filter Tasks</h3>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Category</label>
          <Select 
            value={category} 
            onValueChange={(value) => setCategory(value as TaskCategory)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {categoryOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">
            Price Range: ${priceRange[0]} - ${priceRange[1]}
          </label>
          <Slider
            defaultValue={[0, 200]}
            max={200}
            step={5}
            value={priceRange}
            onValueChange={(value) => setPriceRange(value as [number, number])}
            className="my-4"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Deadline Before</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div className="flex gap-2 pt-2">
          <Button 
            onClick={handleFilter} 
            className="flex-1 bg-primary hover:bg-primary-dark"
          >
            Apply Filters
          </Button>
          <Button 
            onClick={clearFilters} 
            variant="outline" 
            className="flex-1"
          >
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskFilters;
