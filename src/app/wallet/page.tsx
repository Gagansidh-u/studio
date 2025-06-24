
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
    .min(1, { message: 'Amount must be at least 1.' })
    .positive({ message: 'Amount must be positive.' }),
});

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function WalletPage() {
  const { user, loading: authLoading, walletBalance, walletCoins, currency } = useAuth();
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

  const currencySymbol = currency === 'INR' ? '₹' : '$';

  const handleAddFunds = async (amount: number) => {
    if (!user || amount <= 0) return;
    setIsProcessing(true);

    const options = {
      key: "YOUR_LIVE_RAZORPAY_KEY", // Replace with your live Razorpay key
      amount: amount * 100,
      currency: currency,
      name: "Grock Wallet",
      description: `Add ${currencySymbol}${amount} to your wallet`,
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2329abe2'%3E%3Cpath d='M20 5h-3.5C16.5 3.3 15.4 2 14 2c-1.4 0-2.5 1.3-2.5 3H8c0-1.7-1.1-3-2.5-3S3 3.3 3 5H2c-.6 0-1 .4-1 1v2c0 .6.4 1 1 1h1v10c0 .6.4 1 1 1h14c.6 0 1-.4 1-1V9h1c.6 0 1-.4 1-1V6c0-.6-.4-1-1-1zM8 8H4V6h4v2zm11 11H5V9h14v10zm-6-3c0-1.7-1.3-3-3-3s-3 1.3-3 3h2c0-.6.4-1 1-1s1 .4 1 1h2zm5-7h-4V6h4v2z'/%3E%3C/svg%3E",
      handler: async function (response: any) {
        try {
          const walletRef = doc(db, 'wallets', user.uid);
          await runTransaction(db, async (transaction) => {
            const walletDoc = await transaction.get(walletRef);
            if (!walletDoc.exists()) {
              // This case should ideally not happen for a logged-in user
              transaction.set(walletRef, { balance: amount, coins: 0, userId: user.uid, currency: currency });
            } else {
              const newBalance = walletDoc.data().balance + amount;
              transaction.update(walletRef, { balance: newBalance });
            }
          });
          toast({
            title: "Funds Added Successfully!",
            description: `${currencySymbol}${amount} has been added to your wallet.`,
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
        currency: currency,
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
              <CardDescription>Your current wallet balance ({currency}).</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">
                {walletBalance !== null ? `${currencySymbol}${walletBalance.toFixed(2)}` : <Skeleton className="h-10 w-40" />}
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
                {walletCoins !== null ? `(≈ ${currencySymbol}${(walletCoins / 10).toFixed(2)})` : <Skeleton className="h-6 w-20" />}
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
                        <FormLabel>Amount to Add ({currency})</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">{currencySymbol}</span>
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
                        <CreditCard /> Add Funds
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
