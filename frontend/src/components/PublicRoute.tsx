import { Navigate, Outlet } from 'react-router-dom';

/**
 * PublicRoute Component
 * 
 * This is a wrapper for routes that should ONLY be accessible 
 * if the user is NOT logged in (like Login or Register).
 * 
 * Logic:
 * 1. Check if an access token exists in localStorage.
 * 2. If it exists, redirect the user to the tasks page immediately.
 * 3. If it doesn't exist, render the requested page (Outlet).
 */
const PublicRoute = () => {
  const token = localStorage.getItem('accessToken');

  // If user is authenticated, redirect to /tasks
  // "replace" prevents the user from going back to login by pressing Back button
  if (token) {
    return <Navigate to="/tasks" replace />;
  }

  // If not authenticated, render the child route (Login or Register)
  return <Outlet />;
};

export default PublicRoute;