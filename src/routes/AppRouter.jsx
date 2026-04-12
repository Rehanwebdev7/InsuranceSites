import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { AuthProvider, useAuth } from '../contexts/AuthRuntimeContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { LeadProvider } from '../contexts/LeadContext';
import { NotificationProvider } from '../contexts/NotificationContext';
import { SettingsProvider } from '../contexts/SettingsContext';

// Layouts
import CustomerLayout from '../layouts/CustomerLayout';
import AdminLayout from '../layouts/AdminLayout';
import AuthLayout from '../layouts/AuthLayout';

// Customer Pages
import Home from '../pages/customer/Home';
import Services from '../pages/customer/Services';
import About from '../pages/customer/About';
import Contact from '../pages/customer/Contact';
import PrivacyPolicy from '../pages/customer/PrivacyPolicy';
import TermsConditions from '../pages/customer/TermsConditions';

// Common
import ErrorBoundary from '../components/common/ErrorBoundary';

// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard';
import AdminLeads from '../pages/admin/Leads';
import AdminLeadDetail from '../pages/admin/LeadDetail';
import AdminServices from '../pages/admin/Services';
import AdminSlider from '../pages/admin/Slider';
import AdminSettings from '../pages/admin/Settings';
import AdminTestimonials from '../pages/admin/Testimonials';
import AdminManagement from '../pages/admin/AdminManagement';
import SetupSuperAdmin from '../pages/admin/SetupSuperAdmin';

// Auth Pages
import Login from '../pages/auth/Login';

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user.role !== 'admin' && user.role !== 'super_admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Permission Guard for individual admin routes
const PermissionGuard = ({ permission, children }) => {
  const { hasPermission } = useAuth();
  if (!hasPermission(permission)) {
    return <Navigate to="/admin" replace />;
  }
  return children;
};

// Super Admin only route guard
const SuperAdminRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  if (!user || user.role !== 'super_admin') {
    return <Navigate to="/admin" replace />;
  }
  return children;
};

// Public Route (redirect if already logged in)
const PublicRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="w-full max-w-md flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to={(user.role === 'admin' || user.role === 'super_admin') ? '/admin' : '/'} replace />;
  }

  return children;
};

const router = createBrowserRouter([
  // Customer Routes
  {
    path: '/',
    element: <CustomerLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'services', element: <Services /> },
      { path: 'about', element: <About /> },
      { path: 'contact', element: <Contact /> },
      { path: 'privacy', element: <PrivacyPolicy /> },
      { path: 'terms', element: <TermsConditions /> },
    ],
  },
  
  // Auth Routes
  {
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        ),
      },
    ],
  },
  
  // Admin Routes
  {
    path: '/admin',
    element: (
      <ProtectedRoute requireAdmin>
        <LeadProvider>
          <NotificationProvider>
            <AdminLayout />
          </NotificationProvider>
        </LeadProvider>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'leads', element: <PermissionGuard permission="leads"><AdminLeads /></PermissionGuard> },
      { path: 'leads/:id', element: <PermissionGuard permission="leads"><AdminLeadDetail /></PermissionGuard> },
      { path: 'services', element: <PermissionGuard permission="services"><AdminServices /></PermissionGuard> },
      { path: 'slider', element: <PermissionGuard permission="slider"><AdminSlider /></PermissionGuard> },
      { path: 'testimonials', element: <PermissionGuard permission="testimonials"><AdminTestimonials /></PermissionGuard> },
      { path: 'settings', element: <PermissionGuard permission="settings"><AdminSettings /></PermissionGuard> },
      { path: 'admins', element: <SuperAdminRoute><AdminManagement /></SuperAdminRoute> },
    ],
  },
  
  // Temporary: Super Admin Setup (REMOVE AFTER SETUP)
  { path: '/setup-super-admin', element: <SetupSuperAdmin /> },

  // Fallback
  { path: '*', element: <Navigate to="/" replace /> },
]);

// App Router with Providers
const AppRouter = () => {
  return (
    <ErrorBoundary>
      <SettingsProvider>
        <ThemeProvider>
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </ThemeProvider>
      </SettingsProvider>
    </ErrorBoundary>
  );
};

export default AppRouter;
