import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../features/auth/authSlice';
import vivaLogo from '../assets/viva-logo.svg';
import { toast } from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate('/');
    }
    
    // Clean up error on unmount
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, navigate, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate form
      if (!email || !password) {
        toast.error('All fields are required');
        setIsSubmitting(false);
        return;
      }
      
      // Dispatch login action
      await dispatch(login({ email, password })).unwrap();
      
      // If successful, navigate happens due to useEffect
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side with image and overlay */}
      <div className="md:flex-1 relative bg-gradient-to-b from-blue-400 to-blue-900 flex flex-col justify-between p-8">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-400/90 to-blue-900/90 z-0"></div>
        
        {/* Logo */}
        <div className="relative z-10">
          <img src={vivaLogo} alt="Viva Phonics" className="h-16" />
        </div>
        
        {/* Welcome text */}
        <div className="relative z-10 text-white mt-auto mb-20">
          <h1 className="text-5xl font-bold mb-6">Welcome.</h1>
          <p className="text-2xl font-medium max-w-md">
            Private Reading Tutors for Emerging and Struggling Readers
          </p>
        </div>
      </div>
      
      {/* Right side with form */}
      <div className="md:flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Login</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            
            <button
              type="submit"
              className="w-full py-3 bg-cyan-500 text-white font-medium rounded-md hover:bg-cyan-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={isSubmitting || loading}
            >
              {isSubmitting || loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account? <Link to="/register" className="text-cyan-500 hover:underline">Sign up now</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 