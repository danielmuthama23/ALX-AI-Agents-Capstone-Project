import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskFilters from './TaskFilters';
import { TaskPriority, TaskStatus } from '../../../types/task';

const mockFilters = {
  status: TaskStatus.PENDING,
  priority: TaskPriority.HIGH,
  category: 'work',
  search: 'test'
};

const mockOnFiltersChange = jest.fn();
const mockAvailableCategories = ['work', 'personal', 'shopping'];

describe('TaskFilters Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all filter controls', () => {
    render(
      <TaskFilters
        filters={{}}
        onFiltersChange={mockOnFiltersChange}
        availableCategories={mockAvailableCategories}
      />
    );

    expect(screen.getByPlaceholderText('Search tasks...')).toBeInTheDocument();
    expect(screen.getByLabelText('Status')).toBeInTheDocument();
    expect(screen.getByLabelText('Priority')).toBeInTheDocument();
    expect(screen.getByLabelText('Category')).toBeInTheDocument();
  });

  it('displays active filters with badges', () => {
    render(
      <TaskFilters
        filters={mockFilters}
        onFiltersChange={mockOnFiltersChange}
        availableCategories={mockAvailableCategories}
      />
    );

    expect(screen.getByText('Status: Pending')).toBeInTheDocument();
    expect(screen.getByText('Priority: High')).toBeInTheDocument();
    expect(screen.getByText('Category: work')).toBeInTheDocument();
    expect(screen.getByText('Search: "test"')).toBeInTheDocument();
  });

  it('calls onFiltersChange when filters are modified', () => {
    render(
      <TaskFilters
        filters={{}}
        onFiltersChange={mockOnFiltersChange}
        availableCategories={mockAvailableCategories}
      />
    );

    // Change status filter
    fireEvent.change(screen.getByLabelText('Status'), {
      target: { value: TaskStatus.COMPLETED }
    });

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      status: TaskStatus.COMPLETED
    });

    // Change search filter
    fireEvent.change(screen.getByPlaceholderText('Search tasks...'), {
      target: { value: 'new search' }
    });

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      search: 'new search'
    });
  });

  it('clears individual filters when badge close button is clicked', () => {
    render(
      <TaskFilters
        filters={mockFilters}
        onFiltersChange={mockOnFiltersChange}
        availableCategories={mockAvailableCategories}
      />
    );

    // Clear status filter
    const statusBadge = screen.getByText('Status: Pending');
    const closeButton = statusBadge.parentElement?.querySelector('button');
    if (closeButton) {
      fireEvent.click(closeButton);
    }

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      priority: TaskPriority.HIGH,
      category: 'work',
      search: 'test'
    });
  });

  it('clears all filters when clear all button is clicked', () => {
    render(
      <TaskFilters
        filters={mockFilters}
        onFiltersChange={mockOnFiltersChange}
        availableCategories={mockAvailableCategories}
      />
    );

    const clearAllButton = screen.getByText('Clear All');
    fireEvent.click(clearAllButton);

    expect(mockOnFiltersChange).toHaveBeenCalledWith({});
  });

  it('does not show clear all button when no filters are active', () => {
    render(
      <TaskFilters
        filters={{}}
        onFiltersChange={mockOnFiltersChange}
        availableCategories={mockAvailableCategories}
      />
    );

    expect(screen.queryByText('Clear All')).not.toBeInTheDocument();
  });

  it('populates category dropdown with available categories', () => {
    render(
      <TaskFilters
        filters={{}}
        onFiltersChange={mockOnFiltersChange}
        availableCategories={mockAvailableCategories}
      />
    );

    const categorySelect = screen.getByLabelText('Category');
    expect(categorySelect).toHaveTextContent('work');
    expect(categorySelect).toHaveTextContent('personal');
    expect(categorySelect).toHaveTextContent('shopping');
  });
});