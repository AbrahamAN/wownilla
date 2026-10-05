import { expect, test } from "@playwright/test";

test("closing keeps approved copy, disabled destinations and the legacy chat anchor", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#chat");
  const section = page.locator("#community");
  await expect(section).toBeInViewport();
  await expect(section.getByRole("heading", { level: 2 })).toHaveText(
    "ONE SLOT OPEN.",
  );
  await expect(section.locator(".closing-description span")).toHaveText([
    "Your old guildmates might be here.",
    "Your next ones could be.",
  ]);
  await expect(section.locator(".closing-microcopy")).toHaveText(
    "No gear check. Bring your worst memes.",
  );
  await expect(
    section.getByRole("button", { name: "Buy $NILLA" }),
  ).toBeDisabled();
  await expect(
    section.getByRole("link", { name: "Join Telegram" }),
  ).toHaveAttribute("href", "https://t.me/+oLbd05GY5Sc0MDQx");
  await expect(section.locator("#chat p")).toHaveCount(0);
  await expect(section).not.toContainText("312 online");
  await expect(section).not.toContainText("Guild members");
  const boxes = await section
    .locator(".closing-actions > :is(button, a)")
    .evaluateAll((buttons) =>
      buttons.map((button) => {
        const rect = button.getBoundingClientRect();
        return { top: rect.top, left: rect.left, height: rect.height };
      }),
    );
  expect(boxes.every((box) => box.height >= 48)).toBe(true);
  if (testInfo.project.name === "mobile")
    expect(boxes[1].top).toBeGreaterThan(boxes[0].top);
  else expect(boxes[1].left).toBeGreaterThan(boxes[0].left);
  expect(errors).toEqual([]);
});

test("footer links reach real sections and keeps legal text with no placeholder copying", async ({
  page,
}) => {
  await page.goto("/#community");
  const footer = page.locator("footer");
  await expect(footer).toContainText(
    "$NILLA is a meme coin with no intrinsic value or expectation of financial return. Not financial advice. Just a really good meme.",
  );
  await expect(footer).toContainText(
    "Fan-made parody. Not affiliated with, endorsed by, or connected to Blizzard Entertainment.",
  );
  await expect(
    footer.getByRole("button", { name: "Copy $NILLA contract" }),
  ).toBeDisabled();
  await expect(
    footer.getByRole("link", { name: "Join Telegram" }),
  ).toHaveAttribute("href", "https://t.me/+oLbd05GY5Sc0MDQx");
  for (const link of await footer
    .getByRole("navigation", { name: "Footer" })
    .getByRole("link")
    .all()) {
    const destination = await link.getAttribute("href");
    if (!destination) throw new Error("Section destination missing");
    await expect(page.locator(destination)).toHaveCount(1);
    await link.click();
    await expect(page).toHaveURL(new RegExp(`${destination}$`));
    await expect(page.locator(destination)).toBeInViewport();
  }
  await expect(page.locator("body")).not.toContainText(
    "NILLA-CONTRACT-COMING-SOON",
  );
  await expect(page.locator("h1")).toHaveCount(1);
});

test("closing and footer fit 320px and remain readable without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 320, height: 1100 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto(`${baseURL}/#community`);
  await expect(page.locator("#community h2")).toBeVisible();
  await expect(page.locator("footer img")).toBeVisible();
  await expect(page.locator(".footer-contract")).toContainText(
    "Contract unavailable",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await context.close();
});
