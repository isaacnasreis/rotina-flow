import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rotina Flow",
  description: "Organize seu dia com rapidez — abra, digite, faça.",
};

import { Toaster } from "@/components/ui/Toaster";
import { DynamicBackground } from "@/components/layout/DynamicBackground";

import { ThemeProvider } from "@/components/providers/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const stored = localStorage.getItem('rotina-settings');
                if (stored) {
                  const state = JSON.parse(stored).state;
                  if (state && state.theme) {
                    document.documentElement.setAttribute('data-theme', state.theme);
                  }
                } else {
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
        className="antialiased bg-bg-primary min-h-screen text-text-primary"
        suppressHydrationWarning
      >
        <ThemeProvider />
        <DynamicBackground />
        {children}
        <Toaster theme="dark" position="bottom-center" />
      </body>
    </html>
  );
}
