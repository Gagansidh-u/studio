"use client";

import { useState } from "react";
import { giftCards } from "@/lib/data";
import GiftCardItem from "./gift-card-item";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function GiftCardList() {
  const [searchQuery, setSearchQuery] = useState("");

  const uniqueGiftCardsByPlatform = giftCards.filter(
    (card, index, self) =>
      index === self.findIndex((c) => c.platform === card.platform)
  );

  const filteredGiftCards = uniqueGiftCardsByPlatform.filter(
    (card) =>
      card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.platform.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mt-12">
      <div className="relative mx-auto mb-8 max-w-lg">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search for gift cards (e.g. Amazon, Steam...)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-full bg-background/80 py-6 pl-10 pr-4 shadow-inner-lg"
        />
      </div>

      {filteredGiftCards.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredGiftCards.map((card) => (
            <GiftCardItem key={card.id} card={card} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
            <p className="text-lg text-muted-foreground">No gift cards found for &quot;{searchQuery}&quot;.</p>
        </div>
      )}
    </div>
  );
}
