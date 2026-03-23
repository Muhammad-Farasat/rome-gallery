"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SmoothScroll({ children }) {
    useEffect(() => {
        // 1. Initialize Lenis
        const lenis = new Lenis({
            duration: 2.2,      // Increased from 1.5 (longer glide)
            lerp: 0.05,         // Decreased from 0.1 (makes it feel heavier/slower)
            smoothWheel: true,
            wheelMultiplier: 0.8, // Lowers the "strength" of a single scroll wheel click
        });

        // 2. Sync ScrollTrigger with Lenis
        lenis.on("scroll", ScrollTrigger.update);

        // 3. Connect GSAP ticker to Lenis
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        // 4. Disable lag smoothing for instant 3D response
        gsap.ticker.lagSmoothing(0);

        return () => {
            lenis.destroy();
            gsap.ticker.remove(lenis.raf);
        };
    }, []);

    return <>{children}</>;
}