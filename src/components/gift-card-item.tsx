"use client";

import type { GiftCardType } from "@/lib/types";
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
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
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

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function GiftCardItem({ card }: GiftCardItemProps) {
  const { toast } = useToast();
  const aiHint = `${card.platform.toLowerCase().replace(' ', '')} card`;

  const handlePurchase = () => {
    const options = {
        key: "rzp_live_YjljJCP3ewIy4d",
        amount: card.value * 100, // Razorpay expects amount in paise
        currency: "INR",
        name: "Giftify",
        description: `Purchase ${card.name}`,
        image: "https://placehold.co/128x128.png",
        handler: function (response: any) {
            toast({
                title: "Payment Successful!",
                description: `Payment ID: ${response.razorpay_payment_id}. Your gift card details will be sent to your email.`,
            });
        },
        prefill: {
            name: "Test User",
            email: "test.user@example.com",
            contact: "9999999999"
        },
        notes: {
            card_id: card.id,
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="flex h-full cursor-pointer flex-col overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
          <CardHeader className="flex-row items-start gap-4 space-y-0 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
              {platformIcons[card.platform]}
            </div>
            <div>
              <CardTitle className="font-headline text-lg">{card.name}</CardTitle>
              <CardDescription>{card.platform}</CardDescription>
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
          <CardFooter className="flex items-center justify-between p-4">
            <Badge variant="secondary" className="text-base font-bold">
              ₹{card.value}
            </Badge>
            <Button size="sm" onClick={(e) => {
                e.stopPropagation();
                handlePurchase();
            }}>
              <CreditCard className="mr-2 h-4 w-4" /> Purchase
            </Button>
          </CardFooter>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-start gap-4">
             <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-muted flex-shrink-0">
               {platformIcons[card.platform]}
             </div>
             <div>
                <DialogTitle className="font-headline text-2xl">{card.name}</DialogTitle>
                <DialogDescription>
                  {card.platform} - ₹{card.value}
                </DialogDescription>
             </div>
          </div>
        </DialogHeader>
        <div className="space-y-4 py-4">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                 <Image
                    src={card.imageUrl}
                    alt={card.name}
                    fill
                    className="object-cover"
                    data-ai-hint={aiHint}
                  />
            </div>
            <div>
                <h3 className="font-headline text-lg font-semibold">Redemption Instructions</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{card.instructions}</p>
            </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          <Button onClick={handlePurchase}>
            <CreditCard className="mr-2 h-4 w-4" /> Purchase Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
