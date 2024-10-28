import { test, expect } from "@playwright/test";

test.describe("GitHub Search App", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to your app's URL
    await page.goto("http://localhost:3000");
  });

  test("should load the main page", async ({ page }) => {
    // Check if the title is correct
    await expect(page).toHaveTitle("GitHub Search");

    // Check if the search input is present
    const searchInput = page.locator('input[placeholder="Search for users"]');
    await expect(searchInput).toBeVisible();
  });

  test("should search users and display results", async ({ page }) => {
    // Navigate to the page (if not already done in beforeEach)
    await page.goto("http://localhost:3000");

    // Enter a search term
    await page.fill('input[placeholder="Search for users"]', "alex");

    // Click the search button
    await page.click('button:has-text("Search")');

    // Wait for the results to load
    await page.waitForSelector(".container .row .col.d-inline-block");

    // Check if users are displayed
    const usersList = page.locator(".container .row .col.d-inline-block");

    // Get the count of user elements
    const userCount = await usersList.count();

    // Optional: Log the number of users found
    console.log(`Number of users found: ${userCount}`);

    // Check if at least one user is displayed
    expect(userCount).toBeGreaterThan(0);
  });
});
