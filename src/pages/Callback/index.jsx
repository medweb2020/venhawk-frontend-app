import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

/**
 * Callback Page Component
 * @description Handles Auth0 callback after authentication
 */
const Callback = () => {
  const { isAuthenticated, isLoading, error } = useAuth0();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      // Redirect to home page after successful authentication
      window.location.href = '/';
    }
  }, [isAuthenticated, isLoading]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          {/* Error Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Authentication Failed
          </h1>
          <p className="text-gray-600 mb-8">
            {error.message || 'An error occurred during authentication. Please try again.'}
          </p>

          {/* Retry Button */}
          <button
            onClick={() => window.location.href = '/login'}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        {/* Loading Spinner */}
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600 font-medium">Completing authentication...</p>
      </div>
    </div>
  );
};

export default Callback;
