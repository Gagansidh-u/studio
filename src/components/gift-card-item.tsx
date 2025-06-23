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
import { ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { AmazonIcon } from "@/components/icons/amazon-icon";
import { GooglePlayIcon } from "@/components/icons/google-play-icon";
import { SteamIcon } from "@/components/icons/steam-icon";

interface GiftCardItemProps {
  card: GiftCardType;
}

const platformIcons: Record<string, React.ReactNode> = {
    'Amazon': <AmazonIcon className="h-6 w-6 text-foreground" />,
    'Steam': <SteamIcon className="h-6 w-6 text-foreground" />,
    'Google Play': <GooglePlayIcon className="h-6 w-6 text-foreground" />,
};

export default function GiftCardItem({ card }: GiftCardItemProps) {
  const { toast } = useToast();

  const handleAddToCart = () => {
    toast({
      title: "Added to Cart!",
      description: `${card.name} has been added to your cart.`,
    });
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
                data-ai-hint="gift card"
              />
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-between p-4">
            <Badge variant="secondary" className="text-base font-bold">
              ${card.value}
            </Badge>
            <Button size="sm" onClick={(e) => {
                e.stopPropagation();
                handleAddToCart();
            }}>
              <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
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
                  {card.platform} - ${card.value}
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
                    data-ai-hint="gaming currency"
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
          <Button onClick={handleAddToCart}>
            <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
