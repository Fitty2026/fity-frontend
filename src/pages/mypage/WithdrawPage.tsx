import { useNavigate } from 'react-router-dom';

import MyPageButton from '@/features/mypage/components/MyPageButton';
import MyPageScaffold from '@/features/mypage/components/MyPageScaffold';
import useWithdraw from '@/features/auth/hooks/useWithdraw';
import withdrawStar from '@/assets/images/mypage/withdraw-star.svg';
import withdrawData from '@/assets/images/mypage/withdraw-data.svg';
import withdrawAccount from '@/assets/images/mypage/withdraw-account.svg';

const warnings = [
  [withdrawStar, '스타 소멸', '보유하신 스타가 모두 소멸되고 복구가 불가해요'],
  [withdrawData, '데이터 삭제', '생성한 코디, 룩북 등 모든 데이터가 삭제돼요'],
  [withdrawAccount, '계정 복구 불가', '탈퇴 시 계정 복구가 불가능하며 모든 정보가 삭제돼요'],
];

const WithdrawPage = () => {
  const navigate = useNavigate();
  const withdrawMutation = useWithdraw();

  return (
    <MyPageScaffold
      title="Fitty"
      footer={
        <div className="space-y-2">
          {withdrawMutation.isError ? (
            <p className="text-center text-[13px] text-red-500">
              {withdrawMutation.error.message || '회원 탈퇴에 실패했습니다. 다시 시도해 주세요.'}
            </p>
          ) : null}
          <MyPageButton
            variant="secondary"
            disabled={withdrawMutation.isPending}
            onClick={() => navigate(-1)}
          >
            취소
          </MyPageButton>
          <MyPageButton
            disabled={withdrawMutation.isPending}
            onClick={() => withdrawMutation.mutate()}
          >
            {withdrawMutation.isPending ? '탈퇴 처리 중...' : '탈퇴하기'}
          </MyPageButton>
        </div>
      }
    >
      <div className="px-6 pt-14">
        <h2 className="text-center text-[20px] font-semibold">탈퇴하기</h2>
        <p className="mt-1 text-center text-[14px] text-[#5A6169]">
          아래 내용 확인 후 신중하게 결정해주세요
        </p>
        <div className="mt-14 space-y-2">
          {warnings.map(([icon, title, description]) => (
            <div
              key={title}
              className="flex h-[110px] items-center gap-10 rounded-[16px] bg-white px-6 shadow-[0_8px_16px_rgba(0,0,0,0.08)]"
            >
              <img src={icon} alt="" className="h-8 w-8" />
              <div>
                <h3 className="text-[16px] font-bold">{title}</h3>
                <p className="mt-2 text-[14px] leading-[160%] text-[#959BA7]">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MyPageScaffold>
  );
};

export default WithdrawPage;
