import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskItem from './TaskItem';
import { Task, TaskPriority } from '../../../types/task';

const mockTask: Task = {
  id: '1',
  title: 'Test Task',
  description: 'Test description',
  priority: TaskPriority.HIGH,
  category: 'work',
  completed: false,
  dueDate: new Date('2023-12-31'),
  createdAt: new Date('2023-12-01'),
  updatedAt: new Date('2023-12-01'),
  userId: 'user1'
};

const mockOnToggleComplete = jest.fn();
const mockOnUpdate = jest.fn();
const mockOnDelete = jest.fn();

describe('TaskItem Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders task details correctly', () => {
    render(
      <TaskItem
        task={mockTask}
        onToggleComplete={mockOnToggleComplete}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('work')).toBeInTheDocument();
    expect(screen.getByText('high')).toBeInTheDocument();
  });

  it('calls onToggleComplete when checkbox is clicked', () => {
    render(
      <TaskItem
        task={mockTask}
        onToggleComplete={mockOnToggleComplete}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    const completeButton = screen.getByTitle('Mark as complete');
    fireEvent.click(completeButton);
    
    expect(mockOnToggleComplete).toHaveBeenCalledWith('1', true);
  });

  it('enters edit mode when edit button is clicked', () => {
    render(
      <TaskItem
        task={mockTask}
        onToggleComplete={mockOnToggleComplete}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    const editButton = screen.getByTitle('Edit task');
    fireEvent.click(editButton);
    
    expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test description')).toBeInTheDocument();
  });

  it('calls onUpdate when saving edits', async () => {
    render(
      <TaskItem
        task={mockTask}
        onToggleComplete={mockOnToggleComplete}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    // Enter edit mode
    const editButton = screen.getByTitle('Edit task');
    fireEvent.click(editButton);

    // Change title
    const titleInput = screen.getByDisplayValue('Test Task');
    fireEvent.change(titleInput, { target: { value: 'Updated Task' } });

    // Save changes
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    expect(mockOnUpdate).toHaveBeenCalledWith('1', {
      title: 'Updated Task',
      description: 'Test description'
    });
  });

  it('calls onDelete when delete button is clicked', () => {
    render(
      <TaskItem
        task={mockTask}
        onToggleComplete={mockOnToggleComplete}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    const deleteButton = screen.getByTitle('Delete task');
    fireEvent.click(deleteButton);
    
    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });

  it('shows overdue status for overdue tasks', () => {
    const overdueTask: Task = {
      ...mockTask,
      dueDate: new Date('2020-01-01'),
      completed: false
    };

    render(
      <TaskItem
        task={overdueTask}
        onToggleComplete={mockOnToggleComplete}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('(Overdue)')).toBeInTheDocument();
  });

  it('shows completed tasks with line-through', () => {
    const completedTask: Task = {
      ...mockTask,
      completed: true
    };

    render(
      <TaskItem
        task={completedTask}
        onToggleComplete={mockOnToggleComplete}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    const title = screen.getByText('Test Task');
    expect(title).toHaveClass('line-through');
  });
});