import ClosetLoadingPage from './ClosetLoadingPage';

/**
 * 구매내역 인식 로딩 — 로딩 화면의 import 흐름.
 * (분석 흐름과 UI가 동일해 ClosetLoadingPage를 재사용)
 */
const ClosetRecognizingPage = () => <ClosetLoadingPage variant="import" />;

export default ClosetRecognizingPage;
