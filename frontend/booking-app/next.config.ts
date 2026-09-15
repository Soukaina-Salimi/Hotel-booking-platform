import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "8000" },
      { protocol: "https", hostname: "**.up.railway.app" },
      { protocol: "https", hostname: "**.vercel.app" },
      { protocol: "https", hostname: "images.unsplash.com" }, // ← AJOUTER

    ],
    dangerouslyAllowLocalIP: true,
  },
  async rewrites() {
    return [
      // Hotels & rooms → hotel-service (natural-surprise)
      {
        source: "/api/hotels",
        destination: "https://natural-surprise-production-a613.up.railway.app/api/hotels",
      },
      {
        source: "/api/hotels/:path*",
        destination: "https://natural-surprise-production-a613.up.railway.app/api/hotels/:path*",
      },
      {
        source: "/api/rooms",
        destination: "https://natural-surprise-production-a613.up.railway.app/api/rooms",
      },
      {
        source: "/api/rooms/:path*",
        destination: "https://natural-surprise-production-a613.up.railway.app/api/rooms/:path*",
      },
      // Auth → auth-service
      {
        source: "/api/auth",
        destination: "https://hotel-booking-platform-production.up.railway.app/api/auth",
      },
      {
        source: "/api/auth/:path*",
        destination: "https://hotel-booking-platform-production.up.railway.app/api/auth/:path*",
      },
      // Bookings → booking-service
      {
        source: "/api/bookings",
        destination: "https://booking-service-production-a38a.up.railway.app/api/bookings",
      },
      {
        source: "/api/bookings/:path*",
        destination: "https://booking-service-production-a38a.up.railway.app/api/bookings/:path*",
      },
      // Chat → chat-service
      {
        source: "/api/chat",
        destination: "https://chat-service-production-eeb1.up.railway.app/api/chat",
      },
      {
        source: "/api/chat/:path*",
        destination: "https://chat-service-production-eeb1.up.railway.app/api/chat/:path*",
      },
      // Storage (images) → hotel-service
      {
        source: "/storage/:path*",
        destination: "https://natural-surprise-production-a613.up.railway.app/storage/:path*",
      },
    ];
  },
};

export default nextConfig;