import { Outlet, useLocation } from "react-router-dom";

import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";

const MainLayout = () => {
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  return (
    <div className="app-shell">
      <Header />
      <main
        id="main-content"
        className={isHome ? "" : "container page-content"}
        style={
          isHome
            ? {
                /* Critical: constrain main width so carousel/keyboard don't expand it */
                width: "100%",
                maxWidth: "100vw",
                overflowX: "hidden",
                paddingBottom: 0,
              }
            : undefined
        }
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
