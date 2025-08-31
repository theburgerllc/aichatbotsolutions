
import "@/styles/globals.css";
import type { Metadata } from "next";
import Script from "next/script";
import { GA_MEASUREMENT_ID } from "@/lib/analytics";
import GAProvider from '@/app/providers/ga-provider';
const HS_PORTAL = process.env.NEXT_PUBLIC_HS_PORTAL_ID;

export const metadata: Metadata = {
  title: "AI Video Chatbots — Powered by Tavus",
  description: "Enterprise AI video chatbots (digital humans) embedded in your site. Face-to-face conversations that convert.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  openGraph: {
    title: "AI Video Chatbots — Powered by Tavus",
    description: "Face-to-face AI that qualifies, answers, and books meetings — 24/7.",
    type: "website"
  },
  twitter: { card: "summary_large_image", title: "AI Video Chatbots", description: "Tavus-powered digital humans." }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://tavusapi.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
      
        {HS_PORTAL ? (
          <script
            defer
            id="hs-loader"
            src={`https://js.hs-scripts.com/${HS_PORTAL}.js`}
          />
        ) : null}
      
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
          "@context":"https://schema.org",
          "@type":"Organization",
          "name":"AI Chatbot Solutions",
          "url": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
          "sameAs": []
        })}} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
          "@context":"https://schema.org",
          "@type":"Product",
          "name":"Tavus-powered AI Video Chatbot",
          "description":"Digital human that qualifies, answers objections, and books meetings on your site.",
          "brand": {"@type":"Brand","name":"Tavus"},
          "offers": {
            "@type":"AggregateOffer",
            "priceCurrency":"USD",
            "offers":[
              {"@type":"Offer","price":199,"priceCurrency":"USD"},
              {"@type":"Offer","price":699,"priceCurrency":"USD"}
            ]
          }
        })}} />
      </head>
      <body className="min-h-screen">
        {GA_MEASUREMENT_ID ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
            <Script id="ga4" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments)}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}', { anonymize_ip: true });
              `}
            </Script>
          </>
        ) : null}
        <GAProvider />

        <header className="border-b border-zinc-800">
          <div className="container flex items-center justify-between h-16">
            <a href="/" className="font-semibold">AI Chatbot Solutions</a>
            <nav className="hidden md:flex gap-6 text-sm text-zinc-300">
              <a href="#features" className="hover:text-white">Features</a>
              <a href="/pricing" className="hover:text-white">Pricing</a>
              <a href="#faq" className="hover:text-white">FAQ</a>
              <a href="#contact" className="hover:text-white">Contact</a>
            <a href="/book" className="hover:text-white">Book</a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t border-zinc-800 mt-16">
          <div className="container py-10 text-zinc-400 text-sm">
            <div>© {new Date().getFullYear()} AI Chatbot Solutions — Conversational Video Engine</div>
          </div>
        </footer>
      </body>
    </html>
  );
}
