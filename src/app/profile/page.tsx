
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/auth-context';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertCircle, ArrowRight, Pencil, User, Mail, Phone, Wallet, Coins, Bell, Clock,
  Lock, Fingerprint, History, Heart, Share2, Headset, DollarSign, Globe, LogOut, Trash2
} from 'lucide-react';
import { giftCards } from '@/lib/data';
import Image from 'next/image';

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

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, { message: 'Current password is required.' }),
  newPassword: z.string().min(6, { message: 'New password must be at least 6 characters.' }),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const nameSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
});

const phoneSchema = z.object({
  phoneNumber: z.string().min(10, { message: 'Please enter a valid phone number with country code.' }),
});


export default function ProfilePage() {
  const { 
    user, loading: authLoading, logout, walletBalance, walletCoins, changePassword,
    currency, setCurrency, wishlist, removeFromWishlist, phoneNumber,
    updateUserPhoneNumber, updateUserName
  } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [notifications, setNotifications] = React.useState({
    deals: true,
    expiry: true,
    newsletter: false,
    biometric: true,
  });
  const [isChangePasswordOpen, setIsChangePasswordOpen] = React.useState(false);
  const [isCurrencyDialogOpen, setIsCurrencyDialogOpen] = React.useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = React.useState(false);
  const [isNameUpdateOpen, setIsNameUpdateOpen] = React.useState(false);
  const [isPhoneUpdateOpen, setIsPhoneUpdateOpen] = React.useState(false);
  const [changePasswordError, setChangePasswordError] = React.useState<string | null>(null);
  
  const wishlistedCards = React.useMemo(() => 
    giftCards.filter(card => wishlist.includes(card.id)), 
    [wishlist]
  );

  const passwordForm = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const nameForm = useForm<z.infer<typeof nameSchema>>({
    resolver: zodResolver(nameSchema),
    defaultValues: { name: '' },
  });

  const phoneForm = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phoneNumber: '' },
  });

  React.useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);
  
  React.useEffect(() => {
    if (user && isNameUpdateOpen) {
      nameForm.reset({ name: user.displayName || '' });
    }
  }, [user, isNameUpdateOpen, nameForm]);

  React.useEffect(() => {
    if (isPhoneUpdateOpen) {
      phoneForm.reset({ phoneNumber: phoneNumber || '' });
    }
  }, [phoneNumber, isPhoneUpdateOpen, phoneForm]);

  const onPasswordSubmit = async (values: z.infer<typeof changePasswordSchema>) => {
    setChangePasswordError(null);
    try {
      await changePassword(values.currentPassword, values.newPassword);
      toast({ title: "Success", description: "Your password has been changed successfully." });
      setIsChangePasswordOpen(false);
      passwordForm.reset();
    } catch (error: any) {
      const errorMessage = error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential'
        ? 'The current password you entered is incorrect.'
        : error.code === 'auth/weak-password'
        ? 'The new password is too weak. It must be at least 6 characters.'
        : 'An unexpected error occurred. Please try again.';
      setChangePasswordError(errorMessage);
    }
  };

  const onNameSubmit = async (values: z.infer<typeof nameSchema>) => {
    try {
      await updateUserName(values.name);
      setIsNameUpdateOpen(false);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to update name.' });
    }
  };

  const onPhoneSubmit = async (values: z.infer<typeof phoneSchema>) => {
    try {
      await updateUserPhoneNumber(values.phoneNumber);
      setIsPhoneUpdateOpen(false);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to update phone number.' });
    }
  };
  
  const handleCurrencyChange = async (newCurrency: 'INR' | 'USD') => {
    await setCurrency(newCurrency);
    setIsCurrencyDialogOpen(false);
  };
  
  const profileCompletion = React.useMemo(() => {
    let score = 0;
    if (user?.displayName) {
      score += 50;
    }
    if (phoneNumber) {
      score += 50;
    }
    return score;
  }, [user?.displayName, phoneNumber]);

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (profileCompletion / 100) * circumference;

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
            <div className="mx-auto max-w-2xl space-y-6">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <div className="space-y-2 flex-1">
                        <Skeleton className="h-6 w-1/2" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                </div>
                <div className="space-y-4 pt-4">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                </div>
            </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-2xl space-y-8 pb-16">
          
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:text-left">
            <div className="relative h-24 w-24 flex-shrink-0">
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100">
                <circle
                  className="text-border"
                  stroke="currentColor"
                  strokeWidth="8"
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                />
                <circle
                  className="text-primary transition-all duration-500 drop-shadow-primary-glow"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} />
                  <AvatarFallback><User className="h-10 w-10" /></AvatarFallback>
                </Avatar>
              </div>
            </div>

            <div className="flex-1">
              <h1 className="text-2xl font-bold">{user.displayName || 'Sarah Johnson'}</h1>
              <p className="text-muted-foreground">{user.email}</p>
              {phoneNumber && <p className="text-muted-foreground">{phoneNumber}</p>}
            </div>

            <div className="flex flex-col items-center sm:items-end gap-2 w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto" onClick={() => setIsNameUpdateOpen(true)}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
              <p className="text-sm font-medium text-muted-foreground">
                {profileCompletion}% Profile Complete
              </p>
            </div>
          </div>

          <section>
            <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
            <div className="space-y-3">
              <InfoCard icon={<User className="h-6 w-6" />} title="Name" value={user.displayName || 'Not set'} onClick={() => setIsNameUpdateOpen(true)} />
              <InfoCard icon={<Mail className="h-6 w-6" />} title="Email" value={user.email || 'Not set'} />
              <InfoCard icon={<Phone className="h-6 w-6" />} title="Phone" value={phoneNumber || 'Not set'} onClick={() => setIsPhoneUpdateOpen(true)} />
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-4">Payment Methods</h2>
             <Card className="flex items-center p-4 cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => router.push('/wallet')}>
              <Wallet className="h-8 w-8 text-primary" />
              <div className="ml-4 flex-1">
                <p className="font-medium">Wallet Balance</p>
                <p className="text-xl font-bold">{currency === 'INR' ? '₹' : '$'}{walletBalance?.toFixed(2) ?? '0.00'}</p>
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
                 <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
                    <DialogTrigger asChild>
                         <SecurityItem
                            icon={<Lock className="h-6 w-6" />}
                            title="Change Password"
                            description="Update your account password"
                          >
                            <ArrowRight className="h-5 w-5 text-muted-foreground" />
                         </SecurityItem>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Change Password</DialogTitle>
                            <DialogDescription>
                                Enter your current password and a new password below.
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...passwordForm}>
                          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4 py-4">
                            {changePasswordError && (
                              <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{changePasswordError}</AlertDescription>
                              </Alert>
                            )}
                            <FormField
                              control={passwordForm.control}
                              name="currentPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Current Password</FormLabel>
                                  <FormControl>
                                    <Input type="password" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                             <FormField
                              control={passwordForm.control}
                              name="newPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>New Password</FormLabel>
                                  <FormControl>
                                    <Input type="password" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                             <FormField
                              control={passwordForm.control}
                              name="confirmPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Confirm New Password</FormLabel>
                                  <FormControl>
                                    <Input type="password" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                             <DialogFooter>
                                <Button type="submit" disabled={passwordForm.formState.isSubmitting}>
                                  {passwordForm.formState.isSubmitting ? 'Changing...' : 'Change Password'}
                                </Button>
                            </DialogFooter>
                          </form>
                        </Form>
                    </DialogContent>
                </Dialog>

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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <QuickActionCard icon={<History className="h-8 w-8" />} title="Purchase History" description="View your past orders" onClick={() => router.push('/orders')} />
              
              <Dialog open={isWishlistOpen} onOpenChange={setIsWishlistOpen}>
                <DialogTrigger asChild>
                  <QuickActionCard icon={<Heart className="h-8 w-8 text-red-500" />} title="Wishlist" description="Your saved items" />
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>My Wishlist</DialogTitle>
                    <DialogDescription>Items you have saved for later.</DialogDescription>
                  </DialogHeader>
                  <div className="max-h-[60vh] overflow-y-auto p-1">
                    {wishlistedCards.length > 0 ? (
                      <div className="space-y-4">
                        {wishlistedCards.map(card => (
                          <Card key={card.id} className="flex items-center p-2">
                             <Image src={card.imageUrl} alt={card.name} width={64} height={40} className="rounded-md object-cover h-10 w-16" />
                             <div className="ml-4 flex-1">
                                <p className="font-semibold">{card.name}</p>
                                <p className="text-sm text-muted-foreground">{card.platform}</p>
                             </div>
                             <Button variant="ghost" size="icon" onClick={() => removeFromWishlist(card.id)}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                             </Button>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">Your wishlist is empty.</p>
                      </div>
                    )}
                  </div>
                   <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button">Close</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <QuickActionCard icon={<Share2 className="h-8 w-8 text-green-500" />} title="Referral Program" description="Invite friends & earn" />
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Referral Program</DialogTitle>
                    <DialogDescription>
                      Our referral program is coming soon! Check back later to earn rewards by inviting your friends.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button">OK</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <QuickActionCard icon={<Headset className="h-8 w-8 text-orange-500" />} title="Customer Support" description="Get help & support" />
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-4">App Preferences</h2>
            <div className="space-y-3">
              <Dialog open={isCurrencyDialogOpen} onOpenChange={setIsCurrencyDialogOpen}>
                <DialogTrigger asChild>
                  <InfoCard icon={<DollarSign className="h-6 w-6" />} title="Currency" value={currency} />
                </DialogTrigger>
                <DialogContent className="sm:max-w-xs">
                  <DialogHeader>
                    <DialogTitle>Select Currency</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-2 py-4">
                    <Button
                      variant={currency === 'INR' ? 'default' : 'outline'}
                      onClick={() => handleCurrencyChange('INR')}
                    >
                      INR (₹) - Indian Rupee
                    </Button>
                    <Button
                      variant={currency === 'USD' ? 'default' : 'outline'}
                      onClick={() => handleCurrencyChange('USD')}
                    >
                      USD ($) - US Dollar
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <InfoCard icon={<Globe className="h-6 w-6" />} title="Language" value="English" />
            </div>
          </section>

          <Button variant="destructive" className="w-full h-12 text-base" onClick={logout}>
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </Button>

        </div>
      </main>

      {/* Name Update Dialog */}
      <Dialog open={isNameUpdateOpen} onOpenChange={setIsNameUpdateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile Name</DialogTitle>
            <DialogDescription>Update your display name below.</DialogDescription>
          </DialogHeader>
          <Form {...nameForm}>
            <form onSubmit={nameForm.handleSubmit(onNameSubmit)} className="space-y-4 py-4">
              <FormField
                control={nameForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={nameForm.formState.isSubmitting}>
                  {nameForm.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Phone Update Dialog */}
      <Dialog open={isPhoneUpdateOpen} onOpenChange={setIsPhoneUpdateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Phone Number</DialogTitle>
            <DialogDescription>Enter your phone number, including country code.</DialogDescription>
          </DialogHeader>
          <Form {...phoneForm}>
            <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-4 py-4">
              <FormField
                control={phoneForm.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 123 456 7890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={phoneForm.formState.isSubmitting}>
                  {phoneForm.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
