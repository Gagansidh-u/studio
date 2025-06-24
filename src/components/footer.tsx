import Link from 'next/link';
import { Gift } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background/50">
      <div className="container mx-auto px-4 py-6 md:px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
                <Gift className="h-6 w-6 text-primary" />
                <span className="font-headline text-xl font-bold text-foreground">
                Grock
                </span>
            </div>
            <p className="text-sm text-muted-foreground">
                &copy; Grock. All rights reserved.
            </p>
            <nav className="flex gap-4">
                <Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-foreground">
                    Privacy Policy
                </Link>
            </nav>
        </div>
      </div>
    </footer>
  );
}
