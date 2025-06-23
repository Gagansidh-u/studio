import GiftCardList from "@/components/gift-card-list";
import Header from "@/components/header";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 z-0 h-full w-full">
        <iframe
          src="https://my.spline.design/noiselightscopy-5kzzqk5b7smylbe0dakwhzjh/!/embed"
          frameBorder="0"
          width="100%"
          height="100%"
          className="pointer-events-none"
        ></iframe>
         <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <Header />
        <main className="container mx-auto flex-1 px-4 py-8 md:px-6 lg:py-12">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Unlock Your Digital World
            </h1>
            <p className="mt-4 text-lg text-muted-foreground md:text-xl">
              Instantly buy and send gift cards from the world's top brands.
              The perfect gift, every time.
            </p>
          </div>

          <GiftCardList />
        </main>
      </div>
    </div>
  );
}
