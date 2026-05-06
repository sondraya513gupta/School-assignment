'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/context/AuthContext';
import { contentService } from '@/services/content.service';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Toaster } from '@/components/ui/sonner';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

const uploadSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subject: z.string().min(1, 'Subject is required'),
  description: z.string().optional(),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  rotationDuration: z.coerce.number().min(0, 'Must be positive').default(10),
  file: z.any()
    .refine((files) => files?.length === 1, "File is required")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 10MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      ".jpg, .jpeg, .png and .gif files are accepted."
    ),
}).refine((data) => new Date(data.endTime) > new Date(data.startTime), {
  message: "End time must be after start time",
  path: ["endTime"],
});

export default function UploadContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [preview, setPreview] = useState(null);

  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm({
    resolver: zodResolver(uploadSchema)
  });

  const fileWatcher = watch('file');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('subject', data.subject);
      formData.append('description', data.description || '');
      formData.append('startTime', data.startTime);
      formData.append('endTime', data.endTime);
      formData.append('rotationDuration', data.rotationDuration);
      formData.append('file', data.file[0]);
      formData.append('teacherId', user.id);

      await contentService.uploadContent(formData);
      toast.success('Content uploaded successfully and is now pending approval.');
      router.push('/teacher/my-content');
    } catch (err) {
      toast.error('Failed to upload content. Please try again.');
    }
  };

  return (
    <DashboardLayout>
      <Toaster />
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Upload New Content</h2>
          <p className="text-slate-500 mt-1">Submit your subject-based content for principal approval.</p>
        </div>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Content Details</CardTitle>
            <CardDescription>Fill in the information below to broadcast your content.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" placeholder="e.g. Algebra Basics" {...register('title')} />
                  {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="e.g. Mathematics" {...register('subject')} />
                  {errors.subject && <p className="text-xs text-red-500">{errors.subject.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea id="description" placeholder="Briefly describe the content..." {...register('description')} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">Content File (Image/GIF)</Label>
                <div className="flex items-start space-x-4">
                  <div className="flex-1">
                    <Input 
                      id="file" 
                      type="file" 
                      accept="image/*" 
                      {...register('file')} 
                      onChange={(e) => {
                        register('file').onChange(e);
                        handleFileChange(e);
                      }}
                    />
                    <p className="text-xs text-slate-500 mt-1">Supported: JPG, PNG, GIF (Max 10MB)</p>
                    {errors.file && <p className="text-xs text-red-500 mt-1">{errors.file.message}</p>}
                  </div>
                  {preview && (
                    <div className="w-24 h-24 border rounded overflow-hidden bg-slate-100 flex items-center justify-center">
                      <img src={preview} alt="Preview" className="max-w-full max-h-full object-contain" />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input id="startTime" type="datetime-local" {...register('startTime')} />
                  {errors.startTime && <p className="text-xs text-red-500">{errors.startTime.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input id="endTime" type="datetime-local" {...register('endTime')} />
                  {errors.endTime && <p className="text-xs text-red-500">{errors.endTime.message}</p>}
                </div>
              </div>

              <div className="space-y-2 max-w-[200px]">
                <Label htmlFor="rotationDuration">Rotation Duration (Seconds)</Label>
                <Input id="rotationDuration" type="number" {...register('rotationDuration')} />
              </div>

              <div className="pt-4 flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Uploading...' : 'Submit for Approval'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
