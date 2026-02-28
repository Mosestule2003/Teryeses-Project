"use client"

import Image from "next/image"
import { AnimateOnScroll } from "./animate-on-scroll"
import { parseHighlightedText } from "@/lib/utils"

export function AboutSection({ data }: { data?: any }) {
  const content = data?.title ? data : {
    title: "*About* Me",
    heading: "Medical Student &\n*Health Advocate*",
    paragraphs: [
      "I am a medical student at All Saints University School of Medicine in Dominica, with prior studies at Bingham University, Nigeria. My journey in medicine is deeply intertwined with my passion for health advocacy and community empowerment.",
      "From leading menstrual hygiene campaigns on Nigerian streets to championing universal health coverage across the African continent, I believe in the transformative power of evidence-informed policy change and grassroots mobilisation."
    ],
    photo: "/images/portrait.jpg",
    qualities: [
      { label: "Clinical Work in Dominica", desc: "Hands-on clinical training and patient care" },
      { label: "Continental Health Advocacy", desc: "Championing UHC and health equity across Africa" },
      { label: "Community Outreach", desc: "Bridging education with real-world health needs" }
    ]
  };

  return (
    <section
      id="about"
      className="slide-section min-h-screen py-24 px-6 md:px-16 lg:px-24"
    >
      <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
        {/* Photo */}
        <AnimateOnScroll>
          <div className="relative aspect-[3/4] rounded-sm overflow-hidden bg-card">
            <Image
              src={content.photo}
              alt="Teryese Rebecca"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
          </div>
        </AnimateOnScroll>

        {/* Text content */}
        <div>
          <AnimateOnScroll>
            <p className="font-mono text-xs tracking-[0.2em] uppercase text-primary mb-4">
              {parseHighlightedText(content.title)}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-8 whitespace-pre-line">
              {parseHighlightedText(content.heading)}
            </h2>
          </AnimateOnScroll>

          {content.paragraphs.map((para: string, i: number) => (
            <AnimateOnScroll key={i} delay={150 + (i * 50)}>
              <p className="text-foreground/80 leading-relaxed mb-6">
                {para}
              </p>
            </AnimateOnScroll>
          ))}

          <AnimateOnScroll delay={300}>
            <div className="flex flex-col gap-4">
              {content.qualities.map((qual: any, i: number) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <div>
                    <p className="font-serif font-bold text-lg">{qual.label}</p>
                    <p className="text-sm text-foreground/60">{qual.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  )
}
