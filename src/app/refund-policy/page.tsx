
import Header from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: 'Refund Policy for Grock. Understand the conditions for receiving a refund for your purchases.',
};

export default function RefundPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container mx-auto flex-1 px-4 py-8 md:px-6 lg:py-12">
        <Card className="mx-auto max-w-3xl">
          <CardHeader>
            <CardTitle className="text-3xl">Refund Policy</CardTitle>
            <CardDescription>Last updated: October 26, 2023</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-muted-foreground">
            <p>
              At Grock, we strive to ensure a smooth and reliable experience for all our users. This policy outlines the circumstances under which a refund may be issued.
            </p>

            <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">1. Eligibility for a Refund</h3>
                <p>
                    A refund is only available under the following condition:
                </p>
                <ul className="list-disc space-y-1 pl-6">
                    <li>
                    <strong>Order Processing Failure:</strong> If we are unable to process your order and deliver the purchased gift card or membership due to a technical failure on our end, you are eligible for a full refund.
                    </li>
                </ul>
                 <p className="font-medium text-foreground/80 pt-2">
                    Please note that refunds are not provided for successfully delivered gift cards or for cards that have been partially or fully redeemed. All sales of successfully processed orders are final.
                </p>
            </div>

            <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">2. Refund Process & Timeline</h3>
                <p>
                    Once it is determined that an order is eligible for a refund, we will process it within <strong>24 hours</strong>. You will have two options for receiving the refunded amount:
                </p>
                <ul className="list-disc space-y-1 pl-6">
                    <li><strong>Grock Wallet:</strong> The refund amount can be instantly credited to your Grock wallet for immediate use on future purchases.</li>
                    <li><strong>Original Payment Source:</strong> The refund can be sent back to your original payment method (e.g., bank account, credit card). Please note that while we process the refund within 24 hours, it may take your bank or card issuer additional time to reflect the amount in your account.</li>
                </ul>
            </div>
            
            <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">3. How to Request a Refund</h3>
                <p>
                    If you believe your order has failed and you have not received your product, please contact our support team immediately. Provide your order ID and the email address used for the purchase.
                </p>
            </div>

            <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">4. Contact Us</h3>
                <p>
                    If you have questions about our Refund Policy, please contact us at: support@grock.com.
                </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
