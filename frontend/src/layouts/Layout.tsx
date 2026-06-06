import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const Layout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      // Auto-collapse on mobile
      if (mobile) {
        setSidebarCollapsed(true);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex min-h-screen bg-[var(--background)] text-[var(--text-primary)]">
      <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />

      <div 
        className={`flex-1 transition-[margin] duration-300 ease-out ${
          isMobile ? 'ml-0' : sidebarCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        <Topbar onMenuClick={toggleSidebar} />
        <main className="min-h-[calc(100vh-72px)] px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
