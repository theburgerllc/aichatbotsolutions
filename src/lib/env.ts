/**
 * Centralized environment configuration with validation
 * All environment variables should be accessed through this module
 */

type EnvConfig = {
  // Public variables (exposed to client)
  public: {
    appUrl: string;
    gaId: string;
    hsPortalId: string;
    calendlyUrl: string;
  };
  // Server-only variables
  server: {
    // Tavus
    tavusApiKey: string;
    tavusPersonaId: string;
    tavusReplicaId: string;
    // Stripe
    stripeSecretKey: string;
    stripePriceStarter: string;
    stripePriceGrowth: string;
    stripeWebhookSecret: string;
    stripePromoStarter: string;
    stripePromoGrowth: string;
    stripePortalReturnUrl: string;
    // SendGrid
    sendgridApiKey: string;
    sendgridFromEmail: string;
    sendgridEu: boolean;
    // HubSpot
    hubspotPortalId: string;
    hubspotFormId: string;
    hubspotAccessToken: string;
    // Calendly
    calendlyWebhookToken: string;
    // Notifications
    leadsNotificationEmail: string;
    // Testing
    e2eMode: boolean;
  };
};

function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  if (value === undefined) {
    if (typeof window === 'undefined') {
      // Server-side: log warning but don't crash during build
      console.warn(`Missing environment variable: ${key}`);
    }
    return '';
  }
  return value;
}

function requireEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Required environment variable is missing: ${key}`);
  }
  return value;
}

// Validate critical environment variables at module load time
// Non-critical variables use getEnvVar with defaults
export const env: EnvConfig = {
  public: {
    appUrl: getEnvVar('NEXT_PUBLIC_APP_URL', 'http://localhost:3000'),
    gaId: getEnvVar('NEXT_PUBLIC_GA_MEASUREMENT_ID', ''),
    hsPortalId: getEnvVar('NEXT_PUBLIC_HS_PORTAL_ID', ''),
    calendlyUrl: getEnvVar('NEXT_PUBLIC_CALENDLY_URL', ''),
  },
  server: {
    // Tavus - required for demo functionality
    tavusApiKey: getEnvVar('TAVUS_API_KEY', ''),
    tavusPersonaId: getEnvVar('TAVUS_PERSONA_ID', ''),
    tavusReplicaId: getEnvVar('TAVUS_REPLICA_ID', ''),
    // Stripe - required for payments
    stripeSecretKey: getEnvVar('STRIPE_SECRET_KEY', ''),
    stripePriceStarter: getEnvVar('STRIPE_PRICE_STARTER', ''),
    stripePriceGrowth: getEnvVar('STRIPE_PRICE_GROWTH', ''),
    stripeWebhookSecret: getEnvVar('STRIPE_WEBHOOK_SECRET', ''),
    stripePromoStarter: getEnvVar('STRIPE_PROMO_STARTER', ''),
    stripePromoGrowth: getEnvVar('STRIPE_PROMO_GROWTH', ''),
    stripePortalReturnUrl: getEnvVar('STRIPE_PORTAL_RETURN_URL', ''),
    // SendGrid - required for email
    sendgridApiKey: getEnvVar('SENDGRID_API_KEY', ''),
    sendgridFromEmail: getEnvVar('SENDGRID_FROM_EMAIL', ''),
    sendgridEu: getEnvVar('SENDGRID_EU', '') === '1',
    // HubSpot - optional CRM integration
    hubspotPortalId: getEnvVar('HUBSPOT_PORTAL_ID', ''),
    hubspotFormId: getEnvVar('HUBSPOT_FORM_ID', ''),
    hubspotAccessToken: getEnvVar('HUBSPOT_ACCESS_TOKEN', ''),
    // Calendly - optional scheduling
    calendlyWebhookToken: getEnvVar('CALENDLY_WEBHOOK_TOKEN', ''),
    // Notifications
    leadsNotificationEmail: getEnvVar('LEADS_NOTIFICATION_EMAIL', ''),
    // Testing
    e2eMode: getEnvVar('E2E_MODE', '') === '1',
  },
};

// Helper functions for checking if features are enabled
export const features = {
  isTavusEnabled: () => !!(env.server.tavusApiKey && env.server.tavusPersonaId && env.server.tavusReplicaId),
  isStripeEnabled: () => !!(env.server.stripeSecretKey && env.server.stripeWebhookSecret),
  isSendGridEnabled: () => !!(env.server.sendgridApiKey && env.server.sendgridFromEmail),
  isHubSpotFormsEnabled: () => !!(env.server.hubspotPortalId && env.server.hubspotFormId),
  isHubSpotCrmEnabled: () => !!env.server.hubspotAccessToken,
  isCalendlyEnabled: () => !!env.public.calendlyUrl,
  isAnalyticsEnabled: () => !!env.public.gaId,
};

// Type-safe environment variable access
export default env;
