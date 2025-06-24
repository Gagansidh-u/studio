
"use client";

import { Gift, LogIn, User, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';

export default function Header() {
  const { user } = useAuth();

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-border/50 bg-background/50 backdrop-blur-lg">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Gift className="h-7 w-7 text-primary" />
            <span className="font-headline text-2xl font-bold text-foreground">
              Grock
            </span>
          </Link>

          <div className="flex items-center gap-2">
            {user ? (
              <Button asChild variant="ghost" className="relative h-8 w-8 rounded-full">
                <Link href="/profile">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} />
                    <AvatarFallback>
                      <User />
                    </AvatarFallback>
                  </Avatar>
                </Link>
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button asChild variant="ghost">
                  <Link href="/login">
                    <LogIn />
                    <span className="hidden sm:inline">Login</span>
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">
                    <UserPlus />
                    <span className="hidden sm:inline">Sign Up</span>
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
