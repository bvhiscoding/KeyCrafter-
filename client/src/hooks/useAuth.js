import { useMemo } from 'react';

import { useAppSelector } from '@/app/hooks';

const useAuth = () => {
  const { isAuthenticated, user, token } = useAppSelector((state) => state.auth);

  return useMemo(
    () => ({
      isAuthenticated,
      user,
      token,
      isAdmin: user?.role === 'admin',
    }),
    [isAuthenticated, token, user],
  );
};

export default useAuth;
