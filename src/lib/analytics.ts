
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";

const isGA = typeof window !== "undefined" && GA_MEASUREMENT_ID;

export function gaPageview(url: string) {
  if (!isGA) return;
  // @ts-ignore
  window.gtag?.("config", GA_MEASUREMENT_ID, { page_path: url });
}

type GAEvent = {
  action: string;
  category?: string;
  label?: string;
  value?: number;
  nonInteraction?: boolean;
  params?: Record<string, unknown>;
};

export function gaEvent(e: GAEvent) {
  if (!isGA) return;
  // @ts-ignore
  window.gtag?.("event", e.action, {
    event_category: e.category,
    event_label: e.label,
    value: e.value,
    non_interaction: e.nonInteraction,
    ...e.params,
  });
}

export const EV = {
  TavusDemoClick: "tavus_demo_click",
  TavusDemoStart: "tavus_demo_start",
  TavusDemoError: "tavus_demo_error",
  TavusDemoClose: "tavus_demo_close",
  LeadSubmitSuccess: "lead_submit_success",
  LeadSubmitError: "lead_submit_error",
  PricingCtaClick: "pricing_cta_click",
  Scroll75: "scroll_75",
} as const;
