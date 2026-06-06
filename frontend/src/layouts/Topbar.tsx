import { Search, Bell, User, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth.tsx';
import { Link, useNavigate } from 'react-router-dom';

interface TopbarProps {
  onMenuClick?: () => void;
}

const Topbar = ({ onMenuClick }: TopbarProps) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="h-[72px] bg-white/82 backdrop-blur-xl border-b border-slate-200/80 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-40">
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-950 hover:bg-slate-100 rounded-lg transition-all"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-[18px] text-slate-400" />
            <input
              type="text"
              placeholder="Search stories, blogs, or professionals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-slate-50/90 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 shadow-inner shadow-slate-200/30 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
            />
          </div>
        </form>
      </div>

      <button 
        className="sm:hidden p-2 text-slate-500 hover:text-slate-950 hover:bg-slate-100 rounded-lg transition-all"
        onClick={() => navigate('/search')}
      >
        <Search className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-2 sm:gap-3">
        {isAuthenticated ? (
          <>
            <button className="relative p-2 text-slate-500 hover:text-slate-950 hover:bg-slate-100 rounded-lg transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
            </button>

            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-3 rounded-lg border border-transparent py-1.5 pl-1.5 pr-2 hover:border-slate-200 hover:bg-white hover:shadow-sm transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-500 flex items-center justify-center shadow-sm">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="hidden sm:block max-w-32 truncate text-sm font-medium text-slate-800">
                  {user?.isAnonymous ? 'Anonymous' : user?.email?.split('@')[0]}
                </span>
              </button>

              {showDropdown && (
                <div className="absolute right-0 top-full mt-2 w-60 bg-white border border-slate-200 rounded-xl shadow-elevated py-2 animate-fade-in">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-950 truncate">
                      {user?.isAnonymous ? 'Anonymous User' : user?.email}
                    </p>
                    <p className="text-xs font-medium text-slate-500 capitalize">
                      {user?.role.toLowerCase()}
                    </p>
                  </div>
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-950 transition-all"
                    onClick={() => setShowDropdown(false)}
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-950 transition-all"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-all shadow-sm shadow-emerald-600/20"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Topbar;
