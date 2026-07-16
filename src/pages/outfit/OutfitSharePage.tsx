import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageeLayout';
import { mockOutfits } from '../../mocks/data/outfit';

import type { Outfit } from '../../types';

const OutfitSharePage = () => {
  const [result, setResult] = useState<Outfit>();

  useEffect(() => {
    setResult(mockOutfits?.[0]);
  }, []);

  const navigate = useNavigate();

  const downloadImg = () => {
    const imgUrl = 'image.jpg'; // 다운로드할 이미지 경로
    const link = document.createElement('a');
    link.href = imgUrl;
    link.download = `${'코디 이름'}.jpg`; // 저장될 파일 이름
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = () => {
    const url = 'https://example.com';
    navigator.clipboard.writeText(url).then(() => {
      alert('링크가 클립보드에 복사되었습니다.');
    });
  };

  const shareSns = () => {
    if (navigator.share) {
      navigator
        .share({
          title: '공유할 제목',
          text: '공유할 내용',
          url: 'https://example.com',
        })
        .then(() => console.log('성공적으로 공유되었습니다.'))
        .catch((error) => console.log('공유 실패:', error));
    } else {
      alert('이 브라우저는 공유 기능을 지원하지 않습니다.');
    }
  };

  return (
    <PageLayout>
      <div className="mt-[40px] mx-[40px]">
        <img
          className="rounded-[24px] aspect-[327/376] object-cover"
          src={result?.imageUrl}
          alt={result?.createdAt}
        ></img>
      </div>
    </PageLayout>
  );
};

export default OutfitSharePage;
