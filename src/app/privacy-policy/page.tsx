import Header from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Grock. Learn how we collect, use, and protect your data.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container mx-auto flex-1 px-4 py-8 md:px-6 lg:py-12">
        <Card className="mx-auto max-w-3xl">
          <CardHeader>
            <CardTitle className="text-3xl">Privacy Policy</CardTitle>
            <CardDescription>Last updated: October 26, 2023</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-muted-foreground">
            <p>
              Welcome to Grock. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.
            </p>

            <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">1. Information We Collect</h3>
                <p>
                    We may collect information about you in a variety of ways. The information we may collect includes:
                </p>
                <ul className="list-disc space-y-1 pl-6">
                    <li>
                    <strong>Personal Data:</strong> Personally identifiable information, such as your name and email address, that you voluntarily give to us when you register with the application.
                    </li>
                    <li>
                    <strong>Transaction Data:</strong> Information related to your purchases, including gift card details, amounts, recipient emails, and payment methods. We do not store your full credit card details. Payments are processed by our third-party payment gateway, Razorpay.
                    </li>
                    <li>
                    <strong>Wallet Data:</strong> Information about your wallet balance, coins earned, and coins used within the application.
                    </li>
                </ul>
            </div>

            <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">2. How We Use Your Information</h3>
                <p>
                    Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you to:
                </p>
                <ul className="list-disc space-y-1 pl-6">
                    <li>Create and manage your account.</li>
                    <li>Process your transactions and deliver your purchased gift cards.</li>
                    <li>Manage your wallet balance and loyalty coins.</li>
                    <li>Email you regarding your account or order.</li>
                    <li>Ensure the security of our platform and prevent fraudulent transactions.</li>
                </ul>
            </div>
            
            <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">3. Disclosure of Your Information</h3>
                <p>
                    We do not share your personal information with third parties except as described in this Privacy Policy. We may share information with:
                </p>
                <ul className="list-disc space-y-1 pl-6">
                    <li><strong>Service Providers:</strong> We use third-party services like Google Firebase for database and authentication, and Razorpay for payment processing. These services have their own privacy policies.</li>
                    <li><strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in the good faith belief that such action is necessary to comply with a legal obligation.</li>
                </ul>
            </div>

            <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">4. Security of Your Information</h3>
                <p>
                    We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.
                </p>
            </div>

            <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">5. Your Rights</h3>
                <p>
                    You have the right to access the personal information we hold about you and to ask that your personal information be corrected, updated, or deleted. You can manage your account information and delete your account from your user profile settings.
                </p>
            </div>

            <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">6. Changes to This Policy</h3>
                <p>
                    We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
                </p>
            </div>

            <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">7. Contact Us</h3>
                <p>
                    If you have questions or comments about this Privacy Policy, please contact us at: support@grock.com.
                </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
