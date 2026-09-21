import { test, expect } from "@playwright/test";

const BASE = "/lexus-showroom/";

test.describe("lead form", () => {
  test("invalid submit is blocked; valid submit shows confirmation", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });
    page.on("pageerror", (err) => {
      consoleErrors.push(String(err));
    });

    await page.goto(`${BASE}#contact`);
    const form = page.locator("#contact form");
    await expect(form).toBeVisible();

    await form.getByRole("button", { name: /send request/i }).click();

    await expect(page.getByRole("alert").filter({ hasText: /name/i })).toBeVisible();
    await expect(page.getByRole("alert").filter({ hasText: /email/i })).toBeVisible();
    await expect(page.getByRole("alert").filter({ hasText: /model/i })).toBeVisible();
    await expect(form.getByRole("status")).toHaveCount(0);

    await form.getByLabel(/^name$/i).fill("Jace Nibarger");
    await form.getByLabel(/^email$/i).fill("jace@example.com");
    await form.getByLabel(/model interest/i).selectOption("es");
    await form.getByRole("button", { name: /send request/i }).click();

    await expect(form.getByRole("status")).toContainText(/email app|received/i);
    await expect(page.getByRole("alert")).toHaveCount(0);

    expect(consoleErrors, consoleErrors.join("\n")).toEqual([]);
  });
});
