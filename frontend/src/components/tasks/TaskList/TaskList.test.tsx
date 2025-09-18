import React from 'react';
import { render, screen } from '@testing-library/react';
import TaskList from './TaskList';
import { Task, TaskPriority, TaskStatus } from '../../../types/task';

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Test Task 1',
    description: 'Test description 1',
    priority: TaskPriority.HIGH,
    category: 'work',
    completed: false,
    dueDate: new Date('2023-12-31'),
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2023-12-01'),
    userId: 'user1'
  },
  {
    id: '2',
    title: 'Test Task 2',
    description: 'Test description 2',
    priority: TaskPriority.MEDIUM,
    category: 'personal',
    completed: true,
    dueDate: new Date('2023-12-25'),
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2023-12-01'),
    userId: 'user1'
  }
];

const mockOnTaskUpdate = jest.fn();
const mockOnTaskDelete = jest.fn();

describe('TaskList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state', () => {
    render(
      <TaskList
        tasks={[]}
        loading={true}
        onTaskUpdate={mockOnTaskUpdate}
        onTaskDelete={mockOnTaskDelete}
      />
    );

    expect(screen.getByLabelText('Loading tasks...')).toBeInTheDocument();
  });

  it('renders empty state message', () => {
    render(
      <TaskList
        tasks={[]}
        loading={false}
        onTaskUpdate={mockOnTaskUpdate}
        onTaskDelete={mockOnTaskDelete}
        emptyMessage="No tasks available"
      />
    );

    expect(screen.getByText('No tasks available')).toBeInTheDocument();
  });

  it('renders list of tasks', () => {
    render(
      <TaskList
        tasks={mockTasks}
        loading={false}
        onTaskUpdate={mockOnTaskUpdate}
        onTaskDelete={mockOnTaskDelete}
      />
    );

    expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    expect(screen.getByText('Test Task 2')).toBeInTheDocument();
    expect(screen.getByText('work')).toBeInTheDocument();
    expect(screen.getByText('personal')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <TaskList
        tasks={mockTasks}
        loading={false}
        onTaskUpdate={mockOnTaskUpdate}
        onTaskDelete={mockOnTaskDelete}
        className="custom-class"
      />
    );

    const taskList = screen.getByText('Test Task 1').closest('div');
    expect(taskList).toHaveClass('custom-class');
  });
});