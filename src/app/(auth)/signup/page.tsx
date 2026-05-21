import Link from "next/link";
import { SignupForm } from "@/features/auth/signup-form";

export default function SignupPage() {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <div className="w-full max-w-md">
        <SignupForm />
        <p className="mt-4 text-center text-sm text-[var(--muted)]">
          Already registered?{" "}
          <Link href="/login" className="font-medium text-teal-800">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
