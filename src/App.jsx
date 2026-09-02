import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home      from './pages/Home';
import Login     from './pages/Login';
import Dashboard from './pages/Dashboard';

// ── Protected Route wrapper ───────────────────────────────
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-100">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
          <p className="text-primary-600 font-medium">Authenticating…</p>
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/admin/login" replace />;
}

// ── Public-only route (redirect if already logged in) ─────
function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/admin/dashboard" replace /> : children;
}

// ── App ───────────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />

          {/* Admin Login */}
          <Route
            path="/admin/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          {/* Admin Dashboard (protected) */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
