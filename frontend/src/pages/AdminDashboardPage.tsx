import { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Stethoscope,
  ChevronRight
} from 'lucide-react';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { adminApi, professionalsApi } from '../services/api';

interface DashboardStats {
  totalUsers: number;
  totalPosts: number;
  pendingVerifications: number;
  pendingReports: number;
}

interface VerificationRequest {
  id: string;
  userId: string;
  licenseNumber: string;
  specialization: string;
  credentials: string;
  yearsOfExperience: number;
  status: string;
  createdAt: string;
}

const AdminDashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [verifications, setVerifications] = useState<VerificationRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, verificationsRes] = await Promise.all([
        adminApi.getStats(),
        professionalsApi.getPendingVerifications(),
      ]);
      setStats(statsRes.data.data);
      setVerifications(verificationsRes.data.data || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (id: string, approved: boolean) => {
    try {
      await professionalsApi.verify(id, approved);
      fetchDashboardData();
    } catch (error) {
      console.error('Failed to verify professional:', error);
    }
  };

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'text-emerald-700', bg: 'bg-emerald-50', ring: 'ring-emerald-100' },
    { label: 'Total Posts', value: stats?.totalPosts || 0, icon: FileText, color: 'text-emerald-700', bg: 'bg-emerald-50', ring: 'ring-emerald-100' },
    { label: 'Pending Verifications', value: stats?.pendingVerifications || 0, icon: Stethoscope, color: 'text-amber-700', bg: 'bg-amber-50', ring: 'ring-amber-100' },
    { label: 'Pending Reports', value: stats?.pendingReports || 0, icon: AlertTriangle, color: 'text-rose-700', bg: 'bg-rose-50', ring: 'ring-rose-100' },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-7 pb-8">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
        <span className="text-slate-700">Dashboard</span>
        <ChevronRight className="h-4 w-4" />
        <span>Admin</span>
      </div>

      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-card sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-950 text-white shadow-lg shadow-slate-900/20">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950">Admin Dashboard</h1>
            <p className="text-sm text-slate-500">Platform overview, moderation queues, and verification operations.</p>
          </div>
        </div>
        {verifications.length > 0 && (
          <Badge variant="warning" size="md">{verifications.length} pending reviews</Badge>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-hover"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${stat.bg} ${stat.color} ring-1 ${stat.ring}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              {stat.label === 'Pending Verifications' && stat.value > 0 && (
                <Badge variant="warning" size="sm">Action Needed</Badge>
              )}
            </div>
            <p className="text-3xl font-semibold tracking-tight text-slate-950">
              {isLoading ? '-' : stat.value}
            </p>
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Professional Verification Requests</h2>
            <p className="text-sm text-slate-500">Review credentials and approve eligible professionals.</p>
          </div>
          {verifications.length > 0 && (
            <Badge variant="warning" size="md">{verifications.length} Pending</Badge>
          )}
        </div>

        {verifications.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {verifications.map((req) => (
              <div key={req.id} className="p-5 transition-colors hover:bg-slate-50/80">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  <div className="min-w-0">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                        <Stethoscope className="h-4 w-4" />
                      </span>
                      <span className="font-semibold text-slate-950">{req.specialization}</span>
                      <Badge variant="warning" size="sm">Pending</Badge>
                    </div>
                    <p className="text-sm text-slate-600">License: {req.licenseNumber}</p>
                    <p className="text-sm text-slate-500">Experience: {req.yearsOfExperience} years</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      leftIcon={<XCircle className="h-4 w-4" />}
                      onClick={() => handleVerify(req.id, false)}
                    >
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      leftIcon={<CheckCircle className="h-4 w-4" />}
                      onClick={() => handleVerify(req.id, true)}
                    >
                      Verify
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
              <CheckCircle className="h-6 w-6" />
            </div>
            <p className="font-medium text-slate-700">All caught up! No pending verifications.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
