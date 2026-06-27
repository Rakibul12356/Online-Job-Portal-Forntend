import { Navigate } from 'react-router-dom';

/**
 * Route guard shell — wire auth checks here when authentication is added.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {boolean} [props.isAuthenticated]
 */
export function ProtectedRoute({ children, isAuthenticated = true }) {
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
