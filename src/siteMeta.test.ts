import { describe, expect, it } from "vitest";
import { GITHUB_REPO_URL, SITE_LAST_UPDATED } from "./siteMeta";

describe("siteMeta", () => {
  it("exports an ISO date stamp and the public GitHub URL", () => {
    expect(SITE_LAST_UPDATED).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(GITHUB_REPO_URL).toBe(
      "https://github.com/jnibarger01/lexus-showroom",
    );
  });
});
