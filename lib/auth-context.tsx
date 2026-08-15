'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore';

interface UserStats {
  campaignsCount: number;
  contentCount: number;
  creativesCount: number;
  seoCount: number;
  creditsUsed: number;
  campaignsCost?: number;
  contentCost?: number;
  creativesCost?: number;
  seoCost?: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  businessProfile: any | null;
  stats: UserStats;
}

const defaultStats: UserStats = {
  campaignsCount: 0,
  contentCount: 0,
  creativesCount: 0,
  seoCount: 0,
  creditsUsed: 0,
};

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, businessProfile: null, stats: defaultStats });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [businessProfile, setBusinessProfile] = useState<any | null>(null);
  const [stats, setStats] = useState<UserStats>(defaultStats);

  useEffect(() => {
    let unsubCampaigns: () => void;
    let unsubContent: () => void;
    let unsubCreatives: () => void;
    let unsubSeo: () => void;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setBusinessProfile(docSnap.data());
          } else {
            setBusinessProfile(null);
          }
          
          // Setup real-time listeners for stats
          const qCampaigns = query(collection(db, 'campaigns'), where('userId', '==', user.uid));
          unsubCampaigns = onSnapshot(qCampaigns, (snap) => {
            const cost = snap.docs.reduce((acc, doc) => acc + (doc.data().creditsCost || 1), 0);
            setStats(prev => ({ ...prev, campaignsCount: snap.size, campaignsCost: cost, creditsUsed: cost + (prev.contentCost||0) + (prev.creativesCost||0) + (prev.seoCost||0) }));
          });

          const qContent = query(collection(db, 'content'), where('userId', '==', user.uid));
          unsubContent = onSnapshot(qContent, (snap) => {
            const cost = snap.docs.reduce((acc, doc) => acc + (doc.data().creditsCost || 1), 0);
            setStats(prev => ({ ...prev, contentCount: snap.size, contentCost: cost, creditsUsed: (prev.campaignsCost||0) + cost + (prev.creativesCost||0) + (prev.seoCost||0) }));
          });

          const qCreatives = query(collection(db, 'creatives'), where('userId', '==', user.uid));
          unsubCreatives = onSnapshot(qCreatives, (snap) => {
            const cost = snap.docs.reduce((acc, doc) => acc + (doc.data().creditsCost || 1), 0);
            setStats(prev => ({ ...prev, creativesCount: snap.size, creativesCost: cost, creditsUsed: (prev.campaignsCost||0) + (prev.contentCost||0) + cost + (prev.seoCost||0) }));
          });

          const qSeo = query(collection(db, 'seo'), where('userId', '==', user.uid));
          unsubSeo = onSnapshot(qSeo, (snap) => {
            const cost = snap.docs.reduce((acc, doc) => acc + (doc.data().creditsCost || 5), 0);
            setStats(prev => ({ ...prev, seoCount: snap.size, seoCost: cost, creditsUsed: (prev.campaignsCost||0) + (prev.contentCost||0) + (prev.creativesCost||0) + cost }));
          });

        } catch (error) {
          console.error("Error fetching user profile", error);
        }
      } else {
        setBusinessProfile(null);
        setStats(defaultStats);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
      if (unsubCampaigns) unsubCampaigns();
      if (unsubContent) unsubContent();
      if (unsubCreatives) unsubCreatives();
      if (unsubSeo) unsubSeo();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, businessProfile, stats }}>
      {children}
    </AuthContext.Provider>
  );
};
