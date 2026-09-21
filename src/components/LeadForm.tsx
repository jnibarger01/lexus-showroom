import { useId, useRef, useState, type FormEvent } from "react";
import Button from "./Button";
import { vehicles } from "../data/vehicles";
import {
  leadFormHasErrors,
  submitLead,
  validateLeadForm,
  type LeadFieldErrors,
  type LeadFormValues,
  type LeadSubmitStatus,
} from "../leadForm";

const INITIAL: LeadFormValues = {
  name: "",
  email: "",
  modelInterest: "",
  companyWebsite: "",
};

export default function LeadForm() {
  const formId = useId();
  const nameId = `${formId}-name`;
  const emailId = `${formId}-email`;
  const modelId = `${formId}-model`;
  const nameErrorId = `${formId}-name-error`;
  const emailErrorId = `${formId}-email-error`;
  const modelErrorId = `${formId}-model-error`;
  const statusId = `${formId}-status`;

  const [values, setValues] = useState<LeadFormValues>(INITIAL);
  const [errors, setErrors] = useState<LeadFieldErrors>({});
  const [status, setStatus] = useState<LeadSubmitStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const mountedAtMsRef = useRef(Date.now());

  const setField = <K extends keyof LeadFormValues>(key: K, value: LeadFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (key === "name" || key === "email" || key === "modelInterest") {
      const field: "name" | "email" | "modelInterest" = key;
      if (errors[field]) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next[field];
          return next;
        });
      }
    }
    if (status === "error" || status === "success") {
      setStatus("idle");
      setStatusMessage("");
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateLeadForm(values);
    setErrors(nextErrors);
    if (leadFormHasErrors(nextErrors)) {
      setStatus("idle");
      setStatusMessage("");
      return;
    }

    setStatus("submitting");
    setStatusMessage("");
    const result = await submitLead(values, { mountedAtMs: mountedAtMsRef.current });
    setStatus(result.ok ? "success" : "error");
    setStatusMessage(result.message);
    if (result.ok) {
      setValues(INITIAL);
      setErrors({});
    }
  };

  const fieldClass =
    "mt-2 w-full rounded-lg border border-line/20 bg-surface px-4 py-3 text-ink shadow-sm outline-none transition focus:border-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas";
  const labelClass = "block text-sm font-semibold text-ink";
  const errorClass = "mt-1.5 text-sm text-accent-bright";

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="mx-auto max-w-6xl px-gutter pb-section sm:pb-section-lg"
    >
      <div className="mb-10 max-w-2xl sm:mb-12">
        <p className="text-xs font-semibold uppercase tracking-kicker text-accent-bright sm:text-sm">
          Stay in touch
        </p>
        <h2
          id="contact-heading"
          className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl"
        >
          Request information
        </h2>
        <p className="mt-4 leading-7 text-muted">
          Share your name, email, and model interest. No CRM backend — submissions
          go to a Formspree-style endpoint when configured, or open a pre-filled
          email otherwise.
        </p>
      </div>

      <div className="max-w-xl rounded-2xl border border-line/10 bg-surface p-6 sm:p-8">
        <form
          noValidate
          onSubmit={onSubmit}
          aria-describedby={statusMessage ? statusId : undefined}
          className="relative space-y-5"
        >

          {/* Honeypot: off-screen, not required, ignored by assistive tech */}
          <div
            aria-hidden="true"
            className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden"
          >
            <label htmlFor={`${formId}-company-website`}>Company website</label>
            <input
              id={`${formId}-company-website`}
              name="companyWebsite"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={values.companyWebsite ?? ""}
              onChange={(e) => setField("companyWebsite", e.target.value)}
            />
          </div>

          <div>
            <label htmlFor={nameId} className={labelClass}>
              Name
            </label>
            <input
              id={nameId}
              name="name"
              type="text"
              autoComplete="name"
              required
              maxLength={120}
              value={values.name}
              onChange={(e) => setField("name", e.target.value)}
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? nameErrorId : undefined}
              className={fieldClass}
            />
            {errors.name ? (
              <p id={nameErrorId} role="alert" className={errorClass}>
                {errors.name}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor={emailId} className={labelClass}>
              Email
            </label>
            <input
              id={emailId}
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              value={values.email}
              onChange={(e) => setField("email", e.target.value)}
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? emailErrorId : undefined}
              className={fieldClass}
            />
            {errors.email ? (
              <p id={emailErrorId} role="alert" className={errorClass}>
                {errors.email}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor={modelId} className={labelClass}>
              Model interest
            </label>
            <select
              id={modelId}
              name="modelInterest"
              required
              value={values.modelInterest}
              onChange={(e) => setField("modelInterest", e.target.value)}
              aria-invalid={errors.modelInterest ? true : undefined}
              aria-describedby={errors.modelInterest ? modelErrorId : undefined}
              className={fieldClass}
            >
              <option value="">Select a model</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.name.replace("Lexus ", "")} — {vehicle.bodyStyle}
                </option>
              ))}
            </select>
            {errors.modelInterest ? (
              <p id={modelErrorId} role="alert" className={errorClass}>
                {errors.modelInterest}
              </p>
            ) : null}
          </div>

          <div className="pt-1">
            <Button type="submit" variant="primary" disabled={status === "submitting"}>
              {status === "submitting" ? "Sending…" : "Send request"}
            </Button>
          </div>

          {statusMessage ? (
            <p
              id={statusId}
              role={status === "error" ? "alert" : "status"}
              className={
                status === "error"
                  ? "text-sm text-accent-bright"
                  : "text-sm text-muted"
              }
            >
              {statusMessage}
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
}
