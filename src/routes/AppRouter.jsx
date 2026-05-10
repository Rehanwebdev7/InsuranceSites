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
import BrandLoader from '../components/common/BrandLoader';

// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard';
import AdminLeads from '../pages/admin/Leads';
import AdminLeadDetail from '../pages/admin/LeadDetail';
import AdminServices from '../pages/admin/Services';
import AdminSlider from '../pages/admin/Slider';
import AdminSettings from '../pages/admin/Settings';
import AdminTheme from '../pages/admin/Theme';
import AdminTestimonials from '../pages/admin/Testimonials';
import AdminManagement from '../pages/admin/AdminManagement';
import SetupSuperAdmin from '../pages/admin/SetupSuperAdmin';

// Auth Pages
import Login from '../pages/auth/Login';

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <BrandLoader caption="Verifying your session" />;
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
    return <BrandLoader caption="Verifying your session" />;
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
    return <BrandLoader fullscreen={false} caption="One moment" size="sm" />;
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
      { path: 'theme', element: <PermissionGuard permission="settings"><AdminTheme /></PermissionGuard> },
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
