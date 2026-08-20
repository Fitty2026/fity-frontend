import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import Button from '@/components/ui/Button';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { socialLogin } from '@/features/auth/api/authApi';
import { exchangeKakaoCode, parseGoogleCallbackToken } from '@/features/auth/api/socialAuth';
import useAfterLogin from '@/features/auth/hooks/useAfterLogin';
import { getErrorMessage } from '@/lib/apiError';

/**
 * 소셜 로그인 콜백 (/oauth/:provider/callback) — 콘솔에 등록된 리디렉션 URI.
 * 카카오는 ?code= 인가 코드를 토큰으로 교환하고, 구글은 해시(#access_token)로 토큰이 바로 온다.
 * 받은 소셜 토큰을 서버 소셜 로그인 API로 보내 우리 JWT로 교환한 뒤 로그인 공통 흐름을 태운다.
 */
const OAuthCallbackPage = () => {
  const { provider } = useParams<{ provider: string }>();
  const navigate = useNavigate();
  const afterLogin = useAfterLogin();
  const [error, setError] = useState<string | null>(null);
  // 인가 코드는 1회용이라 StrictMode 이중 실행에서 재교환하면 안 된다
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    const run = async () => {
      try {
        if (provider !== 'kakao' && provider !== 'google') {
          throw new Error('지원하지 않는 소셜 로그인이에요.');
        }

        let socialAccessToken: string;
        if (provider === 'kakao') {
          const code = new URLSearchParams(window.location.search).get('code');
          if (!code) throw new Error('카카오 인증이 취소되었어요. 다시 시도해 주세요.');
          socialAccessToken = await exchangeKakaoCode(code);
        } else {
          const token = parseGoogleCallbackToken(window.location.hash);
          if (!token) throw new Error('구글 인증이 취소되었어요. 다시 시도해 주세요.');
          socialAccessToken = token;
        }

        const { accessToken } = await socialLogin(provider, socialAccessToken);
        await afterLogin({ accessToken });
      } catch (err) {
        setError(getErrorMessage(err));
      }
    };
    void run();
  }, [provider, afterLogin]);

  return (
    <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col">
      {error ? (
        <div className="flex flex-1 flex-col items-center justify-center px-6">
          <p className="text-center text-base font-semibold">소셜 로그인에 실패했어요</p>
          <p className="mt-2 text-center text-sm text-neutral-500">{error}</p>
          <Button
            label="로그인으로 돌아가기"
            shape="pill"
            size="md"
            className="mt-8"
            onClick={() => navigate('/login', { replace: true })}
          />
        </div>
      ) : (
        <LoadingScreen message="로그인하고 있어요..." />
      )}
    </PageLayout>
  );
};

export default OAuthCallbackPage;
