import { useMutation } from '@tanstack/react-query';

import { saveRetouchedOutfit } from '@/features/codyplay/api/codyPlayApi';

const useSaveRetouchedOutfit = () =>
  useMutation({
    mutationFn: saveRetouchedOutfit,
  });

export default useSaveRetouchedOutfit;
