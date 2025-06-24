
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  User, 
  signOut, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  Auth, 
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  updateProfile
} from 'firebase/auth';
import { auth, db, storage } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { doc, onSnapshot, getDoc, setDoc, deleteDoc, serverTimestamp, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  walletBalance: number | null;
  walletCoins: number | null;
  currency: 'INR' | 'USD';
  wishlist: string[];
  login: typeof signInWithEmailAndPassword;
  signup: typeof createUserWithEmailAndPassword;
  logout: () => void;
  deleteAccount: (password: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  setCurrency: (currency: 'INR' | 'USD') => Promise<void>;
  addToWishlist: (cardId: string) => Promise<void>;
  removeFromWishlist: (cardId: string) => Promise<void>;
  updateProfilePicture: (file: File) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  walletBalance: null,
  walletCoins: null,
  currency: 'INR',
  wishlist: [],
  login: async () => { throw new Error('login not implemented'); },
  signup: async () => { throw new Error('signup not implemented'); },
  logout: () => {},
  deleteAccount: async () => { throw new Error('deleteAccount not implemented'); },
  changePassword: async () => { throw new Error('changePassword not implemented'); },
  setCurrency: async () => { throw new Error('setCurrency not implemented'); },
  addToWishlist: async () => { throw new Error('addToWishlist not implemented'); },
  removeFromWishlist: async () => { throw new Error('removeFromWishlist not implemented'); },
  updateProfilePicture: async () => { throw new Error('updateProfilePicture not implemented'); },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [walletCoins, setWalletCoins] = useState<number | null>(null);
  const [currency, setCurrencyState] = useState<'INR' | 'USD'>('INR');
  const [wishlist, setWishlist] = useState<string[]>([]);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const walletRef = doc(db, 'wallets', user.uid);
        const walletSnap = await getDoc(walletRef);
        if (!walletSnap.exists()) {
          await setDoc(walletRef, {
            balance: 0,
            coins: 0,
            userId: user.uid,
            email: user.email,
            name: user.displayName,
            creationTime: serverTimestamp(),
            currency: 'INR',
            wishlist: [],
          });
        }
      }
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);
  
  useEffect(() => {
    let unsubscribeWallet: (() => void) | undefined;

    if (user) {
      const walletRef = doc(db, 'wallets', user.uid);
      unsubscribeWallet = onSnapshot(walletRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setWalletBalance(data.balance ?? 0);
          setWalletCoins(data.coins ?? 0);
          setCurrencyState(data.currency ?? 'INR');
          setWishlist(data.wishlist ?? []);
        } else {
          setWalletBalance(0);
          setWalletCoins(0);
          setCurrencyState('INR');
          setWishlist([]);
        }
      });
    } else {
      setWalletBalance(null);
      setWalletCoins(null);
      setCurrencyState('INR');
      setWishlist([]);
    }

    return () => {
      if (unsubscribeWallet) {
        unsubscribeWallet();
      }
    };
  }, [user]);

  const logout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const deleteAccount = async (password: string) => {
    if (!user || !user.email) {
      throw new Error("No user is logged in.");
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);
      
      const walletRef = doc(db, 'wallets', user.uid);
      await deleteDoc(walletRef);
      await deleteUser(user);

      toast({ title: 'Account Deleted', description: 'Your account has been permanently deleted.' });
    } catch (error: any) {
      console.error("Error deleting account: ", error);
      throw error;
    }
  };
  
  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!user || !user.email) {
      throw new Error("No user is currently signed in.");
    }
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
  };
  
  const setCurrency = async (newCurrency: 'INR' | 'USD') => {
    if (!user) return;
    try {
      const walletRef = doc(db, 'wallets', user.uid);
      await updateDoc(walletRef, { currency: newCurrency });
      toast({ title: 'Success', description: `Currency updated to ${newCurrency}.` });
    } catch (error) {
      console.error("Error updating currency:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to update currency.' });
    }
  };

  const addToWishlist = async (cardId: string) => {
    if (!user) return;
    try {
      const walletRef = doc(db, 'wallets', user.uid);
      await updateDoc(walletRef, {
        wishlist: arrayUnion(cardId)
      });
      toast({ title: 'Added to Wishlist' });
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to add to wishlist.' });
    }
  };

  const removeFromWishlist = async (cardId: string) => {
    if (!user) return;
    try {
      const walletRef = doc(db, 'wallets', user.uid);
      await updateDoc(walletRef, {
        wishlist: arrayRemove(cardId)
      });
      toast({ title: 'Removed from Wishlist' });
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to remove from wishlist.' });
    }
  };

  const updateProfilePicture = async (file: File) => {
    if (!user) {
      throw new Error("No user is logged in.");
    }

    try {
      const fileRef = storageRef(storage, `profile-pictures/${user.uid}`);
      await uploadBytes(fileRef, file);
      const photoURL = await getDownloadURL(fileRef);
      await updateProfile(user, { photoURL });
      setUser({ ...user, photoURL }); // Force re-render with new image
    } catch (error) {
      console.error("Error updating profile picture: ", error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    walletBalance,
    walletCoins,
    currency,
    wishlist,
    login: (auth: Auth, email: string, p: string) => signInWithEmailAndPassword(auth, email, p),
    signup: (auth: Auth, email: string, p: string) => createUserWithEmailAndPassword(auth, email, p),
    logout,
    deleteAccount,
    changePassword,
    setCurrency,
    addToWishlist,
    removeFromWishlist,
    updateProfilePicture,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
