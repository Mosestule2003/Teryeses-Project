"use client"

import { useState, useEffect } from "react"

interface NavDot {
  id: string
  label: string
}

const sections: NavDot[] = [
  { id: "hero", label: "Home" },
  { id: "advocacy", label: "Advocacy" },
  { id: "gallery-1", label: "Gallery" },
  { id: "about", label: "About" },
  { id: "education", label: "Education" },
  { id: "experience", label: "Experience" },
  { id: "certifications", label: "Certifications" },
  { id: "gallery-2", label: "Gallery" },
  { id: "contact", label: "Contact" },
]

export function SlideNav() {
  const [active, setActive] = useState("hero")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id)
          }
        })
      },
      { threshold: 0.4 }
    )

    sections.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <nav className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2" aria-label="Section navigation">
      {sections.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => scrollTo(id)}
          className="group flex items-center gap-3 justify-end"
          aria-label={`Navigate to ${label}`}
          aria-current={active === id ? "true" : undefined}
        >
          <span className="text-xs font-mono tracking-wider uppercase text-foreground/0 group-hover:text-foreground/70 transition-all duration-300 pointer-events-none">
            {label}
          </span>
          <span
            className={`block rounded-full transition-all duration-300 ${
              active === id
                ? "w-3 h-3 bg-primary"
                : "w-2 h-2 bg-foreground/30 group-hover:bg-foreground/60"
            }`}
          />
        </button>
      ))}
    </nav>
  )
}
