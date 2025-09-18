import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';
import { AuthProvider } from '../../../contexts/AuthContext';

// Mock the useAuth hook
jest.mock('../../../hooks/useAuth', () => ({
  useAuth: () => ({
    user: {
      id: '1',
      username: 'testuser',
      email: 'test@example.com'
    },
    logout: jest.fn()
  })
}));

// Mock the useNavigate and useLocation hooks
const mockNavigate = jest.fn();
const mockLocation = { pathname: '/dashboard' };

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation
}));

describe('Header Component', () => {
  const renderHeader = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <Header />
        </AuthProvider>
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the header with logo and user info', () => {
    renderHeader();
    
    expect(screen.getByText('TaskFlow AI')).toBeInTheDocument();
    expect(screen.getByText('testuser')).toBeInTheDocument();
  });

  it('toggles mobile menu when menu button is clicked', () => {
    renderHeader();
    
    const menuButton = screen.getByLabelText('Toggle menu');
    fireEvent.click(menuButton);
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Tasks')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('navigates to different routes when menu items are clicked', () => {
    renderHeader();
    
    // Open mobile menu first
    const menuButton = screen.getByLabelText('Toggle menu');
    fireEvent.click(menuButton);
    
    const tasksButton = screen.getByText('Tasks');
    fireEvent.click(tasksButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/tasks');
  });

  it('shows profile dropdown when user icon is clicked', () => {
    renderHeader();
    
    const userButton = screen.getByText('testuser');
    fireEvent.click(userButton);
    
    expect(screen.getByText('Profile Settings')).toBeInTheDocument();
    expect(screen.getByText('Preferences')).toBeInTheDocument();
    expect(screen.getByText('Sign out')).toBeInTheDocument();
  });

  it('highlights active route correctly', () => {
    renderHeader();
    
    const dashboardButton = screen.getByText('Dashboard');
    expect(dashboardButton).toHaveClass('text-blue-600');
  });

  it('calls logout function when sign out is clicked', () => {
    const { useAuth } = require('../../../hooks/useAuth');
    const mockLogout = jest.fn();
    useAuth.mockReturnValue({
      user: { username: 'testuser', email: 'test@example.com' },
      logout: mockLogout
    });

    renderHeader();
    
    const userButton = screen.getByText('testuser');
    fireEvent.click(userButton);
    
    const signOutButton = screen.getByText('Sign out');
    fireEvent.click(signOutButton);
    
    expect(mockLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});