'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export async function signup(prevState: unknown, formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        display_name: (formData.get('displayName') as string)?.trim() || '',
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { success: '確認メールを送信しました。メールを確認してください。' };
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const origin = (await headers()).get('origin');

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error || !data.url) {
    redirect('/signup?error=Google認証に失敗しました');
  }

  redirect(data.url);
}
