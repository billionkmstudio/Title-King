'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  const [isUpdating, setIsUpdating] = useState(true);
  const [updateError, setUpdateError] = useState('');
  const [creditsAdded, setCreditsAdded] = useState(0);

  const planId = searchParams.get('plan');
  const sessionId = searchParams.get('session_id');

  // 更新用戶點數
  useEffect(() => {
    const updateUserCredits = async () => {
      if (!sessionId || !planId) {
        setIsUpdating(false);
        return;
      }

      try {
        const response = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, planId }),
        });

        const data = await response.json();

        if (!response.ok) {
          setUpdateError(data.error || '更新失敗');
        } else {
          setCreditsAdded(data.creditsAdded || 0);
        }
      } catch (error) {
        console.error('Error updating credits:', error);
        setUpdateError('更新失敗，請聯繫客服');
      } finally {
        setIsUpdating(false);
      }
    };

    updateUserCredits();
  }, [sessionId, planId]);

  // 倒數計時
  useEffect(() => {
    if (isUpdating) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/dashboard');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router, isUpdating]);

  const planName = planId === 'pro' ? '超值包（800 點）' : '基礎包（200 點）';

  if (isUpdating) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">正在確認付款...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8 text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          付款成功！ 🎉
        </h1>
        
        <p className="text-gray-600 mb-6">
          你已成功購買 <span className="font-semibold">{planName}</span>
        </p>

        {updateError && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm">
            {updateError}
          </div>
        )}

        {/* Credits Added */}
        {creditsAdded > 0 && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 mb-6">
            <p className="text-amber-800 text-sm mb-1">已到帳點數</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-4xl">🎫</span>
              <span className="text-4xl font-bold text-amber-900">+{creditsAdded}</span>
            </div>
          </div>
        )}

        {/* CTA */}
        <Link
          href="/dashboard"
          className="inline-block w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors"
        >
          前往儀表板 →
        </Link>

        <Link
          href="/"
          className="inline-block w-full py-3 mt-3 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl font-medium transition-colors"
        >
          開始生成標題
        </Link>

        {/* Countdown */}
        <p className="text-sm text-gray-400 mt-4">
          {countdown} 秒後自動跳轉...
        </p>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">載入中...</p>
        </div>
      </main>
    }>
      <SuccessContent />
    </Suspense>
  );
}
