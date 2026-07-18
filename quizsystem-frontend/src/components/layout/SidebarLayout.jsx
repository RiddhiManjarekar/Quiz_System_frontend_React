import { useState, useCallback } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function SidebarLayout({ menuItems }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar = useCallback(() => {
    setSidebarOpen(true);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  return (
    <div className="flex min-h-dvh overflow-hidden bg-gray-100">
      {/* Sidebar */}

      <Sidebar
        menuItems={menuItems}
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />

      {/* Main Content */}

      <div
        className="
          flex min-h-dvh min-w-0 flex-1 flex-col
          transition-all duration-300
          lg:ml-72
        "
      >
        {/* Navbar */}

        <Navbar onMenuClick={openSidebar} />

        {/* Page Content */}

        <main
          className="
            flex-1
            min-w-0
            overflow-y-auto
            overflow-x-hidden
            bg-gray-50
            p-4
            sm:p-5
            lg:p-6
            xl:p-8
          "
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default SidebarLayout;