import { createBrowserRouter, Outlet } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// 0. 진입 / 계정
import SplashPage from '../pages/auth/SplashPage';
import ServiceIntroPage from '../pages/auth/ServiceIntroPage';
import LoginPage from '../pages/auth/LoginPage';
import SignupPage from '../pages/auth/SignupPage';

// 1. 온보딩
import ConsentPage from '../pages/onboarding/ConsentPage';
import StyleSwipePage from '../pages/onboarding/StyleSwipePage';
import StyleConfirmPage from '../pages/onboarding/StyleConfirmPage';
import BodyTypePage from '../pages/onboarding/BodyTypePage';
import BodyPhotoGuidePage from '../pages/onboarding/BodyPhotoGuidePage';
import BodyCameraPage from '../pages/onboarding/BodyCameraPage';
import BodyUploadPage from '../pages/onboarding/BodyUploadPage';
import BodyAnalysisPage from '../pages/onboarding/BodyAnalysisPage';
import BodyResultPage from '../pages/onboarding/BodyResultPage';

// 2. 옷장
import ClosetHomePage from '../pages/closet/ClosetHomePage';
import ClosetRegisterPage from '../pages/closet/ClosetRegisterPage';
import ClosetPlatformPage from '../pages/closet/ClosetPlatformPage';
import ClosetPermissionPage from '../pages/closet/ClosetPermissionPage';
import ClosetImportingPage from '../pages/closet/ClosetImportingPage';
import ClosetReceiptPage from '../pages/closet/ClosetReceiptPage';
import ClosetPhotoPage from '../pages/closet/ClosetPhotoPage';
import ClosetUploadPage from '../pages/closet/ClosetUploadPage';
import ClosetLoadingPage from '../pages/closet/ClosetLoadingPage';
import ClosetAddedPage from '../pages/closet/ClosetAddedPage';
import ClosetCompletePage from '../pages/closet/ClosetCompletePage';
import ClosetItemDetailPage from '../pages/closet/ClosetItemDetailPage';
import ClosetItemDeletePage from '../pages/closet/ClosetItemDeletePage';
import ClosetItemListPage from '../pages/closet/ClosetItemListPage';
import ClosetIntroPage from '../pages/closet/ClosetIntroPage';

// 3. 홈
import HomePage from '../pages/home/HomePage';

// 4. 코디 생성
import StylingStartPage from '../pages/styling/StylingStartPage';
import StylingMethodPage from '../pages/styling/StylingMethodPage';
import StylingDatePage from '../pages/styling/StylingDatePage';
import StylingWeatherPage from '../pages/styling/StylingWeatherPage';
import StylingMoodPage from '../pages/styling/StylingMoodPage';
import StylingItemSelectPage from '../pages/styling/StylingItemSelectPage';
import StylingLoadingPage from '../pages/styling/StylingLoadingPage';

// 5. 코디 결과
import OutfitResultPage from '../pages/outfit/OutfitResultPage';
import OutfitEditPage from '../pages/outfit/OutfitEditPage';
import OutfitSharePage from '../pages/outfit/OutfitSharePage';

// 6. 커머스
import ProductListPage from '../pages/commerce/ProductListPage';
import ProductDetailPage from '../pages/commerce/ProductDetailPage';

// 7. 내 코디
import MyOutfitListPage from '../pages/myoutfit/MyOutfitListPage';
import MyOutfitDetailPage from '../pages/myoutfit/MyOutfitDetailPage';

// 8. 마이페이지
import MyPage from '../pages/mypage/MyPage';

// 9. 에러
import RouteErrorPage from '../pages/error/RouteErrorPage';
import NotFoundPage from '../pages/error/NotFoundPage';

import CodyPlay from '@/pages/codyplay/CodyPlay';
import CodyRetouch from '@/pages/codyplay/CodyRetouch';
import MyOutfitEditPage from '@/pages/myoutfit/MyOutfitEditPage';
import MyOutfitDeletePage from '@/pages/myoutfit/MyOutfitDeletePage';

const router = createBrowserRouter([

  {
    element: <Outlet />,
    errorElement: <RouteErrorPage />,
    children: [
    // ── 인증 불필요 ──────────────────────────────
    { path: '/', element: <SplashPage /> },
    { path: '/intro', element: <ServiceIntroPage /> },
    { path: '/login', element: <LoginPage /> },
    { path: '/signup', element: <SignupPage /> },

    // ── 온보딩 (로그인 후 최초 1회) ───────────────
    {
      path: '/onboarding',
      element: <ProtectedRoute><ConsentPage /></ProtectedRoute>,
    },
    {
      path: '/onboarding/style',
      element: <ProtectedRoute><StyleSwipePage /></ProtectedRoute>,
    },
    {
      path: '/onboarding/style/confirm',
      element: <ProtectedRoute><StyleConfirmPage /></ProtectedRoute>,
    },
    {
      path: '/onboarding/body',
      element: <ProtectedRoute><BodyTypePage /></ProtectedRoute>,
    },
    {
      path: '/onboarding/body/photo',
      element: <ProtectedRoute><BodyPhotoGuidePage /></ProtectedRoute>,
    },
    {
      path: '/onboarding/body/camera',
      element: <ProtectedRoute><BodyCameraPage /></ProtectedRoute>,
    },
    {
      path: '/onboarding/body/upload',
      element: <ProtectedRoute><BodyUploadPage /></ProtectedRoute>,
    },
    {
      path: '/onboarding/body/analysis',
      element: <ProtectedRoute><BodyAnalysisPage /></ProtectedRoute>,
    },
    {
      path: '/onboarding/body/result',
      element: <ProtectedRoute><BodyResultPage /></ProtectedRoute>,
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
    path: '/closet/intro',
    element: <ProtectedRoute><ClosetIntroPage /></ProtectedRoute>,
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
    path: '/closet/register/upload',
    element: <ProtectedRoute><ClosetUploadPage /></ProtectedRoute>,
  },
  {
    path: '/closet/register/receipt',
    element: <ProtectedRoute><ClosetReceiptPage /></ProtectedRoute>,
  },
  {
    path: '/closet/register/importing',
    element: <ProtectedRoute><ClosetImportingPage /></ProtectedRoute>,
  },
  {
    path: '/closet/register/analyzing',
    element: <ProtectedRoute><ClosetLoadingPage variant="analyze" /></ProtectedRoute>,
  },
  {
    path: '/closet/register/added',
    element: <ProtectedRoute><ClosetAddedPage /></ProtectedRoute>,
  },
  {
    path: '/closet/register/complete',
    element: <ProtectedRoute><ClosetCompletePage /></ProtectedRoute>,
  },
  {
    path: '/closet/items',
    element: <ProtectedRoute><ClosetItemListPage /></ProtectedRoute>,
  },
  {
    path: '/closet/items/:itemId',
    element: <ProtectedRoute><ClosetItemDetailPage /></ProtectedRoute>,
  },
  {
    path: '/closet/items/:itemId/delete',
    element: <ProtectedRoute><ClosetItemDeletePage /></ProtectedRoute>,
  },

  // 코디 생성
  {
    path: '/styling',
    element: <ProtectedRoute><StylingStartPage /></ProtectedRoute>,
  },
  {
    path: '/styling/method',
    element: <ProtectedRoute><StylingMethodPage /></ProtectedRoute>,
  },
  {
    path: '/styling/date',
    element: <ProtectedRoute><StylingDatePage /></ProtectedRoute>,
  },
  {
    path: '/styling/weather',
    element: <ProtectedRoute><StylingWeatherPage /></ProtectedRoute>,
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

  //코디 플레이
  {
    path: '/codyplay',
    element: <ProtectedRoute><CodyPlay /></ProtectedRoute>
  },
  {
    path: '/codyplay/retouch',
    element: <ProtectedRoute><CodyRetouch /></ProtectedRoute>
  },

  // 코디 결과
  {
    path: '/outfit/result',
    element: <ProtectedRoute><OutfitResultPage /></ProtectedRoute>,
  },
  {
    path: '/outfit/edit',
    element: <ProtectedRoute><OutfitEditPage /></ProtectedRoute>,
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
  {
    path: '/myoutfit/edit/:outfitId',
    element: <ProtectedRoute><MyOutfitEditPage /></ProtectedRoute>,
  },
   {
    path: '/myoutfit/delete/:outfitId',
    element: <ProtectedRoute><MyOutfitDeletePage /></ProtectedRoute>,
  },
  // 마이페이지
    {
      path: '/mypage',
      element: <ProtectedRoute><MyPage /></ProtectedRoute>,
    },

    // 없는 경로 → 404
    { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

export default router;
