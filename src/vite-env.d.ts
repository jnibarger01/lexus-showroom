/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Optional Formspree-style HTTPS endpoint for lead submissions (public URL only). */
  readonly VITE_LEAD_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
