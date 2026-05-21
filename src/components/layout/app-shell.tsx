import Link from "next/link";
import type { Route } from "next";
import { BarChart3, BriefcaseBusiness, FileUser, LogIn, LogOut, type LucideIcon } from "lucide-react";
import { signOutAction } from "@/features/auth/actions";
import { createClient } from "@/lib/supabase/server";

const navigation: Array<{ href: Route; label: string; icon: LucideIcon }> = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/applications", label: "Applications", icon: BriefcaseBusiness },
  { href: "/profile", label: "Profile", icon: FileUser }
];

export async function AppShell({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen">
      <header className="border-b border-[var(--line)] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-md bg-teal-800 font-semibold text-white">AP</span>
            <span className="text-lg font-semibold">ApplyPilot</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex min-h-10 items-center gap-2 rounded-md px-3 text-sm font-medium text-stone-700 hover:bg-stone-100"
                >
                  <Icon size={17} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {user ? (
            <form action={signOutAction}>
              <button
                type="submit"
                className="inline-flex min-h-10 items-center gap-2 rounded-md border border-[var(--line)] px-3 text-sm font-medium hover:bg-stone-100"
              >
                <LogOut size={17} />
                Sign out
              </button>
            </form>
          ) : (
            <Link
              href="/login"
              className="inline-flex min-h-10 items-center gap-2 rounded-md border border-[var(--line)] px-3 text-sm font-medium hover:bg-stone-100"
            >
              <LogIn size={17} />
              Sign in
            </Link>
          )}
        </div>

        <nav className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 pb-3 md:hidden">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex min-h-10 items-center gap-2 rounded-md px-3 text-sm font-medium text-stone-700 hover:bg-stone-100"
              >
                <Icon size={17} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>
      {children}
    </div>
  );
}

async function getCurrentUser() {
  try {
    const supabase = await createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    return user;
  } catch {
    return null;
  }
}
