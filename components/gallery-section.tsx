"use client"

import Image from "next/image"
import { useState } from "react"
import { AnimateOnScroll } from "./animate-on-scroll"
import { motion, AnimatePresence } from "framer-motion"

interface GalleryProps {
  id: string
  title: string
  subtitle: string
  images: { src: string; alt: string }[]
  caption?: string
}

export function GallerySection({ id, title, subtitle, images, caption }: GalleryProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const imagesPerPage = 5;
  const totalPages = Math.ceil((images?.length || 0) / imagesPerPage);

  const currentImages = images?.slice(currentPage * imagesPerPage, (currentPage + 1) * imagesPerPage) || [];
  return (
    <section
      id={id}
      className="slide-section min-h-screen py-24 px-6 md:px-16 lg:px-24"
    >
      <AnimateOnScroll>
        <div className="text-center mb-12">
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-primary mb-4">
            {subtitle}
          </p>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-balance">
            {title}
          </h2>
        </div>
      </AnimateOnScroll>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-6xl mx-auto overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="col-span-2 md:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-3"
          >
            {currentImages.map((img, i) => (
              <div
                key={i}
                className={`group relative overflow-hidden rounded-sm bg-card aspect-[3/4] ${i === 0 ? "col-span-2 md:col-span-2 row-span-2" : ""}`}
              >
                <Image
                  src={img.src}
                  alt={img.alt || "Gallery Image"}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-background/0 group-hover:bg-background/20 transition-all duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <span className="text-xs font-mono tracking-wider text-foreground/90 bg-background/80 px-2 py-1 rounded-sm shadow-sm">
                    {img.alt}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-10">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${currentPage === index ? "bg-primary w-6" : "bg-primary/20 hover:bg-primary/50"}`}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
      )}

      {caption && (
        <AnimateOnScroll delay={100}>
          <p className="text-center text-sm text-foreground/50 font-mono mt-8 max-w-lg mx-auto">
            {caption}
          </p>
        </AnimateOnScroll>
      )}
    </section>
  )
}
