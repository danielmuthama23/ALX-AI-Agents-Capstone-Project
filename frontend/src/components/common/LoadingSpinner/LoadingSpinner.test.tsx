import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner Component', () => {
  it('renders with default props', () => {
    render(<LoadingSpinner />);
    
    const spinner = screen.getByLabelText('Loading...');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('h-6 w-6');
    expect(spinner).toHaveClass('text-blue-600');
    expect(spinner).toHaveClass('animate-spin');
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<LoadingSpinner size="sm" />);
    expect(screen.getByLabelText('Loading...')).toHaveClass('h-4 w-4');

    rerender(<LoadingSpinner size="lg" />);
    expect(screen.getByLabelText('Loading...')).toHaveClass('h-8 w-8');

    rerender(<LoadingSpinner size="xl" />);
    expect(screen.getByLabelText('Loading...')).toHaveClass('h-12 w-12');
  });

  it('renders with different variants', () => {
    const { rerender } = render(<LoadingSpinner variant="primary" />);
    expect(screen.getByLabelText('Loading...')).toHaveClass('text-blue-600');

    rerender(<LoadingSpinner variant="secondary" />);
    expect(screen.getByLabelText('Loading...')).toHaveClass('text-gray-600');

    rerender(<LoadingSpinner variant="white" />);
    expect(screen.getByLabelText('Loading...')).toHaveClass('text-white');

    rerender(<LoadingSpinner variant="gray" />);
    expect(screen.getByLabelText('Loading...')).toHaveClass('text-gray-400');
  });

  it('renders with custom label', () => {
    render(<LoadingSpinner label="Processing..." />);
    
    expect(screen.getByLabelText('Processing...')).toBeInTheDocument();
    expect(screen.getByText('Processing...')).toBeInTheDocument();
  });

  it('hides label when label prop is empty', () => {
    render(<LoadingSpinner label="" />);
    
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<LoadingSpinner className="custom-spinner" />);
    
    const container = screen.getByRole('img').parentElement;
    expect(container).toHaveClass('custom-spinner');
  });

  it('has proper accessibility attributes', () => {
    render(<LoadingSpinner />);
    
    const spinner = screen.getByRole('img');
    expect(spinner).toHaveAttribute('aria-label', 'Loading...');
  });
});