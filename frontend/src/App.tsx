import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { TaskProvider } from './contexts/TaskContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { useAuth } from './hooks/useAuth';
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
import LoadingSpinner from './components/common/LoadingSpinner/LoadingSpinner';
import { classNames } from './utils/helpers';
import './styles/index.css';

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Public route component (redirect to dashboard if already authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />;
};

// Layout component
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {isAuthenticated && <Header />}
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>
      {isAuthenticated && <Footer />}
    </div>
  );
};

function App() {
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
                    <Layout>
                      <Login />
                    </Layout>
                  </PublicRoute>
                } />
                <Route path="/register" element={
                  <PublicRoute>
                    <Layout>
                      <Register />
                    </Layout>
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

                {/* Default route */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                {/* 404 route */}
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
}

export default App;