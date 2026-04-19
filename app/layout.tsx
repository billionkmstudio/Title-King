import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: '標王 TitleKing - AI 小紅書爆款標題生成器',
  description: 'AI 生成小紅書爆款標題 + 文案潤色。一鍵生成 10 種風格標題，輕鬆提升內容曝光。為海外華人、留學生量身打造的創意工具。',
  keywords: '小紅書, 標題生成, AI, TitleKing, 標王, 爆款, 文案潤色',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: '標王',
  },
  icons: {
    icon: '/logo-icon.png',
    apple: '/logo-icon.png',
  },
  openGraph: {
    type: 'website',
    url: 'https://xhs-topics.billionstudio.co.uk',
    title: '標王 TitleKing - AI 小紅書爆款標題生成器',
    description: 'AI 生成小紅書爆款標題 + 文案潤色。為海外華人、留學生量身打造的創意工具。',
    images: [
      {
        url: 'https://xhs-topics.billionstudio.co.uk/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '標王 TitleKing - AI 小紅書爆款標題生成器',
    description: 'AI 生成小紅書爆款標題 + 文案潤色',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hant">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ef4444" />
        <meta name="description" content="標王 TitleKing - AI 生成小紅書爆款標題 + 文案潤色。一鍵生成 10 種風格標題，輕鬆提升內容曝光。" />
      </head>
      <body className={inter.className}>
        {children}

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-4ZFCL8X62W"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-4ZFCL8X62W');
          `}
        </Script>

        {/* Service Worker */}
        <Script
          id="sw-register"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/sw.js').catch(err => console.log('SW registration failed:', err));
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
