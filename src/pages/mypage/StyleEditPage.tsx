import MyPageButton from '@/features/mypage/components/MyPageButton';
import MyPageScaffold from '@/features/mypage/components/MyPageScaffold';
import styleMinimal from '@/assets/images/mypage/style-minimal.png';
import styleCasual from '@/assets/images/mypage/style-casual.png';

const StyleEditPage = () => (
  <MyPageScaffold title="스타일 수정" footer={<MyPageButton>저장하기</MyPageButton>}>
    <div className="px-6 pt-12">
      <h2 className="text-center text-[20px] font-semibold">스타일을 수정해주세요</h2>
      <div className="mt-14 grid grid-cols-[repeat(2,136px)] justify-between gap-y-8">
        {[styleMinimal, styleCasual].map((image, index) => (
          <img
            key={image}
            src={image}
            alt={`선호 스타일 ${index + 1}`}
            className={`h-[176px] w-[136px] object-cover ${index === 0 ? '-rotate-[5deg] rounded-[16px]' : 'rotate-[5deg] rounded-[24px]'}`}
          />
        ))}
        {[0, 1].map((slot) => (
          <button
            type="button"
            key={slot}
            className={`${slot === 0 ? 'rotate-[5deg]' : '-rotate-[5deg]'} h-[176px] w-[136px] rounded-[16px] border-2 border-dashed border-[#CED1D5] text-[44px] font-light text-[#B2B8BD]`}
          >
            ＋
          </button>
        ))}
      </div>
    </div>
  </MyPageScaffold>
);

export default StyleEditPage;
