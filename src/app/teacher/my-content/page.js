'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { contentService } from '@/services/content.service';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { FileQuestion, AlertCircle } from 'lucide-react';

export default function MyContent() {
  const { user } = useAuth();
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const response = await contentService.getTeacherContent(user.id);
        setContent(response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved': return <Badge className="bg-emerald-500 hover:bg-emerald-600">Approved</Badge>;
      case 'Rejected': return <Badge variant="destructive">Rejected</Badge>;
      default: return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const getScheduleStatus = (item) => {
    if (item.status !== 'Approved') return null;
    const now = new Date();
    const start = new Date(item.startTime);
    const end = new Date(item.endTime);

    if (now < start) return <Badge variant="outline" className="text-blue-500 border-blue-200 bg-blue-50">Scheduled</Badge>;
    if (now > end) return <Badge variant="outline" className="text-slate-400 border-slate-200 bg-slate-50">Expired</Badge>;
    return <Badge variant="outline" className="text-indigo-600 border-indigo-200 bg-indigo-50 animate-pulse">● Active</Badge>;
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">My Uploaded Content</h2>
            <p className="text-slate-500 mt-1">Manage and track the status of your broadcasts.</p>
          </div>
        </div>

        <Card className="border-none shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="pl-6">Title & Subject</TableHead>
                  <TableHead>Times</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Live State</TableHead>
                  <TableHead className="pr-6">Details / Rejection Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell className="pl-6"><Skeleton className="h-10 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-10 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                      <TableCell className="pr-6"><Skeleton className="h-10 w-full" /></TableCell>
                    </TableRow>
                  ))
                ) : content.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <FileQuestion size={48} className="mb-4 opacity-20" />
                        <p>No content uploaded yet.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  content.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="pl-6">
                        <div className="font-semibold text-slate-900">{item.title}</div>
                        <div className="text-xs text-slate-500">{item.subject}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs">
                          <span className="text-slate-400">From:</span> {format(new Date(item.startTime), 'MMM d, HH:mm')}
                        </div>
                        <div className="text-xs">
                          <span className="text-slate-400">To:</span> {format(new Date(item.endTime), 'MMM d, HH:mm')}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell>{getScheduleStatus(item)}</TableCell>
                      <TableCell className="pr-6">
                        {item.status === 'Rejected' && item.rejectionReason && (
                          <div className="flex items-start space-x-2 text-red-600 bg-red-50 p-2 rounded text-xs border border-red-100">
                            <AlertCircle size={14} className="mt-0.5 shrink-0" />
                            <span>{item.rejectionReason}</span>
                          </div>
                        )}
                        {item.status === 'Approved' && (
                          <span className="text-xs text-slate-500 italic">Scheduled for broadcasting.</span>
                        )}
                        {item.status === 'Pending' && (
                          <span className="text-xs text-slate-500 italic">Awaiting principal review.</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
