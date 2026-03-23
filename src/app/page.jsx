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

    // 1. Move Camera Progress
    gsap.to(scrollData.current, {
      progress: 1,
      scrollTrigger: {
        trigger: container.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.1,
      },
    });

  }, []);

  return (
    <main ref={container} className="relative bg-[#f8f5f0] font-['Times_New_Roman'] serif overflow-x-hidden">
      <div className="fixed inset-0 h-screen w-full z-0">
        <Canvas shadows camera={{ position: [-6.17, 7.6, 93.6], fov: 47 }}>
          <Scene scrollData={scrollData} />
        </Canvas>
      </div>

      <div className="h-[2500vh] w-full" />
    </main>
  );
}