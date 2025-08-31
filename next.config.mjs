/** @type {import('next').NextConfig} */
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://assets.calendly.com https://www.google-analytics.com https://region1.google-analytics.com https://js.stripe.com https://*.hs-scripts.com https://*.hsforms.net https://*.hscollectedforms.net",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data: https:",
      "connect-src 'self' https://api.stripe.com https://tavusapi.com https://*.daily.co https://www.google-analytics.com https://region1.google-analytics.com https://*.analytics.google.com https://api.hsforms.com https://forms.hubspot.com https://api.hubapi.com https://*.hscollectedforms.net https://*.hsforms.net",
      "frame-src https://js.stripe.com https://hooks.stripe.com https://*.daily.co https://*.tavus.io https://calendly.com https://*.calendly.com",
      "media-src 'self' https: blob:",
      "worker-src 'self' blob:",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self' https://api.stripe.com https://hooks.stripe.com https://forms.hubspot.com https://api.hsforms.com"
    ].join('; ')
  }
];

const nextConfig = {
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  }
};

export default nextConfig;
