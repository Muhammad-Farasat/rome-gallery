"use client";
import { useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import Scene from "@/component/scene";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Home() {
  const scrollData = useRef({ progress: 0, resetFog: 0 });
  const container = useRef();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.to(scrollData.current, {
      progress: 1,
      scrollTrigger: {
        trigger: container.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.1,
      },
    });

    gsap.fromTo("#final-screen",
      { opacity: 0 },
      {
        opacity: 1,
        scrollTrigger: {
          trigger: container.current,
          start: "92% top",
          end: "98% top",
          scrub: true,
        },
      }
    );
  }, []);

  // 🔥 THE CINEMATIC RESET (MAXIMUM SLOW & TRANSCENDENT)
  const handleRestart = () => {
    // 1. Fade UI slowly
    gsap.to("#final-screen", { opacity: 0, duration: 1.0, ease: "power2.inOut" });

    // 2. Thick Fog In (Divine Whiteout) - SLOWER
    gsap.to(scrollData.current, {
      resetFog: 1,
      duration: 2.5,
      ease: "power2.inOut",
      onComplete: () => {
        // 3. Teleport while screen is fully foggy
        ScrollTrigger.getAll().forEach(t => t.disable());
        window.scrollTo({ top: 0, behavior: 'instant' });
        scrollData.current.progress = 0;

        // 4. Fog Out (Lift the Mist) - TRANSCENDENTLY SLOW
        setTimeout(() => {
          gsap.to(scrollData.current, {
            resetFog: 0,
            duration: 5.0,
            ease: "power3.inOut", // Changed to inOut for even smoother lift
            onComplete: () => {
              ScrollTrigger.getAll().forEach(t => t.enable());
              ScrollTrigger.refresh();
            }
          });
        }, 500);
      }
    });
  };

  return (
    <main ref={container} className="relative bg-[#f8f5f0] font-['Times_New_Roman'] serif overflow-x-hidden">
      <div className="fixed inset-0 h-screen w-full z-0">
        <Canvas shadows camera={{ position: [-6.17, 7.6, 160], fov: 47 }}>
          <Scene scrollData={scrollData} />
        </Canvas>
      </div>

      {/* Vertical Progress Bar */}
      <div className="fixed right-10 top-1/2 -translate-y-1/2 z-[60] flex flex-col items-center gap-4 opacity-40">
        <div className="text-xs text-[#D4AF37] font-serif">I</div>
        <div className="w-[1px] h-40 bg-gradient-to-b from-transparent via-[#D4AF37] to-transparent relative">
          {/* The Moving dot */}
          <div
            className="absolute w-2 h-2 bg-[#D4AF37] rounded-full -left-[3.5px]"
            style={{ top: `${scrollData.current.progress * 100}%` }}
          />
        </div>
        <div className="text-xs text-[#D4AF37] font-serif">X</div>
      </div>

      <div
        id="final-screen"
        className="fixed inset-0 z-50 flex flex-col items-center justify-center opacity-0 pointer-events-none"
        style={{ background: 'transparent' }} // Let the 3D white-out be the background
      >

        <div className="text-center pointer-events-auto">
          {/* Majestic Large Text */}
          <h1 className="text-[12vw] text-[#D4AF37] opacity-20 leading-none tracking-[0.4em] select-none font-serif mb-4">
            FINIS
          </h1>

          {/* Roman Quote */}
          <p className="text-2xl text-gray-500 italic tracking-widest mb-12">
            "Rome is not a place, it is an idea."
          </p>

          {/* CTA Button */}
          <button
            onClick={handleRestart}
            className="group relative px-12 py-4 overflow-hidden border border-[#D4AF37] text-[#D4AF37] tracking-[0.3em] uppercase transition-all duration-500 hover:text-white"
          >
            <span className="relative z-10">Relive the Glory</span>
            <div className="absolute inset-0 z-0 bg-[#D4AF37] translate-y-full transition-transform duration-500 group-hover:translate-y-0" />
          </button>

          {/* Small Credits */}
          <div className="mt-20 opacity-40 text-sm text-gray-400 tracking-[0.2em] uppercase">
            A Roman Historical Experience
          </div>
        </div>
      </div>
      <div className="h-[2500vh] w-full" />
    </main>
  );
}