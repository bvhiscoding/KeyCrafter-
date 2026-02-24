import { Outlet } from 'react-router-dom';

import Sidebar from '@/components/admin/Sidebar';

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <Sidebar />
      <section className="admin-content">
        <Outlet />
      </section>
    </div>
  );
};

export default AdminLayout;
