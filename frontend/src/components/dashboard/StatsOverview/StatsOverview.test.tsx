import React from 'react';
import { render, screen } from '@testing-library/react';
import StatsOverview from './StatsOverview';
import { StatsData } from './StatsOverview';

const mockStatsData: StatsData = {
  total: 25,
  completed: 15,
  pending: 10,
  overdue: 3,
  dueSoon: 5,
  completionRate: 60,
  byPriority: [
    { _id: 'high', count: 5 },
    { _id: 'medium', count: 10 },
    { _id: 'low', count: 10 }
  ],
  byCategory: [
    { _id: 'work', count: 12 },
    { _id: 'personal', count: 8 },
    { _id: 'health', count: 5 }
  ],
  insights: 'You\'re doing great! Keep up the good work.'
};

describe('StatsOverview Component', () => {
  it('renders loading state correctly', () => {
    render(<StatsOverview data={mockStatsData} loading={true} />);
    
    // Should show skeleton loaders
    expect(screen.getAllByTestId('skeleton-loader').length).toBeGreaterThan(0);
  });

  it('renders all main statistics', () => {
    render(<StatsOverview data={mockStatsData} loading={false} />);
    
    expect(screen.getByText('25')).toBeInTheDocument(); // Total
    expect(screen.getByText('15')).toBeInTheDocument(); // Completed
    expect(screen.getByText('10')).toBeInTheDocument(); // Pending
    expect(screen.getByText('3')).toBeInTheDocument();  // Overdue
    expect(screen.getByText('5')).toBeInTheDocument();  // Due Soon
  });

  it('displays completion rate with percentage', () => {
    render(<StatsOverview data={mockStatsData} loading={false} />);
    
    expect(screen.getByText('60%')).toBeInTheDocument();
    expect(screen.getByText('15 of 25 tasks completed')).toBeInTheDocument();
  });

  it('shows priority distribution', () => {
    render(<StatsOverview data={mockStatsData} loading={false} />);
    
    expect(screen.getByText('high')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('20%')).toBeInTheDocument(); // 5/25 = 20%
    
    expect(screen.getByText('medium')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('40%')).toBeInTheDocument(); // 10/25 = 40%
  });

  it('displays top categories', () => {
    render(<StatsOverview data={mockStatsData} loading={false} />);
    
    expect(screen.getByText('work')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('48%')).toBeInTheDocument(); // 12/25 = 48%
    
    expect(screen.getByText('personal')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
  });

  it('shows AI insights when available', () => {
    render(<StatsOverview data={mockStatsData} loading={false} />);
    
    expect(screen.getByText('AI Insights')).toBeInTheDocument();
    expect(screen.getByText("You're doing great! Keep up the good work.")).toBeInTheDocument();
  });

  it('handles empty categories gracefully', () => {
    const emptyData: StatsData = {
      ...mockStatsData,
      byCategory: []
    };
    
    render(<StatsOverview data={emptyData} loading={false} />);
    
    expect(screen.getByText('No categories yet')).toBeInTheDocument();
  });

  it('handles zero total tasks', () => {
    const zeroData: StatsData = {
      total: 0,
      completed: 0,
      pending: 0,
      overdue: 0,
      dueSoon: 0,
      completionRate: 0,
      byPriority: [],
      byCategory: [],
      insights: ''
    };
    
    render(<StatsOverview data={zeroData} loading={false} />);
    
    expect(screen.getByText('0')).toBeInTheDocument(); // Total
    expect(screen.getByText('0%')).toBeInTheDocument(); // Completion rate
  });

  it('applies custom className', () => {
    render(
      <StatsOverview 
        data={mockStatsData} 
        loading={false} 
        className="custom-stats" 
      />
    );
    
    const container = screen.getByText('Total Tasks').closest('div');
    expect(container).toHaveClass('custom-stats');
  });
});