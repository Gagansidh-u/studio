"use client";

import { useState } from "react";
import { giftCards } from "@/lib/data";
import GiftCardItem from "./gift-card-item";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type { GiftCardType } from "@/lib/types";

export default function GiftCardList() {
  const [searchQuery, setSearchQuery] = useState("");

  const filterAndUniqueCards = (cards: GiftCardType[]) => {
    const uniqueByPlatform = cards.filter(
      (card, index, self) =>
        index === self.findIndex((c) => c.platform === card.platform)
    );

    if (!searchQuery) {
        return uniqueByPlatform;
    }

    return uniqueByPlatform.filter(
        (card) =>
          card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          card.platform.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }

  const allGiftCards = giftCards.filter(card => card.category === 'Gift Card');
  const allMemberships = giftCards.filter(card => card.category === 'Membership');

  const filteredGiftCards = filterAndUniqueCards(allGiftCards);
  const filteredMemberships = filterAndUniqueCards(allMemberships);

  return (
    <div className="mt-12 space-y-16">
      <div className="relative mx-auto mb-8 max-w-lg">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search for cards & memberships..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-full bg-background/80 py-6 pl-10 pr-4 shadow-inner-lg"
        />
      </div>

      {filteredGiftCards.length > 0 && (
        <section>
            <h2 className="mb-8 text-center font-headline text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                Gift Cards
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredGiftCards.map((card) => (
                    <GiftCardItem key={card.id} card={card} />
                ))}
            </div>
        </section>
      )}

      {filteredMemberships.length > 0 && (
        <section>
            <h2 className="mb-8 text-center font-headline text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                Membership Vouchers
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredMemberships.map((card) => (
                    <GiftCardItem key={card.id} card={card} />
                ))}
            </div>
        </section>
      )}

      {filteredGiftCards.length === 0 && filteredMemberships.length === 0 && (
         <div className="py-16 text-center">
            <p className="text-lg text-muted-foreground">No items found for &quot;{searchQuery}&quot;.</p>
        </div>
      )}
    </div>
  );
}
