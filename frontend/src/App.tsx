import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TasksPage from './pages/TasksPage';
import PublicRoute from './components/PublicRoute'; // <--- Import our new wrapper

function App() {
  // Helper to decide where to go when user hits "/"
  const getRootRedirect = () => {
    const token = localStorage.getItem('accessToken');
    return token ? "/tasks" : "/login";
  };

  return (
    <Routes>
      {/* 
        PUBLIC ROUTES (Accessible only by guests)
        We wrap Login and Register inside PublicRoute.
        If a logged-in user tries to go here, they get kicked to /tasks.
      */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
      
      {/* 
        PROTECTED ROUTES
        /tasks checks the token inside the component itself (in useEffect).
        If the token is invalid, the backend returns 401, and TasksPage redirects to Login.
      */}
      <Route path="/tasks" element={<TasksPage />} />

      {/* 
        ROOT PATH
        Smart redirect based on token presence.
      */}
      <Route path="/" element={<Navigate to={getRootRedirect()} replace />} />
      
      {/* Fallback for unknown URLs */}
      <Route path="*" element={<Navigate to={getRootRedirect()} replace />} />
    </Routes>
  );
}

export default App;