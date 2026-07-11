import { story } from '../content/story'
import { DaisyBloom } from './DaisyBloom'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative border-t border-line bg-cream py-12 text-center">
      <div className="relative z-10">
        <DaisyBloom
          trigger="load"
          size={30}
          petals={8}
          petalColor="var(--sage)"
          className="mx-auto mb-3 opacity-80"
        />
        <p className="font-body text-xs uppercase tracking-[0.2em] text-ink-soft">
          {story.couple.you} &hearts; {story.couple.her} · {year}
        </p>
      </div>
    </footer>
  )
}
