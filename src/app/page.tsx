
import GiftCardList from "@/components/gift-card-list";
import Header from "@/components/header";
import WalletSummary from "@/components/wallet-summary";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 z-0 h-full w-full bg-gradient-to-r from-background via-black to-background bg-[length:400%_400%] animate-[animated-gradient_15s_ease_infinite]"></div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <Header />
        <main className="container mx-auto flex-1 px-4 py-8 md:px-6 lg:py-12">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent sm:text-5xl md:text-6xl">
              Unlock Your Digital World
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              Instantly buy and send gift cards and memberships from the world's top brands.
              The perfect gift, every time.
            </p>
          </div>

          <GiftCardList />
        </main>
        <WalletSummary />
      </div>
    </div>
  );
}
