import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Shield, 
  Award,
  Edit3,
  Camera,
  Heart,
  MessageCircle,
  BookOpen,
  Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.tsx';
import Button from '../components/Button';
import Input from '../components/Input';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.email?.split('@')[0] || '',
    bio: '',
    email: user?.email || '',
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Call API to update profile
    setTimeout(() => {
      setIsLoading(false);
      setIsEditing(false);
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
          <p className="text-sm text-slate-600">
            Manage your profile and preferences
          </p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
        >
          <Edit3 className="w-4 h-4" />
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
            {isEditing && (
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-slate-800 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-900">
              {user?.email?.split('@')[0] || 'User'}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <Mail className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-600">{user?.email}</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              {user?.isAnonymous ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs">
                  <Shield className="w-3 h-3" />
                  Anonymous Mode
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs">
                  <User className="w-3 h-3" />
                  Public Profile
                </span>
              )}
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs">
                <Award className="w-3 h-3" />
                {user?.role || 'USER'}
              </span>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <form onSubmit={handleSave} className="mt-6 pt-6 border-t border-slate-100 space-y-4">
            <Input
              label="Display Name"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              placeholder="How you want to be called"
            />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell us a little about yourself..."
                rows={3}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
              />
            </div>
            <div className="flex gap-3">
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => setIsEditing(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                isLoading={isLoading}
                className="flex-1"
              >
                Save Changes
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 text-center">
          <BookOpen className="w-5 h-5 text-emerald-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-slate-900">0</p>
          <p className="text-xs text-slate-500">Posts</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 text-center">
          <Heart className="w-5 h-5 text-rose-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-slate-900">0</p>
          <p className="text-xs text-slate-500">Likes</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 text-center">
          <MessageCircle className="w-5 h-5 text-emerald-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-slate-900">0</p>
          <p className="text-xs text-slate-500">Comments</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 text-center">
          <Eye className="w-5 h-5 text-purple-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-slate-900">0</p>
          <p className="text-xs text-slate-500">Views</p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="font-semibold text-slate-900 mb-4">Quick Links</h3>
        <div className="space-y-2">
          <Link 
            to="/my-posts" 
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <BookOpen className="w-5 h-5 text-slate-400" />
            <span className="flex-1 text-slate-700">My Posts</span>
            <ArrowLeft className="w-4 h-4 text-slate-400 rotate-180" />
          </Link>
          <Link 
            to="/saved" 
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <Heart className="w-5 h-5 text-slate-400" />
            <span className="flex-1 text-slate-700">Saved Posts</span>
            <ArrowLeft className="w-4 h-4 text-slate-400 rotate-180" />
          </Link>
          <Link 
            to="/settings" 
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <Shield className="w-5 h-5 text-slate-400" />
            <span className="flex-1 text-slate-700">Settings</span>
            <ArrowLeft className="w-4 h-4 text-slate-400 rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
