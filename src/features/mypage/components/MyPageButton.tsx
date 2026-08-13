interface MyPageButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

const MyPageButton = ({ variant = 'primary', className = '', ...props }: MyPageButtonProps) => (
  <button
    type="button"
    className={`h-[58px] w-full rounded-[32px] text-[16px] font-semibold tracking-[-0.32px] ${
      variant === 'primary' ? 'bg-[#1F2124] text-white' : 'bg-[#F6F7F8] text-[#1F2124]'
    } disabled:bg-[#E6E8EA] disabled:text-[#959BA7] ${className}`}
    {...props}
  />
);

export default MyPageButton;
