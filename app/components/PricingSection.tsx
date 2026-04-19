'use client';

interface PricingSectionProps {
  onSelectPlan: (plan: 'free' | 'starter' | 'pro') => void;
  currentPlan: 'free' | 'starter' | 'pro';
}

export default function PricingSection({ onSelectPlan, currentPlan }: PricingSectionProps) {
  return (
    <div className="py-4">
      {/* Header */}
      <div className="text-center mb-6">
        <span className="inline-block bg-blue-50 text-blue-600 text-sm px-4 py-1 rounded-full mb-3">
          ✨ 海外創作者專屬
        </span>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          選擇你的創作方案
        </h2>
        <p className="text-gray-600 text-sm">
          標題生成 + 文案潤色，一鍵搞定小紅書爆款筆記
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        
        {/* Free Plan */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col">
          <div className="mb-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Free</p>
            <p className="text-sm font-medium text-gray-800">免費體驗</p>
          </div>
          
          <div className="mb-4">
            <span className="text-3xl font-bold text-gray-800">$0</span>
          </div>
          
          <ul className="space-y-2 mb-6 flex-1">
            <li className="flex items-start gap-2 text-sm text-gray-600">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>每日 <strong className="text-gray-800">1 次</strong> 標題生成</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-600">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>2 種基礎風格</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-400">
              <span className="mt-0.5">✗</span>
              <span>文案潤色</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-400">
              <span className="mt-0.5">✗</span>
              <span>一鍵複製</span>
            </li>
          </ul>
          
          <button
            onClick={() => onSelectPlan('free')}
            className={`w-full py-3 rounded-xl text-sm font-medium transition-colors ${
              currentPlan === 'free'
                ? 'bg-gray-100 text-gray-500 cursor-default'
                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
            disabled={currentPlan === 'free'}
          >
            {currentPlan === 'free' ? '目前方案' : '立即開始（免費）'}
          </button>
        </div>

        {/* Starter Plan - Most Popular */}
        <div className="bg-white border-2 border-red-500 rounded-2xl p-5 flex flex-col relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-500 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap">
            🔥 最多人選擇
          </div>
          
          <div className="mb-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Starter</p>
            <p className="text-sm font-medium text-gray-800">新手加油包</p>
          </div>
          
          <div className="mb-4">
            <span className="text-3xl font-bold text-gray-800">$2.99</span>
            <span className="text-sm text-gray-500"> / 20次</span>
          </div>
          
          <ul className="space-y-2 mb-6 flex-1">
            <li className="flex items-start gap-2 text-sm text-gray-600">
              <span className="text-green-500 mt-0.5">✓</span>
              <span><strong className="text-gray-800">20 次</strong> 生成額度</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-600">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>標題 + 文案潤色</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-600">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>5 種標題風格</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-600">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>一鍵複製（含 Emoji）</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-600">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>永不過期</span>
            </li>
          </ul>
          
          <button
            onClick={() => onSelectPlan('starter')}
            className={`w-full py-3 rounded-xl text-sm font-medium transition-colors ${
              currentPlan === 'starter'
                ? 'bg-gray-100 text-gray-500 cursor-default'
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
            disabled={currentPlan === 'starter'}
          >
            {currentPlan === 'starter' ? '目前方案' : '立即購買'}
          </button>
          <p className="text-xs text-gray-500 text-center mt-2">
            ≈ $0.15 / 次 · 永不過期
          </p>
        </div>

        {/* Pro Plan */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col">
          <div className="mb-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Pro</p>
            <p className="text-sm font-medium text-gray-800">專業創作者</p>
          </div>
          
          <div className="mb-4">
            <span className="text-3xl font-bold text-gray-800">$5.99</span>
            <span className="text-sm text-gray-500"> / 月</span>
          </div>
          
          <ul className="space-y-2 mb-6 flex-1">
            <li className="flex items-start gap-2 text-sm text-gray-600">
              <span className="text-green-500 mt-0.5">✓</span>
              <span><strong className="text-gray-800">無限次</strong> 生成</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-600">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>標題 + 文案潤色</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-600">
              <span className="text-green-500 mt-0.5">✓</span>
              <span><strong className="text-gray-800">全部 10 種</strong> 標題風格</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-600">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>
                5 種語氣風格
                <span className="ml-1 text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded">Pro</span>
              </span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-600">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>
                自定義關鍵字
                <span className="ml-1 text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">商單必備</span>
              </span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-600">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>一鍵複製 + 歷史記錄</span>
            </li>
          </ul>
          
          <button
            onClick={() => onSelectPlan('pro')}
            className={`w-full py-3 rounded-xl text-sm font-medium transition-colors ${
              currentPlan === 'pro'
                ? 'bg-gray-100 text-gray-500 cursor-default'
                : 'border border-red-500 text-red-500 hover:bg-red-50'
            }`}
            disabled={currentPlan === 'pro'}
          >
            {currentPlan === 'pro' ? '目前方案' : '解鎖所有功能'}
          </button>
          <p className="text-xs text-gray-500 text-center mt-2">
            每天不到 $0.20 · 接商單必備
          </p>
        </div>
      </div>

      {/* Keyword Feature Highlight */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-4">
          <div className="text-3xl flex-shrink-0">🎯</div>
          <div>
            <p className="font-medium text-amber-900 mb-1">
              Pro 專屬：自定義關鍵字 — 接商單神器
            </p>
            <p className="text-sm text-amber-800 mb-3">
              接到品牌合作？輸入必須提及的品牌名、地點、優惠碼，AI 會自然融入文案。
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-white border border-amber-300 text-amber-800 text-xs px-2 py-1 rounded-full">@品牌名稱</span>
              <span className="bg-white border border-amber-300 text-amber-800 text-xs px-2 py-1 rounded-full">#活動標籤</span>
              <span className="bg-white border border-amber-300 text-amber-800 text-xs px-2 py-1 rounded-full">📍指定地點</span>
              <span className="bg-white border border-amber-300 text-amber-800 text-xs px-2 py-1 rounded-full">🎁 優惠碼</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="bg-gray-50 rounded-xl p-4">
        <div className="flex flex-wrap justify-center items-center gap-6 mb-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>🔒</span>
            <span>Stripe 安全支付</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>💳</span>
            <span>信用卡 / Apple Pay</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>🌍</span>
            <span>支持海外信用卡</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>📧</span>
            <span>權益綁定 Email</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 text-center">
          支持海外信用卡及留學生常用支付方式，付款後即時開通
        </p>
      </div>
    </div>
  );
}
