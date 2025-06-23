"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Always redirect away from the admin section as it's been removed
    if (!loading) {
      router.replace('/');
    }
  }, [loading, router]);

  // Show a loading skeleton while redirecting
  return (
    <div className="flex h-screen w-full items-center justify-center">
        <Skeleton className="h-24 w-1/4" />
    </div>
  );
}
