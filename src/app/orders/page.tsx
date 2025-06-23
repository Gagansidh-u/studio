
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import type { Order } from '@/lib/types';
import Header from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge, type BadgeProps } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Coins, CreditCard, Landmark, Mail, Calendar, Hash, CheckCircle, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const getStatusVariant = (status: Order['status']): BadgeProps['variant'] => {
  switch (status) {
    case 'Completed':
      return 'success';
    case 'Pending':
      return 'warning';
    case 'Processing':
      return 'default';
    default:
      return 'secondary';
  }
};

const OrderDetailItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: React.ReactNode }) => (
    <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
        <div className="text-primary">{icon}</div>
        <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-sm font-medium">{value}</p>
        </div>
    </div>
);

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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
                <Skeleton className="h-20 w-full rounded-lg" />
                <Skeleton className="h-20 w-full rounded-lg" />
                <Skeleton className="h-20 w-full rounded-lg" />
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
                    <Skeleton className="h-20 w-full rounded-lg" />
                    <Skeleton className="h-20 w-full rounded-lg" />
                    <Skeleton className="h-20 w-full rounded-lg" />
                </div>
            ) : orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card 
                    key={order.id} 
                    className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex-1 overflow-hidden">
                        <p className="font-medium truncate">{order.cardName}</p>
                        <p className="text-sm text-muted-foreground">
                           {order.purchaseDate ? format(order.purchaseDate.toDate(), 'PP') : 'N/A'}
                        </p>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
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

      <Dialog open={!!selectedOrder} onOpenChange={(isOpen) => !isOpen && setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-lg">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedOrder.cardName}</DialogTitle>
                <DialogDescription>
                  Order details for your purchase on {selectedOrder.purchaseDate ? format(selectedOrder.purchaseDate.toDate(), 'PP') : 'N/A'}.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                  <OrderDetailItem 
                    icon={<CheckCircle className="h-5 w-5" />}
                    label="Status"
                    value={<Badge variant={getStatusVariant(selectedOrder.status)}>{selectedOrder.status}</Badge>}
                  />
                   <OrderDetailItem 
                    icon={<Calendar className="h-5 w-5" />}
                    label="Purchase Date"
                    value={selectedOrder.purchaseDate ? format(selectedOrder.purchaseDate.toDate(), 'PPpp') : 'N/A'}
                  />
                  <OrderDetailItem 
                    icon={<Mail className="h-5 w-5" />}
                    label="Recipient Email"
                    value={selectedOrder.recipientEmail}
                  />
                   <OrderDetailItem 
                    icon={selectedOrder.paymentMethod === 'wallet' ? <CreditCard className="h-5 w-5" /> : <Landmark className="h-5 w-5" />}
                    label="Payment Method"
                    value={selectedOrder.paymentMethod === 'wallet' ? 'Wallet' : 'PG'}
                  />
                   <OrderDetailItem 
                    icon={<CreditCard className="h-5 w-5" />}
                    label="Final Amount"
                    value={`₹${(selectedOrder.finalAmount ?? selectedOrder.amount).toFixed(2)}`}
                  />
                   <OrderDetailItem 
                    icon={<Coins className="h-5 w-5 text-yellow-500" />}
                    label="Coins Earned"
                    value={selectedOrder.coinsEarned ?? 0}
                  />
                   <OrderDetailItem 
                    icon={<Coins className="h-5 w-5 text-yellow-500" />}
                    label="Coins Used"
                    value={selectedOrder.coinsUsed ?? 0}
                  />
                  <OrderDetailItem 
                    icon={<Hash className="h-5 w-5" />}
                    label="Payment ID"
                    value={<span className="break-all">{selectedOrder.paymentId}</span>}
                  />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
