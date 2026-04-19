import Link from 'next/link';

export default function TermsPage() {
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
        <h1 className="text-3xl font-bold text-gray-800 mb-8">使用條款 / Terms of Use</h1>
        
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-6">
            最後更新：2026 年 4 月
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">1. 服務說明</h2>
            <p className="text-gray-600">
              標王（TitleKing）是由 Billion Studio 提供的 AI 驅動標題生成服務。我們使用人工智能技術幫助用戶生成小紅書風格的標題和文案。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">2. 帳戶註冊</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>你必須提供準確的電子郵件地址</li>
              <li>你負責保護你的帳戶安全</li>
              <li>每個人只能註冊一個帳戶</li>
              <li>我們保留暫停或終止違規帳戶的權利</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">3. 點數系統</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>新用戶註冊可獲得 20 點免費點數</li>
              <li>每次生成標題消耗 10 點</li>
              <li>購買的點數永不過期</li>
              <li>點數不可轉讓或退款</li>
              <li>我們保留修改點數定價的權利</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">4. 付款條款</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>所有付款通過 Stripe 安全處理</li>
              <li>價格以美元 (USD) 計算</li>
              <li>購買後點數立即到帳</li>
              <li>已購買的點數不支援退款</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">5. 內容政策</h2>
            <p className="text-gray-600 mb-3">
              你同意不使用本服務生成：
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>非法或有害內容</li>
              <li>仇恨言論或歧視性內容</li>
              <li>侵犯他人知識產權的內容</li>
              <li>虛假或誤導性信息</li>
              <li>垃圾郵件或惡意內容</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">6. 知識產權</h2>
            <p className="text-gray-600">
              生成的標題和文案可供你自由使用。但請注意，AI 生成的內容可能與其他用戶相似。我們不保證生成內容的獨特性或原創性。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">7. 免責聲明</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>服務按「現狀」提供，不提供任何明示或暗示的保證</li>
              <li>我們不保證服務不會中斷或無錯誤</li>
              <li>我們不對生成內容的準確性或適用性負責</li>
              <li>使用生成內容的風險由用戶自行承擔</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">8. 責任限制</h2>
            <p className="text-gray-600">
              在法律允許的最大範圍內，Billion Studio 不對任何間接、附帶、特殊或後果性損害負責。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">9. 條款修改</h2>
            <p className="text-gray-600">
              我們可能會不時更新這些條款。重大變更會通過電子郵件或網站通知。繼續使用服務即表示接受更新後的條款。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">10. 適用法律</h2>
            <p className="text-gray-600">
              這些條款受英格蘭和威爾士法律管轄。任何爭議應提交英格蘭法院專屬管轄。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">11. 聯繫我們</h2>
            <p className="text-gray-600">
              如有任何問題，請聯繫：<br />
              <a href="mailto:info@billionstudio.app" className="text-red-500 hover:underline">
                info@billionstudio.app
              </a>
            </p>
            <p className="text-gray-600 mt-4">
              Billion Studio<br />
              Surrey, United Kingdom
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
