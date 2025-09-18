import React from 'react';
import { Task } from '../../../types/task';
import TaskItem from '../TaskItem/TaskItem';
import LoadingSpinner from '../../common/LoadingSpinner/LoadingSpinner';
import { classNames } from '../../../utils/helpers';

export interface TaskListProps {
  tasks: Task[];
  loading?: boolean;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => Promise<void>;
  onTaskDelete: (taskId: string) => Promise<void>;
  emptyMessage?: string;
  className?: string;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  loading = false,
  onTaskUpdate,
  onTaskDelete,
  emptyMessage = 'No tasks found',
  className = '',
}) => {
  if (loading) {
    return (
      <div className={classNames('flex justify-center items-center py-12', className)}>
        <LoadingSpinner size="lg" label="Loading tasks..." />
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className={classNames('text-center py-12', className)}>
        <div className="text-gray-500 text-lg mb-2">📋</div>
        <p className="text-gray-600 text-sm">{emptyMessage}</p>
      </div>
    );
  }

  const handleToggleComplete = async (taskId: string, completed: boolean) => {
    await onTaskUpdate(taskId, { completed });
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    await onTaskUpdate(taskId, updates);
  };

  const handleDeleteTask = async (taskId: string) => {
    await onTaskDelete(taskId);
  };

  return (
    <div className={classNames('space-y-3', className)}>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={handleToggleComplete}
          onUpdate={handleUpdateTask}
          onDelete={handleDeleteTask}
        />
      ))}
    </div>
  );
};

export default TaskList;