
"use client";

import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Wallet, Coins } from "lucide-react";
import Link from "next/link";

export default function WalletSummary() {
  const { user, walletBalance, walletCoins } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
        <Link href="/wallet">
            <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardContent className="p-4 flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Wallet className="h-6 w-6 text-primary" />
                        <div>
                            <p className="text-xs text-muted-foreground">Balance</p>
                             {walletBalance !== null ? (
                                <p className="font-bold">₹{walletBalance.toFixed(2)}</p>
                             ) : (
                                <Skeleton className="h-5 w-20 mt-1" />
                             )}
                        </div>
                    </div>
                     <div className="flex items-center gap-2">
                        <Coins className="h-6 w-6 text-yellow-400" />
                        <div>
                            <p className="text-xs text-muted-foreground">Coins</p>
                             {walletCoins !== null ? (
                                <p className="font-bold">{walletCoins}</p>
                             ) : (
                                <Skeleton className="h-5 w-16 mt-1" />
                             )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    </div>
  );
}
