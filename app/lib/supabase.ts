import { createClient } from '@supabase/supabase-js';

// 類型定義
export interface User {
  id: string;
  email: string;
  first_name: string | null;
  credits: number;
  total_generations: number;
  stripe_customer_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: 'signup_bonus' | 'purchase' | 'usage' | 'refund' | 'manual';
  amount: number;
  balance_after: number;
  description: string | null;
  stripe_session_id: string | null;
  created_at: string;
}

export interface Generation {
  id: string;
  user_id: string;
  input_content: string;
  style: string;
  titles: string[];
  polished_content: string | null;
  credits_used: number;
  created_at: string;
}

// 環境變數
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// 前端用的 client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 後端用的 client（service role）
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

// ============================================
// 用戶相關函數
// ============================================

// 獲取或創建用戶（註冊時送 20 點）
export async function getOrCreateUser(email: string, firstName?: string): Promise<User | null> {
  if (!supabaseAdmin) {
    console.error('supabaseAdmin not initialized');
    return null;
  }

  // 先嘗試獲取用戶
  const { data: existingUser } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (existingUser) {
    return existingUser;
  }

  // 創建新用戶（預設 20 點）
  const { data: newUser, error: createError } = await supabaseAdmin
    .from('users')
    .insert({ 
      email,
      first_name: firstName || null,
      credits: 20  // 註冊送 20 點
    })
    .select()
    .single();

  if (createError) {
    console.error('Error creating user:', createError);
    return null;
  }

  // 記錄註冊獎勵交易
  if (newUser) {
    await supabaseAdmin
      .from('transactions')
      .insert({
        user_id: newUser.id,
        type: 'signup_bonus',
        amount: 20,
        balance_after: 20,
        description: '註冊獎勵'
      });
  }

  return newUser;
}

// 獲取用戶資料
export async function getUserByEmail(email: string): Promise<User | null> {
  if (!supabaseAdmin) return null;

  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }

  return data;
}

// 更新用戶名字
export async function updateUserName(email: string, firstName: string): Promise<boolean> {
  if (!supabaseAdmin) return false;

  const { error } = await supabaseAdmin
    .from('users')
    .update({ 
      first_name: firstName,
      updated_at: new Date().toISOString()
    })
    .eq('email', email);

  if (error) {
    console.error('Error updating user name:', error);
    return false;
  }

  return true;
}

// ============================================
// 點數相關函數
// ============================================

// 使用點數（生成時調用）
export async function useCredits(
  userId: string,
  amount: number = 10,
  description: string = '生成標題'
): Promise<{ success: boolean; newBalance: number }> {
  if (!supabaseAdmin) return { success: false, newBalance: 0 };

  // 獲取當前點數
  const { data: user } = await supabaseAdmin
    .from('users')
    .select('credits')
    .eq('id', userId)
    .single();

  if (!user || user.credits < amount) {
    return { success: false, newBalance: user?.credits || 0 };
  }

  const newBalance = user.credits - amount;

  // 扣除點數
  const { error: updateError } = await supabaseAdmin
    .from('users')
    .update({ 
      credits: newBalance,
      total_generations: user.credits + 1,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);

  if (updateError) {
    return { success: false, newBalance: user.credits };
  }

  // 記錄交易
  await supabaseAdmin
    .from('transactions')
    .insert({
      user_id: userId,
      type: 'usage',
      amount: -amount,
      balance_after: newBalance,
      description
    });

  return { success: true, newBalance };
}

// 增加點數（購買後調用）
export async function addCredits(
  userId: string,
  amount: number,
  description: string,
  stripeSessionId?: string
): Promise<number> {
  if (!supabaseAdmin) return 0;

  // 獲取當前點數
  const { data: user } = await supabaseAdmin
    .from('users')
    .select('credits')
    .eq('id', userId)
    .single();

  if (!user) return 0;

  const newBalance = user.credits + amount;

  // 增加點數
  await supabaseAdmin
    .from('users')
    .update({ 
      credits: newBalance,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);

  // 記錄交易
  await supabaseAdmin
    .from('transactions')
    .insert({
      user_id: userId,
      type: 'purchase',
      amount: amount,
      balance_after: newBalance,
      description,
      stripe_session_id: stripeSessionId
    });

  return newBalance;
}

// ============================================
// 歷史記錄相關函數
// ============================================

// 保存生成記錄
export async function saveGeneration(
  userId: string,
  inputContent: string,
  style: string,
  titles: string[],
  polishedContent?: string,
  creditsUsed: number = 10
): Promise<boolean> {
  if (!supabaseAdmin) return false;

  const { error } = await supabaseAdmin
    .from('generations')
    .insert({
      user_id: userId,
      input_content: inputContent,
      style,
      titles,
      polished_content: polishedContent || null,
      credits_used: creditsUsed
    });

  if (error) {
    console.error('Error saving generation:', error);
    return false;
  }

  return true;
}

// 獲取用戶的生成記錄
export async function getUserGenerations(
  userId: string,
  limit: number = 50
): Promise<Generation[]> {
  if (!supabaseAdmin) return [];

  const { data, error } = await supabaseAdmin
    .from('generations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching generations:', error);
    return [];
  }

  return data || [];
}

// 獲取用戶的交易記錄
export async function getUserTransactions(
  userId: string,
  limit: number = 50
): Promise<Transaction[]> {
  if (!supabaseAdmin) return [];

  const { data, error } = await supabaseAdmin
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }

  return data || [];
}

// 獲取用戶統計
export async function getUserStats(userId: string): Promise<{
  credits: number;
  totalGenerations: number;
  totalPurchased: number;
}> {
  if (!supabaseAdmin) return { credits: 0, totalGenerations: 0, totalPurchased: 0 };

  // 獲取用戶資料
  const { data: user } = await supabaseAdmin
    .from('users')
    .select('credits, total_generations')
    .eq('id', userId)
    .single();

  // 獲取購買總額
  const { data: purchases } = await supabaseAdmin
    .from('transactions')
    .select('amount')
    .eq('user_id', userId)
    .eq('type', 'purchase');

  const totalPurchased = purchases?.reduce((sum, p) => sum + p.amount, 0) || 0;

  return {
    credits: user?.credits || 0,
    totalGenerations: user?.total_generations || 0,
    totalPurchased
  };
}
