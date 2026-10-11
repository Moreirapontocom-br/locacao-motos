import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react'
import { AnimatePresence, motion, type PanInfo } from 'motion/react'
import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import type { ImageAsset } from '../../types'
import { DemoBadge } from '../ui/DemoNotice'
import { SmartImage } from '../ui/SmartImage'

/** Deslize mínimo (px) ou velocidade (px/s) para trocar de foto no toque. */
const SWIPE_OFFSET = 60
const SWIPE_VELOCITY = 400

const slide = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 48 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir * -48 }),
}

interface StageProps {
  images: ImageAsset[]
  index: number
  direction: number
  onStep: (step: number) => void
  sizes: string
  fit: 'cover' | 'contain'
  onTap?: () => void
}

/** Área da foto atual: transição lateral suave e troca por deslize (touch e mouse). */
function Stage({ images, index, direction, onStep, sizes, fit, onTap }: StageProps) {
  const swipeable = images.length > 1

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_OFFSET || info.velocity.x < -SWIPE_VELOCITY) onStep(1)
    else if (info.offset.x > SWIPE_OFFSET || info.velocity.x > SWIPE_VELOCITY) onStep(-1)
  }

  return (
    <AnimatePresence initial={false} custom={direction}>
      <motion.div
        key={index}
        custom={direction}
        variants={slide}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        drag={swipeable ? 'x' : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.18}
        onDragEnd={onDragEnd}
        onTap={onTap}
        className={`absolute inset-0 touch-pan-y ${onTap ? 'cursor-zoom-in' : ''}`}
      >
        <SmartImage
          image={images[index]}
          priority={index === 0}
          sizes={sizes}
          className={`size-full ${fit === 'contain' ? 'bg-transparent!' : ''}`}
          imgClassName={`pointer-events-none select-none ${fit === 'contain' ? 'object-contain!' : ''}`}
          tone={fit === 'contain' ? 'dark' : 'light'}
        />
      </motion.div>
    </AnimatePresence>
  )
}

function NavButton({ dir, onClick, dark = false }: { dir: -1 | 1; onClick: () => void; dark?: boolean }) {
  const Icon = dir < 0 ? ChevronLeft : ChevronRight
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir < 0 ? 'Foto anterior' : 'Próxima foto'}
      className={`grid size-11 place-items-center rounded-full backdrop-blur transition-[background-color,transform] duration-200 active:scale-95 ${
        dark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-white/90 text-graphite shadow-sm hover:bg-white'
      }`}
    >
      <Icon aria-hidden className="size-5" />
    </button>
  )
}

/** Miniaturas: faixa rolável no celular, que acompanha a foto selecionada. */
function Thumbnails({
  images,
  index,
  onSelect,
  dark = false,
}: {
  images: ImageAsset[]
  index: number
  onSelect: (i: number) => void
  dark?: boolean
}) {
  const stripRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const strip = stripRef.current
    const thumb = strip?.children[index] as HTMLElement | undefined
    if (!strip || !thumb) return
    const left = thumb.offsetLeft - (strip.clientWidth - thumb.clientWidth) / 2
    strip.scrollTo?.({ left, behavior: 'smooth' })
  }, [index])

  return (
    <ul ref={stripRef} className="flex snap-x gap-2.5 overflow-x-auto pb-1 [scrollbar-width:none] sm:gap-3">
      {images.map((img, i) => {
        const active = i === index
        return (
          <li key={img.src + i} className="w-[22%] shrink-0 snap-start sm:w-[18%] lg:w-[calc((100%-3*0.75rem)/4)]">
            <button
              type="button"
              onClick={() => onSelect(i)}
              aria-label={`Ver foto ${i + 1} de ${images.length}`}
              aria-current={active ? 'true' : undefined}
              className={`relative block w-full overflow-hidden rounded-xl transition-opacity duration-300 ${
                active ? 'opacity-100' : 'opacity-55 hover:opacity-100'
              }`}
            >
              <SmartImage image={{ ...img, alt: '' }} sizes="160px" className="aspect-[4/3]" tone={dark ? 'dark' : 'light'} />
              <span
                aria-hidden
                className={`pointer-events-none absolute inset-0 rounded-xl ring-2 ring-inset transition-colors duration-300 ${
                  active ? 'ring-accent' : 'ring-transparent'
                }`}
              />
            </button>
          </li>
        )
      })}
    </ul>
  )
}

/** Navegação compartilhada entre a galeria e a visualização ampliada. */
function useGalleryNav(total: number) {
  const [state, setState] = useState({ index: 0, direction: 0 })
  const step = (dir: number) =>
    setState((s) => ({ index: (s.index + dir + total) % total, direction: dir }))
  const select = (i: number) => setState((s) => ({ index: i, direction: i >= s.index ? 1 : -1 }))
  const onKeyDown = (e: KeyboardEvent) => {
    if (total < 2) return
    if (e.key === 'ArrowRight') step(1)
    if (e.key === 'ArrowLeft') step(-1)
  }
  return { ...state, step, select, onKeyDown }
}

interface LightboxProps {
  open: boolean
  onClose: () => void
  images: ImageAsset[]
  title: string
  nav: ReturnType<typeof useGalleryNav>
}

/** Foto ampliada em tela cheia (diálogo nativo: Esc fecha e o foco volta à galeria). */
function Lightbox({ open, onClose, images, title, nav }: LightboxProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const total = images.length
  const current = images[nav.index]

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal?.()
    if (!open && dialog.open) dialog.close()
    // Impede a página de rolar por trás da foto ampliada.
    document.documentElement.style.overflow = open ? 'hidden' : ''
    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-label={`Fotos ampliadas: ${title}`}
      onClose={onClose}
      // As setas do teclado chegam ao `onKeyDown` da galeria (o diálogo fica dentro dela).
      className="m-0 h-dvh max-h-none w-screen max-w-none bg-graphite/[0.97] p-0 text-white backdrop:bg-graphite/80 backdrop:backdrop-blur-sm"
    >
      {open && (
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between gap-4 px-4 pt-4 sm:px-6 sm:pt-5">
            <div className="flex min-w-0 items-center gap-3">
              <p className="truncate font-display text-sm font-semibold sm:text-base">{title}</p>
              {current.illustrative && <DemoBadge label="Imagem demonstrativa" className="shrink-0 bg-white/15!" always />}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar fotos ampliadas"
              className="grid size-11 shrink-0 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
            >
              <X aria-hidden className="size-5" />
            </button>
          </div>

          <div className="relative min-h-0 flex-1 overflow-hidden">
            <div className="absolute inset-4 sm:inset-x-20 sm:inset-y-6">
              <Stage
                images={images}
                index={nav.index}
                direction={nav.direction}
                onStep={nav.step}
                sizes="100vw"
                fit="contain"
              />
            </div>
            {total > 1 && (
              <div className="pointer-events-none absolute inset-x-3 top-1/2 hidden -translate-y-1/2 justify-between sm:flex sm:inset-x-5 [&>*]:pointer-events-auto">
                <NavButton dir={-1} onClick={() => nav.step(-1)} dark />
                <NavButton dir={1} onClick={() => nav.step(1)} dark />
              </div>
            )}
          </div>

          {total > 1 && (
            <div className="mx-auto w-full max-w-xl px-4 pb-5 sm:pb-6">
              <div className="mb-3 flex items-center justify-between gap-3 sm:justify-center">
                <span className="sm:hidden">
                  <NavButton dir={-1} onClick={() => nav.step(-1)} dark />
                </span>
                <p className="text-sm font-semibold text-white/80 tabular-nums" aria-live="polite">
                  {nav.index + 1} / {total}
                </p>
                <span className="sm:hidden">
                  <NavButton dir={1} onClick={() => nav.step(1)} dark />
                </span>
              </div>
              <Thumbnails images={images} index={nav.index} onSelect={nav.select} dark />
            </div>
          )}
        </div>
      )}
    </dialog>
  )
}

/**
 * Galeria da moto: foto principal com transição lateral, miniaturas,
 * navegação por setas/teclado/deslize e visualização ampliada.
 */
export function MotorcycleGallery({ images, title }: { images: ImageAsset[]; title: string }) {
  const total = images.length
  const nav = useGalleryNav(total)
  const [zoomed, setZoomed] = useState(false)

  if (total === 0) {
    return (
      <SmartImage
        image={{ src: '', alt: `${title}: fotos em breve` }}
        placeholderLabel="Fotos em breve"
        className="aspect-[4/3] rounded-card sm:aspect-[3/2]"
      />
    )
  }

  const current = images[nav.index]

  return (
    <section aria-label={`Galeria de fotos: ${title}`} aria-roledescription="galeria" onKeyDown={nav.onKeyDown}>
      <div className="group/stage relative aspect-[4/3] overflow-hidden rounded-card bg-steel/50 sm:aspect-[3/2]">
        <Stage
          images={images}
          index={nav.index}
          direction={nav.direction}
          onStep={nav.step}
          sizes="(min-width: 1024px) 760px, 100vw"
          fit="cover"
          onTap={() => setZoomed(true)}
        />

        <div className="pointer-events-none absolute inset-x-4 top-4 flex items-start justify-between gap-2">
          {current.illustrative ? <DemoBadge label="Imagem demonstrativa" always /> : <span />}
          <button
            type="button"
            onClick={() => setZoomed(true)}
            aria-label="Ampliar foto"
            aria-haspopup="dialog"
            className="pointer-events-auto grid size-10 place-items-center rounded-full bg-white/90 text-graphite shadow-sm backdrop-blur transition-[background-color,transform] duration-200 hover:bg-white active:scale-95"
          >
            <Expand aria-hidden className="size-4.5" />
          </button>
        </div>

        {total > 1 && (
          <>
            <div className="pointer-events-none absolute inset-x-3 top-1/2 flex -translate-y-1/2 justify-between opacity-100 transition-opacity duration-300 lg:opacity-0 lg:group-hover/stage:opacity-100 lg:group-focus-within/stage:opacity-100 [&>*]:pointer-events-auto">
              <NavButton dir={-1} onClick={() => nav.step(-1)} />
              <NavButton dir={1} onClick={() => nav.step(1)} />
            </div>
            <p
              className="pointer-events-none absolute right-4 bottom-4 rounded-full bg-graphite/75 px-3 py-1 text-xs font-semibold text-white tabular-nums backdrop-blur"
              aria-live="polite"
            >
              {nav.index + 1} / {total}
            </p>
          </>
        )}
      </div>

      {total > 1 && (
        <div className="mt-3">
          <Thumbnails images={images} index={nav.index} onSelect={nav.select} />
        </div>
      )}

      <Lightbox open={zoomed} onClose={() => setZoomed(false)} images={images} title={title} nav={nav} />
    </section>
  )
}
