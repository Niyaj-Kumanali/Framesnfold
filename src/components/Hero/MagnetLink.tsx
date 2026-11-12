import type { ComponentPropsWithoutRef, PointerEvent as ReactPointerEvent } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

type Props = ComponentPropsWithoutRef<'a'> & { variant?: 'primary' | 'ghost' }

/** Button-styled link that leans slightly toward the mouse. */
export default function MagnetLink({ variant = 'ghost', className, children, ...rest }: Props) {
  const reduced = useReducedMotion()

  const onMove = (e: ReactPointerEvent<HTMLAnchorElement>) => {
    if (reduced || e.pointerType !== 'mouse') return
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    el.style.setProperty('--bx', `${((e.clientX - (r.left + r.width / 2)) * 0.18).toFixed(1)}px`)
    el.style.setProperty('--by', `${((e.clientY - (r.top + r.height / 2)) * 0.3).toFixed(1)}px`)
  }

  const onLeave = (e: ReactPointerEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.setProperty('--bx', '0px')
    e.currentTarget.style.setProperty('--by', '0px')
  }

  return (
    <a
      {...rest}
      className={['btn', variant, className].filter(Boolean).join(' ')}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </a>
  )
}
