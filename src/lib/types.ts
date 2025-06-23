
export type GiftCardType = {
  id: string;
  platform: 'Amazon' | 'Amazon Prime' | 'Steam' | 'Google Play' | 'Netflix' | 'Spotify';
  name: string;
  value: number;
  imageUrl: string;
  instructions: string;
  category: 'Gift Card' | 'Membership';
  planType?: 'Monthly' | 'Annual';
  features?: string[];
  popular?: boolean;
};

export type Order = {
  id?: string;
  userId: string;
  cardPlatform: string;
  cardName: string;
  amount: number;
  finalAmount?: number;
  purchaseDate: any;
  status: 'Completed';
  paymentId: string;
  paymentMethod: 'razorpay' | 'wallet';
  coinsEarned?: number;
  coinsUsed?: number;
  recipientEmail: string;
};

export type Wallet = {
  balance: number;
  coins: number;
  userId: string;
  email?: string;
};
