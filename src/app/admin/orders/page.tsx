
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminOrdersPage() {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Manage Orders</CardTitle>
                    <CardDescription>
                        View and update all customer orders. Feature coming soon.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Full order management functionality will be available here shortly.</p>
                </CardContent>
            </Card>
        </div>
    );
}
