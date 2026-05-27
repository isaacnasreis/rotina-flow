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
    <html lang="pt-BR" suppressHydrationWarning data-theme="dark">
      <head>
        <meta name="theme-color" content="#0a0a0f" />
        <meta name="color-scheme" content="dark light" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const stored = localStorage.getItem('rotina-settings');
                if (stored) {
                  const state = JSON.parse(stored).state;
                  if (state && state.theme) {
                    document.documentElement.setAttribute('data-theme', state.theme);
                    const colors = { dark: '#0a0a0f', light: '#f0f4f8', oled: '#000000' };
                    const meta = document.querySelector('meta[name="theme-color"]');
                    if (meta) meta.content = colors[state.theme] || '#0a0a0f';
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
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
