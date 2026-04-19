import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getOrCreateUser } from '@/app/lib/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('Auth callback error:', error);
      return NextResponse.redirect(`${origin}/?error=auth_failed`);
    }

    if (data.user?.email) {
      // 確保用戶存在於我們的資料庫
      await getOrCreateUser(data.user.email);
    }

    return NextResponse.redirect(`${origin}${next}`);
  }

  // 沒有 code，重定向回首頁
  return NextResponse.redirect(`${origin}/?error=no_code`);
}
