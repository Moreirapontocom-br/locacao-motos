import { useMemo, useState } from 'react'
import { ModalityChoiceContext } from '../components/contact/modalityContext'
import { usePageMeta } from '../lib/seo'
import { Editorial } from '../sections/Editorial'
import { Faq } from '../sections/Faq'
import { FeaturedMotorcycles } from '../sections/FeaturedMotorcycles'
import { FinalCta } from '../sections/FinalCta'
import { Hero } from '../sections/Hero'
import { HowItWorks } from '../sections/HowItWorks'
import { MotoFinder } from '../sections/MotoFinder'
import { RentalModes } from '../sections/RentalModes'

export function HomePage() {
  usePageMeta()
  const [modality, setModality] = useState<string | undefined>()
  const choice = useMemo(() => ({ modality, setModality }), [modality])

  return (
    <ModalityChoiceContext value={choice}>
      {/* Fase 14: ritmo escuro/claro alternado, com um foco visual por seção. */}
      <Hero />
      <FeaturedMotorcycles />
      <Editorial />
      <MotoFinder />
      <RentalModes />
      <HowItWorks />
      <Faq />
      <FinalCta />
    </ModalityChoiceContext>
  )
}
