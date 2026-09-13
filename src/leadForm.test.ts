import { describe, expect, it, vi } from "vitest";
import {
  composeLeadMailto,
  DEFAULT_LEAD_MAILTO,
  getLeadEndpoint,
  isHttpLeadEndpoint,
  isLeadModelId,
  leadFormHasErrors,
  submitLead,
  validateLeadForm,
} from "./leadForm";

describe("validateLeadForm", () => {
  it("accepts a complete valid payload", () => {
    expect(
      validateLeadForm({
        name: "Jace Nibarger",
        email: "jace@example.com",
        modelInterest: "es",
      }),
    ).toEqual({});
  });

  it("requires name, email, and model", () => {
    const errors = validateLeadForm({
      name: "  ",
      email: "",
      modelInterest: "",
    });
    expect(errors.name).toMatch(/name/i);
    expect(errors.email).toMatch(/email/i);
    expect(errors.modelInterest).toMatch(/model/i);
    expect(leadFormHasErrors(errors)).toBe(true);
  });

  it("rejects invalid email and unknown model", () => {
    const errors = validateLeadForm({
      name: "Jace",
      email: "not-an-email",
      modelInterest: "gx",
    });
    expect(errors.email).toMatch(/valid email/i);
    expect(errors.modelInterest).toMatch(/list/i);
  });

  it("normalizes model case for acceptance via isLeadModelId", () => {
    expect(isLeadModelId("nx")).toBe(true);
    expect(isLeadModelId("GX")).toBe(false);
    const errors = validateLeadForm({
      name: "Jace",
      email: "jace@example.com",
      modelInterest: "NX",
    });
    expect(errors).toEqual({});
  });
});

describe("getLeadEndpoint / isHttpLeadEndpoint", () => {
  it("reads trimmed VITE_LEAD_ENDPOINT", () => {
    expect(getLeadEndpoint({ VITE_LEAD_ENDPOINT: "  https://formspree.io/f/xyz  " })).toBe(
      "https://formspree.io/f/xyz",
    );
    expect(getLeadEndpoint({ VITE_LEAD_ENDPOINT: undefined })).toBe("");
  });

  it("detects http(s) sinks", () => {
    expect(isHttpLeadEndpoint("https://formspree.io/f/xyz")).toBe(true);
    expect(isHttpLeadEndpoint("mailto:a@b.com")).toBe(false);
    expect(isHttpLeadEndpoint("")).toBe(false);
  });
});

describe("composeLeadMailto", () => {
  it("builds a mailto with subject and body", () => {
    const href = composeLeadMailto({
      name: "Jace",
      email: "jace@example.com",
      modelInterest: "rx",
    });
    expect(href.startsWith(`mailto:${DEFAULT_LEAD_MAILTO}?`)).toBe(true);
    expect(href).toContain("subject=");
    expect(href).toContain("body=");
    expect(decodeURIComponent(href)).toContain("RX");
    expect(decodeURIComponent(href)).toContain("jace@example.com");
  });
});

describe("submitLead", () => {
  it("POSTs JSON to an http endpoint and reports success", async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ ok: true });
    const result = await submitLead(
      { name: "Jace", email: "jace@example.com", modelInterest: "es" },
      { endpoint: "https://formspree.io/f/test", fetchImpl },
    );
    expect(result.ok).toBe(true);
    expect(result.mode).toBe("endpoint");
    expect(fetchImpl).toHaveBeenCalledOnce();
    const [, init] = fetchImpl.mock.calls[0];
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body as string)).toMatchObject({
      name: "Jace",
      email: "jace@example.com",
      modelInterest: "es",
    });
  });

  it("reports endpoint failure when response is not ok", async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ ok: false, status: 500 });
    const result = await submitLead(
      { name: "Jace", email: "jace@example.com", modelInterest: "nx" },
      { endpoint: "https://formspree.io/f/test", fetchImpl },
    );
    expect(result.ok).toBe(false);
    expect(result.mode).toBe("endpoint");
  });

  it("falls back to mailto when endpoint is unset", async () => {
    const openMailto = vi.fn();
    const result = await submitLead(
      { name: "Jace", email: "jace@example.com", modelInterest: "lx" },
      { endpoint: "", openMailto },
    );
    expect(result.ok).toBe(true);
    expect(result.mode).toBe("mailto");
    expect(openMailto).toHaveBeenCalledOnce();
    expect(openMailto.mock.calls[0][0]).toMatch(/^mailto:/);
  });
});
