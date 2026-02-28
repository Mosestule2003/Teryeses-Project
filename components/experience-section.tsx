"use client"

import { AnimateOnScroll } from "./animate-on-scroll"

const experiences = [
  {
    role: "EV4GH Fellow",
    org: "Emerging Voices for Global Health",
    period: "2026",
    description: "Selected as a fellow for the prestigious Emerging Voices for Global Health programme, contributing to health policy discourse.",
  },
  {
    role: "Health Advocacy Lead",
    org: "NIMSA — Nigerian Medical Students Association",
    period: "2023 — 2025",
    description: "Led multiple health advocacy campaigns including menstrual hygiene awareness, UHC advocacy, and community health screenings reaching over 1,000 students.",
  },
  {
    role: "Community Health Volunteer",
    org: "Various NGOs, Nigeria",
    period: "2022 — 2025",
    description: "Participated in community outreach programmes, health education campaigns, and first aid training across rural and urban communities.",
  },
  {
    role: "Medical Students Association",
    org: "Bingham University MSA",
    period: "2022 — 2025",
    description: "Active member contributing to health week conferences, research training, and SDG awareness campaigns.",
  },
]

export function ExperienceSection({ data }: { data?: any }) {
  const listItems = data?.list || experiences;
  const title = data?.title || "Experience";
  const label = data?.label || "02 · Professional Path";
  return (
    <section
      id="experience"
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

        <div className="flex flex-col gap-8">
          {listItems.map((exp: any, i: number) => (
            <AnimateOnScroll key={i} delay={i * 120}>
              <div className="group relative bg-card/60 backdrop-blur-sm border border-border/60 p-8 md:p-10 rounded-2xl shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-500 hover:-translate-y-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-4">
                  <div>
                    <h3 className="font-serif text-xl font-bold group-hover:text-primary transition-colors duration-300">
                      {exp.role}
                    </h3>
                    <p className="text-sm text-foreground/60">{exp.org}</p>
                  </div>
                  <span className="font-mono text-xs tracking-wider text-primary shrink-0">
                    {exp.period}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-foreground/70">
                  {exp.description}
                </p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
