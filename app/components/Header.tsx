'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabaseInstance = null;

function getSupabase() {
  if (!supabaseInstance && supabaseUrl && supabaseAnonKey) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseInstance;
}

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const setupUser = async () => {
      const supabase = getSupabase();
      if (!supabase) return;

      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
          
          // 獲取用戶點數
          const { data, error } = await supabase
            .from('users')
            .select('credits')
            .eq('id', session.user.id)
            .single();

          if (error) throw error;
          if (data) setCredits(data.credits);
        }
      } catch (error) {
        console.error('Error setting up user:', error);
      } finally {
        setLoading(false);
      }
    };

    setupUser();

    // 監聽認證狀態變更
    const supabase = getSupabase();
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (session?.user) {
            setUser(session.user);
            
            // 獲取用戶點數
            const { data } = await supabase
              .from('users')
              .select('credits')
              .eq('id', session.user.id)
              .single();

            if (data) setCredits(data.credits);
          } else {
            setUser(null);
            setCredits(0);
          }
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  const handleLogout = async () => {
    const supabase = getSupabase();
    if (!supabase) return;

    try {
      await supabase.auth.signOut();
      setUser(null);
      setCredits(0);
      setMenuOpen(false);
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 relative">
            <Image
              src="/logo-icon.png"
              alt="標王 Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-2xl font-bold">
              <span className="text-red-600">標</span>
              <span className="text-amber-500">王</span>
            </h1>
            <p className="text-xs text-gray-600 -mt-1">TitleKing</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {user && (
            <>
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-red-600 font-medium transition-colors"
              >
                生成器
              </Link>
              <Link
                href="/history"
                className="text-gray-700 hover:text-red-600 font-medium transition-colors"
              >
                歷史記錄
              </Link>
              <Link
                href="/buy"
                className="text-gray-700 hover:text-red-600 font-medium transition-colors"
              >
                購買點數
              </Link>
            </>
          )}
          <Link
            href="/privacy"
            className="text-gray-700 hover:text-red-600 font-medium transition-colors"
          >
            私隱政策
          </Link>
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {/* Credits Display */}
              <div className="hidden sm:flex items-center gap-2 bg-amber-100 px-4 py-2 rounded-lg">
                <span className="text-lg">⭐</span>
                <span className="font-bold text-amber-700">{credits} 點</span>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Desktop Logout */}
              <button
                onClick={handleLogout}
                className="hidden md:block px-6 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-colors"
              >
                登出
              </button>
            </>
          ) : (
            <>
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Desktop Login */}
              <Link
                href="/login"
                className="hidden md:block px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-lg hover:shadow-lg transition-all"
              >
                登入/註冊
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <div className="px-4 py-4 flex flex-col gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-2 bg-amber-100 px-4 py-2 rounded-lg mb-2">
                  <span className="text-lg">⭐</span>
                  <span className="font-bold text-amber-700">{credits} 點</span>
                </div>
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-red-600 font-medium py-2"
                  onClick={() => setMenuOpen(false)}
                >
                  生成器
                </Link>
                <Link
                  href="/history"
                  className="text-gray-700 hover:text-red-600 font-medium py-2"
                  onClick={() => setMenuOpen(false)}
                >
                  歷史記錄
                </Link>
                <Link
                  href="/buy"
                  className="text-gray-700 hover:text-red-600 font-medium py-2"
                  onClick={() => setMenuOpen(false)}
                >
                  購買點數
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-colors text-left"
                >
                  登出
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="w-full px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-lg hover:shadow-lg transition-all text-center"
                  onClick={() => setMenuOpen(false)}
                >
                  登入/註冊
                </Link>
              </>
            )}
            <Link
              href="/privacy"
              className="text-gray-700 hover:text-red-600 font-medium py-2"
              onClick={() => setMenuOpen(false)}
            >
              私隱政策
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
