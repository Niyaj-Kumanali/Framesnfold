import { useEffect, useState } from 'react'

/** Order matters: the deepest section in view wins. */
const SECTION_IDS = ['work', 'services', 'about', 'contact'] as const

/**
 * Marks the section sitting in the top half of the viewport. The band ignores
 * the floating pill and stops short of the fold, so a section is only current
 * once its heading is actually on screen.
 */
export function useActiveSection() {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return

    const visible = new Set<string>()
    const targets = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    )
    if (!targets.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id)
          else visible.delete(entry.target.id)
        }
        let current: string | null = null
        for (const id of SECTION_IDS) if (visible.has(id)) current = id
        setActive(current)
      },
      { rootMargin: '-18% 0px -62% 0px', threshold: 0 },
    )

    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [])

  return active
}
