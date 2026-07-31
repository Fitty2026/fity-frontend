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
import ClosetCaptureGuidePage from '../pages/closet/ClosetCaptureGuidePage';
import ClosetCapturePage from '../pages/closet/ClosetCapturePage';
import ClosetTagConfirmPage from '../pages/closet/ClosetTagConfirmPage';
import ClosetPhotoEditPage from '../pages/closet/ClosetPhotoEditPage';
import ClosetTagEditPage from '../pages/closet/ClosetTagEditPage';
import ClosetRecognizingPage from '../pages/closet/ClosetRecognizingPage';
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
import CodyPlayPage from '@/pages/codyplay/CodyPlayPage';
import CodyRetouchPage from '@/pages/codyplay/CodyRetouchPage';
import OutfitSharePage from '../pages/codyplay/OutfitSharePage';

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


import MyOutfitEditPage from '@/pages/myoutfit/MyOutfitEditPage';
import MyOutfitDeletePage from '@/pages/myoutfit/MyOutfitDeletePage';
import MyOutfitAddItemPage from '@/pages/myoutfit/MyOutfitAddItemPage';
import MyOutfitRecentlyDeletedPage from '@/pages/myoutfit/MyOutfitRecentlyDeletedPage';

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
    path: '/closet/register/capture-guide',
    element: <ProtectedRoute><ClosetCaptureGuidePage /></ProtectedRoute>,
  },
  {
    path: '/closet/register/capture',
    element: <ProtectedRoute><ClosetCapturePage /></ProtectedRoute>,
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
    path: '/closet/register/recognizing',
    element: <ProtectedRoute><ClosetRecognizingPage /></ProtectedRoute>,
  },
  {
    path: '/closet/register/analyzing',
    element: <ProtectedRoute><ClosetLoadingPage variant="analyze" /></ProtectedRoute>,
  },
  {
    path: '/closet/register/tags',
    element: <ProtectedRoute><ClosetTagConfirmPage /></ProtectedRoute>,
  },
  {
    // 옷 사진 수정 — 시안 대기(빈 화면)
    path: '/closet/register/tags/photo',
    element: <ProtectedRoute><ClosetPhotoEditPage /></ProtectedRoute>,
  },
  {
    path: '/closet/register/tags/edit',
    element: <ProtectedRoute><ClosetTagEditPage /></ProtectedRoute>,
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
    element: <ProtectedRoute><CodyPlayPage /></ProtectedRoute>
  },
  {
    path: '/codyplay/retouch',
    element: <ProtectedRoute><CodyRetouchPage /></ProtectedRoute>
  },

  // 코디 결과
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
    path: '/myoutfit/recently-deleted',
    element: <ProtectedRoute><MyOutfitRecentlyDeletedPage /></ProtectedRoute>,
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
  {
    path: '/myoutfit/additem/:outfitId',
    element: <ProtectedRoute><MyOutfitAddItemPage /></ProtectedRoute>,
  },

  // 마이페이지
  // TODO(담당자): 시안이 2026-07-29에 추가됨. 화면 구현·API 연동 미착수 — 연동 보류
  // 프로필(이름·체형·취향), 스타일 통계(옷 등록/코디 생성/코디 저장), 좋아요·최근 삭제된 코디·스타 충전 등
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
