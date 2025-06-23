import type { GiftCardType } from './types';

export const giftCards: GiftCardType[] = [
  // Amazon
  {
    id: '1',
    platform: 'Amazon',
    name: 'Amazon Gift Card',
    value: 100,
    imageUrl: 'https://placehold.co/600x400/ff9900/000000',
    instructions: `1. Visit www.amazon.in/redeem
2. Enter the claim code and click "Apply to Your Balance".
3. The gift card funds will be added to your account.`,
  },
  {
    id: '4',
    platform: 'Amazon',
    name: 'Amazon Gift Card',
    value: 250,
    imageUrl: 'https://placehold.co/600x400/ff9900/000000',
    instructions: `1. Visit www.amazon.in/redeem
2. Enter the claim code and click "Apply to Your Balance".
3. The gift card funds will be added to your account.`,
  },
  {
    id: '7',
    platform: 'Amazon',
    name: 'Amazon Gift Card',
    value: 500,
    imageUrl: 'https://placehold.co/600x400/ff9900/000000',
    instructions: `1. Visit www.amazon.in/redeem
2. Enter the claim code and click "Apply to Your Balance".
3. The gift card funds will be added to your account.`,
  },
  {
    id: '13',
    platform: 'Amazon',
    name: 'Amazon Gift Card',
    value: 1000,
    imageUrl: 'https://placehold.co/600x400/ff9900/000000',
    instructions: `1. Visit www.amazon.in/redeem
2. Enter the claim code and click "Apply to Your Balance".
3. The gift card funds will be added to your account.`,
  },

  // Steam
  {
    id: '2',
    platform: 'Steam',
    name: 'Steam Wallet Code',
    value: 250,
    imageUrl: 'https://placehold.co/600x400/1b2838/ffffff',
    instructions: `1. Go to store.steampowered.com/account/redeemwalletcode
2. Sign in to your Steam account.
3. Enter your Wallet Code and click "Continue".`,
  },
  {
    id: '5',
    platform: 'Steam',
    name: 'Steam Wallet Code',
    value: 500,
    imageUrl: 'https://placehold.co/600x400/1b2838/ffffff',
    instructions: `1. Go to store.steampowered.com/account/redeemwalletcode
2. Sign in to your Steam account.
3. Enter your Wallet Code and click "Continue".`,
  },
  {
    id: '8',
    platform: 'Steam',
    name: 'Steam Wallet Code',
    value: 1000,
    imageUrl: 'https://placehold.co/600x400/1b2838/ffffff',
    instructions: `1. Go to store.steampowered.com/account/redeemwalletcode
2. Sign in to your Steam account.
3. Enter your Wallet Code and click "Continue".`,
  },
  {
    id: '14',
    platform: 'Steam',
    name: 'Steam Wallet Code',
    value: 1500,
    imageUrl: 'https://placehold.co/600x400/1b2838/ffffff',
    instructions: `1. Go to store.steampowered.com/account/redeemwalletcode
2. Sign in to your Steam account.
3. Enter your Wallet Code and click "Continue".`,
  },

  // Google Play
  {
    id: '3',
    platform: 'Google Play',
    name: 'Google Play Gift Code',
    value: 100,
    imageUrl: 'https://placehold.co/600x400/3ddc84/ffffff',
    instructions: `1. Open the Google Play Store app.
2. Tap Menu > Redeem.
3. Enter your code.
4. Tap "Redeem".`,
  },
  {
    id: '6',
    platform: 'Google Play',
    name: 'Google Play Gift Code',
    value: 300,
    imageUrl: 'https://placehold.co/600x400/3ddc84/ffffff',
    instructions: `1. Open the Google Play Store app.
2. Tap Menu > Redeem.
3. Enter your code.
4. Tap "Redeem".`,
  },
  {
    id: '15',
    platform: 'Google Play',
    name: 'Google Play Gift Code',
    value: 500,
    imageUrl: 'https://placehold.co/600x400/3ddc84/ffffff',
    instructions: `1. Open the Google Play Store app.
2. Tap Menu > Redeem.
3. Enter your code.
4. Tap "Redeem".`,
  },
  
  // Netflix
  {
    id: '18',
    platform: 'Netflix',
    name: 'Netflix Mobile Membership',
    value: 149,
    imageUrl: 'https://placehold.co/600x400/e50914/ffffff',
    features: '480p resolution, watch on 1 phone or tablet.',
    instructions: `1. Go to netflix.com/redeem.\n2. Enter the PIN code.`,
  },
  {
    id: '9',
    platform: 'Netflix',
    name: 'Netflix Basic Membership',
    value: 199,
    imageUrl: 'https://placehold.co/600x400/e50914/ffffff',
    features: '720p resolution, watch on 1 device at a time.',
    instructions: `1. Go to netflix.com/redeem.\n2. Enter the PIN code.`,
  },
  {
    id: '11',
    platform: 'Netflix',
    name: 'Netflix Standard Membership',
    value: 499,
    imageUrl: 'https://placehold.co/600x400/e50914/ffffff',
    features: '1080p resolution, watch on 2 devices at a time.',
    instructions: `1. Go to netflix.com/redeem.\n2. Enter the PIN code.`,
  },
  {
    id: '16',
    platform: 'Netflix',
    name: 'Netflix Premium Membership',
    value: 649,
    imageUrl: 'https://placehold.co/600x400/e50914/ffffff',
    features: '4K+HDR resolution, watch on 4 devices at a time.',
    instructions: `1. Go to netflix.com/redeem.\n2. Enter the PIN code.`,
  },

  // Spotify
  {
    id: '10',
    platform: 'Spotify',
    name: 'Spotify Individual',
    value: 129,
    imageUrl: 'https://placehold.co/600x400/1db954/000000',
    features: '1 Premium account. Ad-free music listening.',
    instructions: `1. Go to spotify.com/redeem.\n2. Log in or create your Spotify account.\n3. Enter the PIN on the back of the card.`,
  },
  {
    id: '12',
    platform: 'Spotify',
    name: 'Spotify Duo',
    value: 149,
    imageUrl: 'https://placehold.co/600x400/1db954/000000',
    features: '2 Premium accounts. For couples under one roof.',
    instructions: `1. Go to spotify.com/redeem.\n2. Log in or create your Spotify account.\n3. Enter the PIN on the back of the card.`,
  },
  {
    id: '17',
    platform: 'Spotify',
    name: 'Spotify Family',
    value: 179,
    imageUrl: 'https://placehold.co/600x400/1db954/000000',
    features: 'Up to 6 Premium accounts. For family members under one roof.',
    instructions: `1. Go to spotify.com/redeem.\n2. Log in or create your Spotify account.\n3. Enter the PIN on the back of the card.`,
  },
];
