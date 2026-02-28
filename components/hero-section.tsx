"use client"

import Image from "next/image"
import { AnimateOnScroll } from "./animate-on-scroll"
import { parseHighlightedText } from "@/lib/utils"

interface HeroData {
  title?: string
  subtitle?: string
  description?: string
  email?: string
  location?: string
  portrait_image?: string
  stats?: { value: string; label: string }[]
}

const defaultStats = [
  { value: "1K+", label: "Students Reached" },
  { value: "5+", label: "Leadership Roles" },
  { value: "3", label: "Countries" },
  { value: "10+", label: "Certifications" },
]

export function HeroSection({ data }: { data?: HeroData }) {
  // Use passed data from Supabase or fallback to the static defaults
  const title = data?.title || "Processing Solutions *Made Easy*"
  const subtitle = data?.subtitle || "*REDDEX* CHECKOUT"
  const description = data?.description || "Securely manage your account - anywhere at anytime."
  const portraitImage = data?.portrait_image || "/images/portrait.jpg" // The "Woman in pink shirt" fallback

  return (
    <section
      id="hero"
      className="slide-section relative min-h-screen flex flex-col justify-center px-6 md:px-16 lg:px-24 overflow-hidden bg-background"
    >
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 max-w-[1400px] mx-auto w-full items-center relative z-10 pt-20">

        {/* Left Column - Minimalist Typography */}
        <div className="flex flex-col justify-center lg:pr-12 text-center lg:text-left order-2 lg:order-1 relative z-20">
          <AnimateOnScroll>
            {/* The Badge */}
            <span className="inline-flex items-center px-4 py-1.5 bg-accent text-accent-foreground font-sans text-xs uppercase tracking-widest font-bold rounded-full mb-6 mx-auto lg:mx-0 w-max">
              {parseHighlightedText(subtitle)}
            </span>
          </AnimateOnScroll>

          <AnimateOnScroll delay={100}>
            {/* The Primary Headline */}
            <h1 className="font-sans text-5xl md:text-7xl lg:text-[5.5rem] font-bold leading-[1.05] tracking-tight text-foreground mb-6 text-balance">
              {title}
            </h1>
          </AnimateOnScroll>

          <AnimateOnScroll delay={200}>
            {/* The Subheadline */}
            <p className="font-sans text-lg md:text-xl font-normal text-muted-foreground max-w-lg mx-auto lg:mx-0 mb-10 text-balance leading-relaxed">
              {description}
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll delay={300}>
            {/* Primary CTA */}
            <div className="flex justify-center lg:justify-start">
              <button className="group relative inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-sans font-medium rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_8px_30px_rgb(26,26,26,0.12)]">
                <span className="relative z-10">Get Started</span>
                <svg className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out rounded-full" />
              </button>
            </div>
          </AnimateOnScroll>

          {/* Whitespace Strategy: Bottom left is left entirely empty per prompt */}
        </div>

        {/* Right Column - Lifestyle Image & Floating Info Cards */}
        <div className="relative order-1 lg:order-2 h-[500px] md:h-[600px] lg:h-[700px] w-full max-w-xl mx-auto lg:max-w-none">
          <AnimateOnScroll delay={200} className="w-full h-full relative">
            <div className="absolute inset-0 rounded-[32px] overflow-hidden bg-card border border-border/50 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]">
              {portraitImage && (
                <Image
                  src={portraitImage}
                  alt="Professional"
                  fill
                  priority
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              )}
            </div>


          </AnimateOnScroll>
        </div>
      </div>
    </section>
  )
}
