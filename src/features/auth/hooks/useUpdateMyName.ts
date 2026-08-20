import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateMyName } from '../api/authApi';

const useUpdateMyName = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMyName,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users', 'me'] }),
  });
};

export default useUpdateMyName;
