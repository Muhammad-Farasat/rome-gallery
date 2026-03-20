"use client";
import { useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import Scene from "@/component/scene"; 
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Home() {
  const scrollData = useRef({ progress: 0 });
  const container = useRef();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Main Z-axis movement trigger
    gsap.to(scrollData.current, {
      progress: 1,
      scrollTrigger: {
        trigger: container.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
    });

    // Fading in Emperor accomplishments
    const emperorIds = ["#emp1", "#emp2", "#emp3", "#emp4", "#throne"];
    emperorIds.forEach((id, i) => {
        gsap.fromTo(id, 
            { opacity: 0, y: 30 },
            { 
                opacity: 1, 
                y: 0, 
                scrollTrigger: {
                    trigger: container.current,
                    start: `${(i * 20)}% top`,
                    end: `${(i * 20) + 15}% top`,
                    scrub: true,
                }
            }
        );
        // Fade out as we leave them (except for the final throne quote)
        if (id !== "#throne") {
            gsap.to(id, {
                opacity: 0,
                scrollTrigger: {
                    trigger: container.current,
                    start: `${(i * 20) + 15}% top`,
                    end: `${(i * 20) + 20}% top`,
                    scrub: true,
                }
            });
        }
    });
  }, []);

  return (
    <main ref={container} className="relative bg-white font-['Times_New_Roman'] serif">
      <div className="fixed inset-0 h-screen w-full z-0">
        <Canvas shadows camera={{ position: [-6, 7, 100], fov: 45 }}>
          <Scene scrollData={scrollData} />
        </Canvas>
      </div>

      {/* HTML OVERLAY CONTENT */}
      <div className="fixed inset-0 z-10 pointer-events-none flex items-center justify-center">
        
        {/* Emperor 1 */}
        <div id="emp1" className="absolute opacity-0 text-center max-w-xl">
            <h1 className="text-6xl text-[#D4AF37] mb-4 uppercase tracking-widest">Augustus</h1>
            <p className="text-2xl text-gray-700 italic">"I found Rome a city of bricks and left it a city of marble."</p>
        </div>

        {/* Emperor 2 */}
        <div id="emp2" className="absolute opacity-0 text-center max-w-xl">
            <h1 className="text-6xl text-[#D4AF37] mb-4 uppercase tracking-widest">Trajan</h1>
            <p className="text-2xl text-gray-700 italic">Expander of the Empire to its greatest territorial extent.</p>
        </div>

        {/* Emperor 3 */}
        <div id="emp3" className="absolute opacity-0 text-center max-w-xl">
            <h1 className="text-6xl text-[#D4AF37] mb-4 uppercase tracking-widest">Marcus Aurelius</h1>
            <p className="text-2xl text-gray-700 italic">"You have power over your mind - not outside events."</p>
        </div>

        {/* Emperor 4 */}
        <div id="emp4" className="absolute opacity-0 text-center max-w-xl">
            <h1 className="text-6xl text-[#D4AF37] mb-4 uppercase tracking-widest">Constantine</h1>
            <p className="text-2xl text-gray-700 italic">The first Emperor to convert to Christianity and founder of Constantinople.</p>
        </div>

        {/* Final Quote at the Throne */}
        <div id="throne" className="absolute opacity-0 text-center max-w-2xl mt-40">
            <h1 className="text-5xl text-[#D4AF37] uppercase tracking-[1.5em] mb-4">Veni Vidi Vici</h1>
            <p className="text-xl text-gray-400">Rome is not a place, it is an idea.</p>
        </div>
      </div>

      {/* Scroll Proxy */}
      <div className="h-[1000vh] w-full" />
    </main>
  );
}