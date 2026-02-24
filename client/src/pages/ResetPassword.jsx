import { Link } from 'react-router-dom';

const ResetPassword = () => {
  return (
    <section className="stack-md">
      <h1>Reset Password</h1>
      <input type="password" placeholder="New password" />
      <input type="password" placeholder="Confirm new password" />
      <button type="button" className="button">
        Update password
      </button>
      <Link to="/login">Back to login</Link>
    </section>
  );
};

export default ResetPassword;
