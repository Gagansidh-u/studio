
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore"; 

import type { GiftCardType } from "@/lib/types";
import { giftCards } from "@/lib/data";
import { useAuth } from "@/contexts/auth-context";
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
import { CheckCircle, CreditCard, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AmazonIcon } from "@/components/icons/amazon-icon";
import { GooglePlayIcon } from "@/components/icons/google-play-icon";
import { SteamIcon } from "@/components/icons/steam-icon";
import { NetflixIcon } from "@/components/icons/netflix-icon";
import { SpotifyIcon } from "@/components/icons/spotify-icon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "./ui/badge";

interface GiftCardItemProps {
  card: GiftCardType;
}

const platformIcons: Record<string, React.ReactNode> = {
    'Amazon': <AmazonIcon className="h-6 w-6 text-foreground" />,
    'Amazon Prime': <AmazonIcon className="h-6 w-6 text-foreground" />,
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
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const allPlatformCards = giftCards.filter(c => c.platform === card.platform);
  const membershipPlans = allPlatformCards.filter(c => c.category === 'Membership');
  const giftCardOptions = allPlatformCards.filter(c => c.category === 'Gift Card');

  const hasMemberships = membershipPlans.length > 0;
  const hasGiftCards = giftCardOptions.length > 0;
  
  const monthlyPlans = membershipPlans.filter(c => c.planType === 'Monthly');
  const annualPlans = membershipPlans.filter(c => c.planType === 'Annual');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customAmount: undefined,
    },
  });
  
  const aiHint = `${card.platform.toLowerCase().replace(' ', '')} card`;

  let dialogTitle = card.platform;
  if (hasMemberships && hasGiftCards) {
      dialogTitle = `${card.platform} Memberships & Gift Cards`;
  } else if (hasMemberships) {
      dialogTitle = `${card.platform} Membership`;
  } else if (hasGiftCards) {
      dialogTitle = `${card.platform} Gift Card`;
  }

  let dialogDescription = "Choose an option below.";
  if (hasMemberships && !hasGiftCards) {
    dialogDescription = 'Choose a membership plan.';
  } else if (!hasMemberships && hasGiftCards) {
    dialogDescription = 'Choose a value or enter a custom amount.';
  }


  const handlePurchase = async (amount: number, name: string) => {
    if (amount <= 0) return;
    const options = {
        key: "rzp_live_YjljJCP3ewIy4d",
        amount: amount * 100, 
        currency: "INR",
        name: "Grock",
        description: `Purchase ${name}`,
        image: "https://placehold.co/128x128.png",
        handler: async function (response: any) {
            toast({
                title: "Payment Successful!",
                description: `Payment ID: ${response.razorpay_payment_id}. Your gift card details will be sent to your email.`,
            });
            
            if (user) {
              try {
                await addDoc(collection(db, "orders"), {
                  userId: user.uid,
                  cardPlatform: card.platform,
                  cardName: name,
                  amount: amount,
                  purchaseDate: serverTimestamp(),
                  status: 'Completed',
                  paymentId: response.razorpay_payment_id,
                });
              } catch (error) {
                console.error("Error writing document: ", error);
              }
            }

            setIsDialogOpen(false);
            form.reset();
        },
        modal: {
            ondismiss: function() {
                form.reset();
            }
        },
        prefill: {
            name: user?.displayName ?? "Test User",
            email: user?.email ?? "test.user@example.com",
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
    handlePurchase(values.customAmount, `${card.platform} Gift Card`);
  }

  const PlanSelector = ({ plans }: { plans: GiftCardType[] }) => (
    <Accordion type="single" collapsible className="w-full">
      {plans.map(pCard => (
        <AccordionItem value={pCard.id} key={pCard.id} className="border-b-0">
          <div className="flex items-center justify-between rounded-lg border bg-card p-3 shadow-sm mb-3">
            <AccordionTrigger className="flex-grow p-0 hover:no-underline">
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{pCard.name}</h4>
                  {pCard.popular && (
                    <Badge variant="outline" className="text-primary border-primary">Most Popular</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">₹{pCard.value}</p>
              </div>
            </AccordionTrigger>
            <Button onClick={() => handlePurchase(pCard.value, pCard.name)} className="ml-4">
                Buy
            </Button>
          </div>
          <AccordionContent className="pb-4 pt-0 px-3">
            <ul className="space-y-2 text-sm text-muted-foreground">
              {pCard.features?.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );

  const MembershipContent = (
    <>
      {(monthlyPlans.length > 0 && annualPlans.length > 0) ? (
        <Tabs defaultValue="monthly" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="annual">Annual</TabsTrigger>
          </TabsList>
          <TabsContent value="monthly" className="mt-4">
            <PlanSelector plans={monthlyPlans} />
          </TabsContent>
          <TabsContent value="annual" className="mt-4">
            <PlanSelector plans={annualPlans} />
          </TabsContent>
        </Tabs>
      ) : (
        <>
          {monthlyPlans.length > 0 && <PlanSelector plans={monthlyPlans} />}
          {annualPlans.length > 0 && <PlanSelector plans={annualPlans} />}
        </>
      )}
    </>
  );

  const GiftCardContent = (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">Select an Amount</h3>
        <div className="grid grid-cols-2 gap-3">
            {giftCardOptions.map(pCard => (
                <Button key={pCard.id} variant="outline" onClick={() => handlePurchase(pCard.value, pCard.name)}>
                  ₹{pCard.value}
                </Button>
            ))}
        </div>
      </div>

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
    </div>
  );

  return (
    <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) form.reset();
    }}>
      <DialogTrigger asChild>
        <Card className="flex h-full cursor-pointer flex-col overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
          <CardHeader className="flex-row items-start gap-4 space-y-0 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
              {platformIcons[card.platform]}
            </div>
            <div>
              <CardTitle className="font-headline text-lg">{card.platform}</CardTitle>
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
              <Button className="w-full">Buy Now</Button>
            </CardFooter>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-start gap-4">
             <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-muted flex-shrink-0">
               {platformIcons[card.platform]}
             </div>
             <div>
                <DialogTitle className="font-headline text-2xl">{dialogTitle}</DialogTitle>
                <DialogDescription>{dialogDescription}</DialogDescription>
             </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {hasMemberships && hasGiftCards ? (
            <Tabs defaultValue="membership" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="membership">Membership</TabsTrigger>
                <TabsTrigger value="gift-card">Gift Card</TabsTrigger>
              </TabsList>
              <TabsContent value="membership" className="mt-4">
                {MembershipContent}
              </TabsContent>
              <TabsContent value="gift-card" className="mt-4">
                {GiftCardContent}
              </TabsContent>
            </Tabs>
          ) : hasMemberships ? (
            MembershipContent
          ) : hasGiftCards ? (
            GiftCardContent
          ) : null}
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
