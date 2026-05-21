export const APPLICATION_STATUSES = [
  "wishlist",
  "applied",
  "interviewing",
  "offer",
  "rejected",
  "archived"
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];
