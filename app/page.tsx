'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/Header';
import LoginModal from '@/app/components/LoginModal';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export default function Home() {
  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkUser = async () => {
      if (!supabaseUrl || !supabaseAnonKey) {
        console.error('Missing Supabase credentials');
        setLoading(false);
        return;
      }

      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
        }
      } catch (error) {
        console.error('Error checking user:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const handleStartClick = () => {
    if (user) {
      router.push('/dashboard');
    } else {
      setShowLoginModal(true);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 via-white to-amber-50">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 md:px-0">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-6 bg-red-100 text-red-700 px-4 py-2 rounded-full">
            <span className="text-lg">👑</span>
            <span className="font-semibold">標王 TitleKing - AI 爆款標題生成器</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-600 via-red-500 to-amber-500 bg-clip-text text-transparent">
            標王標題王
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
            AI 生成小紅書爆款標題 + 文案潤色<br/>
            <span className="text-red-500 font-semibold">一鍵生成 10 個風格標題</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={handleStartClick}
              disabled={loading}
              className="px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white text-lg font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50"
            >
              {loading ? '載入中...' : '立即開始'}
            </button>
            <button
              onClick={() => router.push('#features')}
              className="px-8 py-4 bg-white text-red-600 border-2 border-red-500 text-lg font-bold rounded-xl hover:bg-red-50 transition-all"
            >
              瞭解更多
            </button>
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">10 種風格</h3>
              <p className="text-gray-600">溫暖、搞笑、專業、激勵等風格任選</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">秒速生成</h3>
              <p className="text-gray-600">AI 毫秒級生成標題，文案潤色一站式</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">經濟實惠</h3>
              <p className="text-gray-600">註冊送 20 點，10 點生成一次標題</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section id="features" className="py-16 px-4 md:px-0 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            為什麼選擇標王？
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="text-3xl flex-shrink-0">👑</div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">專為小紅書優化</h3>
                <p className="text-gray-600">基於小紅書熱門內容分析，生成更容易爆火的標題</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl flex-shrink-0">🎨</div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">多風格選擇</h3>
                <p className="text-gray-600">溫暖治癒、搞笑活力、專業正式等 10 種風格</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl flex-shrink-0">🔄</div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">文案潤色</h3>
                <p className="text-gray-600">不止生成標題，還能潤色您的原文案</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl flex-shrink-0">💡</div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">易用簡潔</h3>
                <p className="text-gray-600">無需複雜設定，一鍵生成，直接複製使用</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 px-4 md:px-0 bg-gradient-to-b from-amber-50 to-red-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            簡單透明的點數制
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">🎁 新手禮包</h3>
              <p className="text-3xl font-bold text-red-600 mb-4">20 點</p>
              <p className="text-gray-600 mb-6">註冊即送，足以生成 2 次</p>
              <button
                onClick={handleStartClick}
                disabled={loading}
                className="w-full py-2 bg-gray-200 text-gray-800 font-bold rounded-lg cursor-not-allowed"
              >
                已包含
              </button>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-red-500 transform scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                熱銷
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">🌟 基礎包</h3>
              <p className="text-3xl font-bold text-red-600 mb-1">$2.99</p>
              <p className="text-gray-600 mb-6">200 點 = 20 次生成</p>
              <button
                onClick={handleStartClick}
                disabled={loading}
                className="w-full py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-colors"
              >
                購買
              </button>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-amber-500">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">💎 超值包</h3>
              <p className="text-3xl font-bold text-amber-600 mb-1">$5.99</p>
              <p className="text-gray-600 mb-6">800 點 = 80 次生成</p>
              <button
                onClick={handleStartClick}
                disabled={loading}
                className="w-full py-2 bg-amber-500 text-white font-bold rounded-lg hover:bg-amber-600 transition-colors"
              >
                購買
              </button>
            </div>
          </div>
          <p className="text-center text-gray-600 mt-8">
            💝 點數永不過期，隨時隨地使用
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 md:px-0 text-center">
        <h2 className="text-4xl font-bold mb-6 text-gray-800">
          準備好成為標題王了嗎？
        </h2>
        <button
          onClick={handleStartClick}
          disabled={loading}
          className="px-12 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white text-xl font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50"
        >
          {loading ? '載入中...' : '免費開始 (送 20 點)'}
        </button>
      </section>

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal 
          onClose={() => setShowLoginModal(false)}
          onSuccess={(user) => {
            setUser(user);
            setShowLoginModal(false);
            router.push('/dashboard');
          }}
        />
      )}
    </main>
  );
}
