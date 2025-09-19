import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RegisterForm from './RegisterForm';
import { AuthProvider } from '../../../contexts/AuthContext';

// Mock the useAuth hook
const mockRegister = jest.fn();
jest.mock('../../../hooks/useAuth', () => ({
  useAuth: () => ({
    register: mockRegister
  })
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

describe('RegisterForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderRegisterForm = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <RegisterForm />
        </AuthProvider>
      </BrowserRouter>
    );
  };

  it('renders registration form correctly', () => {
    renderRegisterForm();

    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument();
    expect(screen.getByText('sign in to your existing account')).toBeInTheDocument();
  });

  it('validates all required fields', async () => {
    renderRegisterForm();

    const submitButton = screen.getByRole('button', { name: 'Create Account' });
    fireEvent.click(submitButton);

    expect(await screen.findByText('Username is required')).toBeInTheDocument();
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
    expect(screen.getByText('Please confirm your password')).toBeInTheDocument();
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('validates username format', async () => {
    renderRegisterForm();

    const usernameInput = screen.getByLabelText('Username');
    const submitButton = screen.getByRole('button', { name: 'Create Account' });

    fireEvent.change(usernameInput, { target: { value: 'ab' } });
    fireEvent.click(submitButton);

    expect(await screen.findByText('Username must be at least 3 characters')).toBeInTheDocument();

    fireEvent.change(usernameInput, { target: { value: 'test user' } });
    fireEvent.click(submitButton);

    expect(await screen.findByText('Username can only contain letters, numbers, and underscores')).toBeInTheDocument();
  });

  it('validates email format', async () => {
    renderRegisterForm();

    const emailInput = screen.getByLabelText('Email address');
    const submitButton = screen.getByRole('button', { name: 'Create Account' });

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);

    expect(await screen.findByText('Email is invalid')).toBeInTheDocument();
  });

  it('validates password strength', async () => {
    renderRegisterForm();

    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Create Account' });

    // Test short password
    fireEvent.change(passwordInput, { target: { value: 'short' } });
    fireEvent.click(submitButton);

    expect(await screen.findByText('Password must be at least 6 characters')).toBeInTheDocument();

    // Test weak password (no uppercase)
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    expect(await screen.findByText('Password must contain at least one uppercase letter, one lowercase letter, and one number')).toBeInTheDocument();
  });

  it('validates password confirmation', async () => {
    renderRegisterForm();

    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: 'Create Account' });

    fireEvent.change(passwordInput, { target: { value: 'Password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'Different123' } });
    fireEvent.click(submitButton);

    expect(await screen.findByText('Passwords do not match')).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    mockRegister.mockResolvedValueOnce({});

    renderRegisterForm();

    const usernameInput = screen.getByLabelText('Username');
    const emailInput = screen.getByLabelText('Email address');
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: 'Create Account' });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'Password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith('testuser', 'test@example.com', 'Password123');
    });
  });

  it('handles registration failure', async () => {
    const errorMessage = 'Email already exists';
    mockRegister.mockRejectedValueOnce({
      response: { data: { message: errorMessage } }
    });

    renderRegisterForm();

    const usernameInput = screen.getByLabelText('Username');
    const emailInput = screen.getByLabelText('Email address');
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: 'Create Account' });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'Password123' } });
    fireEvent.click(submitButton);

    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
  });

  it('shows password strength indicators', async () => {
    renderRegisterForm();

    const passwordInput = screen.getByLabelText('Password');

    // Initially, all indicators should be gray
    expect(screen.getByText('At least 6 characters')).toHaveClass('text-gray-600');
    expect(screen.getByText('One uppercase letter')).toHaveClass('text-gray-600');
    expect(screen.getByText('One lowercase letter')).toHaveClass('text-gray-600');
    expect(screen.getByText('One number')).toHaveClass('text-gray-600');

    // Enter a strong password
    fireEvent.change(passwordInput, { target: { value: 'Password123' } });

    // All indicators should turn green
    expect(screen.getByText('At least 6 characters')).toHaveClass('text-green-600');
    expect(screen.getByText('One uppercase letter')).toHaveClass('text-green-600');
    expect(screen.getByText('One lowercase letter')).toHaveClass('text-green-600');
    expect(screen.getByText('One number')).toHaveClass('text-green-600');
  });

  it('enables submit button only when password is strong', async () => {
    renderRegisterForm();

    const usernameInput = screen.getByLabelText('Username');
    const emailInput = screen.getByLabelText('Email address');
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: 'Create Account' });

    // Fill all fields except use weak password
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'weak' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'weak' } });

    expect(submitButton).toBeDisabled();

    // Use strong password
    fireEvent.change(passwordInput, { target: { value: 'Password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'Password123' } });

    expect(submitButton).not.toBeDisabled();
  });

  it('toggles password visibility', () => {
    renderRegisterForm();

    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const toggleButtons = screen.getAllByRole('button', { name: '' });

    // Password should be hidden by default
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');

    // Click to show password
    fireEvent.click(toggleButtons[0]);
    expect(passwordInput).toHaveAttribute('type', 'text');

    // Click to show confirm password
    fireEvent.click(toggleButtons[1]);
    expect(confirmPasswordInput).toHaveAttribute('type', 'text');
  });
});