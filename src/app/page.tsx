
import GiftCardList from "@/components/gift-card-list";
import Header from "@/components/header";
import WalletSummary from "@/components/wallet-summary";
import { BadgePercent } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 z-0 h-full w-full bg-gradient-to-r from-background via-black to-background bg-[length:400%_400%] animate-[animated-gradient_15s_ease_infinite]"></div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <Header />
        <main className="container mx-auto flex-1 px-4 py-8 md:px-6 lg:py-12">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent sm:text-5xl md:text-6xl">
              Buy Gift Cards & Memberships Instantly
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              Instantly buy and send gift cards and memberships from the world's top brands.
              The perfect gift, every time.
            </p>
          </div>

          <div className="mt-10 mx-auto max-w-2xl">
            <div className="flex items-center justify-center gap-4 rounded-lg border border-primary/30 bg-card p-4 text-center shadow-lg">
                <BadgePercent className="h-10 w-10 shrink-0 text-primary" />
                <div className="text-left">
                    <h2 className="font-semibold text-foreground">1% Unlimited Cashback on All Purchases</h2>
                    <p className="text-sm text-muted-foreground">Earn Grock Coins and save on your next order.</p>
                </div>
            </div>
          </div>

          <GiftCardList />
        </main>
        <WalletSummary />
      </div>
    </div>
  );
}
