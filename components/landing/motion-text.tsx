"use client"

import { useRef } from "react"
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
  type Variants,
} from "motion/react"

import { cn } from "@/lib/utils"

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", duration: 0.6 },
  },
}

function Word({
  word,
  last,
}: {
  word: string
  last?: boolean
}) {
  return (
    <motion.span
      variants={wordVariants}
      className="inline-block"
      aria-hidden={last}
    >
      {word}
      {last ? null : "\u00A0"}
    </motion.span>
  )
}

export function WordsPullUp({
  text,
  className,
  as = "p",
}: {
  text: string
  className?: string
  as?: "p" | "h1" | "h2" | "h3"
}) {
  const words = text.split(" ")
  const MotionTag =
    as === "h1" ? motion.h1 : as === "h2" ? motion.h2 : as === "h3" ? motion.h3 : motion.p
  return (
    <MotionTag
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className={className}
    >
      {words.map((word, index) => (
        <Word key={`${word}-${index}`} word={word} last={index === words.length - 1} />
      ))}
    </MotionTag>
  )
}

export function WordsPullUpMultiStyle({
  segments,
  className,
  as = "p",
}: {
  segments: { text: string; className?: string }[]
  className?: string
  as?: "p" | "h1" | "h2" | "h3"
}) {
  const MotionTag =
    as === "h1" ? motion.h1 : as === "h2" ? motion.h2 : as === "h3" ? motion.h3 : motion.p
  return (
    <MotionTag
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className={className}
    >
      {segments.map((segment, segmentIndex) => {
        const words = segment.text.split(" ")
        return (
          <span
            key={segmentIndex}
            className={cn("inline-block whitespace-pre-wrap", segment.className)}
          >
            {words.map((word, wordIndex) => (
              <Word
                key={`${word}-${wordIndex}`}
                word={word}
                last={wordIndex === words.length - 1}
              />
            ))}
            {segmentIndex < segments.length - 1 ? "\u00A0" : null}
          </span>
        )
      })}
    </MotionTag>
  )
}

function AnimatedLetter({
  char,
  charProgress,
  scrollYProgress,
}: {
  char: string
  charProgress: number
  scrollYProgress: MotionValue<number>
}) {
  const opacity = useTransform(
    scrollYProgress,
    [charProgress - 0.1, charProgress + 0.05],
    [0, 1],
    { clamp: true }
  )
  return (
    <motion.span style={{ opacity }} aria-hidden={char === " "}>
      {char === " " ? "\u00A0" : char}
    </motion.span>
  )
}

export function CharReveal({
  text,
  className,
}: {
  text: string
  className?: string
}) {
  const ref = useRef<HTMLParagraphElement>(null)
  const totalChars = text.length

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.2"],
  })

  return (
    <p ref={ref} className={className}>
      {text.split("").map((char, index) => (
        <AnimatedLetter
          key={`${char}-${index}`}
          char={char}
          charProgress={index / totalChars}
          scrollYProgress={scrollYProgress}
        />
      ))}
    </p>
  )
}
