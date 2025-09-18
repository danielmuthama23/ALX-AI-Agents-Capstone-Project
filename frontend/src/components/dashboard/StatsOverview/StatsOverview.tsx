import React from 'react';
import { classNames } from '../../../utils/helpers';
import {
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CalendarDaysIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

export interface StatsData {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  dueSoon: number;
  completionRate: number;
  byPriority: Array<{ _id: string; count: number }>;
  byCategory: Array<{ _id: string; count: number }>;
  insights?: string;
}

export interface StatsOverviewProps {
  data: StatsData;
  loading?: boolean;
  className?: string;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({
  data,
  loading = false,
  className = ''
}) => {
  if (loading) {
    return (
      <div className={classNames('animate-pulse', className)}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-200 rounded-lg p-6 h-32"></div>
          ))}
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Tasks',
      value: data.total,
      icon: ChartBarIcon,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      label: 'Completed',
      value: data.completed,
      icon: CheckCircleIcon,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      label: 'Pending',
      value: data.pending,
      icon: ClockIcon,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600'
    },
    {
      label: 'Overdue',
      value: data.overdue,
      icon: ExclamationTriangleIcon,
      color: 'bg-red-500',
      textColor: 'text-red-600'
    },
    {
      label: 'Due Soon',
      value: data.dueSoon,
      icon: CalendarDaysIcon,
      color: 'bg-orange-500',
      textColor: 'text-orange-600'
    }
  ];

  const priorityDistribution = data.byPriority.reduce((acc, item) => {
    acc[item._id] = item.count;
    return acc;
  }, {} as Record<string, number>);

  const topCategories = data.byCategory
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  return (
    <div className={classNames('space-y-6', className)}>
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
            >
              <div className="flex items-center">
                <div className={classNames('p-2 rounded-lg', stat.color)}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className={classNames('text-2xl font-bold', stat.textColor)}>
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Completion Rate */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Completion Rate</h3>
          <div className="flex items-center justify-center">
            <div className="relative">
              <svg className="w-32 h-32" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#eee"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="3"
                  strokeDasharray={`${data.completionRate}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-900">
                  {Math.round(data.completionRate)}%
                </span>
              </div>
            </div>
          </div>
          <p className="text-center text-sm text-gray-600 mt-2">
            {data.completed} of {data.total} tasks completed
          </p>
        </div>

        {/* Priority Distribution */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Distribution</h3>
          <div className="space-y-3">
            {['high', 'medium', 'low'].map((priority) => (
              <div key={priority} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 capitalize">
                  {priority}
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-gray-900">
                    {priorityDistribution[priority] || 0}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({priorityDistribution[priority] ? Math.round((priorityDistribution[priority] / data.total) * 100) : 0}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Categories</h3>
          <div className="space-y-3">
            {topCategories.map((category) => (
              <div key={category._id} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 capitalize">
                  {category._id}
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-gray-900">
                    {category.count}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({Math.round((category.count / data.total) * 100)}%)
                  </span>
                </div>
              </div>
            ))}
            {topCategories.length === 0 && (
              <p className="text-sm text-gray-500 text-center">No categories yet</p>
            )}
          </div>
        </div>
      </div>

      {/* AI Insights */}
      {data.insights && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="bg-blue-100 p-2 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Insights</h3>
              <p className="text-gray-700 leading-relaxed">{data.insights}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsOverview;