"use client"

import { useRef, type ReactNode } from "react"
import {
  motion,
  useReducedMotion,
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

const revealViewport = { once: true, margin: "-80px" } as const

type HeadingAs = "p" | "h1" | "h2" | "h3"

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

function WordsContainer({
  as,
  className,
  children,
}: {
  as: HeadingAs
  className?: string
  children: ReactNode
}) {
  switch (as) {
    case "h1":
      return (
        <motion.h1
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
          className={className}
        >
          {children}
        </motion.h1>
      )
    case "h2":
      return (
        <motion.h2
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
          className={className}
        >
          {children}
        </motion.h2>
      )
    case "h3":
      return (
        <motion.h3
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
          className={className}
        >
          {children}
        </motion.h3>
      )
    default:
      return (
        <motion.p
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
          className={className}
        >
          {children}
        </motion.p>
      )
  }
}

function StaticText({
  as,
  className,
  children,
}: {
  as: HeadingAs
  className?: string
  children: ReactNode
}) {
  switch (as) {
    case "h1":
      return <h1 className={className}>{children}</h1>
    case "h2":
      return <h2 className={className}>{children}</h2>
    case "h3":
      return <h3 className={className}>{children}</h3>
    default:
      return <p className={className}>{children}</p>
  }
}

export function WordsPullUp({
  text,
  className,
  as = "p",
}: {
  text: string
  className?: string
  as?: HeadingAs
}) {
  const prefersReducedMotion = useReducedMotion()
  const words = text.split(" ")

  if (prefersReducedMotion) {
    return (
      <StaticText as={as} className={className}>
        {text}
      </StaticText>
    )
  }

  return (
    <WordsContainer as={as} className={className}>
      {words.map((word, index) => (
        <Word
          key={`${word}-${index}`}
          word={word}
          last={index === words.length - 1}
        />
      ))}
    </WordsContainer>
  )
}

export function WordsPullUpMultiStyle({
  segments,
  className,
  as = "p",
}: {
  segments: { text: string; className?: string }[]
  className?: string
  as?: HeadingAs
}) {
  const prefersReducedMotion = useReducedMotion()

  const children = segments.map((segment, segmentIndex) => (
    <span
      key={segmentIndex}
      className={cn("inline-block whitespace-pre-wrap", segment.className)}
    >
      {prefersReducedMotion
        ? segment.text
        : segment.text.split(" ").map((word, wordIndex) => (
            <Word
              key={`${word}-${wordIndex}`}
              word={word}
              last={wordIndex === segment.text.split(" ").length - 1}
            />
          ))}
      {segmentIndex < segments.length - 1 ? "\u00A0" : null}
    </span>
  ))

  if (prefersReducedMotion) {
    return (
      <StaticText as={as} className={className}>
        {children}
      </StaticText>
    )
  }

  return (
    <WordsContainer as={as} className={className}>
      {children}
    </WordsContainer>
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
  const prefersReducedMotion = useReducedMotion()
  const totalChars = text.length

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.2"],
  })

  if (prefersReducedMotion) {
    return (
      <p ref={ref} className={className}>
        {text}
      </p>
    )
  }

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