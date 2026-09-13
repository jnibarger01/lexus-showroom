import { describe, expect, it } from "vitest";
import { compareHash, compareIdsFromLocation } from "./compare";

const ids = ["es", "nx", "rx", "lx"] as const;

describe("compareIdsFromLocation", () => {
  it("reads #compare=es,nx", () => {
    expect(
      compareIdsFromLocation({ hash: "#compare=es,nx", search: "" }, ids),
    ).toEqual(["es", "nx"]);
  });

  it("reads ?compare=rx,lx query", () => {
    expect(
      compareIdsFromLocation(
        { hash: "", search: "?compare=rx,lx" },
        ids,
      ),
    ).toEqual(["rx", "lx"]);
  });

  it("rejects unknown, duplicate, or incomplete pairs", () => {
    expect(
      compareIdsFromLocation({ hash: "#compare=es,es", search: "" }, ids),
    ).toBeUndefined();
    expect(
      compareIdsFromLocation({ hash: "#compare=es", search: "" }, ids),
    ).toBeUndefined();
    expect(
      compareIdsFromLocation({ hash: "#compare=es,zz", search: "" }, ids),
    ).toBeUndefined();
    expect(
      compareIdsFromLocation({ hash: "#models", search: "" }, ids),
    ).toBeUndefined();
  });

  it("prefers hash over query when both present", () => {
    expect(
      compareIdsFromLocation(
        { hash: "#compare=es,nx", search: "?compare=rx,lx" },
        ids,
      ),
    ).toEqual(["es", "nx"]);
  });
});

describe("compareHash", () => {
  it("builds a shareable fragment", () => {
    expect(compareHash("es", "nx")).toBe("#compare=es,nx");
  });
});
