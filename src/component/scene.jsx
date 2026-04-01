"use client";
import { Suspense, useRef, useMemo } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import useSpline from '@splinetool/r3f-spline';
import { PerspectiveCamera, ContactShadows, Float, useGLTF, Html, Environment, MeshReflectorMaterial } from '@react-three/drei';
import * as THREE from 'three';
import EmperorStatue from "./emperorstatue";
import HeavenlyDoor from "./heavenlydoor";
import Dust from "./dust";

export default function Scene({ scrollData, ...props }) {
    const { size } = useThree();
    const isMobile = size.width < 768;
    const { nodes, materials } = useSpline('https://prod.spline.design/06MhAi5pkjH87O9s/scene.splinecode');

    const endingLightRef = useRef();

    useMemo(() => {
        const floor = materials['Plane Material'];
        if (!floor) return;
        floor.roughness = 0.3;
        floor.metalness = 0.0;
        floor.envMapIntensity = 1.0;
        floor.needsUpdate = true;
    }, [materials]);

    const fogVisuals = useRef({ near: 100, far: 2500 });

    useFrame((state) => {
        if (!scrollData || !scrollData.current) return;

        const progress = scrollData.current.progress;

        // --- CONSTANTS ---
        const startZ = isMobile ? 180 : 140;
        const doorZ = 115;

        // 2. CALCULATE TARGET CAMERA Z
        const hallwayEnd = 0.70;      // hall ends earlier
        const columnsEndZ = -1400;    // camera stops here — throne is far away
        const finalZ = -1700; // Keeps camera well back from throne (-1900)

        let targetZ;
        if (progress < 0.20) {
            targetZ = THREE.MathUtils.lerp(startZ, doorZ, progress / 0.20);
        } else if (progress < hallwayEnd) {
            const hallProgress = (progress - 0.20) / (hallwayEnd - 0.20);
            targetZ = THREE.MathUtils.lerp(doorZ, columnsEndZ, hallProgress);
        } else {
            const finalProgress = (progress - hallwayEnd) / (1.0 - hallwayEnd);
            targetZ = THREE.MathUtils.lerp(columnsEndZ, finalZ, finalProgress);
        }

        // 3. CAMERA TELEPORT (Only during reset/whiteout)
        const isResetting = scrollData.current.resetFog > 0.5;
        if (isResetting) {
            state.camera.position.z = targetZ;
        } else {
            // Tighter tracking (0.15) avoids "rubber-banding" feel
            state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.15);
            // Change to:
    // targetZ = -1400; 

        }

        // 4. 🔥 CINEMATIC FOG FADE (THE "MIST LIFTING" LOGIC)
        // We calculate what the fog *should* be based on scroll OR reset trigger
        const whiteoutStart = 0.70;   // starts exactly when camera stops moving
        const whiteoutEnd = 0.90;
        const whiteoutFactor = THREE.MathUtils.smoothstep(progress, whiteoutStart, whiteoutEnd);
        const resetFactor = scrollData.current.resetFog || 0;

        const combinedFactor = Math.max(whiteoutFactor, resetFactor);

        // Fog pulls in closer to create the "White Void"
        const targetFogFar = THREE.MathUtils.lerp(2500, 30, combinedFactor);
        const targetFogNear = THREE.MathUtils.lerp(100, 0, combinedFactor);

        // Smoothly apply fog changes
        fogVisuals.current.far = THREE.MathUtils.lerp(fogVisuals.current.far, targetFogFar, 0.08);
        fogVisuals.current.near = THREE.MathUtils.lerp(fogVisuals.current.near, targetFogNear, 0.08);

        if (state.scene.fog) {
            state.scene.fog.far = fogVisuals.current.far;
            state.scene.fog.near = fogVisuals.current.near;
        }

        // Light intensity behind the throne blooms out
        if (endingLightRef.current) {
            const targetLight = THREE.MathUtils.lerp(1, 1500, combinedFactor);
            endingLightRef.current.intensity = THREE.MathUtils.lerp(endingLightRef.current.intensity, targetLight, 0.1);
        }

        // Set camera orientation
        state.camera.position.y = isMobile ? 9 : 7.6;
        state.camera.position.x = isMobile ? -3 : -6.17;
        const lookX = isMobile ? -3 : -6.17;
        // Dynamic LookAt (looks further ahead during fast movement)
        const looksAhead = isResetting ? 0 : 100;
        state.camera.lookAt(lookX, 7.6, state.camera.position.z - looksAhead);
    });


    return (
        <>
            <color attach="background" args={['#f0ece6']} />
            <fog attach="fog" args={['#f0ece6', 100, 2500]} />

            <group {...props} dispose={null}>
                <scene name="Scene 1">
                    <Environment preset="city" background={false} />

                    <HeavenlyDoor scrollData={scrollData} />


                    <Dust count={500} />

                    {/* THE DIVINE ENDING LIGHT - Sits behind the throne */}
                    <pointLight
                        ref={endingLightRef}
                        position={[-3.8, 50, -2050]}
                        color="#fffaf0"
                        distance={2000}
                    />

                    {/* ALL REMAINING CODE (LIGHTS, STATUES, PILLARS, THRONE) REMAINS UNTOUCHED */}
                    <directionalLight name="Directional Light 2" intensity={1} position={[20, 50, 20]} />
                    <hemisphereLight name="Default Ambient Light" intensity={0.75} color="#fff" />
                    <ContactShadows position={[0, -0.88, -1000]} opacity={0.5} scale={2000} blur={1.5} far={15} color="#2a2520" frames={1} />

                    <Suspense fallback={null}>
                        {/* Statues remain exactly as they were, with historical descriptions added */}
                        <EmperorStatue
                            url="/augustus_opt.glb"
                            name="Augustus"
                            quote="I found Rome a city of bricks and left it a city of marble."
                            description="The founder of the Roman Empire and its first Emperor, establishing the Pax Romana."
                            position={[10, 0, -40]}
                            rotation={[0, -Math.PI / 0.15, 0]}
                            scale={28}
                            textOffset={isMobile ? [-16, 8, 30] : [4, 8, 30]}
                            textRotation={[0, Math.PI / 1.5, 0]}
                            podiumOffset={[0, 0, 0]}
                            podiumSize={[20, 1, 20]}
                        />

                        <EmperorStatue
                            url="/caesar_opt.glb"
                            name="Caesar"
                            quote="Veni, Vidi, Vici."
                            description="A military genius who expanded the Republic and paved the road for the Imperial era."
                            position={[-20, 0, -220]}
                            rotation={[0, Math.PI / 4, 0]}
                            scale={8}
                            textOffset={isMobile ? [18, 4, 0] : [40, 4, 0]}
                            textRotation={[0, -Math.PI / 4, 0]}
                            podiumOffset={[0, 0, 0]}
                            podiumSize={[20, 1, 20]}
                        />

                        <EmperorStatue
                            url="/trajan_opt.glb"
                            name="Trajan"
                            quote="The best of princes."
                            description="Under his rule, the Roman Empire reached its greatest territorial extent in history."
                            podiumOffset={[-6, 0, 0]}
                            podiumSize={[25, 1, 25]}

                            position={[16, 0, -400]}
                            rotation={[0, Math.PI / 4, 0]}
                            scale={28}

                            textOffset={[-18, 6, -16]}
                            textRotation={[0, -Math.PI / 4, 0]}
                        />

                        <EmperorStatue
                            url="/aurelius_opt.glb"
                            name="Aurelius"
                            quote="Our life is what our thoughts make it."
                            description="The Philosopher King and author of 'Meditations', the last of the Five Good Emperors."
                            position={[-22, -2, -550]}
                            rotation={[0, Math.PI / 4, 0]}
                            scale={2}
                            textOffset={[44, 14, 0]}
                            textRotation={[0, -Math.PI / 4, 0]}
                            podiumOffset={[0, 2, 3]}
                            podiumSize={[20, 1, 20]}
                        />

                        <EmperorStatue
                            url="/hadrian_opt.glb"
                            name="Hadrian"
                            quote="Brick by brick, my citizens."
                            description="A prolific builder who consolidated the empire and rebuilt the majestic Pantheon."
                            position={[10, 0, -700]}
                            rotation={[0, -Math.PI / 0.15, 0]}
                            scale={3}
                            textOffset={[4, 8, 30]}
                            textRotation={[0, Math.PI / 1.5, 0]}
                            podiumOffset={[0, 0, 0]}
                            podiumSize={[20, 1, 20]}
                        />

                        <EmperorStatue
                            url="/constantine_opt.glb"
                            name="Constantine"
                            quote="In this sign, conquer."
                            description="The first Emperor to convert to Christianity and the founder of Constantinople."
                            position={[-20, -9, -860]}
                            rotation={[0, Math.PI / 6, 0]}
                            scale={8}
                            textOffset={[35, 12, 0]}
                            textRotation={[0, -Math.PI / 6, 0]}
                            podiumOffset={[0, 10, 0]}
                            podiumSize={[20, 2, 20]}
                        />

                        <EmperorStatue
                            url="/vespasian_opt.glb"
                            name="Vespasian"
                            quote="Money has no smell."
                            description="Founder of the Flavian dynasty who stabilized Rome and began the Colosseum."
                            position={[10, 0, -1050]}
                            rotation={[0, -Math.PI / 6, 0]}
                            scale={38}
                            textOffset={[-35, 3, 0]}
                            textRotation={[0, Math.PI / 6, 0]}
                            podiumOffset={[0, 1, 0]}
                            podiumSize={[20, 2, 20]}
                        />

                        <EmperorStatue
                            url="/nero_opt.glb"
                            name="Nero"
                            quote="Qualis artifex pereo."
                            description="Infamous for his artistic vanity and the collapse of the Julio-Claudian dynasty."
                            position={[-22, 0, -1200]}
                            rotation={[0, Math.PI / 6, 0]}
                            scale={42}
                            textOffset={[35, 10, 0]}
                            textRotation={[0, -Math.PI / 6, 0]}
                            podiumOffset={[0, 1, 0]}
                            podiumSize={[20, 2, 20]}
                        />

                        <EmperorStatue
                            url="/caligula_opt.glb"
                            name="Caligula"
                            quote="Let them hate, so long as they fear."
                            description="A young ruler remembered for his erratic behavior and extreme authoritarianism."
                            position={[15, 0, -1350]}
                            rotation={[0, -Math.PI / 6, 0]}
                            scale={0.05}
                            textOffset={[-35, 10, 0]}
                            textRotation={[0, Math.PI / 6, 0]}
                            podiumOffset={[0, 1, 0]}
                            podiumSize={[20, 2, 20]}
                        />
                    </Suspense>

                    <mesh name="Plane 2" geometry={nodes['Plane 2'].geometry} material={materials['Plane 2 Material']} castShadow receiveShadow position={[1, 149.28, -2000]} rotation={[0.01, 0, -Math.PI / 2]} />

                    {/* Pillars Rendering (Preserved) */}
                    {useMemo(() => {
                        const pillarItems = [];
                        const zStart = 100;
                        const zEnd = -1600;
                        const step = 100;
                        const cameraX = isMobile ? -3 : -6.17;
                        const xOffset = isMobile ? 6 : 2;
                        for (let z = zStart; z >= zEnd; z -= step) {
                            pillarItems.push(
                                <group key={`r-${z}`} position={[cameraX + xOffset, 0.16, z]} scale={[-3.45, 3.07, 2.38]}>
                                    <group rotation={[-Math.PI / 2, 0, 0]}>
                                        <mesh geometry={nodes.Object_21?.geometry || nodes.Object_2.geometry} material={nodes.Object_21?.material || nodes.Object_2.material} castShadow receiveShadow />
                                        <mesh geometry={nodes.Object_31?.geometry || nodes.Object_3.geometry} material={nodes.Object_31?.material || nodes.Object_3.material} castShadow receiveShadow />
                                    </group>
                                </group>
                            );
                        }
                        return pillarItems;
                    }, [nodes, isMobile])}

                    {/* Throne Rendering (Preserved) */}
                    <group name="throne_of_pearls" position={[-3.8, 32.27, -1900]} scale={4.46}>
                        <group rotation={[-Math.PI / 2, 0, 0]}>
                            <mesh geometry={nodes.seat__0.geometry} material={nodes.seat__0.material} castShadow receiveShadow />
                            <mesh geometry={nodes.armrests__0.geometry} material={nodes.armrests__0.material} castShadow receiveShadow />
                            <mesh geometry={nodes.back__0.geometry} material={nodes.back__0.material} castShadow receiveShadow />
                            <mesh geometry={nodes.pillars__0.geometry} material={nodes.pillars__0.material} castShadow receiveShadow />
                        </group>
                    </group>

                    <group name="Stair Base" position={[-16.16, 15.37, -1900]}>
                        <mesh name="Cube 3" geometry={nodes['Cube 3'].geometry} material={materials['Cube 3 Material']} castShadow receiveShadow position={[0, -14.37, 60.57]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={1} />
                        <mesh name="Cube 2" geometry={nodes['Cube 2'].geometry} material={materials['Cube 2 Material']} castShadow receiveShadow position={[0, -9.42, 38.68]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={1} />
                        <mesh name="Cube" geometry={nodes.Cube.geometry} material={materials['Cube Material']} castShadow receiveShadow position={[0, 0, -21.73]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={1} />
                    </group>

                    <PerspectiveCamera name="Camera" makeDefault={false} far={100000} near={10} fov={47} position={[-6.17, 7.6, 93.6]} />
                    <mesh name="Plane" geometry={nodes.Plane.geometry} material={materials['Plane Material']} castShadow receiveShadow position={[-29.55, -0.9, -69.64]} rotation={[-Math.PI / 2, 0, -Math.PI / 2]} />

                    <mesh rotation={[-Math.PI / 2, 0, -Math.PI / 2]} position={[-29.55, -0.82, -1000]} receiveShadow>
                        <planeGeometry args={[8000, 1000]} />
                        <MeshReflectorMaterial
                            resolution={512}
                            blur={[200, 80]}
                            mixBlur={0.5}
                            mixStrength={0.8}
                            roughness={0.1}
                            depthScale={1.2}
                            minDepthThreshold={0.4}
                            maxDepthThreshold={1.4}
                            color="#c8c4bc"
                            metalness={0.0}
                            mirror={0.75}
                        />
                    </mesh>
                </scene>
            </group>
        </>
    );
}