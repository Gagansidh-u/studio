
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { sendEmailVerification } from 'firebase/auth';
import { useAuth } from '@/contexts/auth-context';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/header';
import { useToast } from '@/hooks/use-toast';
import { MailCheck, LogOut, Send } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function VerifyEmailPage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // If no user is logged in, redirect to login
        router.replace('/login');
      } else if (user.emailVerified) {
        // If user is already verified, redirect to home
        router.replace('/');
      }
    }
  }, [user, loading, router]);
  
  const handleResendEmail = async () => {
    if (!user) return;
    setIsSending(true);
    try {
      await sendEmailVerification(user);
      toast({
        title: "Verification Email Sent",
        description: "A new verification link has been sent to your email address.",
      });
    } catch (error: any) {
      let description = "Failed to send verification email. Please try again later.";
      if (error.code === 'auth/too-many-requests') {
          description = "You've requested to resend the verification email too many times. Please wait a while before trying again.";
      }
      toast({
        variant: "destructive",
        title: "Error",
        description: description,
      });
    } finally {
      setIsSending(false);
    }
  };
  
  if (loading || !user || user.emailVerified) {
    // Show a loading state while checks are in progress
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
            <div className="flex flex-col items-center space-y-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MailCheck className="h-8 w-8" />
            </div>
            <CardTitle className="mt-4 text-2xl">Verify Your Email</CardTitle>
            <CardDescription>
              We've sent a verification link to <span className="font-semibold text-foreground">{user.email}</span>. Please check your inbox and follow the link to activate your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <p className="text-sm text-muted-foreground">
                Didn&apos;t receive the email? Check your spam folder or click the button below to resend.
            </p>
            <Button onClick={handleResendEmail} disabled={isSending} className="w-full">
              {isSending ? 'Sending...' : (
                <>
                    <Send /> Resend Verification Email
                </>
              )}
            </Button>
            <Button variant="outline" onClick={logout} className="w-full">
              <LogOut /> Log Out
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
