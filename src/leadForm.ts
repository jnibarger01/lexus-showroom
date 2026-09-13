/** Catalog model ids for the lead form select (matches vehicles.ts). */
export const LEAD_MODEL_IDS = ["es", "nx", "rx", "lx"] as const;
export type LeadModelId = (typeof LEAD_MODEL_IDS)[number];

export interface LeadFormValues {
  name: string;
  email: string;
  modelInterest: string;
}

export type LeadFieldErrors = Partial<
  Record<"name" | "email" | "modelInterest", string>
>;

export type LeadSubmitStatus = "idle" | "submitting" | "success" | "error";

/** Demo mailto sink when `VITE_LEAD_ENDPOINT` is unset (documented in README). */
export const DEFAULT_LEAD_MAILTO = "showroom-leads@example.com";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isLeadModelId(value: string): value is LeadModelId {
  return (LEAD_MODEL_IDS as readonly string[]).includes(value);
}

export function validateLeadForm(values: LeadFormValues): LeadFieldErrors {
  const errors: LeadFieldErrors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const modelInterest = values.modelInterest.trim().toLowerCase();

  if (!name) {
    errors.name = "Enter your name.";
  } else if (name.length > 120) {
    errors.name = "Name must be 120 characters or fewer.";
  }

  if (!email) {
    errors.email = "Enter your email.";
  } else if (!EMAIL_RE.test(email) || email.length > 254) {
    errors.email = "Enter a valid email address.";
  }

  if (!modelInterest) {
    errors.modelInterest = "Select a model.";
  } else if (!isLeadModelId(modelInterest)) {
    errors.modelInterest = "Select a model from the list.";
  }

  return errors;
}

export function leadFormHasErrors(errors: LeadFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

/** Public Formspree-style URL from Vite env (never put API secrets here). */
export function getLeadEndpoint(
  env: ImportMetaEnv | Record<string, string | undefined> = import.meta.env,
): string {
  const raw = env.VITE_LEAD_ENDPOINT;
  return typeof raw === "string" ? raw.trim() : "";
}

export function composeLeadMailto(
  values: LeadFormValues,
  recipient = DEFAULT_LEAD_MAILTO,
): string {
  const name = values.name.trim();
  const email = values.email.trim();
  const model = values.modelInterest.trim().toUpperCase();
  const subject = encodeURIComponent(`Lexus showroom interest — ${model}`);
  const body = encodeURIComponent(
    [
      "New showroom lead",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      `Model interest: ${model}`,
    ].join("\n"),
  );
  const to = recipient.replace(/^mailto:/i, "");
  return `mailto:${to}?subject=${subject}&body=${body}`;
}

export function isHttpLeadEndpoint(endpoint: string): boolean {
  return /^https?:\/\//i.test(endpoint);
}

export interface SubmitLeadResult {
  ok: boolean;
  mode: "endpoint" | "mailto";
  message: string;
}

export interface SubmitLeadOptions {
  endpoint?: string;
  /** Injected for tests; defaults to global fetch. */
  fetchImpl?: typeof fetch;
  /** Injected for tests; defaults to assigning window.location.href. */
  openMailto?: (href: string) => void;
}

/**
 * Submit a validated lead. Uses `VITE_LEAD_ENDPOINT` when it is an http(s)
 * Formspree-style URL; otherwise opens a composed mailto: link.
 */
export async function submitLead(
  values: LeadFormValues,
  options: SubmitLeadOptions = {},
): Promise<SubmitLeadResult> {
  const endpoint = (options.endpoint ?? getLeadEndpoint()).trim();
  const name = values.name.trim();
  const email = values.email.trim();
  const modelInterest = values.modelInterest.trim().toLowerCase();

  if (endpoint && isHttpLeadEndpoint(endpoint)) {
    const fetchImpl = options.fetchImpl ?? fetch;
    try {
      const response = await fetchImpl(endpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          modelInterest,
          _subject: `Lexus showroom interest — ${modelInterest.toUpperCase()}`,
        }),
      });
      if (!response.ok) {
        return {
          ok: false,
          mode: "endpoint",
          message: "Something went wrong sending your request. Please try again.",
        };
      }
      return {
        ok: true,
        mode: "endpoint",
        message: "Thanks — we received your interest and will be in touch.",
      };
    } catch {
      return {
        ok: false,
        mode: "endpoint",
        message: "Network error. Check your connection and try again.",
      };
    }
  }

  const mailtoRecipient =
    endpoint.toLowerCase().startsWith("mailto:")
      ? endpoint
      : DEFAULT_LEAD_MAILTO;
  const href = composeLeadMailto(
    { name, email, modelInterest },
    mailtoRecipient,
  );
  const openMailto =
    options.openMailto ??
    ((url: string) => {
      window.location.href = url;
    });
  openMailto(href);
  return {
    ok: true,
    mode: "mailto",
    message:
      "Your email app should open with a pre-filled message. Send it to complete your request.",
  };
}
