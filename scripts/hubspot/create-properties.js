
/**
 * Create custom HubSpot contact properties for Stripe mapping.
 * Usage:
 *   HUBSPOT_ACCESS_TOKEN=pat-xxx node scripts/hubspot/create-properties.js
 */
const token = process.env.HUBSPOT_ACCESS_TOKEN;
if (!token) {
  console.error("HUBSPOT_ACCESS_TOKEN is required");
  process.exit(1);
}

const API = "https://api.hubapi.com/crm/v3/properties/contacts";
const headers = {
  "Authorization": `Bearer ${token}`,
  "Content-Type": "application/json"
};

const PROPS = [
  // Text IDs
  { name: "stripe_customer_id", label: "Stripe Customer ID", type: "string", fieldType: "text", groupName: "contactinformation" },
  { name: "stripe_subscription_id", label: "Stripe Subscription ID", type: "string", fieldType: "text", groupName: "contactinformation" },
  { name: "stripe_plan", label: "Stripe Price ID (Plan)", type: "string", fieldType: "text", groupName: "contactinformation" },
  { name: "last_invoice_id", label: "Last Stripe Invoice ID", type: "string", fieldType: "text", groupName: "contactinformation" },
  // Enums
  {
    name: "stripe_status",
    label: "Stripe Subscription Status",
    type: "enumeration",
    fieldType: "select",
    groupName: "contactinformation",
    options: [
      "active","trialing","past_due","canceled","unpaid","incomplete","incomplete_expired","paused"
    ].map(v => ({ label: v, value: v }))
  },
  // Dates (ms epoch)
  { name: "stripe_current_period_end", label: "Stripe Current Period End", type: "date", fieldType: "date", groupName: "contactinformation" },
  { name: "last_payment_date", label: "Last Payment Date", type: "date", fieldType: "date", groupName: "contactinformation" },
  // Numbers
  { name: "mrr", label: "Monthly Recurring Revenue (USD)", type: "number", fieldType: "number", groupName: "contactinformation", description: "Calculated from Stripe price (amount/interval)" },
  { name: "ltv", label: "Lifetime Value (USD)", type: "number", fieldType: "number", groupName: "contactinformation", description: "Optional; update via your own logic" }
];

async function ensure(prop) {
  // Check if exists
  const res = await fetch(`${API}/${encodeURIComponent(prop.name)}`, { headers });
  if (res.ok) {
    console.log(`✓ exists: ${prop.name}`);
    return;
  }
  // Create
  const create = await fetch(API, { method: "POST", headers, body: JSON.stringify(prop) });
  if (!create.ok) {
    const t = await create.text();
    console.error(`✗ failed: ${prop.name}\n${t}`);
    process.exitCode = 1;
  } else {
    console.log(`+ created: ${prop.name}`);
  }
}

(async () => {
  for (const p of PROPS) {
    await ensure(p);
  }
  console.log("Done.");
})();
