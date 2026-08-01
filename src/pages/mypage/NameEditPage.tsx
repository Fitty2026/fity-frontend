import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import MyPageButton from '@/features/mypage/components/MyPageButton';
import MyPageScaffold from '@/features/mypage/components/MyPageScaffold';
import profilePlaceholder from '@/assets/images/mypage/profile-placeholder.svg';
import cameraFab from '@/assets/images/mypage/camera-fab.svg';
import cameraIcon from '@/assets/images/mypage/camera.svg';
import albumIcon from '@/assets/images/mypage/album.svg';

const NameEditPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [showPhotoSheet, setShowPhotoSheet] = useState(false);
  const isValid = name.trim().length >= 2 && name.trim().length <= 10;

  return (
    <MyPageScaffold
      title="이름 수정"
      footer={
        <MyPageButton disabled={!isValid} onClick={() => navigate('/mypage/profile')}>
          저장하기
        </MyPageButton>
      }
    >
      <div className="px-6 pt-8">
        <div className="relative mx-auto w-fit">
          <img src={profilePlaceholder} alt="프로필" className="h-[120px] w-[120px]" />
          <button
            type="button"
            onClick={() => setShowPhotoSheet(true)}
            className="absolute bottom-[-8px] right-[-16px] h-16 w-16"
          >
            <img src={cameraFab} alt="프로필 사진 수정" className="h-full w-full" />
          </button>
        </div>
        <label className="mt-12 block text-[16px] font-semibold text-[#1F2124]">이름</label>
        <div className="mt-2 flex h-[50px] items-center rounded-[8px] border border-[#E6E8EA] px-4">
          <input
            value={name}
            maxLength={10}
            onChange={(event) => setName(event.target.value)}
            placeholder="이름을 입력해주세요"
            className="min-w-0 flex-1 outline-none placeholder:text-[#B2B8BD]"
          />
          {name ? (
            <button type="button" onClick={() => setName('')} className="text-[#959BA7]">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#959BA7] text-[12px] text-white">
                ×
              </span>
            </button>
          ) : null}
        </div>
        <p className="mt-2 text-[12px] text-[#B2B8BD]">2~10자 이내로 입력해주세요</p>
      </div>
      {showPhotoSheet ? (
        <button
          type="button"
          aria-label="프로필 사진 메뉴 닫기"
          onClick={() => setShowPhotoSheet(false)}
          className="absolute inset-0 z-20 flex items-end bg-black/10 text-left"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="w-full rounded-t-[56px] bg-[#F6F7F8] pb-10 pt-8 shadow-[0_-1px_8px_rgba(0,0,0,0.16)]"
          >
            <h2 className="pb-8 text-center text-[20px] font-semibold">프로필 사진 추가</h2>
            {[
              [cameraIcon, '카메라로 촬영'],
              [albumIcon, '앨범에서 선택'],
            ].map(([icon, label]) => (
              <button
                key={label}
                type="button"
                className="flex h-[80px] w-full items-center gap-10 border-t border-[#E6E8EA] px-6 text-left text-[16px] font-bold"
              >
                <img src={icon} alt="" className="h-8 w-8" />
                {label}
              </button>
            ))}
          </div>
        </button>
      ) : null}
    </MyPageScaffold>
  );
};

export default NameEditPage;
