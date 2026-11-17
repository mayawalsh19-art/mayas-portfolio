import { useEffect } from 'react'

// Fades and lifts every [data-reveal] element into view the first time it scrolls on screen.
export default function useReveal() {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    document.documentElement.classList.add('reveal-ready')
    const obs = new IntersectionObserver(entries => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-in'); obs.unobserve(e.target) }
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })
    const watch = () => document.querySelectorAll('[data-reveal]:not(.is-in)').forEach(el => obs.observe(el))
    watch()
    // Catch anything React adds later (e.g. after closing a case study)
    const mo = new MutationObserver(watch)
    mo.observe(document.body, { childList: true, subtree: true })
    return () => { obs.disconnect(); mo.disconnect() }
  }, [])
}
