import { Accordion } from '../components/ui/Accordion'
import { ContactButton } from '../components/ui/ContactButton'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { faq } from '../config/content'

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-titulo" className="bg-white section-y">
      <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            id="faq-titulo"
            eyebrow={faq.eyebrow}
            title={faq.title}
            description="Não encontrou o que procurava? Nossa equipe explica tudo no atendimento."
          />
          <ContactButton variant="dark" className="mt-8" context={{ origin: 'faq' }} label="Tirar uma dúvida pelo WhatsApp" />
        </Reveal>
        <Reveal delay={0.08}>
          <Accordion items={faq.items} />
        </Reveal>
      </div>
    </section>
  )
}
