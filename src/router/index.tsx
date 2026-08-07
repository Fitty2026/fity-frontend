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
import ClosetOcrConfirmPage from '../pages/closet/ClosetOcrConfirmPage';
import ClosetOcrEditPage from '../pages/closet/ClosetOcrEditPage';
import ClosetOcrCompletePage from '../pages/closet/ClosetOcrCompletePage';
import ClosetReceiptMethodPage from '../pages/closet/ClosetReceiptMethodPage';
import ClosetTagConfirmPage from '../pages/closet/ClosetTagConfirmPage';
import ClosetPhotoEditPage from '../pages/closet/ClosetPhotoEditPage';
import ClosetTagEditPage from '../pages/closet/ClosetTagEditPage';
import ClosetUploadGuidePage from '../pages/closet/ClosetUploadGuidePage';
import ClosetReceiptCheckPage from '../pages/closet/ClosetReceiptCheckPage';
import ClosetReceiptRecognizingPage from '../pages/closet/ClosetReceiptRecognizingPage';
import ClosetReceiptDonePage from '../pages/closet/ClosetReceiptDonePage';
import ClosetReceiptFailedPage from '../pages/closet/ClosetReceiptFailedPage';
import ClosetPhotoPage from '../pages/closet/ClosetPhotoPage';
import ClosetAddedPage from '../pages/closet/ClosetAddedPage';
import ClosetCompletePage from '../pages/closet/ClosetCompletePage';
import ClosetItemDetailPage from '../pages/closet/ClosetItemDetailPage';
import ClosetItemDeletePage from '../pages/closet/ClosetItemDeletePage';
import ClosetItemListPage from '../pages/closet/ClosetItemListPage';
import ClosetIntroPage from '../pages/closet/ClosetIntroPage';

// 3. 홈

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
      // 홈 탭 = 코디 시작 홈 (develop에서 빈 홈 화면을 걷어냄)
      path: '/home',
      element: <ProtectedRoute><StylingStartPage /></ProtectedRoute>,
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
  // 영수증은 여러 장이라 ?receipt=N으로 몇 번째 장인지 지정한다 (N은 1부터 = 화면의 '영수증 N').
  // receipt 없이 들어오면(주소 직접 입력 등) 첫 장을 본다
  {
    path: '/closet/register/confirm',
    element: <ProtectedRoute><ClosetOcrConfirmPage /></ProtectedRoute>,
  },
  {
    path: '/closet/register/edit',
    element: <ProtectedRoute><ClosetOcrEditPage /></ProtectedRoute>,
  },
  {
    path: '/closet/register/ocr-complete',
    element: <ProtectedRoute><ClosetOcrCompletePage /></ProtectedRoute>,
  },
  // 직접 입력 — ?receipt=N이면 그 장(인식 실패분)을 덮어쓰고, 없으면 새 장으로 추가된다
  {
    path: '/closet/register/manual',
    element: <ProtectedRoute><ClosetOcrEditPage mode="manual" /></ProtectedRoute>,
  },
  {
    path: '/closet/register/receipt-method',
    element: <ProtectedRoute><ClosetReceiptMethodPage /></ProtectedRoute>,
  },
  // 태그 확인·수정 — 진입 경로는 아직 미정(회의 후 연결). 지금은 주소로만 들어갈 수 있다
  {
    path: '/closet/register/tags',
    element: <ProtectedRoute><ClosetTagConfirmPage /></ProtectedRoute>,
  },
  {
    path: '/closet/register/tags/photo',
    element: <ProtectedRoute><ClosetPhotoEditPage /></ProtectedRoute>,
  },
  {
    path: '/closet/register/tags/edit',
    element: <ProtectedRoute><ClosetTagEditPage /></ProtectedRoute>,
  },
  {
    path: '/closet/register/upload-guide',
    element: <ProtectedRoute><ClosetUploadGuidePage /></ProtectedRoute>,
  },
  {
    path: '/closet/register/receipt-check',
    element: <ProtectedRoute><ClosetReceiptCheckPage /></ProtectedRoute>,
  },
  {
    path: '/closet/register/receipt-recognizing',
    element: <ProtectedRoute><ClosetReceiptRecognizingPage /></ProtectedRoute>,
  },
  {
    path: '/closet/register/receipt-confirm',
    element: <ProtectedRoute><ClosetReceiptDonePage /></ProtectedRoute>,
  },
  {
    path: '/closet/register/receipt-failed',
    element: <ProtectedRoute><ClosetReceiptFailedPage /></ProtectedRoute>,
  },
  {
    path: '/closet/register/photo',
    element: <ProtectedRoute><ClosetPhotoPage /></ProtectedRoute>,
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
