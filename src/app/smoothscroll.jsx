"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SmoothScroll({ children }) {
    const lenisRef = useRef(null);

    useEffect(() => {
        // 1. Initialize Lenis (starts stopped — gate must open first)
        const lenis = new Lenis({
            duration: 2.2,
            lerp: 0.05,
            smoothWheel: true,
            wheelMultiplier: 0.8,
            autoStart: false,
        });

        lenisRef.current = lenis;

        // Start in stopped state
        lenis.stop();

        // 2. Sync ScrollTrigger with Lenis
        lenis.on("scroll", ScrollTrigger.update);

        // 3. Connect GSAP ticker to Lenis
        const rafCallback = (time) => {
            lenis.raf(time * 1000);
        };
        gsap.ticker.add(rafCallback);

        // 4. Disable lag smoothing for instant 3D response
        gsap.ticker.lagSmoothing(0);

        // 5. Listen for the gate-opened event from page.jsx
        const handleGateOpen = () => {
            if (lenisRef.current) {
                lenisRef.current.start();
            }
        };
        window.addEventListener("gate-opened", handleGateOpen);

        return () => {
            window.removeEventListener("gate-opened", handleGateOpen);
            lenis.destroy();
            gsap.ticker.remove(rafCallback);
        };
    }, []);

    return <>{children}</>;
}