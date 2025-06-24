
import type { Timestamp } from "firebase/firestore";

export type GiftCardType = {
  id: string;
  platform: 'Amazon' | 'Amazon Prime' | 'Steam' | 'Google Play' | 'Netflix' | 'Spotify';
  name: string;
  value: number; // INR value
  valueUSD: number; // USD value
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
  gstAmount?: number;
  purchaseDate: Timestamp;
  status: 'Completed' | 'Pending' | 'Processing';
  paymentId: string;
  paymentMethod: 'razorpay' | 'wallet';
  coinsEarned?: number;
  coinsUsed?: number;
  discountAmount?: number;
  recipientEmail: string;
  currency: 'INR' | 'USD';
};

export type Wallet = {
  id?: string;
  balance: number;
  coins: number;
  userId: string;
  email?: string;
  name?: string;
  creationTime?: Timestamp;
  currency?: 'INR' | 'USD';
  wishlist?: string[];
};
