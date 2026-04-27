import { Nav } from '@/components/landing/nav'
import { Hero } from '@/components/landing/hero/hero'
import { FeaturesGrid } from '@/components/landing/features-grid'
import { StepsGrid } from '@/components/landing/steps-grid'
import { XmlSection } from '@/components/landing/xml-section'
import { PrivacySection } from '@/components/landing/privacy'
import { BrokersSection } from '@/components/landing/brokers'
import { CtaSection } from '@/components/landing/cta'
import { Footer } from '@/components/landing/footer'

export default async function Page() {
  return (
    <div className="min-h-screen bg-fis-bg text-fis-text font-sans">
      <Nav />
      <main>
        <Hero />
        <FeaturesGrid />
        <StepsGrid />
        <XmlSection />
        <PrivacySection />
        <BrokersSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  )
}
