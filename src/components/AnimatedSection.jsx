import { useInView } from '../hooks/useInView'

// Fade-and-rise wrapper. Do NOT use this around individual repeater template
// items — only around section intros/headings (see CMS rules doc, Rule 4).
export default function AnimatedSection({ children, delay = 0, className = '' }) {
  const [ref, visible] = useInView()
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
