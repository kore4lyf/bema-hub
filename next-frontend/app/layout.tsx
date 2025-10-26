import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "@/components/custom/SessionProvider";
import ReduxProvider from "@/components/providers/ReduxProvider";
import { Toaster } from "@/components/ui/toaster";

const outfit = Outfit({
  variable: "--outfit-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bema Hub - Connect, Create, Celebrate",
  description: "Empower Artists and Fans with Echo Loop",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.className} antialiased`} suppressHydrationWarning>
        <ReduxProvider>
          <SessionProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster />
            </ThemeProvider>
          </SessionProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
