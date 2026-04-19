'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

interface LoginModalProps {
  onClose: () => void;
  onSuccess: (user: any) => void;
}

export default function LoginModal({ onClose, onSuccess }: LoginModalProps) {
  const [mode, setMode] = useState<'email' | 'google'>('email');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const supabase = supabaseUrl && supabaseAnonKey 
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

  const handleGoogleLogin = async () => {
    if (!supabase) {
      setError('Supabase 未正確配置');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Google 登入失敗');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError('請輸入郵箱');
      return;
    }

    if (!supabase) {
      setError('Supabase 未正確配置');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      setMessage('✅ 魔法鏈接已發送到您的郵箱，請檢查並點擊');
      setEmail('');
    } catch (err: any) {
      setError(err.message || '郵件登入失敗');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
        >
          ✕
        </button>

        <h2 className="text-3xl font-bold mb-2 text-gray-800">
          歡迎來到<span className="text-red-600">標</span><span className="text-amber-500">王</span>
        </h2>
        <p className="text-gray-600 mb-6">登入或註冊以開始生成爆款標題</p>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setMode('google')}
            className={`flex-1 py-2 rounded font-semibold transition-colors ${
              mode === 'google'
                ? 'bg-white text-gray-800 shadow'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Google
          </button>
          <button
            onClick={() => setMode('email')}
            className={`flex-1 py-2 rounded font-semibold transition-colors ${
              mode === 'email'
                ? 'bg-white text-gray-800 shadow'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Email
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Success Message */}
        {message && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
            {message}
          </div>
        )}

        {/* Google Login Mode */}
        {mode === 'google' && (
          <div className="space-y-4">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-3 bg-white border-2 border-gray-300 text-gray-800 font-bold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <image href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%234285F4' d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'/%3E%3Cpath fill='%2334A853' d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'/%3E%3Cpath fill='%23FBBC05' d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'/%3E%3Cpath fill='%23EA4335' d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'/%3E%3C/svg%3E" width="20" height="20" />
                {loading ? '登入中...' : '使用 Google 登入'}
              </svg>
            </button>
            <p className="text-center text-gray-600 text-sm">
              首次登入會自動註冊賬戶
            </p>
          </div>
        )}

        {/* Email Login Mode */}
        {mode === 'email' && (
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                電郵地址
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="你的郵箱"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? '發送中...' : '發送魔法鏈接'}
            </button>
            <p className="text-center text-gray-600 text-sm">
              我們會發送無密碼登入鏈接到你的郵箱
            </p>
          </form>
        )}

        {/* Footer */}
        <p className="text-center text-gray-500 text-xs mt-6">
          登入即表示同意<br/>
          <a href="/privacy" className="text-red-600 hover:underline">
            私隱政策
          </a>
          {' '}和{' '}
          <a href="/terms" className="text-red-600 hover:underline">
            服務條款
          </a>
        </p>
      </div>
    </div>
  );
}
