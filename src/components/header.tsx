import { Gift } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-border/50 bg-background/50 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Gift className="h-7 w-7 text-primary" />
          <span className="font-headline text-2xl font-bold text-foreground">
            Giftify
          </span>
        </Link>
      </div>
    </header>
  );
}
