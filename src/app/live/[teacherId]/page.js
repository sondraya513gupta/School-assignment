'use client';

import { useState, useEffect } from 'react';
import { contentService } from '@/services/content.service';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Monitor, RefreshCcw } from 'lucide-react';

export default function PublicLivePage({ params }) {
  const teacherId = params.teacherId;
  const [activeContent, setActiveContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchContent = async () => {
    try {
      const response = await contentService.getActiveContentForTeacher(teacherId);
      setActiveContent(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch live content');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
    // Auto-refresh polling every 30 seconds
    const pollInterval = setInterval(fetchContent, 30000);
    return () => clearInterval(pollInterval);
  }, [teacherId]);

  // Rotation logic if multiple active contents
  useEffect(() => {
    if (activeContent.length > 1) {
      const current = activeContent[currentIndex];
      const duration = (current.rotationDuration || 10) * 1000;
      
      const timer = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % activeContent.length);
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [activeContent, currentIndex]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-8">
        <div className="max-w-4xl w-full space-y-4">
          <Skeleton className="h-12 w-1/3 bg-slate-800" />
          <Skeleton className="h-[500px] w-full bg-slate-800" />
        </div>
      </div>
    );
  }

  const current = activeContent[currentIndex];

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col">
      {/* Header */}
      <header className="h-20 border-b border-white/10 flex items-center justify-between px-8 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Monitor size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Live Broadcast</h1>
            <p className="text-xs text-indigo-400 font-mono">Stream: {teacherId}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-xs font-medium text-slate-400">
            <RefreshCcw size={14} className="animate-spin-slow" />
            <span>Auto-refreshing</span>
          </div>
          {activeContent.length > 0 && (
            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
              ● Live
            </Badge>
          )}
        </div>
      </header>

      {/* Main Broadcast Area */}
      <main className="flex-1 flex items-center justify-center p-8 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

        {!current ? (
          <div className="text-center space-y-6 max-w-md relative z-10">
            <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Monitor size={40} className="text-slate-600" />
            </div>
            <h2 className="text-4xl font-bold text-slate-200">No content available</h2>
            <p className="text-slate-500">There are currently no active broadcasts for this teacher. Please check back later.</p>
          </div>
        ) : (
          <div className="max-w-5xl w-full animate-in fade-in zoom-in duration-700 relative z-10">
            <Card className="bg-slate-900/50 border-white/10 shadow-2xl overflow-hidden backdrop-blur-sm">
              <CardContent className="p-0">
                <div className="aspect-video relative bg-black flex items-center justify-center group">
                  {/* Content Preview (Using a placeholder for the "image") */}
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                     <img 
                       src={`https://api.placeholder.com/1200/800?text=${encodeURIComponent(current.subject)}`}
                       alt={current.title}
                       className="w-full h-full object-cover"
                     />
                     {/* In a real app, you'd use current.fileName or a URL */}
                  </div>
                  
                  {/* Overlay Info */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-12 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <Badge className="mb-4 bg-indigo-600 hover:bg-indigo-700">{current.subject}</Badge>
                    <h2 className="text-5xl font-black mb-4 tracking-tight leading-tight">{current.title}</h2>
                    <p className="text-xl text-slate-300 max-w-2xl line-clamp-2 font-medium opacity-80">{current.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Pagination/Rotation Indicators */}
            {activeContent.length > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                {activeContent.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-8 bg-indigo-500' : 'w-2 bg-white/20'}`} 
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="h-16 border-t border-white/5 flex items-center justify-center px-8 text-xs text-slate-600 font-medium">
        Content Broadcasting System © 2026 • Powered by Next.js & Tailwind CSS
      </footer>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  );
}
