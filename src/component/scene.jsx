"use client";
import { Suspense, useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import useSpline from '@splinetool/r3f-spline';
import { PerspectiveCamera, ContactShadows, Float, useGLTF, Html, Environment, MeshReflectorMaterial } from '@react-three/drei';
import * as THREE from 'three';
import EmperorStatue from "./emperorstatue";

export default function Scene({ scrollData, ...props }) {
    const { nodes, materials } = useSpline('https://prod.spline.design/06MhAi5pkjH87O9s/scene.splinecode');

    useMemo(() => {
        const floor = materials['Plane Material'];
        if (!floor) return;
        floor.roughness = 0.3;
        floor.metalness = 0.0;
        floor.envMapIntensity = 1.0;
        floor.needsUpdate = true;
    }, [materials]);

    useFrame((state) => {
        if (!scrollData || !scrollData.current) return;

        const startZ = 93.6;

        // PRECISE FIX: Adjusted from -2800 to -2150.
        // This stops the camera exactly in front of the throne stairs.
        const endZ = -1950;

        const targetZ = THREE.MathUtils.lerp(startZ, endZ, scrollData.current.progress);

        state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.1);
        state.camera.position.y = 7.6;

        // Looking ahead of the camera to keep the throne in focus
        state.camera.lookAt(-6.17, 7.6, targetZ - 100);
    });

    return (
        <>
            <color attach="background" args={['#f0ece6']} />
            {/* Adjusted fog to pull the throne out of the mist at the end */}
            <fog attach="fog" args={['#f0ece6', 100, 2500]} />

            <group {...props} dispose={null}>
                <scene name="Scene 1">

                    <Environment preset="city" background={false} />

                    <directionalLight
                        name="Directional Light 2"
                        intensity={1}
                        shadow-mapSize-width={1024}
                        shadow-mapSize-height={1024}
                        position={[20, 50, 20]}
                    />

                    <hemisphereLight
                        name="Default Ambient Light"
                        intensity={0.75}
                        color="#fff"
                    />

                    <ContactShadows
                        position={[0, -0.88, -1000]}
                        opacity={0.5}
                        scale={2000}
                        blur={1.5}
                        far={15}
                        color="#2a2520"
                        frames={1}
                    />

                    <Suspense fallback={null}>
                        {/* Statues remain exactly as they were, with historical descriptions added */}
                        <EmperorStatue
                            url="/head_of_augustus.glb"
                            name="Augustus"
                            quote="I found Rome a city of bricks and left it a city of marble."
                            description="The founder of the Roman Empire and its first Emperor, establishing the Pax Romana."
                            position={[10, 0, -40]}
                            rotation={[0, -Math.PI / 0.15, 0]}
                            scale={28}
                            textOffset={[4, 8, 30]}
                            textRotation={[0, Math.PI / 1.5, 0]}
                            podiumOffset={[0, 0, 0]}
                            podiumSize={[20, 1, 20]}
                        />

                        <EmperorStatue
                            url="/caesar.glb"
                            name="Caesar"
                            quote="Veni, Vidi, Vici."
                            description="A military genius who expanded the Republic and paved the road for the Imperial era."
                            position={[-20, 0, -220]}
                            rotation={[0, Math.PI / 4, 0]}
                            scale={8}
                            textOffset={[40, 4, 0]}
                            textRotation={[0, -Math.PI / 4, 0]}
                            podiumOffset={[0, 0, 0]}
                            podiumSize={[20, 1, 20]}
                        />

                        <EmperorStatue
                            url="/trajan.glb"
                            name="Trajan"
                            quote="The best of princes."
                            description="Under his rule, the Roman Empire reached its greatest territorial extent in history."
                            position={[28, 0, -400]}
                            rotation={[0, -Math.PI / 4, 0]}
                            scale={28}
                            textOffset={[-48, 6, 25]}
                            textRotation={[0, Math.PI / 4, 0]}
                            podiumOffset={[-6, 0, 20]}
                            podiumSize={[14, 1, 14]}
                        />

                        <EmperorStatue
                            url="/aurelius.glb"
                            name="Aurelius"
                            quote="Our life is what our thoughts make it."
                            description="The Philosopher King and author of 'Meditations', the last of the Five Good Emperors."
                            position={[-22, 0, -550]}
                            rotation={[0, Math.PI / 4, 0]}
                            scale={2}
                            textOffset={[44, 14, 0]}
                            textRotation={[0, -Math.PI / 4, 0]}
                            podiumOffset={[0, 0, 3]}
                            podiumSize={[20, 1, 20]}
                        />

                        <EmperorStatue
                            url="/hadrian.glb"
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
                            url="/constantine.glb"
                            name="Constantine"
                            quote="In this sign, conquer."
                            description="The first Emperor to convert to Christianity and the founder of Constantinople."
                            position={[-20, -9, -1100]}
                            rotation={[0, Math.PI / 6, 0]}
                            scale={8}
                            textOffset={[35, 12, 0]}
                            textRotation={[0, -Math.PI / 6, 0]}
                            podiumOffset={[0, 10, 0]}
                            podiumSize={[20, 2, 20]}
                        />

                        <EmperorStatue
                            url="/emperor_vespasian.glb"
                            name="Vespasian"
                            quote="Money has no smell."
                            description="Founder of the Flavian dynasty who stabilized Rome and began the Colosseum."
                            position={[10, 0, -1400]}
                            rotation={[0, -Math.PI / 6, 0]}
                            scale={38}
                            textOffset={[-35, 3, 0]}
                            textRotation={[0, Math.PI / 6, 0]}
                            podiumOffset={[0, 1, 0]}
                            podiumSize={[20, 2, 20]}
                        />

                        <EmperorStatue
                            url="/prince_nero.glb"
                            name="Nero"
                            quote="Qualis artifex pereo."
                            description="Infamous for his artistic vanity and the collapse of the Julio-Claudian dynasty."
                            position={[-22, 0, -1550]}
                            rotation={[0, Math.PI / 6, 0]}
                            scale={42}
                            textOffset={[35, 14, 0]}
                            textRotation={[0, -Math.PI / 6, 0]}
                            podiumOffset={[0, 1, 0]}
                            podiumSize={[20, 2, 20]}
                        />

                        <EmperorStatue
                            url="/the_caligula.glb"
                            name="Caligula"
                            quote="Let them hate, so long as they fear."
                            description="A young ruler remembered for his erratic behavior and extreme authoritarianism."
                            position={[15, 0, -1700]}
                            rotation={[0, -Math.PI / 6, 0]}
                            scale={0.05}
                            textOffset={[-35, 16, 0]}
                            textRotation={[0, Math.PI / 6, 0]}
                            podiumOffset={[0, 1, 0]}
                            podiumSize={[20, 2, 20]}
                        />
                    </Suspense>

                    {/* All other meshes, pillars, and throne remain UNTOUCHED */}
                    <mesh name="Plane 2" geometry={nodes['Plane 2'].geometry} material={materials['Plane 2 Material']} castShadow receiveShadow position={[1, 149.28, -2500]} rotation={[0.01, 0, -Math.PI / 2]} />

                    {useMemo(() => {
                        const pillarItems = [];
                        const zStart = 100;
                        const zEnd = -2000;
                        const step = 100;
                        const cameraX = -6.17;
                        const xOffset = 2;

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
                    }, [nodes])}

                    <group name="throne_of_pearls" position={[-3.8, 32.27, -2300]} scale={4.46}>
                        <group rotation={[-Math.PI / 2, 0, 0]}>
                            <mesh geometry={nodes.seat__0.geometry} material={nodes.seat__0.material} castShadow receiveShadow />
                            <mesh geometry={nodes.armrests__0.geometry} material={nodes.armrests__0.material} castShadow receiveShadow />
                            <mesh geometry={nodes.back__0.geometry} material={nodes.back__0.material} castShadow receiveShadow />
                            <mesh geometry={nodes.pillars__0.geometry} material={nodes.pillars__0.material} castShadow receiveShadow />
                        </group>
                    </group>

                    <group name="Stair Base" position={[-16.16, 15.37, -2300]}>
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