import { expect, test } from "@playwright/test";

test("vault follows trading with a safe LONG destination and readable narrow layout", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 1100 });
    await page.goto("/#vault");
    const vault = page.locator("#vault");
    await expect(
      vault.getByRole("heading", { name: "The loot doesn’t sit idle." }),
    ).toBeInViewport();
    const link = vault.getByRole("link", { name: "Learn More on LONG" });
    await expect(link).toHaveAttribute(
      "href",
      "https://x.com/longdotxyz/status/2105813946125148650",
    );
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
    await link.focus();
    await expect(link).toBeFocused();
    expect(
      await vault.evaluate((element) => element.previousElementSibling?.id),
    ).toBe("token");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    if (width < 900) {
      const order = await vault.evaluate((element) =>
        [".vault-copy", ".vault-panel", ".vault-action"].map(
          (selector) =>
            element.querySelector(selector)?.getBoundingClientRect().top ?? -1,
        ),
      );
      expect(order).toEqual([...order].sort((a, b) => a - b));
    }
  }
  expect(errors).toEqual([]);
});

test("vault mechanics and explanation remain readable without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 320, height: 1100 },
  });
  const page = await context.newPage();
  await page.goto(`${baseURL}/#vault`);
  await expect(page.locator("#vault h2")).toBeVisible();
  await expect(page.locator(".vault-mechanics li")).toHaveText([
    "01Stock tokens collected",
    "02Put into trading pools",
    "03Fees return to the vault",
  ]);
  await expect(page.locator(".vault-copy > p:last-child")).toHaveText(
    "LONG’s community vaults collect stock tokens and put them to work in trading pools. Fees earned flow back into the vault and can be reinvested.",
  );
  await expect(page.locator("#vault a")).toBeVisible();
  await context.close();
});
