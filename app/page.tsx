'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Link from 'next/link';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let supabaseInstance: ReturnType<typeof createClient> | null = null;

function getSupabase() {
  if (!supabaseInstance && supabaseUrl && supabaseAnonKey) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseInstance;
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  balance_after: number;
  description: string;
  created_at: string;
}

const PRICING_PLANS = [
  {
    id: 'basic',
    name: '基礎包',
    price: 2.99,
    currency: '$',
    credits: 200,
    generations: 20,
    popular: false,
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 'pro',
    name: '超值包',
    price: 5.99,
    currency: '$',
    credits: 800,
    generations: 80,
    popular: true,
    color: 'from-purple-500 to-pink-500',
    savings: '省 50%',
  },
];

export default function BuyPage() {
  const router = useRouter();
  const [user, setUser] = useState<{
    id: string;
    email: string;
    firstName: string | null;
    credits: number;
  } | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) {
        fetchData(session.user.email);
      } else {
        router.push('/');
      }
    });
  }, [router]);

  const fetchData = async (email: string) => {
    try {
      const response = await fetch(`/api/user/transactions?email=${encodeURIComponent(email)}`);
      if (response.ok) {
        const data = await response.json();
        setUser({
          id: data.id,
          email: data.email,
          firstName: data.first_name,
          credits: data.credits,
        });
        setTransactions(data.transactions || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.auth.signOut();
      router.push('/');
    }
  };

  const handlePurchase = async (planId: string) => {
    if (!user) return;
    
    setIsPurchasing(planId);
    
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          email: user.email,
          userId: user.id,
        }),
      });

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('建立付款失敗，請稍後再試');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('建立付款失敗，請稍後再試');
    } finally {
      setIsPurchasing(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'signup_bonus': return '🎁';
      case 'purchase': return '💳';
      case 'usage': return '✨';
      case 'refund': return '↩️';
      case 'manual': return '🔧';
      default: return '📝';
    }
  };

  const getTransactionLabel = (type: string) => {
    switch (type) {
      case 'signup_bonus': return '註冊獎勵';
      case 'purchase': return '購買點數';
      case 'usage': return '生成消耗';
      case 'refund': return '退款';
      case 'manual': return '人工調整';
      default: return type;
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <Header
        user={user ? {
          email: user.email,
          firstName: user.firstName,
          credits: user.credits,
        } : null}
        onLogin={() => router.push('/')}
        onLogout={handleLogout}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Current Credits */}
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-800 text-sm mb-1">目前點數餘額</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-amber-900">{user?.credits || 0}</span>
                <span className="text-amber-700">點</span>
              </div>
              <p className="text-amber-700 text-sm mt-1">
                可生成約 {Math.floor((user?.credits || 0) / 10)} 次標題
              </p>
            </div>
            <div className="text-6xl">👑</div>
          </div>
        </div>

        {/* Pricing Cards */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">購買點數</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl border-2 p-6 flex flex-col ${
                plan.popular ? 'border-purple-300' : 'border-gray-100'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                    🔥 最受歡迎
                  </span>
                </div>
              )}

              {/* Header - Fixed Height */}
              <div className="text-center mb-4 h-24 flex flex-col justify-center">
                <h3 className="text-lg font-bold text-gray-800">{plan.name}</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-gray-900">{plan.currency}{plan.price}</span>
                  <span className="text-gray-500 ml-1">USD</span>
                </div>
                {plan.savings ? (
                  <span className="inline-block mt-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                    {plan.savings}
                  </span>
                ) : (
                  <span className="inline-block mt-2 text-xs text-transparent px-2 py-0.5">
                    placeholder
                  </span>
                )}
              </div>

              {/* Features - Fixed Height */}
              <div className="space-y-3 mb-6 flex-1">
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="text-green-500">✓</span>
                  <span><strong>{plan.credits}</strong> 點數</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="text-green-500">✓</span>
                  <span>可生成 <strong>{plan.generations}</strong> 次標題</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="text-green-500">✓</span>
                  <span>AI 文案潤色</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="text-green-500">✓</span>
                  <span>全部 10 種風格</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="text-green-500">✓</span>
                  <span>永不過期</span>
                </div>
              </div>

              {/* Button */}
              <button
                onClick={() => handlePurchase(plan.id)}
                disabled={isPurchasing !== null}
                className={`w-full py-3 rounded-xl font-medium text-white transition-all ${
                  isPurchasing === plan.id
                    ? 'bg-gray-400 cursor-not-allowed'
                    : `bg-gradient-to-r ${plan.color} hover:opacity-90`
                }`}
              >
                {isPurchasing === plan.id ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    處理中...
                  </span>
                ) : (
                  `購買 ${plan.credits} 點`
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-800">點數記錄</h2>
          </div>

          {transactions.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{getTransactionIcon(tx.type)}</span>
                    <div>
                      <p className="text-gray-800 font-medium">{tx.description || getTransactionLabel(tx.type)}</p>
                      <p className="text-xs text-gray-500">{formatDate(tx.created_at)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${tx.amount > 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount}
                    </p>
                    <p className="text-xs text-gray-400">餘額 {tx.balance_after}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <p>還沒有交易記錄</p>
            </div>
          )}
        </div>

        {/* FAQ */}
        <div className="mt-8 space-y-4">
          <h2 className="font-bold text-gray-800">常見問題</h2>
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="font-medium text-gray-800 mb-1">點數會過期嗎？</h3>
            <p className="text-sm text-gray-600">不會！購買的點數永不過期，可以慢慢使用。</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="font-medium text-gray-800 mb-1">可以退款嗎？</h3>
            <p className="text-sm text-gray-600">已購買的點數暫不支援退款，請確認後再購買。</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="font-medium text-gray-800 mb-1">支援什麼付款方式？</h3>
            <p className="text-sm text-gray-600">支援 Visa、Mastercard、Apple Pay、Google Pay 等主流付款方式。</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 mt-16 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>© 2026 Billion Studio. All rights reserved.</p>
          <div className="mt-2 flex items-center justify-center gap-4">
            <a href="https://billionstudio.co.uk" className="hover:text-gray-700">billionstudio.co.uk</a>
            <span>·</span>
            <Link href="/privacy" className="hover:text-gray-700">私隱政策</Link>
            <span>·</span>
            <Link href="/terms" className="hover:text-gray-700">使用條款</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
