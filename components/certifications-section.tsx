"use client"

import { AnimateOnScroll } from "./animate-on-scroll"
import { parseHighlightedText } from "@/lib/utils"

const certifications = [
  "WHO — Health Systems Strengthening (2024)",
  "Bingham University MSA — First Aid & CPR (2024)",
  "NIMSA Research Training (2024)",
  "Empowering Medical Students for SDGs — Directorate of Budget, Planning & Strategy (2025)",
  "Geneva Foundation — Sexual Health Training (2024)",
  "International Health Summit 2024 \u00b7 NIMSA Health Week Conference (2022, 2023)",
]

export function CertificationsSection({ data }: { data?: any }) {
  const listItems = data?.list || certifications;
  const title = data?.title ? parseHighlightedText(data.title) : <>Certifications &<br /><em className="text-primary not-italic">Training</em></>;
  const label = data?.label || "03 · Continuous Learning";
  const highlightTitle = data?.highlight_title || "Lifelong Learner";
  const highlightDesc = data?.highlight_desc || "Committed to continuous professional development through workshops, conferences, and online certifications in global health, research methodology, and clinical skills.";
  return (
    <section
      id="certifications"
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

        <div className="flex flex-col gap-4">
          {listItems.map((cert: any, i: number) => (
            <AnimateOnScroll key={i} delay={i * 100}>
              <div className="group flex items-start gap-4 py-4 border-b border-border/50 hover:border-primary/30 transition-colors duration-300">
                <div className="mt-2 w-2 h-2 rounded-full bg-primary shrink-0" />
                <p className="text-sm md:text-base leading-relaxed text-foreground/80 group-hover:text-foreground transition-colors duration-300">
                  {cert}
                </p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        <AnimateOnScroll delay={600}>
          <div className="mt-16 p-8 bg-primary/5 border border-primary/10 rounded-2xl">
            <p className="font-serif text-lg font-bold mb-2">{highlightTitle}</p>
            <p className="text-sm text-foreground/60 leading-relaxed">
              {highlightDesc}
            </p>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  )
}
