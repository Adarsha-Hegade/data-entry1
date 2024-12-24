import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';
import { checkIsFirstUser, signUpAdmin, signIn, verifyProfile } from '../../lib/auth';

export default function LoginPage() {
  const navigate = useNavigate();
  const [isFirstUser, setIsFirstUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      try {
        const isFirst = await checkIsFirstUser();
        setIsFirstUser(isFirst);
      } catch (err) {
        setError('Error checking system status');
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const handleSubmit = async (email: string, password: string, fullName?: string) => {
    setLoading(true);
    setError(null);

    try {
      if (isFirstUser && fullName) {
        // Sign up first admin user
        const signUpData = await signUpAdmin(email, password, fullName);
        
        // Wait for trigger to create profile
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Verify profile creation
        if (signUpData.user) {
          await verifyProfile(signUpData.user.id);
        }

        // Sign in new admin
        await signIn(email, password);
      } else {
        // Regular sign in
        await signIn(email, password);
      }

      navigate('/dashboard');
    } catch (err) {
      console.error('Authentication error:', err);
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <LoginForm
      isFirstUser={isFirstUser}
      onSubmit={handleSubmit}
      error={error}
      loading={loading}
    />
  );
}