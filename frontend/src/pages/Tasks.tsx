import React, { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import TaskList from '../components/tasks/TaskList/TaskList';
import TaskForm from '../components/tasks/TaskForm/TaskForm';
import TaskFilters from '../components/tasks/TaskFilters/TaskFilters';
import Button from '../components/common/Button/Button';
import Modal from '../components/common/Modal/Modal';
import { PlusIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { Task, TaskFilters as TaskFiltersType } from '../types/task';

const Tasks: React.FC = () => {
  const {
    tasks,
    loading,
    error,
    filters,
    createTask,
    updateTask,
    deleteTask,
    setFilters,
    refetch
  } = useTasks();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [availableCategories] = useState(['work', 'personal', 'shopping', 'health', 'learning']);

  const handleCreateTask = async (taskData: Partial<Task>) => {
    try {
      await createTask(taskData);
      setIsCreateModalOpen(false);
      await refetch();
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      await updateTask(taskId, updates);
      await refetch();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      await refetch();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleFiltersChange = (newFilters: TaskFiltersType) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
            <p className="text-gray-600 mt-2">
              Manage your tasks and stay organized
            </p>
          </div>
          
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <Button
              variant="outline"
              icon={<FunnelIcon className="h-4 w-4" />}
              onClick={() => setIsFiltersOpen(true)}
            >
              Filters
            </Button>
            
            <Button
              variant="primary"
              icon={<PlusIcon className="h-4 w-4" />}
              onClick={() => setIsCreateModalOpen(true)}
            >
              New Task
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <TaskList
              tasks={tasks}
              loading={loading}
              onTaskUpdate={handleUpdateTask}
              onTaskDelete={handleDeleteTask}
              emptyMessage="No tasks found. Create your first task to get started!"
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Stats</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Tasks</span>
                  <span className="font-semibold">{tasks.length}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Completed</span>
                  <span className="font-semibold text-green-600">
                    {tasks.filter(t => t.completed).length}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pending</span>
                  <span className="font-semibold text-yellow-600">
                    {tasks.filter(t => !t.completed).length}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Tips</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Use filters to find specific tasks</li>
                  <li>• Set due dates to stay on track</li>
                  <li>• Use categories to organize tasks</li>
                  <li>• Mark tasks complete as you finish them</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Create Task Modal */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create New Task"
          size="lg"
        >
          <TaskForm
            onSubmit={handleCreateTask}
            onCancel={() => setIsCreateModalOpen(false)}
          />
        </Modal>

        {/* Filters Modal */}
        <Modal
          isOpen={isFiltersOpen}
          onClose={() => setIsFiltersOpen(false)}
          title="Filter Tasks"
          size="md"
        >
          <TaskFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            availableCategories={availableCategories}
          />
          
          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => {
                setFilters({});
                setIsFiltersOpen(false);
              }}
            >
              Clear All
            </Button>
            <Button
              variant="primary"
              onClick={() => setIsFiltersOpen(false)}
            >
              Apply Filters
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Tasks;