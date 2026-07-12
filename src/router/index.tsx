import { createBrowserRouter, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// 0. 진입 / 계정
import SplashPage from '../pages/auth/SplashPage';
import ServiceIntroPage from '../pages/auth/ServiceIntroPage';
import LoginPage from '../pages/auth/LoginPage';

// 1. 온보딩
import StylePreferencePage from '../pages/onboarding/StylePreferencePage';
import PhotoUploadPage from '../pages/onboarding/PhotoUploadPage';
import BodyAnalysisPage from '../pages/onboarding/BodyAnalysisPage';
import AvatarGeneratePage from '../pages/onboarding/AvatarGeneratePage';

// 2. 옷장
import ClosetHomePage from '../pages/closet/ClosetHomePage';
import ClosetRegisterPage from '../pages/closet/ClosetRegisterPage';
import ClosetPlatformPage from '../pages/closet/ClosetPlatformPage';
import ClosetPermissionPage from '../pages/closet/ClosetPermissionPage';
import ClosetPhotoPage from '../pages/closet/ClosetPhotoPage';
import ClosetLoadingPage from '../pages/closet/ClosetLoadingPage';
import ClosetTagEditPage from '../pages/closet/ClosetTagEditPage';
import ClosetCompletePage from '../pages/closet/ClosetCompletePage';
import ClosetItemDetailPage from '../pages/closet/ClosetItemDetailPage';

// 3. 홈
import HomePage from '../pages/home/HomePage';

// 4. 코디 생성
import StylingStartPage from '../pages/styling/StylingStartPage';
import StylingDatePage from '../pages/styling/StylingDatePage';
import StylingMoodPage from '../pages/styling/StylingMoodPage';
import StylingItemSelectPage from '../pages/styling/StylingItemSelectPage';
import StylingLoadingPage from '../pages/styling/StylingLoadingPage';

// 5. 코디 결과
import OutfitResultPage from '../pages/outfit/OutfitResultPage';
import OutfitSavePage from '../pages/outfit/OutfitSavePage';
import OutfitSharePage from '../pages/outfit/OutfitSharePage';

// 6. 커머스
import ProductListPage from '../pages/commerce/ProductListPage';
import ProductDetailPage from '../pages/commerce/ProductDetailPage';

// 7. 내 코디
import MyOutfitListPage from '../pages/myoutfit/MyOutfitListPage';
import MyOutfitDetailPage from '../pages/myoutfit/MyOutfitDetailPage';

// 8. 마이페이지
import MyPage from '../pages/mypage/MyPage';

const router = createBrowserRouter([
  // ── 인증 불필요 ──────────────────────────────
  { path: '/', element: <SplashPage /> },
  { path: '/intro', element: <ServiceIntroPage /> },
  { path: '/login', element: <LoginPage /> },

  // ── 온보딩 (로그인 후 최초 1회) ───────────────
  {
    path: '/onboarding',
    element: <ProtectedRoute><StylePreferencePage /></ProtectedRoute>,
  },
  {
    path: '/onboarding/photo',
    element: <ProtectedRoute><PhotoUploadPage /></ProtectedRoute>,
  },
  {
    path: '/onboarding/analysis',
    element: <ProtectedRoute><BodyAnalysisPage /></ProtectedRoute>,
  },
  {
    path: '/onboarding/avatar',
    element: <ProtectedRoute><AvatarGeneratePage /></ProtectedRoute>,
  },

  // ── 메인 (로그인 필요) ────────────────────────
  {
    path: '/home',
    element: <ProtectedRoute><HomePage /></ProtectedRoute>,
  },

  // 옷장
  {
    path: '/closet',
    element: <ProtectedRoute><ClosetHomePage /></ProtectedRoute>,
  },
  {
    path: '/closet/register',
    element: <ProtectedRoute><ClosetRegisterPage /></ProtectedRoute>,
  },
  {
    path: '/closet/register/platform',
    element: <ProtectedRoute><ClosetPlatformPage /></ProtectedRoute>,
  },
  {
    path: '/closet/register/permission',
    element: <ProtectedRoute><ClosetPermissionPage /></ProtectedRoute>,
  },
  {
    path: '/closet/register/photo',
    element: <ProtectedRoute><ClosetPhotoPage /></ProtectedRoute>,
  },
  {
    path: '/closet/register/importing',
    element: <ProtectedRoute><ClosetLoadingPage variant="import" /></ProtectedRoute>,
  },
  {
    path: '/closet/register/analyzing',
    element: <ProtectedRoute><ClosetLoadingPage variant="analyze" /></ProtectedRoute>,
  },
  {
    path: '/closet/register/tags',
    element: <ProtectedRoute><ClosetTagEditPage /></ProtectedRoute>,
  },
  {
    path: '/closet/register/complete',
    element: <ProtectedRoute><ClosetCompletePage /></ProtectedRoute>,
  },
  {
    path: '/closet/:itemId',
    element: <ProtectedRoute><ClosetItemDetailPage /></ProtectedRoute>,
  },

  // 코디 생성
  {
    path: '/styling',
    element: <ProtectedRoute><StylingStartPage /></ProtectedRoute>,
  },
  {
    path: '/styling/date',
    element: <ProtectedRoute><StylingDatePage /></ProtectedRoute>,
  },
  {
    path: '/styling/mood',
    element: <ProtectedRoute><StylingMoodPage /></ProtectedRoute>,
  },
  {
    path: '/styling/items',
    element: <ProtectedRoute><StylingItemSelectPage /></ProtectedRoute>,
  },
  {
    path: '/styling/loading',
    element: <ProtectedRoute><StylingLoadingPage /></ProtectedRoute>,
  },

  // 코디 결과
  {
    path: '/outfit/result',
    element: <ProtectedRoute><OutfitResultPage /></ProtectedRoute>,
  },
  {
    path: '/outfit/save',
    element: <ProtectedRoute><OutfitSavePage /></ProtectedRoute>,
  },
  {
    path: '/outfit/share',
    element: <ProtectedRoute><OutfitSharePage /></ProtectedRoute>,
  },

  // 커머스
  {
    path: '/commerce',
    element: <ProtectedRoute><ProductListPage /></ProtectedRoute>,
  },
  {
    path: '/commerce/:productId',
    element: <ProtectedRoute><ProductDetailPage /></ProtectedRoute>,
  },

  // 내 코디
  {
    path: '/myoutfit',
    element: <ProtectedRoute><MyOutfitListPage /></ProtectedRoute>,
  },
  {
    path: '/myoutfit/:outfitId',
    element: <ProtectedRoute><MyOutfitDetailPage /></ProtectedRoute>,
  },

  // 마이페이지
  {
    path: '/mypage',
    element: <ProtectedRoute><MyPage /></ProtectedRoute>,
  },

  // 없는 경로 → 홈으로
  { path: '*', element: <Navigate to="/" replace /> },
]);

export default router;