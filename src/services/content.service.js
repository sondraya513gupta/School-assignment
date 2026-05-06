// Mock data storage to simulate a real backend
const getStoredContent = () => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem('mock_content_db');
    return data ? JSON.parse(data) : [];
  }
  return [];
};

const setStoredContent = (data) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('mock_content_db', JSON.stringify(data));
  }
};

import { mockApiCall } from '@/utils/apiClient';

export const contentService = {
  uploadContent: async (formData) => {
    return mockApiCall(async (token) => {
      // token could be used for auth in real API
      return new Promise((resolve) => {
        setTimeout(() => {
          const contents = getStoredContent();
          const newContent = {
            id: `content_${Date.now()}`,
            title: formData.get('title'),
            subject: formData.get('subject'),
            description: formData.get('description'),
            startTime: formData.get('startTime'),
            endTime: formData.get('endTime'),
            rotationDuration: formData.get('rotationDuration') || 0,
            status: 'Pending',
            teacherId: formData.get('teacherId'),
            fileName: formData.get('file')?.name || 'unknown_file',
            createdAt: new Date().toISOString(),
            rejectionReason: null
          };
          contents.push(newContent);
          setStoredContent(contents);
          resolve({ success: true, data: newContent });
        }, 1500);
      });
    });
  },
  getTeacherContent: async (teacherId) => {
    return mockApiCall(async (token) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const contents = getStoredContent();
          const teacherContent = contents.filter(c => c.teacherId === teacherId);
          resolve({ success: true, data: teacherContent });
        }, 800);
      });
    });
  },
  getActiveContentForTeacher: async (teacherId) => {
    return mockApiCall(async (token) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const contents = getStoredContent();
          const now = new Date().toISOString();
          const activeContent = contents.filter(c =>
            c.teacherId === teacherId &&
            c.status === 'Approved' &&
            new Date(c.startTime) <= new Date(now) &&
            new Date(c.endTime) >= new Date(now)
          );
          resolve({ success: true, data: activeContent });
        }, 500);
      });
    });
  }
};
