import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

describe('Button Component', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toHaveClass('bg-blue-600');
    expect(button).toHaveClass('text-white');
    expect(button).toHaveClass('px-4 py-2');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('renders with different variants', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-blue-600');

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-gray-600');

    rerender(<Button variant="danger">Danger</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-red-600');

    rerender(<Button variant="outline">Outline</Button>);
    expect(screen.getByRole('button')).toHaveClass('border');
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-3 py-1.5');

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-6 py-3');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not handle click events when disabled', () => {
    const handleClick = jest.fn();
    render(<Button disabled onClick={handleClick}>Disabled</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('does not handle click events when loading', () => {
    const handleClick = jest.fn();
    render(<Button loading onClick={handleClick}>Loading</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('shows loading spinner when loading', () => {
    render(<Button loading>Loading</Button>);
    
    expect(screen.getByRole('button')).toHaveClass('opacity-60');
    expect(screen.getByRole('button')).toHaveTextContent('Loading');
  });

  it('renders with icon on left', () => {
    render(
      <Button icon={<ArrowRightIcon className="h-4 w-4" />} iconPosition="left">
        Next
      </Button>
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Next');
  });

  it('renders with icon on right', () => {
    render(
      <Button icon={<ArrowRightIcon className="h-4 w-4" />} iconPosition="right">
        Next
      </Button>
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Next');
  });

  it('renders full width button', () => {
    render(<Button fullWidth>Full Width</Button>);
    
    expect(screen.getByRole('button')).toHaveClass('w-full');
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('renders with title attribute', () => {
    render(<Button title="Tooltip">Button</Button>);
    
    expect(screen.getByRole('button')).toHaveAttribute('title', 'Tooltip');
  });

  it('renders as submit button', () => {
    render(<Button type="submit">Submit</Button>);
    
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });
});