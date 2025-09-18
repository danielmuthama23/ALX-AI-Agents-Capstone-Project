import React from 'react';
import { TaskPriority, TaskStatus } from '../../../types/task';
import Button from '../../common/Button/Button';
import { classNames } from '../../../utils/helpers';
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  category?: string;
  search?: string;
}

export interface TaskFiltersProps {
  filters: TaskFilters;
  onFiltersChange: (filters: TaskFilters) => void;
  availableCategories: string[];
  className?: string;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({
  filters,
  onFiltersChange,
  availableCategories,
  className = ''
}) => {
  const statusOptions: { value: TaskStatus; label: string }[] = [
    { value: TaskStatus.PENDING, label: 'Pending' },
    { value: TaskStatus.COMPLETED, label: 'Completed' },
    { value: TaskStatus.OVERDUE, label: 'Overdue' },
    { value: TaskStatus.DUE_SOON, label: 'Due Soon' }
  ];

  const priorityOptions: { value: TaskPriority; label: string }[] = [
    { value: TaskPriority.LOW, label: 'Low' },
    { value: TaskPriority.MEDIUM, label: 'Medium' },
    { value: TaskPriority.HIGH, label: 'High' }
  ];

  const hasActiveFilters = Object.values(filters).some(
    value => value !== undefined && value !== ''
  );

  const handleFilterChange = (key: keyof TaskFilters, value: string | undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value === '' ? undefined : value
    });
  };

  const handleSearchChange = (search: string) => {
    onFiltersChange({
      ...filters,
      search: search || undefined
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  return (
    <div className={classNames('bg-white p-4 rounded-lg border border-gray-200', className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <FunnelIcon className="h-5 w-5 mr-2" />
          Filters
        </h3>
        
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            icon={<XMarkIcon className="h-4 w-4" />}
            onClick={clearAllFilters}
          >
            Clear All
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {/* Search Input */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            type="text"
            id="search"
            value={filters.search || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search tasks..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Status Filter */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value as TaskStatus)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              id="priority"
              value={filters.priority || ''}
              onChange={(e) => handleFilterChange('priority', e.target.value as TaskPriority)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Priorities</option>
              {priorityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              value={filters.category || ''}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {availableCategories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters Badges */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
            {filters.status && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Status: {statusOptions.find(opt => opt.value === filters.status)?.label}
                <button
                  onClick={() => handleFilterChange('status', undefined)}
                  className="ml-1 hover:text-blue-900"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )}
            
            {filters.priority && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Priority: {priorityOptions.find(opt => opt.value === filters.priority)?.label}
                <button
                  onClick={() => handleFilterChange('priority', undefined)}
                  className="ml-1 hover:text-green-900"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )}
            
            {filters.category && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Category: {filters.category}
                <button
                  onClick={() => handleFilterChange('category', undefined)}
                  className="ml-1 hover:text-purple-900"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )}
            
            {filters.search && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Search: "{filters.search}"
                <button
                  onClick={() => handleFilterChange('search', undefined)}
                  className="ml-1 hover:text-gray-900"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskFilters;