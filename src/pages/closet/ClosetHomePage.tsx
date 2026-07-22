import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageeLayout';
import { ClosetBottomNav, ClosetSearchField, ClosetTopBar } from '@/features/closet/components';
import { matchesQuery } from '@/features/closet/searchItems';
import useClosetStore from '@/store/closetStore';
import type { ClothingItem } from '@/types';

/** 카테고리 행 노출 순서 (해당 카테고리 옷이 있을 때만 표시) */
const ROW_CATEGORIES = ['아우터', '상의', '하의', '신발', '가방', '액세서리'] as const;

/** 현황 카테고리 아이콘 — 32×32, #5A6169 */
const StatIcon = ({ kind }: { kind: 'top' | 'bottom' | 'shoes' | 'etc' }) => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    {kind === 'top' && (
      <path d="M30.949 7.6525L24.479 4.125C24.3324 4.04389 24.1678 4.0009 24.0002 4H20.0002C19.735 4 19.4807 4.10536 19.2931 4.29289C19.1056 4.48043 19.0002 4.73478 19.0002 5C19.0002 5.79565 18.6842 6.55871 18.1216 7.12132C17.559 7.68393 16.7959 8 16.0002 8C15.2046 8 14.4415 7.68393 13.8789 7.12132C13.3163 6.55871 13.0002 5.79565 13.0002 5C13.0002 4.73478 12.8949 4.48043 12.7073 4.29289C12.5198 4.10536 12.2655 4 12.0002 4H8.00024C7.83228 4.0007 7.66721 4.04368 7.52024 4.125L1.05149 7.6525C0.590369 7.89619 0.2447 8.3128 0.0902809 8.81097C-0.0641384 9.30914 -0.0147045 9.84822 0.227743 10.31L2.63649 14.9113C2.81164 15.2421 3.07417 15.5185 3.39551 15.7105C3.71685 15.9024 4.08469 16.0026 4.45899 16H7.00024V26C7.00024 26.5304 7.21096 27.0391 7.58603 27.4142C7.9611 27.7893 8.46981 28 9.00024 28H23.0002C23.5307 28 24.0394 27.7893 24.4145 27.4142C24.7895 27.0391 25.0002 26.5304 25.0002 26V16H27.5427C27.917 16.0026 28.2849 15.9024 28.6062 15.7105C28.9276 15.5185 29.1901 15.2421 29.3652 14.9113L31.774 10.31C32.0163 9.84807 32.0656 9.30887 31.9109 8.81068C31.7563 8.31249 31.4103 7.89598 30.949 7.6525ZM4.45899 14C4.44052 14.0009 4.42234 13.9951 4.40774 13.9838L2.01149 9.4075L7.00024 6.685V14H4.45899ZM23.0002 26H9.00024V6H11.1002C11.331 7.12895 11.9445 8.14356 12.8372 8.87222C13.7298 9.60089 14.8467 9.99888 15.999 9.99888C17.1513 9.99888 18.2682 9.60089 19.1608 8.87222C20.0535 8.14356 20.667 7.12895 20.8977 6H23.0002V26ZM27.594 13.9825C27.5871 13.9887 27.579 13.9935 27.5702 13.9965C27.5614 13.9995 27.552 14.0007 27.5427 14H25.0002V6.685L29.9902 9.4075L27.594 13.9825Z" fill="#5A6169" />
    )}
    {kind === 'bottom' && (
      <path d="M27.9847 26.75L25.2347 4.75C25.1738 4.26657 24.9385 3.822 24.573 3.49977C24.2075 3.17755 23.737 2.99983 23.2497 3H8.74971C8.26246 2.99983 7.7919 3.17755 7.42641 3.49977C7.06091 3.822 6.82562 4.26657 6.76471 4.75L4.01471 26.75C3.97923 27.0316 4.00409 27.3175 4.08764 27.5887C4.17118 27.86 4.31149 28.1103 4.49925 28.3231C4.68701 28.536 4.91791 28.7064 5.17662 28.8231C5.43532 28.9398 5.7159 29.0001 5.99971 29H11.086C11.5307 29.0001 11.9628 28.8519 12.314 28.5789C12.6651 28.3059 12.9152 27.9236 13.0247 27.4925L15.9997 15.9925L18.9735 27.485C19.0816 27.9177 19.3313 28.3018 19.6828 28.5763C20.0343 28.8508 20.4675 28.9999 20.9135 29H25.9997C26.2835 29.0001 26.5641 28.9398 26.8228 28.8231C27.0815 28.7064 27.3124 28.536 27.5002 28.3231C27.6879 28.1103 27.8282 27.86 27.9118 27.5887C27.9953 27.3175 28.0202 27.0316 27.9847 26.75ZM24.1122 11.9C23.3968 11.7358 22.74 11.3786 22.2133 10.8674C21.6866 10.3561 21.3101 9.71024 21.1247 9H23.7497L24.1122 11.9ZM23.2497 5L23.4997 7H8.49971L8.74971 5H23.2497ZM8.24971 9H10.8747C10.6893 9.71024 10.3128 10.3561 9.78609 10.8674C9.25939 11.3786 8.60264 11.7358 7.88721 11.9L8.24971 9ZM11.086 27H5.99971L7.62471 13.9663C8.92718 13.828 10.1488 13.268 11.1037 12.3715C12.0586 11.475 12.6946 10.2912 12.9147 9H14.9997V11.875L11.086 27ZM20.911 26.9925L16.9997 11.875V9H19.0847C19.3049 10.2912 19.9408 11.475 20.8957 12.3715C21.8506 13.268 23.0722 13.828 24.3747 13.9663L25.9997 27L20.911 26.9925Z" fill="#5A6169" />
    )}
    {kind === 'shoes' && (
      <path d="M28.5812 16.1388L20.99 13.6088C20.5952 13.4769 20.2322 13.2644 19.9241 12.9846C19.6159 12.7048 19.3693 12.364 19.2 11.9838L16.2987 5.20005C16.2987 5.20005 16.2987 5.1913 16.2987 5.18755C16.0922 4.72416 15.7172 4.35661 15.2497 4.15934C14.7823 3.96206 14.2574 3.9498 13.7812 4.12505L4.31625 7.5613C3.93091 7.70244 3.59813 7.95834 3.36276 8.29451C3.1274 8.63068 3.00079 9.03093 3 9.4413V24.0001C3 24.5305 3.21071 25.0392 3.58579 25.4143C3.96086 25.7893 4.46957 26.0001 5 26.0001H30C30.5304 26.0001 31.0391 25.7893 31.4142 25.4143C31.7893 25.0392 32 24.5305 32 24.0001V20.8826C32.0001 19.8331 31.6699 18.8102 31.0564 17.9588C30.4428 17.1074 29.5768 16.4707 28.5812 16.1388ZM14.465 6.00005L15.3538 8.0788L12.6587 9.06005C12.4377 9.14029 12.252 9.29588 12.1342 9.49948C12.0165 9.70308 11.9743 9.94166 12.015 10.1733C12.0558 10.4049 12.1769 10.6148 12.357 10.766C12.5371 10.9172 12.7648 11.0001 13 11.0001C13.1165 10.9999 13.232 10.9792 13.3413 10.9388L16.1413 9.9213L16.7337 11.3051L14.6587 12.0551C14.4341 12.1327 14.2444 12.2879 14.1238 12.4928C14.0032 12.6977 13.9595 12.9388 14.0006 13.173C14.0416 13.4071 14.1648 13.619 14.348 13.7706C14.5311 13.9221 14.7623 14.0035 15 14.0001C15.1165 13.9999 15.232 13.9792 15.3413 13.9388L17.5413 13.1388C17.7936 13.6033 18.1176 14.0252 18.5012 14.3888L16.6588 15.0588C16.4368 15.1384 16.2501 15.2939 16.1317 15.4978C16.0133 15.7017 15.9707 15.9409 16.0115 16.1732C16.0524 16.4054 16.174 16.6158 16.3548 16.7671C16.5357 16.9184 16.7642 17.0009 17 17.0001C17.1163 16.9997 17.2318 16.9794 17.3412 16.9401L20.8412 15.6676L27.95 18.0363C28.4026 18.1876 28.8125 18.4447 29.1458 18.7863C29.4791 19.1278 29.726 19.5439 29.8662 20.0001H5V9.4413L14.465 6.00005ZM5 24.0001V22.0001H30V24.0001H5Z" fill="#5A6169" />
    )}
    {kind === 'etc' && (
      <path d="M23 5H9C7.14409 5.00199 5.36477 5.74012 4.05245 7.05245C2.74012 8.36477 2.00199 10.1441 2 12V24C2 24.5304 2.21071 25.0391 2.58579 25.4142C2.96086 25.7893 3.46957 26 4 26H28C28.5304 26 29.0391 25.7893 29.4142 25.4142C29.7893 25.0391 30 24.5304 30 24V12C29.998 10.1441 29.2599 8.36477 27.9476 7.05245C26.6352 5.74012 24.8559 5.00199 23 5ZM28 12V13H24V7.1C25.1286 7.33205 26.1427 7.94613 26.8713 8.8387C27.6 9.73128 27.9986 10.8478 28 12ZM17 17H15V13H17V17ZM14 19H18C18.2652 19 18.5196 18.8946 18.7071 18.7071C18.8946 18.5196 19 18.2652 19 18V15H22V24H10V15H13V18C13 18.2652 13.1054 18.5196 13.2929 18.7071C13.4804 18.8946 13.7348 19 14 19ZM19 13V12C19 11.7348 18.8946 11.4804 18.7071 11.2929C18.5196 11.1054 18.2652 11 18 11H14C13.7348 11 13.4804 11.1054 13.2929 11.2929C13.1054 11.4804 13 11.7348 13 12V13H10V7H22V13H19ZM8 7.1V13H4V12C4.00141 10.8478 4.40003 9.73128 5.12866 8.8387C5.8573 7.94613 6.87139 7.33205 8 7.1ZM4 15H8V24H4V15ZM28 24H24V15H28V24Z" fill="#5A6169" />
    )}
  </svg>
);

/** 현황 카드 + 버튼 — 27×27 (#9D98F0 원 포함) */
const PlusSmallIcon = () => (
  <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="13.5" cy="13.5" r="13.5" fill="#9D98F0" />
    <path d="M19.125 13.5C19.125 13.6243 19.0756 13.7435 18.9877 13.8315C18.8998 13.9194 18.7806 13.9688 18.6562 13.9688H13.9688V18.6562C13.9688 18.7806 13.9194 18.8998 13.8315 18.9877C13.7435 19.0756 13.6243 19.125 13.5 19.125C13.3757 19.125 13.2565 19.0756 13.1685 18.9877C13.0806 18.8998 13.0312 18.7806 13.0312 18.6562V13.9688H8.34375C8.21943 13.9688 8.1002 13.9194 8.01229 13.8315C7.92439 13.7435 7.875 13.6243 7.875 13.5C7.875 13.3757 7.92439 13.2565 8.01229 13.1685C8.1002 13.0806 8.21943 13.0312 8.34375 13.0312H13.0312V8.34375C13.0312 8.21943 13.0806 8.1002 13.1685 8.01229C13.2565 7.92439 13.3757 7.875 13.5 7.875C13.6243 7.875 13.7435 7.92439 13.8315 8.01229C13.9194 8.1002 13.9688 8.21943 13.9688 8.34375V13.0312H18.6562C18.7806 13.0312 18.8998 13.0806 18.9877 13.1685C19.0756 13.2565 19.125 13.3757 19.125 13.5Z" fill="#F6F7F8" />
  </svg>
);

/** 빈 옷장 점선 원 — 60×60 */
const EmptyDashedIcon = () => (
  <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M45.9101 45.9101C50.1297 41.6905 52.5003 35.9675 52.5003 30.0001C52.5003 24.0327 50.1297 18.3097 45.9101 14.0901C41.6905 9.87054 35.9675 7.5 30.0001 7.5C24.0327 7.5 18.3097 9.87054 14.0901 14.0901M45.9101 45.9101C41.6905 50.1297 35.9675 52.5003 30.0001 52.5003C24.0327 52.5003 18.3097 50.1297 14.0901 45.9101C9.87054 41.6905 7.5 35.9675 7.5 30.0001C7.5 24.0327 9.87054 18.3097 14.0901 14.0901M45.9101 45.9101L14.0901 14.0901" stroke="#1F2124" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="8 8" />
  </svg>
);

/** 옷 추가하기 + 아이콘 — 32×32 */
const PlusCircleIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 12V20M20 16H12M28 16C28 17.5759 27.6896 19.1363 27.0866 20.5922C26.4835 22.0481 25.5996 23.371 24.4853 24.4853C23.371 25.5996 22.0481 26.4835 20.5922 27.0866C19.1363 27.6896 17.5759 28 16 28C14.4241 28 12.8637 27.6896 11.4078 27.0866C9.95189 26.4835 8.62902 25.5996 7.51472 24.4853C6.40042 23.371 5.5165 22.0481 4.91345 20.5922C4.31039 19.1363 4 17.5759 4 16C4 12.8174 5.26428 9.76516 7.51472 7.51472C9.76516 5.26428 12.8174 4 16 4C19.1826 4 22.2348 5.26428 24.4853 7.51472C26.7357 9.76516 28 12.8174 28 16Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** 쇼핑몰 연동 쇼핑백 아이콘 — 32×32 */
const BagIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 14V8C21 6.67392 20.4732 5.40215 19.5355 4.46447C18.5978 3.52678 17.3261 3 16 3C14.6739 3 13.4021 3.52678 12.4644 4.46447C11.5268 5.40215 11 6.67392 11 8V14M26.1413 11.3427L27.8253 27.3427C27.9186 28.2293 27.2253 29 26.3333 29H5.66665C5.45626 29.0002 5.24817 28.9562 5.05591 28.8708C4.86365 28.7853 4.69151 28.6604 4.55068 28.5041C4.40984 28.3478 4.30347 28.1636 4.23845 27.9635C4.17344 27.7634 4.15125 27.5519 4.17331 27.3427L5.85865 11.3427C5.89752 10.9741 6.07148 10.6329 6.34698 10.385C6.62248 10.1371 6.98002 9.99993 7.35065 10H24.6493C25.4173 10 26.0613 10.58 26.1413 11.3427ZM11.5 14C11.5 14.1326 11.4473 14.2598 11.3535 14.3536C11.2598 14.4473 11.1326 14.5 11 14.5C10.8674 14.5 10.7402 14.4473 10.6464 14.3536C10.5527 14.2598 10.5 14.1326 10.5 14C10.5 13.8674 10.5527 13.7402 10.6464 13.6464C10.7402 13.5527 10.8674 13.5 11 13.5C11.1326 13.5 11.2598 13.5527 11.3535 13.6464C11.4473 13.7402 11.5 13.8674 11.5 14ZM21.5 14C21.5 14.1326 21.4473 14.2598 21.3535 14.3536C21.2598 14.4473 21.1326 14.5 21 14.5C20.8674 14.5 20.7402 14.4473 20.6464 14.3536C20.5527 14.2598 20.5 14.1326 20.5 14C20.5 13.8674 20.5527 13.7402 20.6464 13.6464C20.7402 13.5527 20.8674 13.5 21 13.5C21.1326 13.5 21.2598 13.5527 21.3535 13.6464C21.4473 13.7402 21.5 13.8674 21.5 14Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** 옷 가로 스크롤 행 — 스크롤바 숨김 + 하단 구분선(좌우 24). 아이템 클릭 시 상세 이동 */
const ClothesRow = ({ items, onItemClick }: { items: ClothingItem[]; onItemClick: (id: string) => void }) => (
  <div>
    <div className="flex gap-2 overflow-x-auto px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {items.map((item) => (
        <button key={item.id} type="button" onClick={() => onItemClick(item.id)} className="shrink-0 cursor-pointer">
          <img src={item.imageUrl} alt={item.tags.join(' ')} loading="lazy" className="h-[134px] w-[104px] rounded-2xl object-cover" />
        </button>
      ))}
    </div>
    {/* 구분선 — 좌우 24 안쪽 */}
    <div className="mx-6 mt-4 border-b border-[#E6E8EA]" />
  </div>
);

/**
 * 내 옷장 홈 — 등록된 옷 없음(빈 상태) / 있음(목록) 두 상태.
 * 데이터: mockClosetItems (백엔드 연결 시 API 응답으로 대체)
 */
const ClosetHomePage = () => {
  const navigate = useNavigate();
  const items = useClosetStore((state) => state.items);
  const filled = items.length > 0;
  const [search, setSearch] = useState('');

  // 현황 카드 카운트 — items 바뀔 때만 재계산 (검색과 무관, 전체 기준)
  const counts = useMemo(() => {
    const countOf = (category: string) => items.filter((item) => item.category === category).length;
    const top = countOf('상의');
    const bottom = countOf('하의');
    const shoes = countOf('신발');
    // 기타 = 상의/하의/신발 외 전부 (아우터·가방·액세서리)
    return { top, bottom, shoes, etc: items.length - top - bottom - shoes };
  }, [items]);

  // 검색 결과를 카테고리 행으로 분할 — items·search 바뀔 때만 재계산
  const rows = useMemo(() => {
    const visibleItems = items.filter((item) => matchesQuery(item, search));
    return ROW_CATEGORIES.map((category) => ({
      category,
      items: visibleItems.filter((item) => item.category === category),
    })).filter((row) => row.items.length > 0);
  }, [items, search]);

  return (
    <PageLayout showHeader={false} showBottomNav={false} className="flex flex-col min-h-0">
      <div className="relative flex flex-col flex-1 min-h-0 bg-white">
        <ClosetTopBar height={53} />

        {filled ? (
          /* 옷 있는 상태 (러프 — 세부 스펙 대기) */
          <div className="flex-1 min-h-0 overflow-y-auto">
            {/* 내 옷장 현황 카드 — 375×149, padding 16/24, gap 16, bg #F6F7F8 */}
            <div className="flex flex-col gap-4 bg-[#F6F7F8] px-6 py-4">
              <div className="flex items-center justify-between">
                <span className="text-[16px] font-semibold leading-[1.6] tracking-[-0.02em] text-black">내 옷장 현황</span>
                <button
                  type="button"
                  onClick={() => navigate('/closet/register')}
                  className="cursor-pointer"
                  aria-label="옷 추가"
                >
                  <PlusSmallIcon />
                </button>
              </div>
              <div className="flex items-center justify-between">
                {(
                  [
                    { kind: 'top', label: '상의', count: counts.top },
                    { kind: 'bottom', label: '하의', count: counts.bottom },
                    { kind: 'shoes', label: '신발', count: counts.shoes },
                    { kind: 'etc', label: '기타', count: counts.etc },
                  ] as const
                ).map((stat) => (
                  <div key={stat.kind} className="flex h-[42px] w-[70px] items-center justify-between">
                    <StatIcon kind={stat.kind} />
                    <span className="flex flex-col items-center">
                      <span className="text-[12px] font-medium leading-[1.65] tracking-[-0.02em] text-[#1F2124]">{stat.label}</span>
                      <span className="text-[16px] font-bold leading-[1.6] tracking-[-0.02em] text-[#1F2124]">{stat.count}</span>
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] font-medium leading-[1.65] tracking-[-0.02em] text-[#1F2124]">전체 의류 {items.length}</p>
            </div>

            {/* 카테고리 헤더 — 327×26, 현황 카드 아래 43 */}
            <div className="mt-[43px] flex items-center justify-between px-6">
              <span className="text-[16px] font-semibold leading-[1.6] tracking-[-0.02em] text-black">카테고리</span>
              <button
                type="button"
                onClick={() => navigate('/closet/items')}
                className="flex cursor-pointer items-center gap-1 text-[12px] font-medium leading-[1.65] tracking-[-0.02em] text-[#B2B8BD]"
              >
                전체보기
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.5 3L10.5 8L5.5 13" stroke="#B2B8BD" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {/* 검색바 — 헤더 아래 24 */}
            <div className="mt-6 px-6">
              <ClosetSearchField value={search} onChange={setSearch} />
            </div>

            {/* 카테고리별 옷 가로 스크롤 행 — 134 높이 */}
            <div className="mt-4 flex flex-col gap-4 pb-6">
              {rows.map((row) => (
                <ClothesRow
                  key={row.category}
                  items={row.items}
                  onItemClick={(id) => navigate(`/closet/${id}`)}
                />
              ))}
              {rows.length === 0 && (
                <p className="px-6 py-8 text-center text-[14px] font-medium leading-[1.6] tracking-[-0.02em] text-[#959BA7]">
                  검색 결과가 없어요
                </p>
              )}
            </div>
          </div>
        ) : (
          /* 빈 상태 */
          <div className="flex flex-1 flex-col">
            {/* 점선 아이콘 — 상단바 아래 156, 중앙 */}
            <div className="mt-[156px] flex flex-col items-center">
              <EmptyDashedIcon />
              <p className="mt-4 text-center text-[20px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#1F2124]">
                아직 등록된 옷이 없어요
              </p>
              <p className="mt-2 text-center text-[14px] font-medium leading-[1.6] tracking-[-0.02em] text-[#5A6169]">
                첫 번째 옷을 추가하고
                <br />
                나만의 스타일 데이터를 쌓아보세요
              </p>
            </div>

            {/* 액션 버튼 2개 — 326×80, radius16, bg #FFF 20%, shadow 0/8/16 8% */}
            <div className="mt-16 flex flex-col items-center gap-[11px] px-6">
              <button
                type="button"
                onClick={() => navigate('/closet/register')}
                className="flex h-20 w-full cursor-pointer items-center gap-10 rounded-2xl bg-white/20 p-6 text-left shadow-[0_8px_16px_0_rgba(0,0,0,0.08)]"
              >
                <PlusCircleIcon />
                <span className="text-[16px] font-bold leading-[1.6] tracking-[-0.02em] text-[#1F2124]">옷 추가하기</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/closet/register/platform')}
                className="flex h-20 w-full cursor-pointer items-center gap-10 rounded-2xl bg-white/20 p-6 text-left shadow-[0_8px_16px_0_rgba(0,0,0,0.08)]"
              >
                <BagIcon />
                <span className="text-[16px] font-bold leading-[1.6] tracking-[-0.02em] text-[#1F2124]">쇼핑몰 연동하기</span>
              </button>
            </div>
          </div>
        )}

        <ClosetBottomNav />
      </div>
    </PageLayout>
  );
};

export default ClosetHomePage;
