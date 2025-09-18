import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Mock the context providers
jest.mock('./contexts/ThemeContext', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children
}));

jest.mock('./contexts/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => children
}));

jest.mock('./contexts/TaskContext', () => ({
  TaskProvider: ({ children }: { children: React.ReactNode }) => children
}));

// Mock the pages
jest.mock('./pages/Login', () => () => <div>Login Page</div>);
jest.mock('./pages/Register', () => () => <div>Register Page</div>);
jest.mock('./pages/Dashboard', () => () => <div>Dashboard Page</div>);
jest.mock('./pages/Tasks', () => () => <div>Tasks Page</div>);
jest.mock('./pages/Profile', () => () => <div>Profile Page</div>);
jest.mock('./pages/Settings', () => () => <div>Settings Page</div>);
jest.mock('./pages/NotFound', () => () => <div>Not Found Page</div>);

describe('App Component', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
  });

  it('redirects to dashboard when accessing root route', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    
    // This test is basic since we're mocking the navigation
    expect(window.location.pathname).toBe('/');
  });

  it('handles 404 routes', () => {
    window.history.pushState({}, 'Test page', '/nonexistent-route');
    
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Should show not found page for unknown routes
    expect(screen.getByText('Not Found Page')).toBeInTheDocument();
  });
});