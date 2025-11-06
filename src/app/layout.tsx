import type { Metadata } from "next";
import "@/styles/globals.css";
import { I18nProvider } from "@/components/providers/i18n-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { FinanceStoreProvider } from "@/components/providers/finance-store-provider";
import { Navbar } from "@/components/navbar";
import { Space_Grotesk, Inter } from "next/font/google";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display"
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body"
});

export const metadata: Metadata = {
  title: "Finora | Personal Finance OS",
  description:
    "Track spending, plan budgets, manage savings goals, and stay ahead of bills in every currency and language."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${display.variable} ${body.variable}`}>
      <body className="min-h-screen bg-slate-950 font-body text-slate-100 antialiased">
        <I18nProvider>
          <ThemeProvider>
            <QueryProvider>
              <FinanceStoreProvider>
                <div className="flex min-h-screen flex-col">
                  <Navbar />
                  <main className="flex-1">{children}</main>
                </div>
              </FinanceStoreProvider>
            </QueryProvider>
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
