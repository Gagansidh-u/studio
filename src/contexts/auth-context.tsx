
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, Auth } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { doc, onSnapshot, getDoc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  walletBalance: number | null;
  walletCoins: number | null;
  login: typeof signInWithEmailAndPassword;
  signup: typeof createUserWithEmailAndPassword;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  walletBalance: null,
  walletCoins: null,
  login: async () => { throw new Error('login not implemented'); },
  signup: async () => { throw new Error('signup not implemented'); },
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [walletCoins, setWalletCoins] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Check for wallet and create if it doesn't exist. This handles existing users.
        const walletRef = doc(db, 'wallets', user.uid);
        const walletSnap = await getDoc(walletRef);
        if (!walletSnap.exists()) {
          await setDoc(walletRef, {
            balance: 0,
            coins: 0,
            userId: user.uid,
            email: user.email,
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
          setWalletBalance(doc.data().balance);
          setWalletCoins(doc.data().coins ?? 0);
        } else {
          setWalletBalance(0);
          setWalletCoins(0);
        }
      });
    } else {
      setWalletBalance(null);
      setWalletCoins(null);
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

  const value: AuthContextType = {
    user,
    loading,
    walletBalance,
    walletCoins,
    login: (auth: Auth, email: string, p: string) => signInWithEmailAndPassword(auth, email, p),
    signup: (auth: Auth, email: string, p: string) => createUserWithEmailAndPassword(auth, email, p),
    logout,
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
