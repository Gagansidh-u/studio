"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import type { GiftCardType } from "@/lib/types";
import { giftCards } from "@/lib/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { CreditCard, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { AmazonIcon } from "@/components/icons/amazon-icon";
import { GooglePlayIcon } from "@/components/icons/google-play-icon";
import { SteamIcon } from "@/components/icons/steam-icon";
import { NetflixIcon } from "@/components/icons/netflix-icon";
import { SpotifyIcon } from "@/components/icons/spotify-icon";

interface GiftCardItemProps {
  card: GiftCardType;
}

const platformIcons: Record<string, React.ReactNode> = {
    'Amazon': <AmazonIcon className="h-6 w-6 text-foreground" />,
    'Steam': <SteamIcon className="h-6 w-6 text-foreground" />,
    'Google Play': <GooglePlayIcon className="h-6 w-6 text-foreground" />,
    'Netflix': <NetflixIcon className="h-6 w-6 text-foreground" />,
    'Spotify': <SpotifyIcon className="h-6 w-6 text-foreground" />,
};

const formSchema = z.object({
  customAmount: z.coerce.number()
    .min(100, { message: "Amount must be at least ₹100." })
    .refine((val) => val > 0 && val % 100 === 0, {
      message: "Amount must be a positive multiple of 100.",
    }),
});


declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function GiftCardItem({ card }: GiftCardItemProps) {
  const { toast } = useToast();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const platformCards = giftCards.filter(c => c.platform === card.platform);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customAmount: undefined,
    },
  });
  
  const aiHint = `${card.platform.toLowerCase().replace(' ', '')} card`;
  const isMembership = ['Netflix', 'Spotify'].includes(card.platform);
  const showCustomAmount = !isMembership;

  const cardTitle = isMembership
    ? `${card.platform} Membership`
    : `${card.platform} Gift Card`;

  const handlePurchase = (amount: number) => {
    if (amount <= 0) return;
    const options = {
        key: "rzp_live_YjljJCP3ewIy4d",
        amount: amount * 100, 
        currency: "INR",
        name: "Giftify",
        description: `Purchase ${card.platform} Gift Card for ₹${amount}`,
        image: "https://placehold.co/128x128.png",
        handler: function (response: any) {
            toast({
                title: "Payment Successful!",
                description: `Payment ID: ${response.razorpay_payment_id}. Your gift card details will be sent to your email.`,
            });
            setIsDialogOpen(false);
            form.reset();
            setSelectedAmount(null);
        },
        modal: {
            ondismiss: function() {
                form.reset();
                setSelectedAmount(null);
            }
        },
        prefill: {
            name: "Test User",
            email: "test.user@example.com",
            contact: "9999999999"
        },
        notes: {
            card_platform: card.platform,
            amount: amount,
        },
        theme: {
            color: "#29abe2"
        }
    };
    
    if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response: any){
            toast({
                variant: 'destructive',
                title: "Payment Failed",
                description: response.error.description,
            });
        });
        rzp.open();
    } else {
        toast({
            variant: 'destructive',
            title: "Error",
            description: "Payment gateway is not loaded. Please try again later.",
        });
    }
  };

  function onCustomAmountSubmit(values: z.infer<typeof formSchema>) {
    setSelectedAmount(values.customAmount);
    handlePurchase(values.customAmount);
  }

  const handleDenominationClick = (amount: number) => {
    setSelectedAmount(amount);
    form.reset();
    handlePurchase(amount);
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) {
            form.reset();
            setSelectedAmount(null);
        }
    }}>
      <DialogTrigger asChild>
        <Card className="flex h-full cursor-pointer flex-col overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
          <CardHeader className="flex-row items-start gap-4 space-y-0 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
              {platformIcons[card.platform]}
            </div>
            <div>
              <CardTitle className="font-headline text-lg">{cardTitle}</CardTitle>
              <CardDescription>Click to see purchase options</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex-grow p-0">
            <div className="relative aspect-video">
              <Image
                src={card.imageUrl}
                alt={card.name}
                fill
                className="object-cover"
                data-ai-hint={aiHint}
              />
            </div>
          </CardContent>
           <CardFooter className="p-4">
              <Button className="w-full">
                Buy Now
              </Button>
            </CardFooter>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-start gap-4">
             <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-muted flex-shrink-0">
               {platformIcons[card.platform]}
             </div>
             <div>
                <DialogTitle className="font-headline text-2xl">{cardTitle}</DialogTitle>
                <DialogDescription>
                  Choose a plan or enter a custom value.
                </DialogDescription>
             </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
            <div>
                <h3 className="mb-3 text-sm font-medium text-muted-foreground">
                  {isMembership ? 'Select a Membership Plan' : 'Select an Amount'}
                </h3>
                <div className="space-y-3">
                    {platformCards.map(pCard => (
                        <div key={pCard.id} className="flex items-center justify-between rounded-lg border bg-card p-3 shadow-sm">
                            <div className="flex-grow pr-4">
                                <h4 className="font-semibold">
                                  { isMembership ? pCard.name.replace(`${pCard.platform} `, '') : `₹${pCard.value} Gift Card` }
                                </h4>
                                {pCard.features && <p className="text-sm text-muted-foreground mt-1">{pCard.features}</p>}
                            </div>
                            <Button onClick={() => handleDenominationClick(pCard.value)}>
                                Buy for ₹{pCard.value}
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            {showCustomAmount && (
              <>
                <div className="flex items-center">
                    <div className="flex-grow border-t border-border"></div>
                    <span className="flex-shrink mx-4 text-xs uppercase text-muted-foreground">Or</span>
                    <div className="flex-grow border-t border-border"></div>
                </div>

                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onCustomAmountSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="customAmount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Enter Custom Amount</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">₹</span>
                                                <Input type="number" step="100" placeholder="e.g., 500" className="pl-7" {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full">
                                 <CreditCard className="mr-2 h-4 w-4" /> Purchase Custom Amount
                            </Button>
                        </form>
                    </Form>
                     <div className="mt-2 flex items-start gap-2 text-xs text-muted-foreground">
                        <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <p>Custom amounts must be in multiples of 100 (e.g., 100, 200, 300).</p>
                    </div>
                </div>
              </>
            )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
