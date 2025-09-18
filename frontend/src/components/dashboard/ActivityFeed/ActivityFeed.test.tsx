import React from 'react';
import { render, screen } from '@testing-library/react';
import ActivityFeed from './ActivityFeed';
import { ActivityItem } from './ActivityFeed';

const mockActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'created',
    taskTitle: 'Complete project documentation',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    user: 'John Doe',
    details: 'Added detailed requirements'
  },
  {
    id: '2',
    type: 'completed',
    taskTitle: 'Review PR #123',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    user: 'Jane Smith'
  },
  {
    id: '3',
    type: 'updated',
    taskTitle: 'Update landing page',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    user: 'Mike Johnson',
    details: 'Changed hero section'
  },
  {
    id: '4',
    type: 'deleted',
    taskTitle: 'Old meeting notes',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    user: 'Sarah Wilson'
  }
];

describe('ActivityFeed Component', () => {
  it('renders loading state correctly', () => {
    render(<ActivityFeed activities={[]} loading={true} />);
    
    // Should show skeleton loaders
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    expect(screen.getAllByTestId('skeleton-loader').length).toBeGreaterThan(0);
  });

  it('renders empty state correctly', () => {
    render(<ActivityFeed activities={[]} loading={false} />);
    
    expect(screen.getByText('No recent activity')).toBeInTheDocument();
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
  });

  it('displays activities with correct icons and colors', () => {
    render(<ActivityFeed activities={mockActivities} loading={false} />);
    
    // Check that all activities are displayed
    expect(screen.getByText('John Doe created task "Complete project documentation"')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith completed task "Review PR #123"')).toBeInTheDocument();
    expect(screen.getByText('Mike Johnson updated task "Update landing page"')).toBeInTheDocument();
    expect(screen.getByText('Sarah Wilson deleted task "Old meeting notes"')).toBeInTheDocument();
  });

  it('shows activity details when available', () => {
    render(<ActivityFeed activities={mockActivities} loading={false} />);
    
    expect(screen.getByText('Added detailed requirements')).toBeInTheDocument();
    expect(screen.getByText('Changed hero section')).toBeInTheDocument();
  });

  it('formats timestamps correctly', () => {
    render(<ActivityFeed activities={mockActivities} loading={false} />);
    
    // Should show relative time
    expect(screen.getByText('5m ago')).toBeInTheDocument();
    expect(screen.getByText('30m ago')).toBeInTheDocument();
    expect(screen.getByText('2h ago')).toBeInTheDocument();
    expect(screen.getByText('1d ago')).toBeInTheDocument();
  });

  it('limits displayed activities when maxItems is set', () => {
    render(<ActivityFeed activities={mockActivities} loading={false} maxItems={2} />);
    
    // Should only show first 2 activities
    expect(screen.getByText('John Doe created task "Complete project documentation"')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith completed task "Review PR #123"')).toBeInTheDocument();
    expect(screen.queryByText('Mike Johnson updated task "Update landing page"')).not.toBeInTheDocument();
  });

  it('shows item count when there are more activities than maxItems', () => {
    render(<ActivityFeed activities={mockActivities} loading={false} maxItems={2} />);
    
    expect(screen.getByText('Showing 2 of 4 activities')).toBeInTheDocument();
  });

  it('uses "You" when no user is specified', () => {
    const activitiesWithNoUser: ActivityItem[] = [
      {
        id: '1',
        type: 'created',
        taskTitle: 'New Task',
        timestamp: new Date(),
        // user is undefined
      }
    ];
    
    render(<ActivityFeed activities={activitiesWithNoUser} loading={false} />);
    
    expect(screen.getByText('You created task "New Task"')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <ActivityFeed 
        activities={mockActivities} 
        loading={false} 
        className="custom-activity-feed" 
      />
    );
    
    const container = screen.getByText('Recent Activity').closest('div');
    expect(container).toHaveClass('custom-activity-feed');
  });

  it('uses custom empty message', () => {
    render(
      <ActivityFeed 
        activities={[]} 
        loading={false} 
        emptyMessage="No activities found" 
      />
    );
    
    expect(screen.getByText('No activities found')).toBeInTheDocument();
  });
});