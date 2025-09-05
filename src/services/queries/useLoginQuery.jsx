import { useMutation } from '@tanstack/react-query';
import { loginUser } from '../API/authAPI';

export const useLoginMutation = (onSuccess, onError) => {
  return useMutation({
    mutationFn: ({ email, password }) => loginUser(email, password),
    onSuccess,
    onError,
  });
};
