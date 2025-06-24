
import Header from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms and Conditions for using the Grock application.',
};

export default function TermsAndConditionsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container mx-auto flex-1 px-4 py-8 md:px-6 lg:py-12">
        <Card className="mx-auto max-w-3xl">
          <CardHeader>
            <CardTitle className="text-3xl">Terms & Conditions</CardTitle>
            <CardDescription>Last updated: October 26, 2023</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-muted-foreground">
            <p>
              Please read these Terms and Conditions ("Terms") carefully before using the Grock application (the "Service") operated by us. Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms.
            </p>

            <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">1. Accounts</h3>
                <p>
                    When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service. You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
                </p>
            </div>

            <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">2. Purchases</h3>
                <p>
                    If you wish to purchase any product or service made available through the Service ("Purchase"), you may be asked to supply certain information relevant to your Purchase. All purchases are processed through our third-party payment gateway, Razorpay, or your Grock wallet. As per our Refund Policy, sales of successfully processed orders are final.
                </p>
            </div>
            
            <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">3. Use of Gift Cards</h3>
                <p>
                    Gift cards and membership vouchers purchased through our Service are subject to the terms and conditions of the respective third-party provider (e.g., Amazon, Steam). It is your responsibility to read and comply with their terms. We are not responsible for any issues arising from the use or redemption of these cards.
                </p>
            </div>

             <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">4. Intellectual Property</h3>
                <p>
                    The Service and its original content, features, and functionality are and will remain the exclusive property of Grock and its licensors.
                </p>
            </div>

            <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">5. Termination</h3>
                <p>
                    We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                </p>
            </div>

            <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">6. Changes To Terms</h3>
                <p>
                    We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page.
                </p>
            </div>

            <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">7. Contact Us</h3>
                <p>
                    If you have any questions about these Terms, please contact us at: support@grock.com.
                </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
