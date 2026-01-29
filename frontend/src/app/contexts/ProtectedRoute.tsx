'use client';
import React, { Suspense } from 'react';
import { useAuth } from './AuthContext';

// Install react-error-boundary: npm install react-error-boundary
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

// Types for your specific roles
type UserRole = 'EMPLOYER' | 'JOB_SEEKER';

// Proper User interface with strict typing
interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  isEmailVerified?: boolean;
}

interface ProtectedRouteConfig {
  allowedRoles?: UserRole[];
  fallbackUrl?: string;
  loadingComponent?: React.ComponentType;
  unauthorizedComponent?: React.ComponentType;
  onAuthCheck?: (user: User) => boolean;
}

interface ProtectedRouteProps extends ProtectedRouteConfig {
  children: React.ReactNode;
}

// Custom hook for auth validation with proper typing
function useAuthValidation(config: ProtectedRouteConfig) {
  const { user, loading, checkAuth } = useAuth();
  
  // Memoized validation logic with proper typing
  const isAuthorized = React.useMemo(() => {
    if (loading || !user) return null;
    
    // Custom auth check function
    if (config.onAuthCheck && !config.onAuthCheck(user as User)) {
      return false;
    }
    
    // Role-based validation for EMPLOYER/JOB_SEEKER only
    if (config.allowedRoles && !config.allowedRoles.includes(user.role)) {
      return false;
    }
    
    return true;
  }, [user, loading, config]);
  
  // Auto-refresh auth on mount
  React.useEffect(() => {
    if (!user && !loading) {
      checkAuth();
    }
  }, [user, loading, checkAuth]);
  
  return { user, loading, isAuthorized };
}

// Optimized loading component
const DefaultLoading: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
  </div>
);

// Role-aware unauthorized component
const DefaultUnauthorized: React.FC = () => {
  const { user } = useAuth();
  
  const getRoleMessage = (): string => {
    if (!user) return "Please log in to access this page.";
    
    return user.role === 'EMPLOYER' 
      ? "This page is only accessible to job seekers."
      : "This page is only accessible to employers.";
  };

  const getRedirectPath = (): string => {
    if (!user) return "/login";
    return user.role === 'EMPLOYER' ? "/employer/dashboard" : "/jobseeker/dashboard";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
      <div className="max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-4">{getRoleMessage()}</p>
        <button
          onClick={() => window.location.href = getRedirectPath()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

// Error fallback component with proper typing
const ErrorFallback: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-4">
    <h2 className="text-xl font-bold text-red-800 mb-2">Authentication Error</h2>
    <p className="text-red-600 mb-4">{error.message}</p>
    <div className="space-x-2">
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
      >
        Try Again
      </button>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
      >
        Reload Page
      </button>
    </div>
  </div>
);

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  loadingComponent: LoadingComponent = DefaultLoading,
  unauthorizedComponent: UnauthorizedComponent = DefaultUnauthorized,
  fallbackUrl = '/login',
  ...config
}) => {
  const { user, loading, isAuthorized } = useAuthValidation(config);

  // Store intended destination for post-login redirect
  React.useEffect(() => {
    if (!loading && !user) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
      }
    }
  }, [loading, user]);

  // Loading state
  if (loading) {
    return (
      <Suspense fallback={<LoadingComponent />}>
        <LoadingComponent />
      </Suspense>
    );
  }

  // Not authenticated
  if (!user) {
    if (typeof window !== 'undefined') {
      window.location.href = fallbackUrl;
    }
    return null;
  }

  // Not authorized
  if (isAuthorized === false) {
    return <UnauthorizedComponent />;
  }

  // Authorized - render children with error boundary
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        console.error('ProtectedRoute Error:', error);
        console.error('Error Info:', errorInfo);
      }}
      onReset={() => {
        // Optional: Clear any error state or redirect
        window.location.reload();
      }}
    >
      <Suspense fallback={<LoadingComponent />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};

// Fixed Higher-order component with proper TypeScript generics
export function withAuth<TProps extends Record<string, unknown>>(
  WrappedComponent: React.ComponentType<TProps>,
  config: ProtectedRouteConfig = {}
): React.FC<TProps> {
  const WithAuthComponent: React.FC<TProps> = (props) => (
    <ProtectedRoute {...config}>
      <WrappedComponent {...props} />
    </ProtectedRoute>
  );

  WithAuthComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name})`;
  return WithAuthComponent;
}

// Alternative HOC with forwardRef support (if you need refs)
export function withAuthAndRef<
  TProps extends Record<string, unknown>,
  TRef = HTMLElement
>(
  WrappedComponent: React.ForwardRefExoticComponent<
    React.PropsWithoutRef<TProps> & React.RefAttributes<TRef>
  >,
  config: ProtectedRouteConfig = {}
) {
  const WithAuthAndRefComponent = React.forwardRef<TRef, TProps>((props, ref) => (
    <ProtectedRoute {...config}>
      <WrappedComponent {...props} ref={ref} />
    </ProtectedRoute>
  ));

  WithAuthAndRefComponent.displayName = `withAuthAndRef(${WrappedComponent.displayName || 'Component'})`;
  return WithAuthAndRefComponent;
}

// Pre-configured route guards with proper typing
export const RequireEmployer = <TProps extends Record<string, unknown>>(
  Component: React.ComponentType<TProps>
): React.FC<TProps> => withAuth(Component, { allowedRoles: ['EMPLOYER'] });

export const RequireJobSeeker = <TProps extends Record<string, unknown>>(
  Component: React.ComponentType<TProps>
): React.FC<TProps> => withAuth(Component, { allowedRoles: ['JOB_SEEKER'] });

export const RequireAuthenticated = <TProps extends Record<string, unknown>>(
  Component: React.ComponentType<TProps>
): React.FC<TProps> => withAuth(Component, {});

// Role-specific redirect helpers with proper return typing
export const getDefaultRedirect = (role: UserRole): string => {
  return role === 'EMPLOYER' ? '/employer/dashboard' : '/jobseeker/dashboard';
};

// Type guard for user validation
export const isValidUser = (user: unknown): user is User => {
  return (
    typeof user === 'object' &&
    user !== null &&
    'id' in user &&
    'name' in user &&
    'email' in user &&
    'role' in user &&
    typeof (user as User).role === 'string' &&
    ['EMPLOYER', 'JOB_SEEKER'].includes((user as User).role)
  );
};
