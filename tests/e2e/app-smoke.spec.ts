import { expect, test } from "@playwright/test";

test("redirects logged-out users from the dashboard to sign in", async ({ page }) => {
  await page.goto("/dashboard");

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
});

test("redirects logged-out users from the new application page to sign in", async ({ page }) => {
  await page.goto("/applications/new");

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
});

test("shows client-visible validation on the login form", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page.getByText("Enter a valid email address.")).toBeVisible();
  await expect(page.getByText("Password is required.")).toBeVisible();
});

test("loads the signup shell", async ({ page }) => {
  await page.goto("/signup");

  await expect(page.getByRole("heading", { name: "Create account" })).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
});
