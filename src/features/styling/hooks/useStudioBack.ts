import { useNavigate } from 'react-router-dom';

/** 스튜디오 플로우 진입 화면 — 히스토리가 없을 때 돌아갈 곳 */
const STUDIO_FALLBACK = '/styling/date';

/**
 * 뒤로가기 — URL 직접 진입처럼 이전 페이지가 없으면 navigate(-1)이 아무것도 하지 않는다.
 * react-router가 history.state에 넣어주는 idx로 판단해, 첫 진입이면 fallback으로 보낸다.
 */
const useStudioBack = (fallback: string = STUDIO_FALLBACK) => {
  const navigate = useNavigate();

  return () => {
    const historyIndex = (window.history.state as { idx?: number } | null)?.idx ?? 0;
    if (historyIndex > 0) navigate(-1);
    else navigate(fallback, { replace: true });
  };
};

export default useStudioBack;
