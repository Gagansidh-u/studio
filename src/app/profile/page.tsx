
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ArrowRight, Camera, Pencil, User, Mail, Phone, Wallet, Coins, Bell, Clock, 
  Lock, Fingerprint, History, Heart, Share2, Headset, DollarSign, Globe, LogOut 
} from 'lucide-react';

const InfoCard = ({ icon, title, value, onClick }: { icon: React.ReactNode, title: string, value: string, onClick?: () => void }) => (
  <Card className="flex items-center p-4 cursor-pointer hover:bg-muted/50 transition-colors" onClick={onClick}>
    <div className="text-primary">{icon}</div>
    <div className="ml-4 flex-1">
      <p className="text-sm font-medium">{title}</p>
      <p className="text-sm text-muted-foreground">{value}</p>
    </div>
    <ArrowRight className="h-5 w-5 text-muted-foreground" />
  </Card>
);

const NotificationItem = ({ icon, title, description, checked, onCheckedChange }: { icon: React.ReactNode, title: string, description: string, checked: boolean, onCheckedChange: (checked: boolean) => void }) => (
    <div className="flex items-center">
        <div className="text-primary">{icon}</div>
        <div className="ml-4 flex-1">
            <p className="font-medium">{title}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
);

const SecurityItem = ({ icon, title, description, children, onClick }: { icon: React.ReactNode, title: string, description: string, children: React.ReactNode, onClick?: () => void }) => (
    <Card className="flex items-center p-4 cursor-pointer hover:bg-muted/50 transition-colors" onClick={onClick}>
        <div className="text-primary">{icon}</div>
        <div className="ml-4 flex-1">
            <p className="font-medium">{title}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {children}
    </Card>
);

const QuickActionCard = ({ icon, title, description, onClick }: { icon: React.ReactNode, title: string, description: string, onClick?: () => void }) => (
    <Card className="flex flex-col items-center justify-center p-4 text-center aspect-square cursor-pointer hover:bg-muted/50 transition-colors" onClick={onClick}>
        <div className="text-primary">{icon}</div>
        <p className="mt-2 font-semibold">{title}</p>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </Card>
);


export default function ProfilePage() {
  const { user, loading: authLoading, logout, walletBalance, walletCoins } = useAuth();
  const router = useRouter();
  
  const [notifications, setNotifications] = React.useState({
    deals: true,
    expiry: true,
    newsletter: false,
    biometric: true,
  });

  React.useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);
  
  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
            <div className="mx-auto max-w-2xl space-y-6">
                <Skeleton className="h-24 w-full" />
                <div className="flex items-center gap-4">
                    <Skeleton className="h-20 w-20 rounded-full" />
                    <div className="space-y-2 flex-1">
                        <Skeleton className="h-6 w-1/2" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                </div>
                <Skeleton className="h-10 w-32" />
                <div className="space-y-4">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                </div>
            </div>
        </main>
      </div>
    );
  }

  const profileCompletion = user?.displayName ? 50 : 0; // Simplified logic

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-2xl space-y-8 pb-16">
          
          <Card className="flex items-center gap-4 p-4 cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex-1 space-y-2">
              <label htmlFor="profile-progress" className="text-sm font-medium">Profile Completion</label>
              <Progress id="profile-progress" value={profileCompletion} className="h-2" />
              <p className="text-xs text-muted-foreground">Complete your profile to unlock all features</p>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
          </Card>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} />
                <AvatarFallback>
                  <User className="h-10 w-10" />
                </AvatarFallback>
              </Avatar>
              <Button size="icon" className="absolute bottom-0 right-0 h-7 w-7 rounded-full">
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{user.displayName || 'Sarah Johnson'}</h1>
              <p className="text-muted-foreground">{user.email}</p>
              <p className="text-muted-foreground">+91 99999 99999</p>
            </div>
            <Button variant="outline">
              <Pencil className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>

          <section>
            <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
            <div className="space-y-3">
              <InfoCard icon={<User className="h-6 w-6" />} title="Name" value={user.displayName || 'Not set'} />
              <InfoCard icon={<Mail className="h-6 w-6" />} title="Email" value={user.email || 'Not set'} />
              <InfoCard icon={<Phone className="h-6 w-6" />} title="Phone" value="+91 99999 99999" />
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-4">Payment Methods</h2>
             <Card className="flex items-center p-4 cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => router.push('/wallet')}>
              <Wallet className="h-8 w-8 text-primary" />
              <div className="ml-4 flex-1">
                <p className="font-medium">Wallet Balance</p>
                <p className="text-xl font-bold">₹{walletBalance?.toFixed(2) ?? '0.00'}</p>
              </div>
              <div className="text-right">
                <div className="font-medium flex items-center gap-1 justify-end"><Coins className="h-4 w-4 text-yellow-400" />Grock Coins</div>
                <p className="text-xl font-bold">{walletCoins ?? 0}</p>
              </div>
            </Card>
          </section>
          
          <section>
             <h2 className="text-lg font-semibold mb-4">Notification Preferences</h2>
             <Card className="p-4 space-y-4">
                <NotificationItem 
                    icon={<Bell className="h-6 w-6" />} 
                    title="Deal Notifications"
                    description="Get notified about special offers"
                    checked={notifications.deals}
                    onCheckedChange={(c) => setNotifications(p => ({...p, deals: c}))}
                />
                 <NotificationItem 
                    icon={<Clock className="h-6 w-6" />} 
                    title="Expiry Reminders"
                    description="Reminders for expiring gift cards"
                    checked={notifications.expiry}
                    onCheckedChange={(c) => setNotifications(p => ({...p, expiry: c}))}
                />
                 <NotificationItem 
                    icon={<Mail className="h-6 w-6" />} 
                    title="Newsletters"
                    description="Weekly newsletter updates"
                    checked={notifications.newsletter}
                    onCheckedChange={(c) => setNotifications(p => ({...p, newsletter: c}))}
                />
             </Card>
          </section>

           <section>
              <h2 className="text-lg font-semibold mb-4">Security Settings</h2>
              <div className="space-y-3">
                <SecurityItem
                    icon={<Lock className="h-6 w-6" />}
                    title="Change Password"
                    description="Update your account password"
                >
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </SecurityItem>
                <SecurityItem
                    icon={<Fingerprint className="h-6 w-6" />}
                    title="Biometric Authentication"
                    description="Use fingerprint to login"
                >
                    <Switch checked={notifications.biometric} onCheckedChange={(c) => setNotifications(p => ({...p, biometric: c}))} />
                </SecurityItem>
              </div>
           </section>

          <section>
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <QuickActionCard icon={<History className="h-8 w-8" />} title="Purchase History" description="View your past orders" onClick={() => router.push('/orders')} />
              <QuickActionCard icon={<Heart className="h-8 w-8 text-red-500" />} title="Wishlist" description="Your saved items" />
              <QuickActionCard icon={<Share2 className="h-8 w-8 text-green-500" />} title="Referral Program" description="Invite friends & earn" />
              <QuickActionCard icon={<Headset className="h-8 w-8 text-orange-500" />} title="Customer Support" description="Get help & support" />
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-4">App Preferences</h2>
            <div className="space-y-3">
              <InfoCard icon={<DollarSign className="h-6 w-6" />} title="Currency" value="INR (₹)" />
              <InfoCard icon={<Globe className="h-6 w-6" />} title="Language" value="English" />
            </div>
          </section>

          <Button variant="destructive" className="w-full h-12 text-base" onClick={logout}>
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </Button>

        </div>
      </main>
    </div>
  );
}
