import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { TaskProvider } from './contexts/TaskContext';
import { ThemeProvider } from './contexts/ThemeContext';
import {
  Login,
  Register,
  Dashboard,
  Tasks,
  Profile,
  Settings,
  NotFound
} from './pages';
import Header from './components/common/Header/Header';
import Footer from './components/common/Footer/Footer';
import { useAuth } from './hooks/useAuth';
import { useTheme } from './hooks/useTheme';
import { classNames } from './utils/helpers';
import './styles/index.css';
import './assets/styles/fonts.css';

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Public route component (redirect if authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />;
};

// Layout component
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { resolvedTheme } = useTheme();

  return (
    <div className={classNames(
      'min-h-screen bg-gray-50 transition-colors duration-200',
      resolvedTheme === 'dark' ? 'dark-theme' : 'light-theme'
    )}>
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TaskProvider>
          <Router>
            <div className="App">
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } />
                <Route path="/register" element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                } />

                {/* Protected routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/tasks" element={
                  <ProtectedRoute>
                    <Layout>
                      <Tasks />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Layout>
                      <Profile />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <Layout>
                      <Settings />
                    </Layout>
                  </ProtectedRoute>
                } />

                {/* Redirect root to dashboard */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                {/* 404 page */}
                <Route path="*" element={
                  <Layout>
                    <NotFound />
                  </Layout>
                } />
              </Routes>
            </div>
          </Router>
        </TaskProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;