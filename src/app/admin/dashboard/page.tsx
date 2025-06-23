
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Order, Wallet } from '@/lib/types';
import OverviewCards from '@/components/admin/overview-cards';
import SalesChart from '@/components/admin/sales-chart';
import RecentOrders from '@/components/admin/recent-orders';

async function getDashboardData() {
  const ordersQuery = query(collection(db, 'orders'), orderBy('purchaseDate', 'desc'));
  const usersQuery = query(collection(db, 'wallets'));

  const [ordersSnapshot, usersSnapshot] = await Promise.all([
    getDocs(ordersQuery),
    getDocs(usersQuery),
  ]);

  const orders = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Order[];
  const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Wallet[];
  
  const totalRevenue = orders.reduce((acc, order) => acc + (order.finalAmount ?? order.amount), 0);
  const totalOrders = orders.length;
  const totalUsers = users.length;
  
  const recentOrders = orders.slice(0, 5);

  return { totalRevenue, totalOrders, totalUsers, orders, recentOrders };
}

export default async function AdminDashboardPage() {
    const { totalRevenue, totalOrders, totalUsers, orders, recentOrders } = await getDashboardData();
    
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            
            <OverviewCards
                totalRevenue={totalRevenue}
                totalOrders={totalOrders}
                totalUsers={totalUsers}
            />

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <SalesChart orders={orders} />
                </div>
                <div className="lg:col-span-1">
                    <RecentOrders orders={recentOrders} />
                </div>
            </div>
        </div>
    );
}
