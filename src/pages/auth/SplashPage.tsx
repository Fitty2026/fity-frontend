import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import BottomSheet from '@/components/ui/BottomSheet';
import { useState } from 'react';
import PageLayout from '@/components/layout/PageeLayout';

const SplashPage = () => {
  const [open, setOpen] = useState(false);

  return (
    <PageLayout showBottomNav={false} showHeader={false}>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-6 p-6 bg-white min-h-screen">
      <h1 className="text-xl font-bold">컴포넌트 테스트</h1>

      {/* Button */}
      <div className="flex flex-col gap-2">
        <p className="text-sm text-neutral-400">Button</p>
        <Button label="시작하기" fullWidth />
        <Button label="secondary" variant="secondary" fullWidth />
        <Button label="ghost" variant="ghost" fullWidth />
        <Button label="비활성" disabled fullWidth />
      </div>

      {/* Input */}
      <div className="flex flex-col gap-2">
        <p className="text-sm text-neutral-400">Input</p>
        <Input label="이메일" placeholder="이메일을 입력하세요" />
        <Input label="비밀번호" type="password" placeholder="비밀번호를 입력하세요" errorMessage="비밀번호가 틀렸어요" />
      </div>

      {/* Badge */}
      <div className="flex flex-col gap-2">
        <p className="text-sm text-neutral-400">Badge</p>
        <div className="flex gap-2 flex-wrap">
          <Badge label="미니멀" selected />
          <Badge label="캐주얼" />
          <Badge label="스트리트" />
          <Badge label="포멀" selected />
        </div>
      </div>

      {/* BottomSheet */}
      <div className="flex flex-col gap-2">
        <p className="text-sm text-neutral-400">BottomSheet</p>
        <Button label="바텀시트 열기" variant="secondary" onClick={() => setOpen(true)} />
        <BottomSheet isOpen={open} onClose={() => setOpen(false)} title="옷장 등록 방식">
          <div className="flex flex-col gap-3">
            <Button label="사진으로 직접 등록" fullWidth />
            <Button label="구매내역 연동" variant="secondary" fullWidth />
          </div>
        </BottomSheet>
      </div>
    </div>
      </div>
    </PageLayout>
  )
};

export default SplashPage;