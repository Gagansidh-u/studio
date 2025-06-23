
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminUsersPage() {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold tracking-tight">Users</h1>
             <Card>
                <CardHeader>
                    <CardTitle>Manage Users</CardTitle>
                    <CardDescription>
                        View and manage all registered users. Feature coming soon.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Full user management functionality will be available here shortly.</p>
                </CardContent>
            </Card>
        </div>
    );
}
