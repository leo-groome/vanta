import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'
import App from './App.tsx'

import { BrowserRouter } from 'react-router-dom'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'

posthog.init('phc_sdZv8T9Q2Bv6CsktmA5XELsWkWvKbhnyeHF75zwcBfKe', {
  api_host: 'https://us.i.posthog.com',
  person_profiles: 'identified_only',
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PostHogProvider client={posthog}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PostHogProvider>
  </StrictMode>,
)
