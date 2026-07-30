import { useMutation } from '@tanstack/react-query';
import { saveAgreements } from '../api/agreementApi';

/** USER-01 약관 동의 저장 mutation */
const useSaveAgreements = () => useMutation({ mutationFn: saveAgreements });

export default useSaveAgreements;
