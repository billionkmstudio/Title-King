'use client';

import { useState } from 'react';

interface NameInputModalProps {
  email: string;
  onSubmit: (name: string) => void;
  onSkip: () => void;
}

export default function NameInputModal({ email, onSubmit, onSkip }: NameInputModalProps) {
  // 從 email 提取預設名字
  const defaultName = email.split('@')[0].replace(/[._]/g, ' ');
  const [name, setName] = useState(defaultName);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      onSkip();
      return;
    }

    setIsSubmitting(true);
    onSubmit(name.trim());
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">👋</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            歡迎加入！
          </h2>
          <p className="text-gray-600 text-sm">
            我們想知道怎麼稱呼你
          </p>
        </div>

        {/* Name Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            你的名字 / 暱稱
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="輸入你的名字"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300 text-lg"
            autoFocus
          />
          <p className="text-xs text-gray-500 mt-2">
            我們會用這個名字在頁面上跟你打招呼 ✨
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onSkip}
            className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            稍後再說
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors disabled:bg-gray-300"
          >
            {isSubmitting ? '保存中...' : '確定'}
          </button>
        </div>

        {/* Bonus Info */}
        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <p className="text-sm text-green-600 font-medium">
            🎁 註冊獎勵：20 點已到帳！
          </p>
          <p className="text-xs text-gray-500 mt-1">
            可免費生成 2 次爆款標題
          </p>
        </div>
      </div>
    </div>
  );
}
