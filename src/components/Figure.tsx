import { useState } from 'react'
import { DaisyBloom } from './DaisyBloom'

interface FigureProps {
  src?: string
  alt: string
  caption?: string
  /** Tailwind aspect-ratio class, e.g. "aspect-[4/5]". */
  aspect?: string
  className?: string
  priority?: boolean
}

/**
 * Never renders a broken image box. If `src` is missing or fails to load,
 * shows an elegant on-theme placeholder (paper fill, faint daisy glyph,
 * "replace me" chip) at the correct aspect ratio instead.
 */
export function Figure({
  src,
  alt,
  caption,
  aspect = 'aspect-[4/5]',
  className = '',
  priority = false,
}: FigureProps) {
  const [errored, setErrored] = useState(false)
  const showPlaceholder = !src || errored

  return (
    <figure
      className={`group relative overflow-hidden rounded-[2px] border border-line bg-cream-2 ${aspect} ${className}`}
    >
      {!showPlaceholder && (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setErrored(true)}
          className="h-full w-full object-cover transition-transform duration-[1200ms] ease-power3-out motion-safe:group-hover:scale-[1.035]"
        />
      )}

      {showPlaceholder && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-cream-2 p-4 text-center">
          <DaisyBloom size={56} petals={8} trigger="load" className="opacity-35" />
          <span className="rounded-full border border-line bg-ivory px-3 py-1 font-body text-[11px] tracking-wide text-ink-soft">
            {alt || 'photo'} · replace me
          </span>
        </div>
      )}

      {caption && (
        <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent px-4 pb-3 pt-10 font-body text-sm text-ivory text-pretty">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
