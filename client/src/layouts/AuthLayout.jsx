import { Outlet } from 'react-router-dom';

/* Auth pages (Login, Register, ForgotPassword, ResetPassword)
   render their own full-page layout with `.auth-layout` class. 
   This layout just provides the Outlet. */
const AuthLayout = () => {
  return <Outlet />;
};

export default AuthLayout;
