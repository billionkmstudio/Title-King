import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 relative">
                <Image
                  src="/logo-icon.png"
                  alt="標王 Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold">
                  <span className="text-red-500">標</span>
                  <span className="text-amber-400">王</span>
                </h3>
                <p className="text-xs text-gray-400">TitleKing</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              AI 驅動的小紅書爆款標題生成器<br />
              讓每個標題都成為流量入口
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4 text-amber-400">快速連結</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                  開始生成
                </Link>
              </li>
              <li>
                <Link href="/buy" className="text-gray-400 hover:text-white transition-colors">
                  購買點數
                </Link>
              </li>
              <li>
                <Link href="/history" className="text-gray-400 hover:text-white transition-colors">
                  歷史記錄
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold mb-4 text-amber-400">法律資訊</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  私隱政策
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                  使用條款
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-400 text-center md:text-left">
            © {currentYear} 標王 TitleKing. All rights reserved.
          </div>
          
          <div className="text-sm text-gray-400 text-center md:text-right">
            Powered by{' '}
            <a 
              href="https://billionstudio.co.uk" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 transition-colors font-medium"
            >
              Billion Studio
            </a>
          </div>
        </div>

        {/* Extra Info */}
        <div className="mt-6 text-center text-xs text-gray-500">
          基於 AI 技術的內容生成工具 · 幫助創作者提升內容影響力
        </div>
      </div>
    </footer>
  );
}
