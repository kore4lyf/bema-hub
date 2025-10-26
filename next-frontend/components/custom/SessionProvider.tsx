"use client";

import { ReactNode } from "react";

// This is now a pass-through component since we're using Redux for auth
export function SessionProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
