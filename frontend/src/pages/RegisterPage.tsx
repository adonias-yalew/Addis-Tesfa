import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Heart, ArrowRight, Check, X } from 'lucide-react';
import { authApi } from '../services/api';
import { getRoleDashboardPath, useAuth } from '../hooks/useAuth.tsx';

// Input sanitization helpers
const sanitizeEmail = (email: string): string => {
  return email
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9.@_+-]/g, '');
};

const sanitizePassword = (password: string): string => {
  // Allow common special characters but strip control characters
  return password.replace(/[\x00-\x1F\x7F]/g, '');
};

// Password validation
interface PasswordRequirements {
  minLength: boolean;
  hasSpecialChar: boolean;
  hasNumber: boolean;
  hasUppercase: boolean;
}

const checkPasswordStrength = (password: string): PasswordRequirements => {
  return {
    minLength: password.length >= 8,
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    hasNumber: /\d/.test(password),
    hasUppercase: /[A-Z]/.test(password),
  };
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    isAnonymous: true,
  });

  const passwordStrength = useMemo(() => checkPasswordStrength(formData.password), [formData.password]);
  const isPasswordValid = passwordStrength.minLength && passwordStrength.hasSpecialChar;
  const doPasswordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword.length > 0;

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeEmail(e.target.value);
    setFormData({ ...formData, email: sanitized });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizePassword(e.target.value);
    setFormData({ ...formData, password: sanitized });
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizePassword(e.target.value);
    setFormData({ ...formData, confirmPassword: sanitized });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (!passwordStrength.hasSpecialChar) {
      setError('Password must contain at least one special character');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const response = await authApi.register(
        formData.email,
        formData.password,
        formData.isAnonymous
      );
      const { token, user } = response.data.data;
      login(token, user);
      navigate(getRoleDashboardPath(user.role), { replace: true });
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } } };
      setError(axiosErr.response?.data?.error || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    'Anonymous posting by default',
    'Verified professional support',
    'Encrypted & secure',
    'Free forever'
  ];

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Benefits */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-5/12 bg-gradient-to-br from-emerald-50 via-white to-teal-50 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Join our supportive community
            </h2>
            <p className="text-slate-600 text-lg">
              Start your healing journey today. Thousands have found comfort and understanding here.
            </p>
          </div>

          <div className="space-y-4">
            {features.map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-slate-700">{feature}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50">
            <div className="flex gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className="w-4 h-4 fill-amber-400 text-amber-400" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-slate-700 text-sm mb-3">
              "I was hesitant at first, but Addis Tesfa changed my life. The anonymous support helped me open up about things I never could before."
            </p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-xs font-semibold">
                SM
              </div>
              <span className="text-sm text-slate-600">Sarah M.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 xl:px-12 py-12">
        <div className="w-full max-w-md mx-auto">
          {/* Logo */}
          <div className="mb-8">
            <Link to="/welcome" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-900">Addis Tesfa</span>
            </Link>
            <Link to="/welcome" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-emerald-600 transition-colors mt-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Create your account</h1>
            <p className="text-slate-600">Start your journey to healing and support</p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleEmailChange}
                  required
                  maxLength={100}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handlePasswordChange}
                  required
                  maxLength={128}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[38px] text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Confirm Password
                  {formData.confirmPassword.length > 0 && (
                    <span className={`ml-2 text-xs font-normal ${doPasswordsMatch ? 'text-emerald-600' : 'text-red-500'}`}>
                      {doPasswordsMatch ? '✓ Match' : '✗ Do not match'}
                    </span>
                  )}
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Repeat your password"
                  value={formData.confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  required
                  maxLength={128}
                  className={`w-full px-4 py-3 rounded-xl border focus:ring-2 outline-none transition-all ${
                    formData.confirmPassword.length > 0
                      ? doPasswordsMatch
                        ? 'border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/20'
                        : 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20'
                  }`}
                />
              </div>

              {/* Live Password Requirements */}
              {formData.password.length > 0 && (
                <div className="p-4 bg-slate-50 rounded-xl space-y-3">
                  <p className="text-sm font-medium text-slate-700">Password strength:</p>
                  
                  {/* Strength bar */}
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => {
                      const strength = Object.values(passwordStrength).filter(Boolean).length;
                      const isActive = strength >= level;
                      const colorClass = strength <= 1 ? 'bg-red-500' : strength === 2 ? 'bg-amber-500' : strength === 3 ? 'bg-emerald-400' : 'bg-emerald-600';
                      return (
                        <div
                          key={level}
                          className={`h-1.5 flex-1 rounded-full transition-all ${isActive ? colorClass : 'bg-slate-200'}`}
                        />
                      );
                    })}
                  </div>
                  
                  {/* Requirements checklist */}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className={`flex items-center gap-2 ${passwordStrength.minLength ? 'text-emerald-600' : 'text-slate-500'}`}>
                      {passwordStrength.minLength ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                      <span>8+ characters</span>
                    </div>
                    <div className={`flex items-center gap-2 ${passwordStrength.hasSpecialChar ? 'text-emerald-600' : 'text-slate-500'}`}>
                      {passwordStrength.hasSpecialChar ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                      <span>Special char (!@#$...)</span>
                    </div>
                    <div className={`flex items-center gap-2 ${passwordStrength.hasNumber ? 'text-emerald-600' : 'text-slate-500'}`}>
                      {passwordStrength.hasNumber ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                      <span>Number (0-9)</span>
                    </div>
                    <div className={`flex items-center gap-2 ${passwordStrength.hasUppercase ? 'text-emerald-600' : 'text-slate-500'}`}>
                      {passwordStrength.hasUppercase ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                      <span>Uppercase (A-Z)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Anonymous Toggle */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div className="flex-1">
                  <p className="font-medium text-slate-900 text-sm">Stay Anonymous</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Your identity will be protected by default
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer ml-4">
                  <input
                    type="checkbox"
                    checked={formData.isAnonymous}
                    onChange={(e) =>
                      setFormData({ ...formData, isAnonymous: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading || !isPasswordValid || !doPasswordsMatch}
                className="w-full py-3 px-4 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="text-emerald-600 font-semibold hover:text-emerald-700">
                Sign in
              </Link>
            </p>
          </div>

          {/* Trust indicators */}
          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              End-to-end encrypted
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Anonymous by default
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
