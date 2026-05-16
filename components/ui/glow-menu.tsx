"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface MenuItem {
  icon: LucideIcon | React.FC<React.SVGProps<SVGSVGElement>>
  label: string
  href: string
  gradient: string
  iconColor: string
}

interface MenuBarProps extends React.HTMLAttributes<HTMLDivElement> {
  items: MenuItem[]
  activeItem?: string
  onItemClick?: (label: string) => void
}

const glowVariants = {
  initial: { opacity: 0, scale: 0.8 },
  hover: {
    opacity: 1,
    scale: 2,
    transition: {
      opacity: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
      scale: { duration: 0.5, type: "spring", stiffness: 300, damping: 25 },
    },
  },
}

const navGlowVariants = {
  initial: { opacity: 0 },
  hover: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
    },
  },
}

const labelVariants = {
  initial: { opacity: 0, height: 0, y: -8 },
  hover: {
    opacity: 1,
    height: 18,
    y: -2,
    transition: { duration: 0.18, ease: [0.4, 0, 0.2, 1] },
  },
}

const iconWrapVariants = {
  initial: { y: 0 },
  hover: {
    y: -4,
    transition: { duration: 0.18, ease: [0.4, 0, 0.2, 1] },
  },
}

export const MenuBar = React.forwardRef<HTMLDivElement, MenuBarProps>(
  ({ className, items, activeItem, onItemClick, ...props }, ref) => {
    const { theme } = useTheme()
    const isDarkTheme = theme === "dark"

    return (
      <motion.nav
        ref={ref}
        className={cn(
          "relative overflow-visible rounded-[2rem] border border-white/60 bg-white/45 p-3 shadow-[0_18px_48px_rgba(15,23,42,0.08)] backdrop-blur-xl",
          className,
        )}
        initial="initial"
        whileHover="hover"
        {...props}
      >
        <motion.div
          className={`pointer-events-none absolute -inset-2 z-0 rounded-3xl bg-gradient-radial from-transparent ${
            isDarkTheme
              ? "via-blue-400/30 via-30% via-purple-400/30 via-60% via-red-400/30 via-90%"
              : "via-blue-400/20 via-30% via-purple-400/20 via-60% via-red-400/20 via-90%"
          } to-transparent`}
          variants={navGlowVariants}
        />
        <ul className="relative z-10 flex items-start gap-5 xl:gap-7">
          {items.map((item) => {
            const Icon = item.icon
            const isActive = item.label === activeItem

            return (
              <motion.li key={item.label} className="relative h-16 w-[74px] xl:w-[82px]">
                <button
                  onClick={() => onItemClick?.(item.label)}
                  className="relative block h-16 w-[74px] overflow-visible rounded-[1.5rem] xl:w-[82px]"
                  aria-label={item.label}
                >
                  <motion.div
                    className={cn(
                      "group absolute left-0 top-0 flex h-16 w-[74px] flex-col items-center justify-center overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white/55 px-2 py-2 shadow-[0_10px_26px_rgba(15,23,42,0.08)] backdrop-blur transition-all duration-200 hover:h-[82px] hover:bg-white/85 hover:shadow-[0_18px_38px_rgba(15,23,42,0.12)] xl:w-[82px]",
                      isActive ? "bg-white/90 shadow-[0_16px_36px_rgba(37,99,235,0.16)]" : "",
                    )}
                    style={{ perspective: "600px" }}
                    whileHover="hover"
                    initial="initial"
                  >
                    <motion.div
                      className="pointer-events-none absolute -inset-1 z-0"
                      variants={glowVariants}
                      animate={isActive ? "hover" : "initial"}
                      style={{
                        background: item.gradient,
                        opacity: isActive ? 1 : 0,
                        borderRadius: "24px",
                      }}
                    />
                    <motion.div
                      className={cn(
                        "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-transparent text-sm font-bold transition-colors",
                        isActive
                          ? "text-foreground"
                          : "text-muted-foreground group-hover:text-foreground",
                      )}
                      variants={iconWrapVariants}
                    >
                      <span
                        className={cn(
                          "transition-colors duration-300",
                          isActive ? item.iconColor : "text-foreground",
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                    </motion.div>
                    <motion.div
                      className="pointer-events-none relative z-10 -mt-2 overflow-hidden whitespace-nowrap text-center text-[11px] font-extrabold leading-4 text-foreground"
                      variants={labelVariants}
                    >
                      <span>{item.label}</span>
                    </motion.div>
                  </motion.div>
                </button>
              </motion.li>
            )
          })}
        </ul>
      </motion.nav>
    )
  },
)

MenuBar.displayName = "MenuBar"
