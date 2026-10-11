import { usePageMeta } from '../lib/seo'
import { About } from '../sections/About'
import { Acquisition } from '../sections/Acquisition'
import { Faq } from '../sections/Faq'
import { FeaturedMotorcycles } from '../sections/FeaturedMotorcycles'
import { FinalCta } from '../sections/FinalCta'
import { Hero } from '../sections/Hero'
import { HowItWorks } from '../sections/HowItWorks'

export function HomePage() {
  usePageMeta()
  return (
    <>
      <Hero />
      <FeaturedMotorcycles />
      <HowItWorks />
      <Acquisition />
      <About />
      <Faq />
      <FinalCta />
    </>
  )
}
