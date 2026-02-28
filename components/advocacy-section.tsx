"use client"

import { AnimateOnScroll } from "./animate-on-scroll"
import { parseHighlightedText } from "@/lib/utils"
import { ArrowUpRight } from "lucide-react"
import Image from "next/image"

const advocacyItems = [
  {
    tag: "health equity",
    title: "menstrual hygiene is a right",
    description:
      "taking it to the streets — mobilising students to hold placards and demand that menstrual health is recognised as a fundamental health right for every girl in nigeria.",
    bgColor: "#50C878", // Emerald Green
    textColor: "#FFFFFF",
    bgImage: "https://images.unsplash.com/photo-1542887800-faca0261c9e1?auto=format&fit=crop&q=80",
    link: "",
  },
  {
    tag: "continental advocacy",
    title: "voices for universal health coverage",
    description:
      "championing uhc across africa through strategic advocacy and youth empowerment, ensuring no one is left behind in the journey to health for all.",
    bgColor: "#1A1A1A", // Off-Black Theme
    textColor: "#FFFFFF",
    bgImage: "https://images.unsplash.com/photo-1532938911079-1b06ac7ce122?auto=format&fit=crop&q=80",
    link: "",
  },
  {
    tag: "community outreach",
    title: "from campus to community",
    description:
      "bridging the gap between medical education and real community health needs through outreach programmes, health screenings, and health education campaigns.",
    bgColor: "#5AB2D1", // Muted Sky Blue
    textColor: "#FFFFFF",
    bgImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80",
    link: "",
  },
]

export function AdvocacySection({ data }: { data?: any }) {
  const listItems = data?.items || advocacyItems;
  const label = data?.label?.toLowerCase() || "*what* i stand for";
  const titleText = data?.title
    ? parseHighlightedText(data.title.toLowerCase())
    : <>advocacy &<br /><em className="text-highlight not-italic">impact</em></>;

  return (
    <section
      id="advocacy"
      className="slide-section min-h-screen py-24 px-6 md:px-16 lg:px-24 lowercase"
    >
      <AnimateOnScroll>
        <p className="font-sans text-sm tracking-widest font-bold mb-4 text-foreground/50">
          {parseHighlightedText(label)}
        </p>
        <h2 className="font-sans text-5xl md:text-7xl font-bold mb-16 tracking-wide text-balance whitespace-pre-line text-foreground">
          {titleText}
        </h2>
      </AnimateOnScroll>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        {listItems.map((item: any, i: number) => {
          const tag = item.tag ? item.tag.toLowerCase() : advocacyItems[i % 3].tag;
          const title = item.title ? item.title.toLowerCase() : advocacyItems[i % 3].title;
          const desc = item.description ? item.description.toLowerCase() : advocacyItems[i % 3].description;
          const bgColor = advocacyItems[i % 3].bgColor;
          const textColor = advocacyItems[i % 3].textColor;
          const bgImage = advocacyItems[i % 3].bgImage;

          const link = item.link || "";

          const CardContent = (
            <div
              style={{ backgroundColor: bgColor, color: textColor }}
              className="group relative p-8 md:p-10 rounded-[30px] overflow-hidden h-full flex flex-col justify-between transition-transform duration-500 hover:-translate-y-2 shadow-sm border border-transparent"
            >
              {/* Fading Background Image */}
              <div className="absolute inset-0 z-0 opacity-[0.15] mix-blend-overlay transition-opacity duration-700 group-hover:opacity-30">
                {bgImage && (
                  <Image
                    src={bgImage}
                    alt={title}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-0 opacity-80" />

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-auto">
                  <span className="font-sans text-xs tracking-wide bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-white shadow-sm font-medium">
                    {tag}
                  </span>
                  <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 group-hover:bg-white group-hover:text-black transition-colors duration-300 shrink-0">
                    <ArrowUpRight className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                </div>

                <div className="mt-20">
                  <h3 className="font-sans text-2xl md:text-3xl font-bold tracking-wide mb-4 text-white leading-tight">
                    {title}
                  </h3>
                  <p className="font-sans text-base font-light leading-relaxed text-white/90">
                    {desc}
                  </p>
                </div>
              </div>
            </div>
          );

          return (
            <AnimateOnScroll key={i} delay={100 + (i * 100)} className="h-full">
              {link ? (
                <a href={link} target="_blank" rel="noopener noreferrer" className="block h-full cursor-pointer">
                  {CardContent}
                </a>
              ) : (
                CardContent
              )}
            </AnimateOnScroll>
          )
        })}
      </div>
    </section>
  )
}
