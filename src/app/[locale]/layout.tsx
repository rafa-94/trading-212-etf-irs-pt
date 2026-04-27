import { Plus_Jakarta_Sans, Fraunces, JetBrains_Mono } from "next/font/google"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, setRequestLocale } from "next-intl/server"
import { ThemeProvider } from "@/components/theme-provider"
import { routing } from "@/i18n/routing"
import { cn } from "@/lib/utils";
import type { Metadata } from "next"


import "../globals.css"

const fontSans = Plus_Jakarta_Sans({
  subsets:['latin'],
  variable:'--font-sans',
  fallback: ['sans-serif']
})

const fontSerif = Fraunces({
  subsets:['latin'],
  variable:'--font-serif',
  fallback: ["Georgia", "serif"]
})

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})


export const metadata: Metadata = {
  title: "Fiscus — Calculadora IRS para Investidores",
  description:
    "Calcula as mais-valias de ETFs e ações com FIFO automático. Gera o Modelo 3 para o Portal das Finanças.",
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {

  const { locale } = await params
  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, fontSans.variable, fontSerif.variable, "scroll-smooth")}
    >
      <body className="bg-background text-foreground">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>{children}</ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
