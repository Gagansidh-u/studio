
"use client";

import { useState } from "react";
import { giftCards } from "@/lib/data";
import GiftCardItem from "./gift-card-item";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type { GiftCardType } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Helper to get a unique representative card for each platform from a given list of cards.
const getDisplayCards = (cards: GiftCardType[]) => {
  const uniquePlatforms = [...new Set(cards.map(card => card.platform))];
  return uniquePlatforms.map(platform => {
    return cards.find(card => card.platform === platform)!;
  }).filter(Boolean); // Ensure no undefined values
};

export default function GiftCardList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMembershipPlanType, setActiveMembershipPlanType] = useState("all"); // 'all', 'monthly', 'annual'

  // Filter cards based on search query
  const searchedCards = giftCards.filter(
    (card) =>
      card.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get display cards for "Gift Cards" tab
  const giftCardResults = getDisplayCards(
    searchedCards.filter((card) => card.category === 'Gift Card')
  );

  // Filter memberships by plan type for the "Memberships" tab
  const allMemberships = searchedCards.filter((card) => card.category === 'Membership');
  const planTypeFilteredMemberships = activeMembershipPlanType === 'all'
    ? allMemberships
    : allMemberships.filter((card) => card.planType?.toLowerCase() === activeMembershipPlanType);
  
  const membershipResults = getDisplayCards(planTypeFilteredMemberships);

  // Component to render the grid of cards
  const CardGrid = ({ cards }: { cards: GiftCardType[] }) => (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {cards.map((card) => (
        <GiftCardItem key={card.platform} card={card} />
      ))}
    </div>
  );

  return (
    <div className="mt-10 space-y-16">
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

      {searchedCards.length === 0 ? (
         <div className="py-16 text-center">
            <p className="text-lg text-muted-foreground">No items found for &quot;{searchQuery}&quot;.</p>
        </div>
      ) : (
        <Tabs defaultValue="gift-cards" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="gift-cards">Gift Cards</TabsTrigger>
            <TabsTrigger value="memberships">Membership Vouchers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="gift-cards" className="mt-8">
            {giftCardResults.length > 0 ? (
              <CardGrid cards={giftCardResults} />
            ) : (
              <div className="py-16 text-center">
                <p className="text-lg text-muted-foreground">No gift cards found.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="memberships" className="mt-8">
            <Tabs defaultValue={activeMembershipPlanType} onValueChange={setActiveMembershipPlanType} className="w-full">
              <TabsList className="mb-8 grid w-full max-w-md mx-auto grid-cols-3">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="annual">Annual</TabsTrigger>
              </TabsList>
              
              {membershipResults.length > 0 ? (
                <CardGrid cards={membershipResults} />
              ) : (
                 <div className="py-16 text-center">
                    <p className="text-lg text-muted-foreground">No {activeMembershipPlanType !== 'all' ? activeMembershipPlanType : ''} memberships found.</p>
                </div>
              )}
            </Tabs>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
