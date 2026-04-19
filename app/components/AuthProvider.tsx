'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { createClient, User as SupabaseUser, Session } from '@supabase/supabase-js';

// 用戶資料類型
interface UserData {
  email: string;
  plan: 'free' | 'starter' | 'pro';
  credits: number;
  dailyFreeUsed: boolean;
}

// Context 類型
interface AuthContextType {
  user: UserData | null;
  session: Session | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string) => Promise<{ success: boolean; message: string }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 獲取用戶資料
  const fetchUserData = async (email: string): Promise<UserData | null> => {
    try {
      const response = await fetch(`/api/user?email=${encodeURIComponent(email)}`);
      if (!response.ok) return null;
      
      const data = await response.json();
      return {
        email: data.email,
        plan: data.plan,
        credits: data.credits,
        dailyFreeUsed: data.daily_free_used,
      };
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  // 刷新用戶資料
  const refreshUser = async () => {
    if (session?.user?.email) {
      const userData = await fetchUserData(session.user.email);
      setUser(userData);
    }
  };

  // 初始化 session
  useEffect(() => {
    // 獲取當前 session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user?.email) {
        fetchUserData(session.user.email).then(setUser);
      }
      setIsLoading(false);
    });

    // 監聽 auth 變化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session?.user?.email) {
          const userData = await fetchUserData(session.user.email);
          setUser(userData);
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Google 登入
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    if (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  };

  // Magic Link 登入
  const signInWithEmail = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    if (error) {
      console.error('Magic link error:', error);
      return { success: false, message: error.message };
    }

    return { success: true, message: '登入連結已發送到你的信箱' };
  };

  // 登出
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error);
      throw error;
    }
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        signInWithGoogle,
        signInWithEmail,
        signOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
