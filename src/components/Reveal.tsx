import { useEffect, useRef, useState } from 'react'

interface RevealProps {
  children: React.ReactNode
  delayMs?: number
  className?: string
  direction?: 'up' | 'left' | 'right' | 'scale'
}

export function Reveal({
  children,
  delayMs = 0,
  className = '',
  direction = 'up',
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -36px 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const hiddenTransform =
    direction === 'left'
      ? 'translate3d(-22px, 0, 0)'
      : direction === 'right'
        ? 'translate3d(22px, 0, 0)'
        : direction === 'scale'
          ? 'scale(0.96)'
          : 'translate3d(0, 24px, 0)'

  return (
    <div
      ref={ref}
      className={`vinka-reveal ${className}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translate3d(0, 0, 0) scale(1)' : hiddenTransform,
        transitionDelay: `${delayMs}ms`,
      }}
    >
      {children}
    </div>
  )
}
