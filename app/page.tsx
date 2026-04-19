'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let supabaseInstance: ReturnType<typeof createClient> | null = null;

function getSupabase() {
  if (!supabaseInstance && supabaseUrl && supabaseAnonKey) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseInstance;
}

interface Generation {
  id: string;
  input_content: string;
  style: string;
  titles: string[];
  polished_content: string | null;
  credits_used: number;
  created_at: string;
}

const STYLE_NAMES: Record<string, { name: string; emoji: string }> = {
  shock: { name: '震驚懸念', emoji: '🔥' },
  recommend: { name: '種草安利', emoji: '✨' },
  list: { name: '數字清單', emoji: '📊' },
  save: { name: '省錢攻略', emoji: '💰' },
  review: { name: '測評推薦', emoji: '👥' },
  story: { name: '親身經歷', emoji: '💭' },
  knowledge: { name: '乾貨知識', emoji: '📚' },
  contrast: { name: '反差對比', emoji: '🎭' },
  question: { name: '互動提問', emoji: '💬' },
  warning: { name: '避坑警告', emoji: '⚠️' },
};

export default function HistoryPage() {
  const router = useRouter();
  const [user, setUser] = useState<{
    email: string;
    firstName: string | null;
    credits: number;
  } | null>(null);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

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
      const response = await fetch(`/api/user/generations?email=${encodeURIComponent(email)}`);
      if (response.ok) {
        const data = await response.json();
        setUser({
          email: data.email,
          firstName: data.first_name,
          credits: data.credits,
        });
        setGenerations(data.generations || []);
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

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
        user={user}
        onLogin={() => router.push('/')}
        onLogout={handleLogout}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">📋 歷史記錄</h1>
            <p className="text-gray-600 text-sm mt-1">
              共 {generations.length} 筆生成記錄
            </p>
          </div>
        </div>

        {generations.length > 0 ? (
          <div className="space-y-4">
            {generations.map((gen) => (
              <div
                key={gen.id}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden"
              >
                {/* Header */}
                <div
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpandedId(expandedId === gen.id ? null : gen.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span>{STYLE_NAMES[gen.style]?.emoji || '📝'}</span>
                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                          {STYLE_NAMES[gen.style]?.name || gen.style}
                        </span>
                        <span className="text-xs text-gray-400">
                          · {gen.titles?.length || 0} 個標題
                        </span>
                      </div>
                      <p className="text-gray-800 line-clamp-2">{gen.input_content}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400">{formatDate(gen.created_at)}</span>
                      <svg
                        className={`w-5 h-5 text-gray-400 transition-transform ${
                          expandedId === gen.id ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedId === gen.id && (
                  <div className="px-4 pb-4 border-t border-gray-100">
                    <div className="pt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">生成的標題：</h4>
                      <div className="space-y-2">
                        {gen.titles?.map((title, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-amber-50 rounded-lg group"
                          >
                            <div className="flex items-center gap-2 flex-1">
                              <span className="w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs">
                                {index + 1}
                              </span>
                              <span className="text-gray-800 text-sm">{title}</span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopy(title);
                              }}
                              className={`px-2 py-1 text-xs rounded transition-all ${
                                copiedText === title
                                  ? 'bg-green-100 text-green-600'
                                  : 'bg-white text-gray-500 hover:bg-gray-100 opacity-0 group-hover:opacity-100'
                              }`}
                            >
                              {copiedText === title ? '✓' : '複製'}
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Copy All */}
                      <button
                        onClick={() => handleCopy(gen.titles?.join('\n') || '')}
                        className="mt-3 w-full py-2 border border-dashed border-gray-200 rounded-lg text-sm text-gray-500 hover:border-red-300 hover:text-red-500 transition-colors"
                      >
                        📋 複製全部標題
                      </button>

                      {/* Polished Content */}
                      {gen.polished_content && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-medium text-gray-700">✨ 潤色文案</h4>
                            <button
                              onClick={() => handleCopy(gen.polished_content || '')}
                              className={`px-2 py-1 text-xs rounded transition-all ${
                                copiedText === gen.polished_content
                                  ? 'bg-green-100 text-green-600'
                                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                              }`}
                            >
                              {copiedText === gen.polished_content ? '✓ 已複製' : '複製'}
                            </button>
                          </div>
                          <pre className="text-sm text-gray-600 whitespace-pre-wrap bg-purple-50 p-3 rounded-lg">
                            {gen.polished_content}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <p className="text-5xl mb-4">📭</p>
            <h3 className="text-lg font-medium text-gray-800 mb-2">還沒有生成記錄</h3>
            <p className="text-gray-500 mb-4">開始製作你的第一個爆款標題吧！</p>
            <a
              href="/"
              className="inline-block px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              立即開始 →
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
