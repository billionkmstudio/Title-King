import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Header */}
      <header className="border-b border-amber-100 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">👑</span>
            <span className="font-bold text-gray-800">標王</span>
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">私隱政策 / Privacy Policy</h1>
        
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-6">
            最後更新：2026 年 4 月
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">1. 我們收集的資料</h2>
            <p className="text-gray-600 mb-3">
              當你使用標王時，我們可能收集以下資料：
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>電子郵件地址（用於帳戶登入）</li>
              <li>姓名或暱稱（用於個人化體驗）</li>
              <li>你輸入的內容主題（用於生成標題）</li>
              <li>使用記錄和生成歷史</li>
              <li>付款資訊（由 Stripe 安全處理）</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">2. 我們如何使用你的資料</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>提供和改善我們的服務</li>
              <li>處理付款和點數管理</li>
              <li>發送服務相關通知</li>
              <li>提供客戶支援</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">3. 資料安全</h2>
            <p className="text-gray-600">
              我們使用業界標準的安全措施保護你的資料，包括 SSL 加密、安全的資料庫存儲，以及與 Stripe 等受信任的第三方合作處理付款。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">4. 第三方服務</h2>
            <p className="text-gray-600 mb-3">
              我們使用以下第三方服務：
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Supabase - 用戶認證和資料存儲</li>
              <li>Stripe - 付款處理</li>
              <li>Anthropic (Claude AI) - AI 內容生成</li>
              <li>Google Analytics - 網站分析</li>
              <li>Vercel - 網站托管</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">5. 你的權利</h2>
            <p className="text-gray-600 mb-3">
              你有權：
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>訪問你的個人資料</li>
              <li>更正不準確的資料</li>
              <li>要求刪除你的帳戶和資料</li>
              <li>反對某些資料處理</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">6. Cookie</h2>
            <p className="text-gray-600">
              我們使用必要的 Cookie 來維持你的登入狀態和網站功能。我們也使用 Google Analytics 來了解網站使用情況。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">7. 聯繫我們</h2>
            <p className="text-gray-600">
              如有任何關於私隱的問題，請聯繫：<br />
              <a href="mailto:info@billionstudio.app" className="text-red-500 hover:underline">
                info@billionstudio.app
              </a>
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link href="/" className="text-red-500 hover:underline">
            ← 返回首頁
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 mt-16 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>© 2026 Billion Studio. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
