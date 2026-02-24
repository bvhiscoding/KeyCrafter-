import useAuth from '@/hooks/useAuth';

const Profile = () => {
  const { user } = useAuth();

  return (
    <section className="card stack-sm">
      <h1>Profile</h1>
      <p>
        Name: <strong>{user?.name || 'Guest User'}</strong>
      </p>
      <p>
        Email: <strong>{user?.email || 'N/A'}</strong>
      </p>
      <p>
        Role: <strong>{user?.role || 'user'}</strong>
      </p>
    </section>
  );
};

export default Profile;
