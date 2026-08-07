import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import MyPageButton from '@/features/mypage/components/MyPageButton';
import MyPageScaffold from '@/features/mypage/components/MyPageScaffold';
import straight from '@/assets/images/body/straight.png';
import wave from '@/assets/images/body/wave.png';
import natural from '@/assets/images/body/natural.png';
import cameraIcon from '@/assets/images/mypage/camera.svg';
import albumIcon from '@/assets/images/mypage/album.svg';

const bodies = [
  { label: '스트레이트 타입', image: straight },
  { label: '웨이브 타입', image: wave },
  { label: '내추럴 타입', image: natural },
];

const BodyEditPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'select' | 'upload'>('select');
  const [selected, setSelected] = useState<string>();
  return (
    <MyPageScaffold
      title="체형 수정"
      footer={<MyPageButton disabled={activeTab === 'upload' || !selected}>확인</MyPageButton>}
    >
      <div className="px-6 pt-8">
        <div className="grid grid-cols-2 border-b border-[#E6E8EA] text-center text-[16px] font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('select')}
            className={`pb-4 ${activeTab === 'select' ? 'border-b-2 border-[#1F2124] text-[#1F2124]' : 'text-[#B2B8BD]'}`}
          >
            체형 선택
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`pb-4 ${activeTab === 'upload' ? 'border-b-2 border-[#1F2124] text-[#1F2124]' : 'text-[#B2B8BD]'}`}
          >
            체형 업로드
          </button>
        </div>

        {activeTab === 'select' ? (
          <>
            <h2 className="mt-12 text-center text-[20px] font-semibold">체형을 선택해주세요</h2>
            <p className="mt-1 text-center text-[14px] text-[#5A6169]">
              이미지를 꾹 누르면 자세한 정보를 알 수 있어요
            </p>
            <div className="mt-12 grid grid-cols-3 gap-1">
              {bodies.map((body) => (
                <button
                  type="button"
                  key={body.label}
                  onClick={() => setSelected(body.label)}
                  className={`rounded-[12px] pb-3 ${selected === body.label ? 'bg-[#F6F7F8] ring-2 ring-[#1F2124]' : ''}`}
                >
                  <img
                    src={body.image}
                    alt={body.label}
                    className="h-[296px] w-full object-contain"
                  />
                  <span className="text-[12px] font-medium">{body.label}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="flex min-h-[460px] flex-col">
            <h2 className="mt-[86px] text-center text-[20px] font-semibold">
              체형을 업로드해주세요
            </h2>
            <div className="mt-auto space-y-3 pb-5">
              {[
                [cameraIcon, '카메라로 촬영', '/onboarding/body/camera'],
                [albumIcon, '앨범에서 선택', '/onboarding/body/upload'],
              ].map(([icon, label, path]) => (
                <button
                  type="button"
                  key={label}
                  onClick={() => navigate(path)}
                  className="flex h-[80px] w-full items-center gap-10 rounded-[16px] bg-white px-6 text-left shadow-[0_8px_16px_rgba(0,0,0,0.08)]"
                >
                  <img src={icon} alt="" className="h-8 w-8" />
                  <span className="text-[16px] font-bold text-[#1F2124]">{label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <p className="mt-4 text-right text-[12px] text-[#959BA7]">저장된 체형 : 슬림 스트레이트</p>
      </div>
    </MyPageScaffold>
  );
};

export default BodyEditPage;
