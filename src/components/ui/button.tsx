import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const buttonStyles =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-teal-800 px-4 py-2 text-sm font-semibold !text-white shadow-sm [&_svg]:text-white hover:bg-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

export function Button({
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type={type} className={cn(buttonStyles, className)} {...props} />;
}
