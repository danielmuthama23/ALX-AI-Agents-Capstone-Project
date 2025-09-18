import React from 'react';
import { useTasks } from '../hooks/useTasks';
import { useAuth } from '../hooks/useAuth';
import StatsOverview from '../components/dashboard/StatsOverview/StatsOverview';
import ActivityFeed from '../components/dashboard/ActivityFeed/ActivityFeed';
import TaskList from '../components/tasks/TaskList/TaskList';
import Button from '../components/common/Button/Button';
import { PlusIcon } from '@heroicons/react/24/outline';
import { classNames } from '../utils/helpers';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { tasks, loading, stats, refetch } = useTasks({
    limit: 5,
    sortBy: 'dueDate',
    sortOrder: 'asc'
  });

  const recentTasks = tasks.slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.username}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's your productivity overview and recent activity.
          </p>
        </div>

        {/* Stats Overview */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Overview</h2>
            <Button
              variant="primary"
              icon={<PlusIcon className="h-4 w-4" />}
              onClick={refetch}
            >
              Refresh Data
            </Button>
          </div>
          <StatsOverview data={stats} loading={loading} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Tasks */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Recent Tasks</h2>
              <Link to="/tasks">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {recentTasks.length > 0 ? (
                <TaskList
                  tasks={recentTasks}
                  loading={loading}
                  onTaskUpdate={async () => {}}
                  onTaskDelete={async () => {}}
                  emptyMessage="No recent tasks"
                />
              ) : (
                <div className="p-6 text-center">
                  <p className="text-gray-500">No tasks yet</p>
                  <Link to="/tasks">
                    <Button variant="primary" className="mt-4">
                      Create Your First Task
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </section>

          {/* Recent Activity */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Recent Activity</h2>
            </div>
            <ActivityFeed
              activities={[
                {
                  id: '1',
                  type: 'created',
                  taskTitle: 'Complete project documentation',
                  timestamp: new Date(Date.now() - 1000 * 60 * 30),
                  user: 'You'
                },
                {
                  id: '2',
                  type: 'completed',
                  taskTitle: 'Review PR #123',
                  timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
                  user: 'You'
                }
              ]}
              loading={loading}
            />
          </section>
        </div>

        {/* Quick Actions */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/tasks?create=new">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                <div className="text-blue-600 mb-3">
                  <PlusIcon className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Create Task</h3>
                <p className="text-sm text-gray-600">Add a new task to your list</p>
              </div>
            </Link>
            
            <Link to="/tasks?filter=due-soon">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                <div className="text-orange-600 mb-3">
                  <PlusIcon className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Due Soon</h3>
                <p className="text-sm text-gray-600">View tasks that are due soon</p>
              </div>
            </Link>
            
            <Link to="/profile">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                <div className="text-green-600 mb-3">
                  <PlusIcon className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Profile</h3>
                <p className="text-sm text-gray-600">Update your account settings</p>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;