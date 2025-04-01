
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { TaskCategory } from '@/types';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, FilterX, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface HorizontalTaskFiltersProps {
  onFilter: (
    category?: TaskCategory,
    minAmount?: number,
    maxAmount?: number,
    deadline?: Date
  ) => void;
  initialFilters?: {
    category?: TaskCategory;
    minAmount?: number;
    maxAmount?: number;
    deadline?: string;
  };
}

const HorizontalTaskFilters: React.FC<HorizontalTaskFiltersProps> = ({ onFilter, initialFilters }) => {
  const { reset } = useForm();
  const [category, setCategory] = useState<TaskCategory | undefined>(initialFilters?.category);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    initialFilters?.minAmount ?? 0, 
    initialFilters?.maxAmount ?? 200
  ]);
  const [date, setDate] = useState<Date | undefined>(
    initialFilters?.deadline ? new Date(initialFilters.deadline) : undefined
  );
  const [isExpanded, setIsExpanded] = useState(false);

  // Apply initial filters on mount if they exist
  useEffect(() => {
    if (initialFilters && Object.keys(initialFilters).length > 0) {
      setIsExpanded(true);
    }
  }, [initialFilters]);

  const handleReset = () => {
    setCategory(undefined);
    setPriceRange([0, 200]);
    setDate(undefined);
    reset();
    onFilter();
  };

  const handleFilter = () => {
    onFilter(
      category,
      priceRange[0],
      priceRange[1],
      date
    );
    setIsExpanded(false);
  };

  return (
    <div className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">Filter Tasks</h2>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 h-8 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"
              aria-expanded={isExpanded}
              aria-controls="filter-panel"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span className="text-xs">{isExpanded ? 'Hide Filters' : 'Show Filters'}</span>
            </Button>
            
            {(category || priceRange[0] > 0 || priceRange[1] < 200 || date) && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleReset}
                className="h-8 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                aria-label="Reset filters"
              >
                <FilterX className="h-3.5 w-3.5 mr-1" />
                Reset
              </Button>
            )}
          </div>
        </div>
        
        {isExpanded && (
          <div 
            id="filter-panel" 
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pb-4 border-t border-gray-100 dark:border-gray-800 pt-4"
          >
            <div>
              <Label htmlFor="category" className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">Category</Label>
              <Select 
                value={category} 
                onValueChange={(value) => setCategory(value as TaskCategory || undefined)}
              >
                <SelectTrigger id="category" className="w-full border-gray-200 dark:border-gray-700 h-8 text-sm">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  <SelectItem value="logo">Logo Design</SelectItem>
                  <SelectItem value="banner">Banner Design</SelectItem>
                  <SelectItem value="social-media">Social Media</SelectItem>
                  <SelectItem value="flyer">Flyer</SelectItem>
                  <SelectItem value="business-card">Business Card</SelectItem>
                  <SelectItem value="illustration">Illustration</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="flex justify-between">
                <Label className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">Price Range</Label>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  ${priceRange[0]} - ${priceRange[1]}
                </span>
              </div>
              <Slider
                value={[priceRange[0], priceRange[1]]}
                min={0}
                max={200}
                step={5}
                onValueChange={(value) => setPriceRange([value[0], value[1]])}
                className="py-3"
              />
            </div>

            <div>
              <Label className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">Deadline</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-8 text-sm border-gray-200 dark:border-gray-700",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                    {date ? format(date, "PPP") : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-end">
              <Button 
                onClick={handleFilter} 
                className="w-full h-8 text-sm bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HorizontalTaskFilters;
