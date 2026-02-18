import type { NextConfig } from "next";

const securityHeaders = [
  {
    // Prevents XSS — injected scripts from external sources won't run
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // unsafe-inline/eval needed for Next.js
      "style-src 'self' 'unsafe-inline'",                // unsafe-inline needed for Tailwind
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data:",
      "connect-src 'self'",
    ].join("; "),
  },
  {
    // Prevents clickjacking — stops page being embedded in an iframe
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    // Prevents MIME sniffing — browser won't guess file types
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    // Limits referrer info sent to external sites — prevents URL leakage
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    // Disables browser features that app doesn't need
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
