
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import type { Order } from '@/lib/types';
import Header from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge, type BadgeProps } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Coins } from 'lucide-react';

const getStatusVariant = (status: Order['status']): BadgeProps['variant'] => {
  switch (status) {
    case 'Completed':
      return 'success';
    case 'Pending':
      return 'warning';
    case 'Processing':
      return 'default'; // 'default' uses primary color (blue)
    default:
      return 'secondary';
  }
};

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      const fetchOrders = async () => {
        setLoading(true);
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', user.uid),
          orderBy('purchaseDate', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const userOrders = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Order[];
        setOrders(userOrders);
        setLoading(false);
      };
      fetchOrders();
    }
  }, [user]);

  if (authLoading || !user) {
    return (
       <div className="flex min-h-screen flex-col">
        <Header />
        <main className="container mx-auto flex-1 px-4 py-8 md:px-6 lg:py-12">
            <div className="space-y-2">
                <Skeleton className="h-8 w-1/4" />
                <Skeleton className="h-6 w-1/2" />
            </div>
            <div className="mt-8 space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
            </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container mx-auto flex-1 px-4 py-8 md:px-6 lg:py-12">
        <Card>
          <CardHeader>
            <CardTitle>My Orders</CardTitle>
            <CardDescription>View your past gift card and membership purchases.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
                <div className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            ) : orders.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Recipient Email</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Coins Used</TableHead>
                    <TableHead>Coins Earned</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        {order.purchaseDate 
                          ? format(order.purchaseDate.toDate(), 'PPpp')
                          : 'N/A'}
                      </TableCell>
                      <TableCell className="font-medium">{order.cardName}</TableCell>
                      <TableCell>{order.recipientEmail}</TableCell>
                      <TableCell>₹{order.finalAmount ?? order.amount}</TableCell>
                      <TableCell className="flex items-center gap-1">
                        {order.coinsUsed ? <><Coins className="h-4 w-4 text-yellow-400" /> {order.coinsUsed}</> : '-'}
                      </TableCell>
                       <TableCell className="flex items-center gap-1">
                        {order.coinsEarned ? <><Coins className="h-4 w-4 text-yellow-400" /> {order.coinsEarned}</> : '-'}
                      </TableCell>
                      <TableCell className="capitalize">{order.paymentMethod}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground">You haven&apos;t made any purchases yet.</p>
                <Button asChild className="mt-4">
                  <Link href="/">Start Shopping</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
