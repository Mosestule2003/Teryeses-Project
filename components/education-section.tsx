"use client"

import { AnimateOnScroll } from "./animate-on-scroll"

const education = [
  {
    degree: "Doctor of Medicine (MD)",
    school: "All Saints University School of Medicine, Dominica",
    year: "2025 — Present",
  },
  {
    degree: "MBBS — Bachelor of Medicine & Surgery",
    school: "Bingham University, Nigeria",
    year: "2022 — 2025",
  },
  {
    degree: "West African Senior School Certificate",
    school: "Stella Maris College \u00b7 NECO",
    year: "2020",
  },
]

export function EducationSection({ data }: { data?: any }) {
  const listItems = data?.list || education;
  const title = data?.title || "Education";
  const label = data?.label || "01 · Academic Journey";
  return (
    <section
      id="education"
      className="slide-section min-h-screen py-24 px-6 md:px-16 lg:px-24"
    >
      <div className="max-w-4xl mx-auto">
        <AnimateOnScroll>
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-primary mb-4">
            {label}
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-16 whitespace-pre-line">
            {title}
          </h2>
        </AnimateOnScroll>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-border" />

          <div className="flex flex-col gap-12 pl-8">
            {listItems.map((edu: any, i: number) => (
              <AnimateOnScroll key={i} delay={i * 150}>
                <div className="relative">
                  {/* Timeline dot */}
                  <div className="absolute -left-8 top-1.5 w-2 h-2 rounded-full bg-primary -translate-x-1/2" />

                  <h3 className="font-serif text-xl font-bold mb-1">
                    {edu.degree}
                  </h3>
                  <p className="text-sm text-foreground/70 mb-1">
                    {edu.school}
                  </p>
                  <p className="font-mono text-xs text-primary tracking-wider">
                    {edu.year}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
