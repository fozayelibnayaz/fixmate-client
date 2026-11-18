import { test, expect } from "@playwright/test";

test("home loads and shows hero", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/FixMate/);
  await expect(page.getByText("Every broken device")).toBeVisible();
});

test("services page loads", async ({ page }) => {
  await page.goto("/services");
  await expect(page.getByText("Find a")).toBeVisible();
});

test("protected route redirects to sign-in", async ({ page }) => {
  await page.goto("/dashboard/customer");
  await expect(page).toHaveURL(/sign-in/);
});
