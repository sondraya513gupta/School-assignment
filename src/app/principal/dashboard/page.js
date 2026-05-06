'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { approvalService } from '@/services/approval.service';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutDashboard, Clock, CheckCircle2, XCircle } from 'lucide-react';

export default function PrincipalDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const response = await approvalService.getAllContent();
      const data = response.data;
      
      setStats({
        total: data.length,
        pending: data.filter(c => c.status === 'Pending').length,
        approved: data.filter(c => c.status === 'Approved').length,
        rejected: data.filter(c => c.status === 'Rejected').length,
      });
      setLoading(false);
    };

    fetchStats();
  }, []);

  const cards = [
    { title: 'All Uploaded Content', value: stats.total, icon: LayoutDashboard, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Pending Approval', value: stats.pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { title: 'Approved Content', value: stats.approved, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Rejected Content', value: stats.rejected, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-6 flex flex-col items-center">
        {/* School Header */}
        <header className="flex items-center gap-4 mb-8">
          {/* Placeholder logo */}
          <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
            <span className="text-2xl">🏫</span>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-800 tracking-wide">
            Your School Name
          </h1>
        </header>

        <div className="w-full max-w-7xl">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                Principal Overview
              </h2>
              <p className="text-slate-500 mt-1">
                Review and manage content broadcasts for the entire school.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {cards.map((card, i) => {
                const Icon = card.icon;
                return (
                  <Card
                    key={i}
                    className="border-none shadow-lg bg-white/30 backdrop-blur-lg hover:scale-105 transition-transform duration-300"
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-slate-600">
                        {card.title}
                      </CardTitle>
                      <div className={`${card.bg} p-2 rounded-lg`}> 
                        <Icon className={`h-4 w-4 ${card.color}`} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      {loading ? (
                        <div className="h-8 w-16 bg-slate-100 animate-pulse rounded" />
                      ) : (
                        <div className="text-2xl font-bold text-slate-800">
                          {card.value}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
