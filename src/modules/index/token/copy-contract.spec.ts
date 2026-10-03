import { expect, test } from "@playwright/test";
import { siteConfig } from "../common/site-config";

test.beforeEach(async ({ page }) => {
  await page.route("**/api/msft", (route) =>
    route.fulfill({
      json: {
        address: siteConfig.msft.address,
        price: null,
        generatedAt: null,
        observedAt: new Date().toISOString(),
        halted: false,
      },
    }),
  );
});

test("copies the full verified contract after clipboard resolves", async ({
  page,
}) => {
  await page.clock.install({ time: new Date("2026-10-02T00:00:00Z") });
  await page.clock.pauseAt(new Date("2026-10-02T00:00:01Z"));
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: (value: string) => {
          document.documentElement.dataset.copiedValue = value;
          return new Promise<void>((resolve) => {
            document.addEventListener("resolve-clipboard", () => resolve(), {
              once: true,
            });
          });
        },
      },
    });
  });
  await page.goto("/#top");
  const control = page.locator("#market .msft-contract");
  await expect(control).toContainText("MSFT");
  const copy = control.getByRole("button", {
    name: "Copy MSFT token contract",
  });
  await copy.click();
  await expect(copy).toHaveAttribute("aria-busy", "true");
  await expect(control.getByRole("status")).not.toContainText("Copied");
  expect(await page.locator("html").getAttribute("data-copied-value")).toBe(
    siteConfig.msft.address,
  );
  await page.evaluate(() =>
    document.dispatchEvent(new Event("resolve-clipboard")),
  );
  await expect(control.getByRole("status")).toHaveText("Copied full address.");
  await expect(copy).toHaveAttribute("data-copied", "true");
  await expect(control.getByRole("status")).toHaveCSS("position", "absolute");
  await expect(copy).toBeFocused();
  await page.clock.fastForward(1999);
  await expect(copy).toHaveAttribute("data-copied", "true");
  await page.clock.fastForward(1);
  await expect(copy).toHaveAttribute("data-copied", "false");
  await expect(control.getByRole("status")).toBeEmpty();
  await expect(control.locator(".copy-full-value")).toHaveCount(0);
  await expect(copy).toBeFocused();
});

test("copy rejection exposes selectable full address text without claiming success", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: () => Promise.reject(new Error("Denied")) },
    });
  });
  await page.goto("/#top");
  const control = page.locator("#market .msft-contract");
  const copy = control.getByRole("button", {
    name: "Copy MSFT token contract",
  });
  await copy.click();
  await expect(control.getByRole("status")).toContainText("Select the text");
  await expect(control.getByRole("status")).not.toContainText("Copied");
  await expect(copy).toHaveAttribute("data-copied", "false");
  await expect(control.locator(".contract-value")).toHaveCSS(
    "user-select",
    "text",
  );
  await expect(control.locator(".copy-full-value")).toHaveText(
    siteConfig.msft.address,
  );
  await expect(copy).toBeFocused();
});

test("reduced motion switches the success icon without a fade", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() =>
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: async () => {} },
    }),
  );
  await page.goto("/#top");
  const copy = page.locator("#market .msft-contract button");
  await copy.click();
  await expect(copy).toHaveAttribute("data-copied", "true");
  await expect(copy.locator(".copy-check")).toHaveCSS("opacity", "1");
  await expect(copy.locator(".copy-check")).toHaveCSS(
    "transition-duration",
    "0s",
  );
});
