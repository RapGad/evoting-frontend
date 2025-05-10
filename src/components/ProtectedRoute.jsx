import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = sessionStorage.getItem('token'); // or from context

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
