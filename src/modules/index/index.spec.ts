import { expect, test } from "@playwright/test";

test("serves indexable metadata and the preserved token section", async ({
  page,
  request,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/#token");
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator("#token")).toBeInViewport();
  await expect(page).toHaveTitle("WOWNILLA — Enter the Horde");
  const robots = await request.get("/robots.txt");
  expect(robots.ok()).toBeTruthy();
  expect(await robots.text()).toContain("Allow: /");
  expect(errors).toEqual([]);
});

test("allows keyboard entry, navigation, and music toggling", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByRole("button", { name: "Mute music" }).click();
  await expect(
    page.getByRole("button", { name: "Play music" }),
  ).toHaveAttribute("aria-pressed", "false");
  if (await page.getByRole("button", { name: "Open menu" }).isVisible()) {
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(
      page.getByRole("button", { name: "Close menu" }),
    ).toHaveAttribute("aria-expanded", "true");
    await page
      .locator("#mobileMenu")
      .getByRole("link", { name: "Token" })
      .click();
    await expect(
      page.getByRole("button", { name: "Open menu" }),
    ).toHaveAttribute("aria-expanded", "false");
  } else {
    await page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("link", { name: "Token", exact: true })
      .click();
  }
  await expect(page).toHaveURL(/#token$/);
  await expect(page.locator("#token")).toBeInViewport();
});
