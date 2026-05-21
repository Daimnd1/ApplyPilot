"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export type AuthActionState = {
  error?: string;
  success?: string;
  fieldErrors?: {
    name?: string[];
    email?: string[];
    password?: string[];
  };
};

const signInSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required.")
});

const signUpSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters.")
});

export async function signInAction(
  _previousState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = signInSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors
    };
  }

  const supabase = await getSupabaseOrNull();

  if (!supabase) {
    return {
      error: "Supabase environment variables are missing."
    };
  }

  const result = await tryAuthRequest(() => supabase.auth.signInWithPassword(parsed.data));

  if (!result.ok) {
    return {
      error: result.error
    };
  }

  const { error } = result.data;

  if (error) {
    return {
      error: "Sign in failed. Check your email and password."
    };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signUpAction(
  _previousState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = signUpSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors
    };
  }

  const supabase = await getSupabaseOrNull();

  if (!supabase) {
    return {
      error: "Supabase environment variables are missing."
    };
  }

  const result = await tryAuthRequest(() =>
    supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        data: {
          name: parsed.data.name
        }
      }
    })
  );

  if (!result.ok) {
    return {
      error: result.error
    };
  }

  const { data, error } = result.data;

  if (error) {
    return {
      error: error.message
    };
  }

  if (!data.session) {
    return {
      success: "Account created. Check your email to confirm your account before signing in."
    };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signOutAction() {
  const supabase = await getSupabaseOrNull();

  if (supabase) {
    await tryAuthRequest(() => supabase.auth.signOut());
  }

  revalidatePath("/", "layout");
  redirect("/login");
}

async function getSupabaseOrNull() {
  try {
    return await createClient();
  } catch {
    return null;
  }
}

async function tryAuthRequest<T>(request: () => Promise<T>) {
  try {
    return {
      ok: true,
      data: await request()
    } as const;
  } catch {
    return {
      ok: false,
      error:
        "Could not reach Supabase. Check NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, and your network connection."
    } as const;
  }
}
