import { useLayoutEffect, type RefObject } from 'react'

/**
 * Publishes the bar's real height as `--bar-h` on `.app`. CSS uses it to pull
 * the 100svh hero under the sticky bar and to offset section anchors. Measured
 * rather than guessed because the padding and type sizes change with viewport.
 */
export function useHeaderHeight(ref: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const bar = ref.current
    const app = bar?.closest<HTMLElement>('.app')
    if (!bar || !app) return

    const update = () => app.style.setProperty('--bar-h', `${bar.offsetHeight}px`)
    update()

    const observer = new ResizeObserver(update)
    observer.observe(bar)
    return () => observer.disconnect()
  }, [ref])
}
