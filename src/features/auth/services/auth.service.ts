import type { SupabaseClient } from "@supabase/supabase-js";

export type AdminLoginInput = {
  email: string;
  password: string;
};

export async function signInAdmin(
  supabase: SupabaseClient,
  input: AdminLoginInput,
) {
  const email = input.email.trim().toLowerCase();

  if (!email || !input.password) {
    throw new Error("البريد الإلكتروني وكلمة المرور مطلوبان.");
  }

  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password: input.password,
    });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user || !data.session) {
    throw new Error("تعذر إنشاء جلسة تسجيل الدخول.");
  }

  return {
    user: data.user,
    session: data.session,
  };
}

export async function signOutAdmin(
  supabase: SupabaseClient,
) {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
}