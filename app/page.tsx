'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/Header';
import ResultCard from '@/app/components/ResultCard';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

interface Generation {
  titles: string[];
  polished_content?: string;
  style: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [credits, setCredits] = useState(0);
  const [content, setContent] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('warm');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Generation | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [error, setError] = useState('');

  const styles = [
    { id: 'warm', name: '溫暖治癒 ☀️' },
    { id: 'funny', name: '搞笑活力 😂' },
    { id: 'professional', name: '專業正式 💼' },
    { id: 'motivational', name: '激勵鼓舞 💪' },
    { id: 'mysterious', name: '神秘好奇 🔮' },
    { id: 'trendy', name: '潮流時髦 🔥' },
    { id: 'casual', name: '隨性輕鬆 😎' },
    { id: 'emotional', name: '感傷深情 💔' },
    { id: 'educational', name: '教育知識 📚' },
    { id: 'luxurious', name: '奢華高級 👑' },
  ];

  // 初始化用戶和檢查認證
  useEffect(() => {
    const checkAuth = async () => {
      if (!supabaseUrl || !supabaseAnonKey) {
        router.push('/');
        return;
      }

      const supabase = createClient(supabaseUrl, supabaseAnonKey);

      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.user) {
          router.push('/');
          return;
        }

        setUser(session.user);
        setUserEmail(session.user.email || '');

        // 獲取用戶信息和點數
        const { data, error } = await supabase
          .from('users')
          .select('credits')
          .eq('id', session.user.id)
          .single();

        if (error) throw error;
        if (data) setCredits(data.credits);
      } catch (error) {
        console.error('Auth error:', error);
        router.push('/');
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // 生成標題的函數
  const handleGenerate = async () => {
    if (!content.trim()) {
      setError('請輸入內容');
      return;
    }

    if (credits < 10) {
      setError('點數不足，請購買更多點數');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          style: selectedStyle,
          userId: user?.id,
        }),
      });

      if (!response.ok) {
        throw new Error('生成失敗');
      }

      const data = await response.json();

      // 更新本地點數
      setCredits(data.remainingCredits || credits - 10);

      // 設置結果
      setResults({
        titles: data.titles,
        polished_content: data.polishedContent,
        style: selectedStyle,
      });

      setShowResults(true);
      setContent('');
    } catch (err: any) {
      setError(err.message || '生成失敗，請重試');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-red-50 via-white to-amber-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">載入中...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 via-white to-amber-50">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-2 text-gray-800">
          歡迎回來，<span className="text-red-600">{userEmail?.split('@')[0]}</span>！
        </h1>
        <p className="text-gray-600 mb-8">開始生成您的小紅書爆款標題吧</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左邊：輸入表單 */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                🎯 生成爆款標題
              </h2>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              {/* Content Input */}
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-3">
                  📝 輸入您的內容
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="例如：我今天在咖啡館看到一隻超可愛的貓咪..."
                  className="w-full h-32 p-4 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none resize-none"
                  disabled={loading}
                />
                <p className="text-gray-500 text-sm mt-2">
                  {content.length}/500 字符
                </p>
              </div>

              {/* Style Selector */}
              <div className="mb-8">
                <label className="block text-gray-700 font-semibold mb-3">
                  🎨 選擇標題風格（10 種）
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {styles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style.id)}
                      disabled={loading}
                      className={`p-3 rounded-lg font-medium transition-all ${
                        selectedStyle === style.id
                          ? 'bg-red-500 text-white shadow-lg scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } disabled:opacity-50`}
                    >
                      {style.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={loading || !content.trim()}
                className="w-full py-4 bg-gradient-to-r from-red-500 to-red-600 text-white text-xl font-bold rounded-lg hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '✨ 生成中...' : '✨ 生成 10 個標題 (消耗 10 點)'}
              </button>
            </div>
          </div>

          {/* 右邊：點數卡片 */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-amber-100 to-red-100 p-8 rounded-xl shadow-lg sticky top-24">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">⭐ 我的點數</h3>
              <div className="text-5xl font-bold text-amber-600 mb-6">
                {credits}
              </div>
              <p className="text-gray-600 mb-6">
                • 每次生成消耗 10 點<br/>
                • 剩餘可生成 <span className="font-bold text-red-600">{Math.floor(credits / 10)}</span> 次
              </p>

              <button
                onClick={() => router.push('/buy')}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-red-500 text-white font-bold rounded-lg hover:shadow-lg transition-all mb-4"
              >
                💰 購買更多點數
              </button>

              <div className="bg-white/50 p-4 rounded-lg">
                <p className="text-sm text-gray-700 font-semibold mb-2">
                  💡 如何獲得點數？
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>✅ 註冊送 20 點</li>
                  <li>💳 購買基礎包 (200 點)</li>
                  <li>💎 購買超值包 (800 點)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {showResults && results && (
          <div className="mt-12">
            <h2 className="text-3xl font-bold mb-8 text-gray-800">
              ✨ 生成結果
            </h2>
            <ResultCard generation={results} />
          </div>
        )}
      </div>
    </main>
  );
}
