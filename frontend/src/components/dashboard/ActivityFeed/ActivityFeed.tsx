import React from 'react';
import { classNames } from '../../../utils/helpers';
import {
  CheckCircleIcon,
  PlusCircleIcon,
  PencilSquareIcon,
  TrashIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

export interface ActivityItem {
  id: string;
  type: 'created' | 'completed' | 'updated' | 'deleted';
  taskTitle: string;
  timestamp: Date;
  user?: string;
  details?: string;
}

export interface ActivityFeedProps {
  activities: ActivityItem[];
  loading?: boolean;
  className?: string;
  emptyMessage?: string;
  maxItems?: number;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activities,
  loading = false,
  className = '',
  emptyMessage = 'No recent activity',
  maxItems = 10
}) => {
  const displayedActivities = activities.slice(0, maxItems);

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'created':
        return PlusCircleIcon;
      case 'completed':
        return CheckCircleIcon;
      case 'updated':
        return PencilSquareIcon;
      case 'deleted':
        return TrashIcon;
      default:
        return ClockIcon;
    }
  };

  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'created':
        return 'text-blue-500 bg-blue-100';
      case 'completed':
        return 'text-green-500 bg-green-100';
      case 'updated':
        return 'text-yellow-500 bg-yellow-100';
      case 'deleted':
        return 'text-red-500 bg-red-100';
      default:
        return 'text-gray-500 bg-gray-100';
    }
  };

  const getActivityText = (activity: ActivityItem) => {
    const user = activity.user || 'You';
    const task = `"${activity.taskTitle}"`;

    switch (activity.type) {
      case 'created':
        return `${user} created task ${task}`;
      case 'completed':
        return `${user} completed task ${task}`;
      case 'updated':
        return `${user} updated task ${task}`;
      case 'deleted':
        return `${user} deleted task ${task}`;
      default:
        return `${user} modified task ${task}`;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    }
    
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className={classNames('animate-pulse', className)}>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={classNames('bg-white rounded-lg shadow-sm border border-gray-200', className)}>
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
      </div>

      <div className="p-6">
        {displayedActivities.length === 0 ? (
          <div className="text-center py-8">
            <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">{emptyMessage}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedActivities.map((activity) => {
              const Icon = getActivityIcon(activity.type);
              return (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={classNames('p-2 rounded-full', getActivityColor(activity.type))}>
                    <Icon className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {getActivityText(activity)}
                    </p>
                    
                    {activity.details && (
                      <p className="text-sm text-gray-600 mt-1">{activity.details}</p>
                    )}
                    
                    <p className="text-xs text-gray-500 mt-1">
                      {formatTime(new Date(activity.timestamp))}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {activities.length > maxItems && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600 text-center">
            Showing {maxItems} of {activities.length} activities
          </p>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;