
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { db } from '@/lib/firebase';
import { doc, runTransaction } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Header from '@/components/header';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Coins } from 'lucide-react';

const formSchema = z.object({
  amount: z.coerce
    .number()
    .min(10, { message: 'Amount must be at least ₹10.' })
    .positive({ message: 'Amount must be positive.' }),
});

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function WalletPage() {
  const { user, loading: authLoading, walletBalance, walletCoins } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: '',
    },
  });

  if (!authLoading && !user) {
    router.push('/login');
  }

  const handleAddFunds = async (amount: number) => {
    if (!user || amount <= 0) return;
    setIsProcessing(true);

    const options = {
      key: "rzp_live_YjljJCP3ewIy4d",
      amount: amount * 100,
      currency: "INR",
      name: "Grock Wallet",
      description: `Add ₹${amount} to your wallet`,
      image: "https://placehold.co/128x128.png",
      handler: async function (response: any) {
        try {
          const walletRef = doc(db, 'wallets', user.uid);
          await runTransaction(db, async (transaction) => {
            const walletDoc = await transaction.get(walletRef);
            if (!walletDoc.exists()) {
              transaction.set(walletRef, { balance: amount, coins: 0, userId: user.uid });
            } else {
              const newBalance = walletDoc.data().balance + amount;
              transaction.update(walletRef, { balance: newBalance });
            }
          });
          toast({
            title: "Funds Added Successfully!",
            description: `₹${amount} has been added to your wallet.`,
          });
          form.reset();
        } catch (e) {
          console.error("Transaction failed: ", e);
          toast({
            variant: 'destructive',
            title: "Update Failed",
            description: "Could not update your wallet balance. Please contact support.",
          });
        } finally {
          setIsProcessing(false);
        }
      },
      prefill: {
        name: user.displayName ?? "Test User",
        email: user.email ?? "test.user@example.com",
        contact: "9999999999"
      },
      notes: {
        user_id: user.uid,
        amount: amount,
      },
      theme: {
        color: "#29abe2"
      },
      modal: {
        ondismiss: function() {
          setIsProcessing(false);
          form.reset();
        }
      },
    };

    if (window.Razorpay) {
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        toast({
          variant: 'destructive',
          title: "Payment Failed",
          description: response.error.description,
        });
        setIsProcessing(false);
      });
      rzp.open();
    } else {
      toast({
        variant: 'destructive',
        title: "Error",
        description: "Payment gateway is not loaded. Please try again later.",
      });
      setIsProcessing(false);
    }
  };
  
  function onSubmit(values: z.infer<typeof formSchema>) {
    handleAddFunds(values.amount);
  }

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="container mx-auto flex-1 px-4 py-8 md:px-6 lg:py-12">
            <div className="space-y-4 max-w-md mx-auto">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-48 w-full" />
            </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container mx-auto flex-1 px-4 py-8 md:px-6 lg:py-12">
        <div className="space-y-8 max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>My Wallet</CardTitle>
              <CardDescription>Your current wallet balance.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">
                {walletBalance !== null ? `₹${walletBalance.toFixed(2)}` : <Skeleton className="h-10 w-40" />}
              </div>
            </CardContent>
          </Card>

           <Card>
            <CardHeader>
              <CardTitle>My Grock Coins</CardTitle>
              <CardDescription>Your current coin balance and its value.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-baseline justify-between">
              <div className="text-4xl font-bold flex items-center gap-2">
                {walletCoins !== null ? (
                    <>
                        <Coins className="h-8 w-8 text-yellow-400" />
                        {walletCoins.toLocaleString()}
                    </>
                ) : <Skeleton className="h-10 w-40" />}
              </div>
              <div className="text-lg text-muted-foreground">
                {walletCoins !== null ? `(≈ ₹${(walletCoins / 10).toFixed(2)})` : <Skeleton className="h-6 w-20" />}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add Funds</CardTitle>
              <CardDescription>Add money to your wallet using any payment method.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount to Add</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">₹</span>
                            <Input type="number" step="10" placeholder="e.g., 500" className="pl-7" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isProcessing}>
                    {isProcessing ? 'Processing...' : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" /> Add Funds
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
