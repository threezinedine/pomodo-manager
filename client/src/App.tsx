import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CalendarPage } from './pages/Calendar';
import { LoginPage } from './pages/Login';
import { ReportsPage } from './pages/Reports';
import { RegisterPage } from './pages/Register';
import { SettingsPage } from './pages/Settings';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ToastContainer } from './components/Toast';

// TODO: replace with actual auth store state
const isAuthenticated = false;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public — auth pages (no layout, no protection) */}
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected — authenticated pages wrapped in Layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Layout isAuthenticated={isAuthenticated}>
                <CalendarPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Layout isAuthenticated={isAuthenticated}>
                <ReportsPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Layout isAuthenticated={isAuthenticated}>
                <SettingsPage />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
      {/* ToastContainer — always mounted once, handles its own visibility */}
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
