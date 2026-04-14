import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('medicines').select('*');

    if (error) throw error;

    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(
      { error: '予期しないエラーが発生しました' },
      { status: 500 },
    );
  }
}
