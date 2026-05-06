'use client';

import { useState, useEffect } from 'react';
import { approvalService } from '@/services/approval.service';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { Check, X, FileSearch } from 'lucide-react';
import { format } from 'date-fns';

export default function PendingApprovals() {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const response = await approvalService.getPendingContent();
    setContent(response.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (id) => {
    await approvalService.approveContent(id);
    toast.success('Content approved for broadcasting.');
    fetchData();
  };

  const handleRejectClick = (id) => {
    setSelectedId(id);
    setRejectReason('');
    setIsRejectModalOpen(true);
  };

  const confirmReject = async () => {
    if (!rejectReason.trim()) {
      toast.error('Rejection reason is mandatory.');
      return;
    }
    await approvalService.rejectContent(selectedId, rejectReason);
    toast.success('Content rejected.');
    setIsRejectModalOpen(false);
    fetchData();
  };

  return (
    <DashboardLayout>
      <Toaster />
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Pending Approvals</h2>
          <p className="text-slate-500 mt-1">Review recently uploaded content for approval or rejection.</p>
        </div>

        <Card className="border-none shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="pl-6">Title & Subject</TableHead>
                  <TableHead>Times</TableHead>
                  <TableHead>Teacher ID</TableHead>
                  <TableHead className="pr-6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array(3).fill(0).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell className="h-16 pl-6 animate-pulse bg-slate-50/50" colSpan={4} />
                    </TableRow>
                  ))
                ) : content.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <Check size={48} className="mb-4 opacity-20" />
                        <p>No pending approvals at the moment.</p>
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
                          {format(new Date(item.startTime), 'MMM d, HH:mm')} - {format(new Date(item.endTime), 'HH:mm')}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs font-mono text-slate-500">{item.teacherId}</TableCell>
                      <TableCell className="pr-6 text-right">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                            onClick={() => handleApprove(item.id)}
                          >
                            <Check size={14} className="mr-1" /> Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-red-200 text-red-600 hover:bg-red-50"
                            onClick={() => handleRejectClick(item.id)}
                          >
                            <X size={14} className="mr-1" /> Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Content</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this content. This will be visible to the teacher.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Rejection Reason (Mandatory)</Label>
              <Textarea 
                id="reason" 
                placeholder="e.g. Image resolution is too low or content is inappropriate." 
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectModalOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmReject}>Reject Content</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
