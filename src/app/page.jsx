"use client";
import { useRef, useEffect, useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { useProgress } from "@react-three/drei";
import Scene from "@/component/scene";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Home() {
  const scrollData = useRef({ progress: 0, resetFog: 0 });
  const container = useRef();
  const audioRef = useRef(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [gateOpen, setGateOpen] = useState(false);

  // 3D Asset Loading Progress
  const { progress: assetsProgress } = useProgress();
  const assetsLoaded = assetsProgress === 100;

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio("/bg_music.mp3");
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;

    // Lock scroll until gate is opened
    if (!gateOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Handle entering the experience
  const handleEnter = useCallback(() => {
    if (!assetsLoaded) return;
    setGateOpen(true);
    document.body.style.overflow = "";

    // Tell SmoothScroll (Lenis) to start accepting scroll
    window.dispatchEvent(new Event("gate-opened"));

    // Fade out the gate overlay
    gsap.to("#gate-overlay", {
      opacity: 0,
      duration: 2.0,
      ease: "power2.inOut",
      onComplete: () => {
        const el = document.getElementById("gate-overlay");
        if (el) el.style.display = "none";
      },
    });

    // Start music if enabled
    if (soundEnabled && audioRef.current) {
      audioRef.current.volume = 0;
      audioRef.current.play().catch(() => { });
      gsap.to(audioRef.current, { volume: 0.4, duration: 3.0, ease: "power2.inOut" });
    }
  }, [soundEnabled, assetsLoaded]);

  // Sync audio volume with scroll progress (fade during whiteout)
  useEffect(() => {
    let raf;
    const syncVolume = () => {
      if (audioRef.current && !audioRef.current.paused) {
        const progress = scrollData.current.progress || 0;
        const resetFog = scrollData.current.resetFog || 0;
        // Fade volume down during whiteout (>85%) or reset
        const whiteoutFade = progress > 0.85 ? 1 - ((progress - 0.85) / 0.15) : 1;
        const resetFade = 1 - resetFog;
        const targetVol = Math.max(0, Math.min(0.4, 0.4 * Math.min(whiteoutFade, resetFade)));
        audioRef.current.volume += (targetVol - audioRef.current.volume) * 0.05;
      }
      raf = requestAnimationFrame(syncVolume);
    };
    if (gateOpen) raf = requestAnimationFrame(syncVolume);
    return () => cancelAnimationFrame(raf);
  }, [gateOpen]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.to(scrollData.current, {
      progress: 1,
      scrollTrigger: {
        trigger: container.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      },
      onUpdate: () => {
        const progress = scrollData.current.progress;
        const finalScreen = document.getElementById("final-screen");
        if (finalScreen) {

          let op = (progress - 0.80) / (0.92 - 0.80);
          op = Math.max(0, Math.min(1, op));

          finalScreen.style.visibility = op > 0 ? "visible" : "hidden";
          finalScreen.style.opacity = op.toString();
          finalScreen.style.pointerEvents = op > 0.8 ? "auto" : "none";
          finalScreen.style.transform = `scale(${0.95 + (op * 0.05)})`

          if (op >= 1) {

            document.body.style.overflow = "hidden";
          } else {
            if (gateOpen) document.body.style.overflow = "";
          }
        }

      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };

  }, [gateOpen]);

  // 🔥 THE CINEMATIC RESET (MAXIMUM SLOW & TRANSCENDENT)
  const handleRestart = () => {
    // 1. Fade UI slowly
    gsap.to("#final-screen", {
      opacity: 0,
      duration: 1.0,
      ease: "power2.inOut",
      onComplete: () => {
        const el = document.getElementById("final-screen");
        if (el) el.style.visibility = "hidden";
      }
    });

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
            ease: "power3.inOut",
            onComplete: () => {
              ScrollTrigger.getAll().forEach(t => t.enable());
              ScrollTrigger.refresh();
            }
          });
        }, 500);
      }
    });
  };

  // Toggle sound at any time
  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => {
      const next = !prev;
      if (audioRef.current) {
        if (next) {
          audioRef.current.play().catch(() => { });
          gsap.to(audioRef.current, { volume: 0.4, duration: 1.0 });
        } else {
          gsap.to(audioRef.current, {
            volume: 0,
            duration: 0.5,
            onComplete: () => audioRef.current?.pause(),
          });
        }
      }
      return next;
    });
  }, []);

  return (
    <main ref={container} className="relative bg-[#f8f5f0] font-['Times_New_Roman'] serif overflow-x-hidden">

      {/* ═══════════════════════════════════════════════════════ */}
      {/* GATE OVERLAY — Sound Toggle + Enter */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div
        id="gate-overlay"
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
        style={{
          background: "radial-gradient(ellipse at center, rgba(26,22,16,0.85) 0%, rgba(10,8,5,0.97) 100%)",
          backdropFilter: "blur(8px)",
        }}
      >
        {/* Decorative Top Line */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 flex items-center gap-4 opacity-30">
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-[#D4AF37]" />
          <div className="w-1.5 h-1.5 bg-[#D4AF37] rotate-45" />
          <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-[#D4AF37]" />
        </div>

        {/* Latin Subtitle */}
        <p className="text-[#D4AF37]/40 text-xs tracking-[0.5em] uppercase mb-6 font-serif">
          Senatus Populusque Romanus
        </p>

        {/* Title */}
        <h1 className="text-[#D4AF37] text-5xl md:text-7xl font-serif tracking-[0.3em] mb-2 text-center leading-tight select-none"
          style={{ textShadow: "0 0 60px rgba(212,175,55,0.15)" }}
        >
          ROME
        </h1>
        <p className="text-[#D4AF37]/25 text-lg tracking-[0.6em] uppercase font-serif mb-14">
          Eternal Glory
        </p>

        {/* Sound Toggle */}
        <div className="flex flex-col items-center gap-5 mb-12">
          <p className="text-[#a09880] text-sm tracking-[0.2em] uppercase">
            Experience with Sound
          </p>

          <button
            onClick={() => setSoundEnabled(prev => !prev)}
            className="group relative flex items-center gap-4 px-8 py-3 border border-[#D4AF37]/30 rounded-sm transition-all duration-500 hover:border-[#D4AF37]/60"
            style={{ background: "rgba(212,175,55,0.03)" }}
          >
            {/* Speaker Icon */}
            <svg
              width="24" height="24" viewBox="0 0 24 24" fill="none"
              className="text-[#D4AF37] transition-all duration-300"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" opacity="0.2" />
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              {soundEnabled ? (
                <>
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </>
              ) : (
                <>
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </>
              )}
            </svg>

            <span className="text-[#D4AF37] tracking-[0.15em] uppercase text-sm font-serif">
              {soundEnabled ? "Sound On" : "Sound Off"}
            </span>

            {/* Glow indicator */}
            <div
              className="w-2 h-2 rounded-full transition-all duration-500"
              style={{
                background: soundEnabled ? "#D4AF37" : "#555",
                boxShadow: soundEnabled ? "0 0 8px rgba(212,175,55,0.6)" : "none",
              }}
            />
          </button>
        </div>

        {/* Enter Button with Loading State */}
        <button
          onClick={handleEnter}
          disabled={!assetsLoaded}
          className={`group relative px-16 py-5 overflow-hidden border border-[#D4AF37]/50 text-[#D4AF37] tracking-[0.4em] uppercase transition-all duration-700 font-serif text-sm ${!assetsLoaded ? 'opacity-50 cursor-wait' : 'hover:text-[#1a1610] hover:border-[#D4AF37]'}`}
        >
          <span className="relative z-10">
            {assetsLoaded ? "Enter the Empire" : `Loading... ${Math.round(assetsProgress)}%`}
          </span>
          {assetsLoaded && (
            <div className="absolute inset-0 z-0 bg-[#D4AF37] translate-y-full transition-transform duration-700 group-hover:translate-y-0" />
          )}
        </button>

        {/* Scroll hint */}
        {assetsLoaded && (
          <div className="absolute bottom-10 flex flex-col items-center gap-2 opacity-20">
            <p className="text-[#D4AF37] text-[10px] tracking-[0.3em] uppercase">
              Scroll to Explore
            </p>
            <svg width="16" height="24" viewBox="0 0 16 24" className="text-[#D4AF37] animate-bounce">
              <path d="M8 4 L8 18 M3 14 L8 19 L13 14" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
          </div>
        )}

        {/* Decorative Bottom Line */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex items-center gap-4 opacity-20">
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent to-[#D4AF37]/50" />
          <div className="text-[#D4AF37]/30 text-[10px] tracking-[0.3em] font-serif">SPQR</div>
          <div className="w-24 h-[1px] bg-gradient-to-l from-transparent to-[#D4AF37]/50" />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* Persistent Sound Toggle (appears after gate opens) */}
      {/* ═══════════════════════════════════════════════════════ */}
      {gateOpen && (
        <button
          onClick={toggleSound}
          className="fixed top-6 left-6 z-[70] flex items-center gap-2 px-3 py-2 border border-[#D4AF37]/20 rounded-sm transition-all duration-500 hover:border-[#D4AF37]/50 group"
          style={{ background: "rgba(240,236,230,0.6)", backdropFilter: "blur(4px)" }}
          title={soundEnabled ? "Mute" : "Unmute"}
        >
          <svg
            width="18" height="18" viewBox="0 0 24 24" fill="none"
            className="text-[#D4AF37]/70 group-hover:text-[#D4AF37] transition-colors"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            {soundEnabled ? (
              <>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </>
            ) : (
              <>
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </>
            )}
          </svg>
        </button>
      )}

      <div className="fixed inset-0 h-screen w-full z-0">
        <Canvas shadows camera={{ position: [-6.17, 7.6, 115], fov: 47 }}>
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
        style={{ background: 'transparent', visibility: 'hidden' }}
      >
        <div className="text-center pointer-events-auto">
          {/* 🔥 REMOVED opacity-20 and added a subtle glow */}
          <h1 className="text-[12vw] text-[#D4AF37] leading-none tracking-[0.4em] select-none font-serif mb-4"
            style={{ textShadow: "0 0 40px rgba(212,175,55,0.3)" }}>
            FINIS
          </h1>

          <p className="text-2xl text-gray-600 italic tracking-widest mb-12">
            "Rome is not a place, it is an idea."
          </p>

          <button
            onClick={handleRestart}
            className="group relative px-12 py-4 overflow-hidden border border-[#D4AF37] text-[#D4AF37] tracking-[0.3em] uppercase transition-all duration-500 hover:text-white"
          >
            <span className="relative z-10">Relive the Glory</span>
            <div className="absolute inset-0 z-0 bg-[#D4AF37] translate-y-full transition-transform duration-500 group-hover:translate-y-0" />
          </button>
        </div>
      </div>
      <div className="h-[5000vh] w-full" />
    </main>
  );
}
