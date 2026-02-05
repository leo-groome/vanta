/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_EMAILJS_PUBLIC_KEY?: string
  readonly VITE_EMAILJS_SERVICE_ID?: string
  readonly VITE_EMAILJS_TEMPLATE_ID_LEAD?: string
  readonly VITE_EMAILJS_TEMPLATE_ID_AUTOREPLY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
