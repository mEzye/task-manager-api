import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import client from '../api/client'; // Import our configured axios client

const LoginPage = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null); // To show error messages
  
  const navigate = useNavigate(); // Hook for navigation

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    try {
      console.log('Sending request to backend...');
      
      // 1. Send POST request
      const response = await client.post('/auth/login', {
        email,
        password
      });

      // 2. Extract tokens from response
      const { accessToken, refreshToken } = response.data;

      // 3. Save to localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      console.log('Login successful! Token saved.');

      // 4. Redirect to Tasks page (we will create it later, for now just home)
      navigate('/tasks'); // or '/' if you want

    } catch (err: any) {
      console.error('Login failed', err);
      // Show error message from backend or a generic one
      setError(err.response?.data?.message || 'Failed to login');
    }
  };

  return (
    <div className="container" style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '400px', 
        padding: '2rem', 
        backgroundColor: 'var(--bg-secondary)', 
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Enter your credentials to access your tasks.
          </p>
        </div>

        {/* Error Message Display */}
        {error && (
          <div style={{ 
            color: 'var(--danger)', 
            marginBottom: '1rem', 
            textAlign: 'center',
            fontSize: '0.9rem' 
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <input 
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" style={{ width: '100%' }}>
            Log In
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Don't have an account? </span>
          <Link to="/register">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;