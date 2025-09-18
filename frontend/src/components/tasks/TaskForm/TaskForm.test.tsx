import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskForm from './TaskForm';
import { Task, TaskPriority } from '../../../types/task';

const mockOnSubmit = jest.fn();
const mockOnCancel = jest.fn();

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

describe('TaskForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders empty form for new task', () => {
    render(
      <TaskForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByPlaceholderText('Enter task title')).toBeInTheDocument();
    expect(screen.getByText('Create Task')).toBeInTheDocument();
  });

  it('renders pre-filled form for editing', () => {
    render(
      <TaskForm
        initialData={mockTask}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        submitButtonText="Update Task"
      />
    );

    expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test description')).toBeInTheDocument();
    expect(screen.getByDisplayValue('high')).toBeInTheDocument();
    expect(screen.getByDisplayValue('work')).toBeInTheDocument();
    expect(screen.getByText('Update Task')).toBeInTheDocument();
  });

  it('calls onSubmit with form data', async () => {
    render(
      <TaskForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText('Enter task title'), {
      target: { value: 'New Task' }
    });
    
    fireEvent.change(screen.getByPlaceholderText('Enter task description (optional)'), {
      target: { value: 'New description' }
    });
    
    fireEvent.change(screen.getByLabelText('Priority'), {
      target: { value: TaskPriority.HIGH }
    });
    
    fireEvent.change(screen.getByLabelText('Category'), {
      target: { value: 'work' }
    });
    
    fireEvent.change(screen.getByLabelText('Due Date'), {
      target: { value: '2023-12-31' }
    });

    // Submit the form
    fireEvent.click(screen.getByText('Create Task'));

    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: 'New Task',
      description: 'New description',
      priority: TaskPriority.HIGH,
      category: 'work',
      dueDate: new Date('2023-12-31')
    });
  });

  it('requires title field', () => {
    render(
      <TaskForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const submitButton = screen.getByText('Create Task');
    expect(submitButton).toBeDisabled();

    // Fill only title
    fireEvent.change(screen.getByPlaceholderText('Enter task title'), {
      target: { value: 'New Task' }
    });

    expect(submitButton).not.toBeDisabled();
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(
      <TaskForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('disables form fields when loading', () => {
    render(
      <TaskForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        loading={true}
      />
    );

    expect(screen.getByPlaceholderText('Enter task title')).toBeDisabled();
    expect(screen.getByText('Create Task')).toBeDisabled();
  });
});