import type { ReactNode } from 'react'

interface SectionLabelProps {
  children: ReactNode
  tone?: 'ink' | 'gold' | 'sage'
  className?: string
  as?: 'span' | 'div'
}

const TONE_CLASS: Record<NonNullable<SectionLabelProps['tone']>, string> = {
  ink: 'text-ink-soft',
  gold: 'text-gold-deep',
  sage: 'text-sage-deep',
}

/** Small uppercase tracked metadata label — dates, kickers, chapter numbers. */
export function SectionLabel({ children, tone = 'ink', className = '', as = 'span' }: SectionLabelProps) {
  const Tag = as
  return (
    <Tag
      className={`font-body text-xs uppercase tracking-[0.2em] ${TONE_CLASS[tone]} ${className}`}
    >
      {children}
    </Tag>
  )
}
