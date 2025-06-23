
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, Auth } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { doc, onSnapshot } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  walletBalance: number | null;
  login: typeof signInWithEmailAndPassword;
  signup: typeof createUserWithEmailAndPassword;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  walletBalance: null,
  login: async () => { throw new Error('login not implemented'); },
  signup: async () => { throw new Error('signup not implemented'); },
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
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
        } else {
          setWalletBalance(0);
        }
      });
    } else {
      setWalletBalance(null);
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
