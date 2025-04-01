
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { CalendarIcon, FilterX } from 'lucide-react';
import { TaskCategory } from '@/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface TaskFiltersProps {
  onFilter: (
    category?: TaskCategory,
    minAmount?: number,
    maxAmount?: number,
    deadline?: Date
  ) => void;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({ onFilter }) => {
  const { register, handleSubmit, reset } = useForm();
  const [category, setCategory] = useState<TaskCategory | undefined>(undefined);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [date, setDate] = useState<Date | undefined>(undefined);

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
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>Filter Tasks</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleReset}
            className="h-8 px-2 text-xs"
          >
            <FilterX className="h-3.5 w-3.5 mr-1" />
            Reset
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select 
            value={category} 
            onValueChange={(value) => setCategory(value as TaskCategory || undefined)}
          >
            <SelectTrigger id="category">
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

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>Price Range</Label>
            <span className="text-sm text-gray-500">
              ${priceRange[0]} - ${priceRange[1]}
            </span>
          </div>
          
          <Slider
            variant="range"
            value={[priceRange[0], priceRange[1]]}
            min={0}
            max={200}
            step={5}
            onValueChange={(value) => setPriceRange([value[0], value[1]])}
            className="py-4"
          />
        </div>

        <div className="space-y-2">
          <Label>Deadline</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
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

        <Button 
          onClick={handleFilter} 
          className="w-full bg-primary hover:bg-primary-dark"
        >
          Apply Filters
        </Button>
      </CardContent>
    </Card>
  );
};

export default TaskFilters;
