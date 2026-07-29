import { useMutation } from '@tanstack/react-query';
import { signup } from '../api/authApi';

/** AUTH-01 이메일 회원가입 mutation */
const useSignup = () => useMutation({ mutationFn: signup });

export default useSignup;
