import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageeLayout';
import { INTRO_SEEN_KEY } from '@/features/auth/constants';
import useAuthStore from '@/store/authStore';

const SPLASH_DURATION_MS = 1500;

const SplashPage = () => {
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoggedIn) {
        navigate('/home', { replace: true });
      } else if (localStorage.getItem(INTRO_SEEN_KEY)) {
        navigate('/login', { replace: true });
      } else {
        navigate('/intro', { replace: true });
      }
    }, SPLASH_DURATION_MS);

    return () => clearTimeout(timer);
  }, [isLoggedIn, navigate]);

  return (
    <PageLayout showHeader={false} showBottomNav={false} className="flex items-center justify-center">
      <h1 className="text-4xl font-bold tracking-tight">Fitty</h1>
    </PageLayout>
  );
};

export default SplashPage;
