
"use client";

import { format } from 'date-fns';
import type { Order } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { User } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';

interface RecentOrdersProps {
  orders: Order[];
}

export default function RecentOrders({ orders }: RecentOrdersProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        }).format(amount);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>
                    The 5 most recent orders.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {orders.map((order) => (
                    <div key={order.id} className="flex items-center gap-4">
                        <Avatar className="hidden h-9 w-9 sm:flex">
                            <AvatarFallback><User /></AvatarFallback>
                        </Avatar>
                        <div className="grid gap-1 flex-1">
                            <p className="text-sm font-medium leading-none truncate">{order.cardName}</p>
                            <p className="text-sm text-muted-foreground truncate">{order.recipientEmail}</p>
                        </div>
                        <div className="ml-auto font-medium">{formatCurrency(order.finalAmount ?? order.amount)}</div>
                    </div>
                ))}
                 <Button asChild className="w-full mt-4">
                  <Link href="/admin/orders">View All Orders</Link>
                </Button>
            </CardContent>
        </Card>
    );
}
