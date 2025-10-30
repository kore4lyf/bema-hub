import type { Variants } from "motion"

export const staggerContainer: Variants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.5,
        },
    },
}

export const blurIn: Variants = {
    hidden: { opacity: 0, filter: "blur(4px)", y: 10 },
    show: {
        opacity: 1, filter: "blur(0px)", y: 0,
        transition: {
            duration: 1,
            ease: "easeInOut",
        },
    },
}

export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            duration: 0.3,
        },
    },
}