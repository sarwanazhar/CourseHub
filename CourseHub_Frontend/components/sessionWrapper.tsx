// components/Providers.jsx

"use client";

import { SessionProvider } from "next-auth/react";

// This is a client-only component that wraps its children in a SessionProvider.
export default function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
