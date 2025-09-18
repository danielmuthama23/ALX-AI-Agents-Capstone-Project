import React, { useState } from 'react';
import { Task } from '../../../types/task';
import { classNames } from '../../../utils/helpers';
import { 
  CheckCircleIcon,
  ClockIcon,
  CalendarDaysIcon,
  TagIcon,
  PencilIcon,
  TrashIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';
import Button from '../../common/Button/Button';

export interface TaskItemProps {
  task: Task;
  onToggleComplete: (taskId: string, completed: boolean) => Promise<void>;
  onUpdate: (taskId: string, updates: Partial<Task>) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleComplete,
  onUpdate,
  onDelete
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');

  const priorityColors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800'
  };

  const priorityIcons = {
    high: <ArrowUpIcon className="h-3 w-3" />,
    medium: <span className="text-xs">!</span>,
    low: <ArrowDownIcon className="h-3 w-3" />
  };

  const handleToggleComplete = async () => {
    await onToggleComplete(task.id, !task.completed);
  };

  const handleEdit = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (editTitle.trim()) {
      await onUpdate(task.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setIsEditing(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(task.id);
    setIsDeleting(false);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(date));
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

  return (
    <div
      className={classNames(
        'bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow',
        task.completed && 'opacity-60 bg-gray-50',
        isEditing && 'ring-2 ring-blue-500'
      )}
    >
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Task title"
            autoFocus
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Description (optional)"
            rows={3}
          />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-start space-x-3">
          <button
            onClick={handleToggleComplete}
            className="flex-shrink-0 mt-1 p-1 rounded-full hover:bg-gray-100 transition-colors"
            title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
          >
            <CheckCircleIcon
              className={classNames(
                'h-5 w-5',
                task.completed ? 'text-green-500' : 'text-gray-300'
              )}
            />
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3
                className={classNames(
                  'text-sm font-medium truncate',
                  task.completed && 'line-through text-gray-500'
                )}
              >
                {task.title}
              </h3>
              
              <div className="flex items-center space-x-2">
                <span
                  className={classNames(
                    'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                    priorityColors[task.priority]
                  )}
                >
                  {priorityIcons[task.priority]}
                  <span className="ml-1 capitalize">{task.priority}</span>
                </span>
              </div>
            </div>

            {task.description && (
              <p className="text-sm text-gray-600 mb-2 whitespace-pre-wrap">
                {task.description}
              </p>
            )}

            <div className="flex items-center space-x-4 text-xs text-gray-500">
              {task.dueDate && (
                <div className="flex items-center space-x-1">
                  <CalendarDaysIcon className="h-3 w-3" />
                  <span
                    className={classNames(
                      isOverdue && !task.completed && 'text-red-600 font-medium'
                    )}
                  >
                    {formatDate(task.dueDate)}
                    {isOverdue && ' (Overdue)'}
                  </span>
                </div>
              )}

              {task.category && (
                <div className="flex items-center space-x-1">
                  <TagIcon className="h-3 w-3" />
                  <span className="capitalize">{task.category}</span>
                </div>
              )}

              <div className="flex items-center space-x-1">
                <ClockIcon className="h-3 w-3" />
                <span>{formatDate(task.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              icon={<PencilIcon className="h-4 w-4" />}
              onClick={handleEdit}
              title="Edit task"
            />
            
            <Button
              variant="ghost"
              size="sm"
              icon={<TrashIcon className="h-4 w-4" />}
              onClick={handleDelete}
              loading={isDeleting}
              title="Delete task"
              className="text-red-600 hover:text-red-700"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskItem;