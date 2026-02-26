import {
  Navigate,
  Route,
  Routes,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Landing from './pages/Landing';
import BudgetTimeline from './pages/BudgetTimeline';
import Summary from './pages/Summary';
import Vendors from './pages/Vendors';
import VendorDetail from './pages/Vendors/detail';
import Callback from './pages/Callback';
import NotFound from './pages/NotFound';
import LoadingSpinner from './components/common/LoadingSpinner';
import { useUserSync } from './hooks/useUserSync';
import { useAppLoading } from './hooks/useAppLoading';

function LegacyVendorsRoute() {
  const [searchParams] = useSearchParams();
  const projectId = String(searchParams.get('projectId') || '').trim();

  if (/^\d+$/.test(projectId)) {
    return <Navigate to={`/projects/${projectId}/vendors`} replace />;
  }

  return <Vendors />;
}

function LegacyVendorDetailRoute() {
  const [searchParams] = useSearchParams();
  const { vendorId } = useParams();
  const projectId = String(searchParams.get('projectId') || '').trim();

  if (vendorId && /^\d+$/.test(projectId)) {
    return (
      <Navigate
        to={`/projects/${projectId}/vendors/${encodeURIComponent(vendorId)}`}
        replace
      />
    );
  }

  return <VendorDetail />;
}

/**
 * App Component
 * @description Main application component with routing
 */
function App() {
  // Sync user with backend when authenticated
  const { isSyncing } = useUserSync();
  const { isLoading: isAppLoading, message: appLoadingMessage } = useAppLoading();

  // Show loading spinner while syncing user
  if (isSyncing) {
    return <LoadingSpinner fullScreen size="large" message="Setting up your account..." />;
  }

  return (
    <>
      <Routes>
        {/* Auth callback route */}
        <Route path="/callback" element={<Callback />} />

        {/* Landing page - shows Login if not authenticated, Landing form if authenticated */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Landing />
            </ProtectedRoute>
          }
        />
        <Route
          path="/budget-timeline"
          element={
            <ProtectedRoute>
              <BudgetTimeline />
            </ProtectedRoute>
          }
        />
        <Route
          path="/summary"
          element={
            <ProtectedRoute>
              <Summary />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/:projectId/vendors"
          element={
            <ProtectedRoute>
              <Vendors />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/:projectId/vendors/:vendorId"
          element={
            <ProtectedRoute>
              <VendorDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendors"
          element={
            <ProtectedRoute>
              <LegacyVendorsRoute />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendors/:vendorId"
          element={
            <ProtectedRoute>
              <LegacyVendorDetailRoute />
            </ProtectedRoute>
          }
        />

        {/* 404 Not Found - catch all unmatched routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {isAppLoading && (
        <LoadingSpinner
          fullScreen
          size="large"
          message={appLoadingMessage || 'Loading...'}
        />
      )}
    </>
  );
}

export default App;
