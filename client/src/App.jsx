import { RouterProvider } from 'react-router-dom';

import useAuth from '@/hooks/useAuth';
import { useGetWishlistQuery } from '@/features/user/user.api';
import router from '@/routes';

const App = () => {
  const { isAuthenticated } = useAuth();

  useGetWishlistQuery(undefined, {
    skip: !isAuthenticated,
  });

  return <RouterProvider router={router} />;
};

export default App;
