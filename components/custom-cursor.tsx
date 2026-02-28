"use client"

import { useEffect, useState } from "react"

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only show custom cursor on non-touch devices
    const mediaQuery = window.matchMedia("(pointer: fine)")
    if (!mediaQuery.matches) return

    setIsVisible(true)

    const handleMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest("a, button, [role='button']")) {
        setIsHovering(true)
      }
    }

    const handleOut = () => {
      setIsHovering(false)
    }

    window.addEventListener("mousemove", handleMove)
    window.addEventListener("mouseover", handleOver)
    window.addEventListener("mouseout", handleOut)

    return () => {
      window.removeEventListener("mousemove", handleMove)
      window.removeEventListener("mouseover", handleOver)
      window.removeEventListener("mouseout", handleOut)
    }
  }, [])

  if (!isVisible) return null

  return (
    <>
      {/* Outer ring */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-[999] mix-blend-difference"
        style={{
          transform: `translate(${position.x - 20}px, ${position.y - 20}px)`,
          transition: "transform 0.15s ease-out",
        }}
      >
        <div
          className={`rounded-full border transition-all duration-300 ${
            isHovering
              ? "w-12 h-12 border-primary bg-primary/10"
              : "w-10 h-10 border-foreground/30"
          }`}
        />
      </div>
      {/* Inner dot */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-[999]"
        style={{
          transform: `translate(${position.x - 3}px, ${position.y - 3}px)`,
        }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
      </div>
    </>
  )
}
