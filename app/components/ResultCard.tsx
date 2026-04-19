'use client';

import { useState } from 'react';

interface ResultCardProps {
  generation: {
    titles: string[];
    polished_content?: string;
    style: string;
  };
}

export default function ResultCard({ generation }: ResultCardProps) {
  const [copiedIndex, setCopiedIndex] = useState(-1);
  const [copiedPolished, setCopiedPolished] = useState(false);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(-1), 2000);
    });
  };

  const copyPolished = () => {
    if (generation.polished_content) {
      navigator.clipboard.writeText(generation.polished_content).then(() => {
        setCopiedPolished(true);
        setTimeout(() => setCopiedPolished(false), 2000);
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Generated Titles */}
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h3 className="text-2xl font-bold mb-6 text-gray-800">
          📝 生成的 10 個標題
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {generation.titles.map((title, index) => (
            <div
              key={index}
              className="p-4 bg-gradient-to-r from-red-50 to-amber-50 border-2 border-red-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 flex items-center justify-center bg-red-500 text-white rounded-full text-sm font-bold">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <p className="text-gray-800 font-semibold mb-3 text-lg leading-relaxed">
                    {title}
                  </p>
                  <button
                    onClick={() => copyToClipboard(title, index)}
                    className={`w-full py-2 rounded-lg font-semibold transition-all text-sm ${
                      copiedIndex === index
                        ? 'bg-green-500 text-white'
                        : 'bg-white border-2 border-red-500 text-red-500 hover:bg-red-50'
                    }`}
                  >
                    {copiedIndex === index ? '✓ 已複製' : '複製'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-gray-600 text-sm mt-6 bg-blue-50 p-4 rounded-lg">
          💡 提示：試試看不同的標題，看哪個最符合你的內容。可以混合使用不同風格。
        </p>
      </div>

      {/* Polished Content */}
      {generation.polished_content && (
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h3 className="text-2xl font-bold mb-6 text-gray-800">
            ✨ 潤色後的文案
          </h3>

          <div className="bg-gradient-to-b from-amber-50 to-red-50 p-6 rounded-lg mb-4 border-2 border-amber-200">
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap text-lg">
              {generation.polished_content}
            </p>
          </div>

          <button
            onClick={copyPolished}
            className={`w-full py-3 font-bold rounded-lg transition-all ${
              copiedPolished
                ? 'bg-green-500 text-white'
                : 'bg-gradient-to-r from-amber-500 to-red-500 text-white hover:shadow-lg'
            }`}
          >
            {copiedPolished ? '✓ 已複製' : '複製潤色文案'}
          </button>

          <p className="text-gray-600 text-sm mt-4 bg-blue-50 p-4 rounded-lg">
            💝 這個版本已經過 AI 優化，保留了原意但更吸引人。你也可以再根據需要調整。
          </p>
        </div>
      )}

      {/* Next Steps */}
      <div className="bg-gradient-to-r from-red-100 to-amber-100 p-8 rounded-xl border-2 border-red-300">
        <h3 className="text-xl font-bold mb-4 text-gray-800">
          🚀 下一步
        </h3>
        <ol className="space-y-2 text-gray-800 list-decimal list-inside">
          <li>複製你最喜歡的標題</li>
          <li>粘貼到小紅書的標題欄</li>
          <li>搭配你的潤色文案和配圖</li>
          <li>發佈並等待爆火！👑</li>
        </ol>
      </div>
    </div>
  );
}
