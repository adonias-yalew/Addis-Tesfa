import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {
  AuthProvider,
  getRoleDashboardPath,
  useAuth,
  useIsAdmin,
  useIsProfessional,
} from "./hooks/useAuth.tsx";
import Layout from "./layouts/Layout";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CreatePostPage from "./pages/CreatePostPage";
import PostDetailPage from "./pages/PostDetailPage";
import AICopilotPage from "./pages/AICopilotPage";
import MyPostsPage from "./pages/MyPostsPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import ContactPage from "./pages/ContactPage";
import ProfessionalsPage from "./pages/ProfessionalsPage";
import BlogsPage from "./pages/BlogsPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import ProfessionalDashboardPage from "./pages/ProfessionalDashboardPage";
import DashboardPage from "./pages/DashboardPage";
import "./App.css";

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

// Public Route (redirect if authenticated)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return !isAuthenticated ? <>{children}</> : <Navigate to={getRoleDashboardPath(user?.role)} replace />;
};

const RoleRedirect = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return isAuthenticated ? <Navigate to={getRoleDashboardPath(user?.role)} replace /> : <Navigate to="/welcome" replace />;
};

const UserRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return isAuthenticated && user?.role === 'USER' ? <>{children}</> : <Navigate to={getRoleDashboardPath(user?.role)} replace />;
};

// Admin Route Component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const isAdmin = useIsAdmin();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return isAuthenticated && isAdmin ? <>{children}</> : <Navigate to="/" />;
};

// Professional Route Component
const ProfessionalRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const isProfessional = useIsProfessional();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return isAuthenticated && isProfessional ? (
    <>{children}</>
  ) : (
    <Navigate to="/" />
  );
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/welcome" element={<LandingPage />} />

      {/* Auth Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      {/* Protected Routes with Layout */}
      <Route element={<Layout />}>
        <Route path="/" element={<RoleRedirect />} />

        {/* User Dashboard */}
        <Route
          path="/user/dashboard"
          element={
            <UserRoute>
              <DashboardPage />
            </UserRoute>
          }
        />
        <Route path="/dashboard" element={<RoleRedirect />} />

        <Route
          path="/community"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/copilot"
          element={
            <ProtectedRoute>
              <AICopilotPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/post/:id"
          element={
            <ProtectedRoute>
              <PostDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/blogs"
          element={
            <ProtectedRoute>
              <BlogsPage />
            </ProtectedRoute>
          }
        />

        {/* Authenticated only */}
        <Route
          path="/my-posts"
          element={
            <ProtectedRoute>
              <MyPostsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-post"
          element={
            <ProtectedRoute>
              <CreatePostPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contact"
          element={
            <ProtectedRoute>
              <ContactPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/professionals"
          element={
            <ProtectedRoute>
              <ProfessionalsPage />
            </ProtectedRoute>
          }
        />

        {/* Redirect old home to dashboard */}
        <Route path="/home" element={<RoleRedirect />} />

        {/* Admin only */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          }
        />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

        {/* Professional only */}
        <Route
          path="/professional/dashboard"
          element={
            <ProfessionalRoute>
              <ProfessionalDashboardPage />
            </ProfessionalRoute>
          }
        />
        <Route
          path="/professional/:section"
          element={
            <ProfessionalRoute>
              <ProfessionalDashboardPage />
            </ProfessionalRoute>
          }
        />
        <Route path="/professional" element={<Navigate to="/professional/dashboard" replace />} />
      </Route>

      {/* Default redirect */}
      <Route path="*" element={<Navigate to="/welcome" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
