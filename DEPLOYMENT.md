# Production Deployment Checklist for Vercel

## 🚀 Quick Deploy Commands

```bash
# Install Vercel CLI
npm i -g vercel@latest

# Deploy to Vercel
vercel --prod
```

## ✅ Pre-Deployment Checklist

### 1. Code Quality Validation
- [x] TypeScript compilation passes: `npx tsc --noEmit`
- [x] ESLint configured for v9: `npx eslint src/`
- [x] Dependencies installed: `npm ci`
- [x] Package versions verified (Next 15.5.2, React 19.1.0, Tailwind v4)

### 2. Security Headers Configured
- [x] CSP headers in `next.config.mjs` include all required domains
- [x] Duplicate CSP removed from `vercel.json`
- [x] HSTS, X-Frame-Options, etc. configured

### 3. API Routes Hardened
- [x] `/api/tavus/start`: Retry logic, timeout handling, error redaction
- [x] `/api/stripe/*`: Webhook signature verification, safe env handling
- [x] `/api/contact`: Input sanitization, UTM tracking, dual-write to HubSpot
- [x] `/api/calendly/webhook`: Bearer token verification, graceful errors

## 📋 Environment Variables Setup

Add these to Vercel Dashboard → Settings → Environment Variables:

```bash
# Tavus API
vercel env add TAVUS_API_KEY production
vercel env add TAVUS_PERSONA_ID production
vercel env add TAVUS_REPLICA_ID production

# Stripe
vercel env add STRIPE_SECRET_KEY production
vercel env add STRIPE_PRICE_STARTER production
vercel env add STRIPE_PRICE_GROWTH production
vercel env add STRIPE_WEBHOOK_SECRET production
vercel env add STRIPE_PROMO_STARTER production
vercel env add STRIPE_PROMO_GROWTH production
vercel env add STRIPE_PORTAL_RETURN_URL production

# SendGrid
vercel env add SENDGRID_API_KEY production
vercel env add SENDGRID_FROM_EMAIL production
vercel env add SENDGRID_EU production # Set to "1" for EU region

# HubSpot (Optional)
vercel env add NEXT_PUBLIC_HS_PORTAL_ID production
vercel env add HUBSPOT_PORTAL_ID production
vercel env add HUBSPOT_FORM_ID production
vercel env add HUBSPOT_ACCESS_TOKEN production

# Calendly
vercel env add NEXT_PUBLIC_CALENDLY_URL production
vercel env add CALENDLY_WEBHOOK_TOKEN production

# Notifications
vercel env add LEADS_NOTIFICATION_EMAIL production

# Analytics
vercel env add NEXT_PUBLIC_GA_MEASUREMENT_ID production

# App URL
vercel env add NEXT_PUBLIC_APP_URL production
```

## 🔧 Post-Deployment Configuration

### 1. Edge Config Setup
```bash
# Create Edge Config in Vercel Dashboard
# Add experiment key:
{
  "exp_hero": "a"  // or "b" for variant B
}
```

### 2. Stripe Webhook Configuration
1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://yourdomain.com/api/stripe/webhook`
3. Select events:
   - `checkout.session.completed`
   - `invoice.paid`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy signing secret to `STRIPE_WEBHOOK_SECRET`

### 3. Calendly Webhook Setup
1. Go to Calendly → Integrations → Webhooks
2. Add webhook URL: `https://yourdomain.com/api/calendly/webhook`
3. Subscribe to:
   - `invitee.created`
   - `invitee.canceled`
4. Set authentication token in `CALENDLY_WEBHOOK_TOKEN`

## 🎯 Production Launch Steps

1. **Deploy to Preview**
   ```bash
   vercel
   ```

2. **Test Critical Paths**
   - [ ] Homepage loads with 3D scene
   - [ ] Demo modal opens and starts Tavus conversation
   - [ ] Pricing page CTAs launch Stripe Checkout
   - [ ] Contact form sends emails
   - [ ] Book page loads Calendly scheduler
   - [ ] UTM parameters captured in cookies
   - [ ] A/B test variant cookie set

3. **Deploy to Production**
   ```bash
   vercel --prod
   ```

4. **Verify Production**
   - [ ] Check CSP headers: `curl -I https://yourdomain.com`
   - [ ] Test Stripe webhooks with Stripe CLI
   - [ ] Verify GA4 events firing
   - [ ] Check robots.txt and sitemap.xml
   - [ ] Test 404 and error pages

## 📊 Performance Targets

- Lighthouse Performance: >90
- Lighthouse SEO: >90
- Lighthouse Best Practices: >90
- Lighthouse Accessibility: >90

## 🔒 Security Checklist

- [x] All API keys in environment variables
- [x] CSP headers configured correctly
- [x] Input validation on all forms
- [x] Webhook signatures verified
- [x] Error messages sanitized
- [x] Rate limiting via Vercel (automatic)
- [x] HTTPS enforced (automatic on Vercel)

---

**Last Updated:** 2025-08-31
**Version:** 1.1.0
**Status:** Production Ready ✅
