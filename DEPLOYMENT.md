# Deployment Guide - AI Video Chatbot Solutions

## 🚀 Quick Start

```bash
npm install
npm run build
npm start
```

## ✅ Production Verification Summary

- **TypeScript**: ✅ Zero errors (verified with `npx tsc --noEmit`)
- **ESLint**: ✅ Clean (verified with `npm run lint`)
- **Security Audit**: ✅ 0 vulnerabilities (verified with `npm audit`)
- **Build Status**: ✅ Successful
- **Node Version**: Requires >= 18.18.0
- **Package Manager**: npm 10.8.2

## 🔧 Fixed Issues

1. **Stripe Webhook Route**: Fixed spread operator syntax error (line 29)
2. **Success Page**: Fixed malformed imports and duplicate 'use client' directives
3. **Middleware**: Excludes webhook routes from processing to preserve raw body
4. **TypeScript Config**: Verified strict mode with Next.js 15 / React 19 compatibility

## 🛡️ Security & CSP

### Content Security Policy (next.config.mjs)
- ✅ Tavus/Daily.co domains for video chat
- ✅ Stripe domains for payments
- ✅ Google Analytics domains
- ✅ HubSpot domains for CRM
- ✅ Calendly domains for scheduling
- ✅ Enforced on all routes except static assets

### Middleware Safety
- ✅ Edge runtime compatible (no Node.js APIs)
- ✅ Excludes `/api/stripe/webhook` and `/api/calendly/webhook`
- ✅ Error handling with fallback to `NextResponse.next()`
- ✅ UTM parameter capture with secure cookies

## 🎨 Frontend Stack

- **Next.js**: 15.5.2 (App Router)
- **React**: 19.1.0
- **Tailwind CSS**: v4.1.12 with `@theme` tokens
- **React Three Fiber**: 9.3.0 (React 19 compatible)
- **Three.js**: 0.179.0
- **Drei**: 10.7.4

## 📦 Required Environment Variables

```env
# Core App
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Tavus API (AI Video Chatbot)
TAVUS_API_KEY=tvs_xxx
TAVUS_PERSONA_ID=prs_xxx
TAVUS_REPLICA_ID=rpl_xxx

# Stripe Payments
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PRICE_STARTER=price_xxx
STRIPE_PRICE_GROWTH=price_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# SendGrid Email
SENDGRID_API_KEY=SG.xxx
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
```

## 🚢 Vercel Deployment

### 1. Environment Setup
```bash
vercel env add NEXT_PUBLIC_APP_URL production
vercel env add TAVUS_API_KEY production
vercel env add TAVUS_PERSONA_ID production
vercel env add TAVUS_REPLICA_ID production
vercel env add STRIPE_SECRET_KEY production
vercel env add STRIPE_WEBHOOK_SECRET production
vercel env add SENDGRID_API_KEY production
```

### 2. Build Settings
- Framework: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
- Node Version: 20.x

### 3. Edge Config (for A/B testing)
```json
{
  "exp_hero": "a"  // or "b" for variant
}
```

### 4. Webhook Configuration

#### Stripe Webhook
- URL: `https://yourdomain.com/api/stripe/webhook`
- Events: `checkout.session.completed`, `invoice.paid`, `customer.subscription.*`

#### Calendly Webhook (Optional)
- URL: `https://yourdomain.com/api/calendly/webhook`
- Add Bearer token to `CALENDLY_WEBHOOK_TOKEN`

## 📊 API Routes Summary

| Route | Runtime | Purpose | Auth |
|-------|---------|---------|------|
| `/api/tavus/start` | Edge | Start AI video chat | Public |
| `/api/stripe/checkout` | Node.js | Create checkout session | Public |
| `/api/stripe/webhook` | Node.js | Handle Stripe events | Webhook signature |
| `/api/stripe/portal` | Node.js | Customer portal | Session-based |
| `/api/contact` | Edge | Lead capture | Public |
| `/api/calendly/webhook` | Edge | Meeting notifications | Bearer token |

## 🧪 Testing Checklist

- [ ] Homepage loads with 3D scene
- [ ] Demo modal opens and closes properly
- [ ] Tavus conversation starts (check console)
- [ ] Contact form submits successfully
- [ ] Pricing page CTAs work
- [ ] Stripe checkout flow (test mode)
- [ ] Success page displays after purchase
- [ ] CSP headers present (check DevTools Network)
- [ ] UTM parameters captured in cookies
- [ ] GA4 events fire correctly

## 📈 Monitoring

- Google Analytics: Events tracked for conversions
- Stripe Dashboard: Monitor subscriptions and payments
- Vercel Analytics: Performance and Web Vitals
- Error Tracking: Check Vercel Functions logs

## 🔄 Rollback Plan

If issues arise:
1. Revert to previous deployment in Vercel
2. Check environment variables
3. Review Function logs for errors
4. Verify webhook endpoints are accessible

## 📝 Next Steps

1. Set up monitoring alerts
2. Configure backup email provider
3. Add rate limiting to API routes
4. Implement proper error tracking (Sentry)
5. Add E2E tests with Playwright
6. Set up staging environment

---

**Last Updated**: August 31, 2025
**Version**: 1.1.0
