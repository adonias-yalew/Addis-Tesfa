import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  Calendar,
  Home,
  Users,
  Sparkles,
  FileText,
  BookOpen,
  Stethoscope,
  MessageSquare,
  NotebookText,
  User,
  Settings,
  Shield,
  Heart,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth, useIsAdmin, useIsProfessional } from "../hooks/useAuth.tsx";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar = ({ collapsed, onToggle }: SidebarProps) => {
  const { isAuthenticated } = useAuth();
  const isAdmin = useIsAdmin();
  const isProfessional = useIsProfessional();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const inProfessionalWorkspace = isProfessional;

  const professionalNavItems = [
    { to: "/professional/dashboard", icon: Home, label: "Home", end: true },
    { to: "/community", icon: Users, label: "Community" },
    { to: "/copilot", icon: Sparkles, label: "AI Copilot" },
    { to: "/blogs", icon: BookOpen, label: "Blogs & Resources" },
    { to: "/professional/my-blogs", icon: FileText, label: "My Blogs" },
    { to: "/professional/clients", icon: Users, label: "Clients" },
    { to: "/professional/messages", icon: MessageSquare, label: "Messages" },
    { to: "/professional/notes", icon: NotebookText, label: "Notes" },
    { to: "/contact", icon: HelpCircle, label: "Help & Contact" },
  ];

  const platformNavItems = [
    { to: "/user/dashboard", icon: Home, label: "Home" },
    { to: "/community", icon: Users, label: "Community" },
    ...(isAuthenticated
      ? [{ to: "/copilot", icon: Sparkles, label: "AI Copilot" }]
      : []),
    { to: "/blogs", icon: BookOpen, label: "Blogs & Resources" },
    { to: "/professionals", icon: Stethoscope, label: "Find Professionals" },
    { to: "/contact", icon: HelpCircle, label: "Help & Contact" },
    ...(isAuthenticated
      ? [{ to: "/my-posts", icon: FileText, label: "My Posts" }]
      : []),
  ];

  const navItems = inProfessionalWorkspace
    ? professionalNavItems
    : platformNavItems;

  const roleItems = inProfessionalWorkspace
    ? []
    : [
        ...(isProfessional
          ? [
              {
                to: "/professional/dashboard",
                icon: Stethoscope,
                label: "Professional Dashboard",
              },
            ]
          : []),
        ...(isAdmin
          ? [{ to: "/admin/dashboard", icon: Shield, label: "Admin Panel" }]
          : []),
      ];

  const platformBottomItems = [
    ...(isAuthenticated
      ? [
          { to: "/profile", icon: User, label: "Profile" },
          { to: "/settings", icon: Settings, label: "Settings" },
        ]
      : []),
  ];

  const professionalBottomItems = [
    { to: "/profile", icon: User, label: "Profile" },
    { to: "/settings", icon: Settings, label: "Settings" },
  ];

  const bottomItems = inProfessionalWorkspace
    ? professionalBottomItems
    : platformBottomItems;

  // Close sidebar on mobile when clicking outside
  const handleOverlayClick = () => {
    if (isMobile && !collapsed) {
      onToggle();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && !collapsed && (
        <div
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={handleOverlayClick}
        />
      )}

      <aside
        className={`h-screen fixed left-0 top-0 bg-white/92 backdrop-blur-xl border-r border-slate-200/80 flex flex-col z-50 shadow-[18px_0_60px_-46px_rgba(15,23,42,0.7)] transition-all duration-300 ease-out ${
          collapsed ? "w-20" : "w-64"
        } ${isMobile && collapsed ? "-translate-x-full" : "translate-x-0"}`}
      >
        <div className="h-[72px] px-4 border-b border-slate-200/80 flex items-center justify-between">
          <NavLink
            to="/"
            className={`flex items-center gap-3 ${collapsed ? "justify-center w-full" : ""}`}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-600/20 ring-1 ring-white/40">
              <Heart className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <h1 className="font-semibold text-[15px] tracking-tight text-slate-950 whitespace-nowrap">
                  Addis Tesfa
                </h1>
                <p className="text-[11px] font-medium text-slate-500 whitespace-nowrap">
                  Support platform
                </p>
              </div>
            )}
          </NavLink>

          {!isMobile && (
            <button
              onClick={onToggle}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/professional/dashboard"}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700 font-semibold shadow-[inset_0_0_0_1px_rgba(37,99,235,0.10)]"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                } ${collapsed ? "justify-center" : ""}`
              }
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <span className="whitespace-nowrap overflow-hidden">
                  {item.label}
                </span>
              )}
            </NavLink>
          ))}

          {/* Role-based sections */}
          {roleItems.length > 0 && (
            <>
              <div
                className={`pt-4 mt-4 border-t border-slate-200/80 ${collapsed ? "px-2" : "px-1"}`}
              >
                {!collapsed && (
                  <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Workspace
                  </p>
                )}
                {roleItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                        isActive
                          ? "bg-emerald-50 text-emerald-700 font-semibold shadow-[inset_0_0_0_1px_rgba(37,99,235,0.10)]"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                      } ${collapsed ? "justify-center" : ""}`
                    }
                    title={collapsed ? item.label : undefined}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {!collapsed && (
                      <span className="whitespace-nowrap overflow-hidden">
                        {item.label}
                      </span>
                    )}
                  </NavLink>
                ))}
              </div>
            </>
          )}
        </nav>

        {bottomItems.length > 0 && (
          <div className="p-3 border-t border-slate-200/80 space-y-1.5">
            {bottomItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700 font-semibold shadow-[inset_0_0_0_1px_rgba(37,99,235,0.10)]"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                  } ${collapsed ? "justify-center" : ""}`
                }
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && (
                  <span className="whitespace-nowrap overflow-hidden">
                    {item.label}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
