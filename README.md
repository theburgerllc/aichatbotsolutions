# AI Video Chatbots — Powered by Tavus

- Next.js 15 + Tailwind + R3F 3D hero
- Tavus conversation API (`/api/tavus/start`) returns `conversation_url` → embedded in modal
- SendGrid contact API (`/api/contact`) for lead capture
- GA4 pageviews & events
- Pricing table + testimonials
- Exit-intent demo CTA
- Case studies section + dynamic routes
- Security headers via `vercel.json`

## Run

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Environment

Copy `.env.example` to `.env.local` and fill values. This archive includes your provided keys for local use.

## Deploy (Vercel)

Set the same env vars in Vercel (Preview & Production).


## HubSpot Property Bootstrap

Create the custom contact properties used by the Stripe→HubSpot sync:
```bash
HUBSPOT_ACCESS_TOKEN=pat-xxx npm run hs:bootstrap
```
Properties created:
- `stripe_customer_id` (text)
- `stripe_subscription_id` (text)
- `stripe_plan` (text)
- `stripe_status` (select)
- `stripe_current_period_end` (date)
- `last_payment_date` (date)
- `last_invoice_id` (text)
- `mrr` (number), `ltv` (number — optional)


## 2025-08 Upgrade

- **Next.js 15.5.2** + **React 19.1** (App Router)
- **Tailwind CSS 4.1** (configless). Custom brand colors defined via `@theme` in `src/app/globals.css`.
- **3D**: `three@0.179`, `@react-three/fiber@9.3`, `@react-three/drei@10.7`.
- **Stripe**: API version pinned to `2025-08-27.basil`, Customer Portal & webhooks included.
- **SendGrid**: `@sendgrid/mail@8.1`.
- **ESLint 9 (flat config)** + **Prettier 3.6**.
- **CSP**: Allowed `*.daily.co` for Tavus conversation iframes.
- **PostCSS**: Use `@tailwindcss/postcss` plugin.

> After pulling dependencies, run:  
> `npm run dev` (local) or deploy on Vercel (Node 20+).

### Tailwind v4 Custom Colors
Brand palette is provided via `@theme` tokens. Use classes like `bg-brand-600`, `text-brand-600`, etc.


## Scheduling
- Set `NEXT_PUBLIC_CALENDLY_URL` to your booking link (e.g., `https://calendly.com/yourteam/intro`).
- A **Book a strategy call** button is available on the homepage and pricing page, and inside the demo modal.


### Book Route
- `/book` shows the scheduler and captures UTM parameters into `localStorage:last_utm` for attribution.
- GA events: `book_page_open`, `scheduler_open` fire on entry/open.


## Calendly Webhook
- Configure Calendly to POST to `/api/calendly/webhook` for events like `invitee.created`, `invitee.canceled`.
- Set `CALENDLY_WEBHOOK_TOKEN` and use it as a Bearer token in the webhook for a simple auth layer.
- The endpoint sends:
  - Confirmation email to the invitee (if email present)
  - Notification email to `LEADS_NOTIFICATION_EMAIL` (or `SENDGRID_FROM_EMAIL`)
  - Optional HubSpot upsert (requires `HUBSPOT_ACCESS_TOKEN`)

## Thank You Route
- `/thank-you` fires `thank_you_view` (GA) and offers next steps.
- Contact form now redirects to `/thank-you` on success.
- UTM parameters collected on `/book` are forwarded with the contact payload.


## Edge Config Experiments
- Install `@vercel/edge-config` (already added).
- Create an **Edge Config** in Vercel and add key `exp_hero` with value `"a"` or `"b"`.
- Set the **Edge Config connection string** in the Vercel project (automatically injected).
- Middleware reads the key and sets the `exp_hero` cookie (30 days). Client code (`getVariant('hero')`) prefers `?hero=` → `localStorage` → `cookie`.


## Sticky Mini-CTA
- A floating CTA appears after ~30s to nudge users to **Demo** or **Book**.
- GA events: `sticky_cta_show`, `sticky_cta_demo`, `sticky_cta_book`.
