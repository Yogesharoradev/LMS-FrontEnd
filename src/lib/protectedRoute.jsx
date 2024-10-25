import { Fragment } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, authenticated, user }) => {

  const location = useLocation();

  if (!authenticated && !location.pathname.includes("/auth")) {
    return <Navigate to="/auth" />;
  }

  
  if (authenticated && location.pathname.includes("/auth")) {
    return <Navigate to="/" />;
  }

  if (authenticated && user?.role !== "Admin" && location.pathname.includes("/admin")) {
    return <Navigate to="/" />;
  }


  if (authenticated && user?.role === "Admin" && !location.pathname.includes("/admin")) {
    return <Navigate to="/admin" />;
  }

  return <Fragment>{children}</Fragment>;
};

export default ProtectedRoute;
