"use client"

import { AnimateOnScroll } from "./animate-on-scroll"
import { parseHighlightedText } from "@/lib/utils"

export function ContactSection({ data }: { data?: any }) {
  const content = data || {
    label: "Get In Touch",
    title: "Let's Build a\n*Healthier Future*",
    description: "Interested in collaborating on health advocacy, research, or community outreach? I would love to hear from you.",
    links: [
      { label: "Email Me", url: "mailto:taetule@gmail.com", is_external: true },
      { label: "LinkedIn", url: "https://linkedin.com", is_external: true }
    ],
    footer_name: "Kpughur Tule Teryese Rebecca",
    footer_text: "EV4GH 2026 Portfolio"
  };
  return (
    <section
      id="contact"
      className="slide-section min-h-screen flex flex-col justify-center items-center px-6 md:px-16 lg:px-24 py-24 text-center overflow-hidden relative"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-muted/30 pointer-events-none" />
      <div className="relative z-10 w-full">
        <AnimateOnScroll>
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-primary mb-6">
            {content.label}
          </p>
        </AnimateOnScroll>

        <AnimateOnScroll delay={100}>
          <h2 className="font-serif text-5xl md:text-7xl font-bold mb-8 text-balance whitespace-pre-line">
            {parseHighlightedText(content.title)}
          </h2>
        </AnimateOnScroll>

        <AnimateOnScroll delay={200}>
          <p className="text-lg text-foreground/70 max-w-xl mx-auto mb-12 leading-relaxed">
            {content.description}
          </p>
        </AnimateOnScroll>

        <AnimateOnScroll delay={300}>
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {content.links && content.links.map((link: any, i: number) => (
              <a
                key={i}
                href={link.url}
                target={link.is_external ? "_blank" : "_self"}
                rel={link.is_external ? "noopener noreferrer" : ""}
                className={i === 0
                  ? "inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-mono text-sm tracking-wider rounded-xl hover:bg-primary/90 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                  : "inline-flex items-center gap-2 px-6 py-3 border border-border text-foreground font-mono text-sm tracking-wider rounded-xl hover:border-primary hover:text-primary transition-all duration-300 hover:-translate-y-0.5"
                }
              >
                {link.label}
              </a>
            ))}
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll delay={400}>
          <div className="flex flex-col items-center gap-2 text-foreground/30">
            <div className="w-px h-12 bg-primary/20" />
            <p className="font-mono text-xs tracking-wider">
              {content.footer_name}
            </p>
            <p className="font-mono text-[10px] tracking-wider text-foreground/20">
              {content.footer_text}
            </p>
            <a
              href="/admin/login"
              className="font-mono text-[10px] tracking-wider text-foreground/20 hover:text-primary transition-colors mt-2"
            >
              Admin Dashboard
            </a>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  )
}
