"use client";
import { Suspense, useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import useSpline from '@splinetool/r3f-spline';
import { PerspectiveCamera, ContactShadows, Float, useGLTF, Html, Environment, MeshReflectorMaterial } from '@react-three/drei';
import * as THREE from 'three';

function EmperorStatue({ url, position, rotation, scale = 1, name, quote, textOffset, textRotation = [0, 0, 0] }) {
    if (!url) return null;

    const { scene } = useGLTF(url);
    const clonedScene = useMemo(() => scene.clone(), [scene]);
    const htmlRef = useRef();

    useFrame((state) => {
        if (!htmlRef.current) return;

        const camZ = state.camera.position.z;
        const statueZ = position[2];
        const distance = camZ - statueZ;

        let opacity = 0;

        if (distance < 80 && distance > -15) {
            if (distance > 40) {
                opacity = THREE.MathUtils.mapLinear(distance, 80, 40, 0, 1);
            } else if (distance < 5) {
                opacity = THREE.MathUtils.mapLinear(distance, 5, -15, 1, 0);
            } else {
                opacity = 1;
            }
        }

        htmlRef.current.style.opacity = opacity;
        htmlRef.current.style.transform = `translateY(${Math.sin(state.clock.elapsedTime) * 10}px)`;
    });

    return (
        <group position={position} rotation={rotation}>
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                <primitive object={clonedScene} scale={scale} position={[0, 1, 0]} />
            </Float>

            {name && (
                <Html
                    position={textOffset}
                    center
                    transform
                    distanceFactor={30}
                    rotation={textRotation}
                >
                    <div ref={htmlRef} style={{
                        opacity: 0,
                        transition: 'opacity 0.3s ease-out',
                        width: '500px',
                        textAlign: textOffset[0] < 0 ? 'right' : 'left',
                        pointerEvents: 'none',
                        color: 'white',
                        textShadow: '0px 0px 20px rgba(0,0,0,0.5)'
                    }}>
                        <h1 style={{
                            fontSize: '5rem',
                            color: '#cba052',
                            margin: 0,
                            fontFamily: 'serif',
                            letterSpacing: '12px',
                            fontWeight: 'normal',
                            textTransform: 'uppercase'
                        }}>
                            {name}
                        </h1>
                        <p style={{
                            fontSize: '1.4rem',
                            color: '#444',
                            fontStyle: 'italic',
                            marginTop: '5px',
                            maxWidth: '400px',
                            display: 'inline-block'
                        }}>
                            {quote}
                        </p>
                    </div>
                </Html>
            )}
        </group>
    );
}

export default function Scene({ scrollData, ...props }) {
    const { nodes, materials } = useSpline('https://prod.spline.design/06MhAi5pkjH87O9s/scene.splinecode');

    useMemo(() => {
        const floor = materials['Plane Material'];
        if (!floor) return;
        // Keep OG texture, just make it glossy
        floor.roughness = 0.3;
        floor.metalness = 0.0;
        floor.envMapIntensity = 1.0;
        floor.needsUpdate = true;
    }, [materials]);

    useFrame((state) => {
        if (!scrollData || !scrollData.current) return;
        const startZ = 93.6;
        const endZ = -630;
        const targetZ = THREE.MathUtils.lerp(startZ, endZ, scrollData.current.progress);

        state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.05);
        state.camera.position.y = 7.6;
        state.camera.lookAt(-6.17, 7.6, targetZ - 100);
    });

    return (
        <>
            {/* Match Spline background color exactly */}
            <color attach="background" args={['#f0ece6']} />
            <fog attach="fog" args={['#f0ece6', 500, 1100]} />

            <group {...props} dispose={null}>
                <scene name="Scene 1">

                    {/* Environment for floor reflections */}
                    <Environment preset="city" background={false} />

                    {/* === EXACT SPLINE LIGHTS === */}
                    <directionalLight
                        name="Directional Light 2"
                        castShadow
                        intensity={1}
                        shadow-mapSize-width={1024}
                        shadow-mapSize-height={1024}
                        shadow-camera-near={-10000}
                        shadow-camera-far={100000}
                        shadow-camera-left={-50}
                        shadow-camera-right={50}
                        shadow-camera-top={50}
                        shadow-camera-bottom={-50}
                        color="#fff"
                        position={[27.48, 328.43, -711.73]}
                    />
                    <directionalLight
                        name="Directional Light"
                        castShadow
                        intensity={0.7}
                        shadow-mapSize-width={1024}
                        shadow-mapSize-height={1024}
                        shadow-camera-near={-10000}
                        shadow-camera-far={100000}
                        shadow-camera-left={-1000}
                        shadow-camera-right={1000}
                        shadow-camera-top={1000}
                        shadow-camera-bottom={-1000}
                        position={[-51.56, 60.86, 16.52]}
                    />
                    <hemisphereLight
                        name="Default Ambient Light"
                        intensity={0.75}
                        color="#fff"
                    />

                    {/* Sharp contact shadows */}
                    <ContactShadows
                        position={[0, -0.88, -300]}
                        opacity={0.8}
                        scale={900}
                        blur={0.5}
                        far={15}
                        color="#2a2520"
                    />
                    <ContactShadows
                        position={[0, -0.88, -80]}
                        opacity={0.75}
                        scale={450}
                        blur={0.4}
                        far={12}
                        color="#2a2520"
                    />

                    <Suspense fallback={null}>
                        {/* 1. AUGUSTUS */}
                        <EmperorStatue
                            url="/augustus.glb"
                            position={[10, 8, -100]}
                            rotation={[0, -Math.PI / 96, 0]}
                            scale={34}
                            name="Augustus"
                            quote="I found Rome a city of bricks and left it a city of marble."
                            textOffset={[-30, 0, 0]}
                            textRotation={[0, Math.PI / 96, 0]}
                        />

                        {/* 2. CAESAR */}
                        <EmperorStatue
                            url="/caesar.glb"
                            position={[-25, -2, -250]}
                            rotation={[0, Math.PI / 44, 0]}
                            scale={12}
                            name="Caesar"
                            quote="Veni, Vidi, Vici."
                            textOffset={[32, 10, 0]}
                            textRotation={[0, -Math.PI / 44, 0]}
                        />

                        {/* 3. TRAJAN */}
                        <EmperorStatue
                            url="/trajan.glb"
                            position={[25, -32, -400]}
                            rotation={[0, -Math.PI / 4, 0]}
                            scale={28}
                            name="Trajan"
                            quote="The best of princes."
                            textOffset={[-30, 44, 40]}
                            textRotation={[0, Math.PI / 4, 0]}
                        />

                        {/* 4. MARCUS AURELIUS */}
                        <EmperorStatue
                            url="/aurelius.glb"
                            position={[-25, 8, -550]}
                            rotation={[0, Math.PI / 4, 0]}
                            scale={3}
                            name="Aurelius"
                            quote="Our life is what our thoughts make it."
                            textOffset={[36, 0, 0]}
                            textRotation={[0, -Math.PI / 4, 0]}
                        />
                    </Suspense>

                    {/* PILLARS & ENVIRONMENT */}
                    <mesh name="Plane 2" geometry={nodes['Plane 2'].geometry} material={materials['Plane 2 Material']} castShadow receiveShadow position={[-28.62, 149.28, -1050]} rotation={[0.01, 0, -Math.PI / 2]} />
                    <group name="doric_pillar 4" position={[-10.26, 0.16, -494.38]} scale={[-3.45, 3.07, 2.38]}><group rotation={[-Math.PI / 2, 0, 0]}><mesh geometry={nodes.Object_2.geometry} material={nodes.Object_2.material} castShadow receiveShadow /><mesh geometry={nodes.Object_3.geometry} material={nodes.Object_3.material} castShadow receiveShadow /></group></group>
                    <group name="doric_pillar 3" position={[-10.26, 0.16, -297.31]} scale={[-3.45, 3.07, 2.38]}><group rotation={[-Math.PI / 2, 0, 0]}><mesh geometry={nodes.Object_21.geometry} material={nodes.Object_21.material} castShadow receiveShadow /><mesh geometry={nodes.Object_31.geometry} material={nodes.Object_31.material} castShadow receiveShadow /></group></group>
                    <group name="doric_pillar 2" position={[-10.26, 0.16, -99.75]} scale={[-3.45, 3.07, 2.38]}><group rotation={[-Math.PI / 2, 0, 0]}><mesh geometry={nodes.Object_22.geometry} material={nodes.Object_22.material} castShadow receiveShadow /><mesh geometry={nodes.Object_32.geometry} material={nodes.Object_32.material} castShadow receiveShadow /></group></group>
                    <group name="doric_pillar 41" position={[-10.26, 0.16, -395.61]} scale={[-3.45, 3.07, 2.38]}><group rotation={[-Math.PI / 2, 0, 0]}><mesh geometry={nodes.Object_23.geometry} material={nodes.Object_23.material} castShadow receiveShadow /><mesh geometry={nodes.Object_33.geometry} material={nodes.Object_33.material} castShadow receiveShadow /></group></group>
                    <group name="doric_pillar 5" position={[-10.26, 0.16, -593]} scale={[-3.45, 3.07, 2.38]}><group rotation={[-Math.PI / 2, 0, 0]}><mesh geometry={nodes.Object_2.geometry} material={nodes.Object_2.material} castShadow receiveShadow /><mesh geometry={nodes.Object_3.geometry} material={nodes.Object_3.material} castShadow receiveShadow /></group></group>
                    <group name="doric_pillar 6" position={[-10.26, 0.16, -692]} scale={[-3.45, 3.07, 2.38]}><group rotation={[-Math.PI / 2, 0, 0]}><mesh geometry={nodes.Object_2.geometry} material={nodes.Object_2.material} castShadow receiveShadow /><mesh geometry={nodes.Object_3.geometry} material={nodes.Object_3.material} castShadow receiveShadow /></group></group>
                    <group name="doric_pillar 31" position={[-10.26, 0.16, -198.53]} scale={[-3.45, 3.07, 2.38]}><group rotation={[-Math.PI / 2, 0, 0]}><mesh geometry={nodes.Object_24.geometry} material={nodes.Object_24.material} castShadow receiveShadow /><mesh geometry={nodes.Object_34.geometry} material={nodes.Object_34.material} castShadow receiveShadow /></group></group>
                    <group name="doric_pillar" position={[-10.26, 0.16, -0.97]} scale={[-3.45, 3.07, 2.38]}><group rotation={[-Math.PI / 2, 0, 0]}><mesh geometry={nodes.Object_25.geometry} material={nodes.Object_25.material} castShadow receiveShadow /><mesh geometry={nodes.Object_35.geometry} material={nodes.Object_35.material} castShadow receiveShadow /></group></group>
                    <group name="throne_of_pearls" position={[-3.8, 32.27, -960]} scale={4.46}><group rotation={[-Math.PI / 2, 0, 0]}><mesh geometry={nodes.seat__0.geometry} material={nodes.seat__0.material} castShadow receiveShadow /><mesh geometry={nodes.armrests__0.geometry} material={nodes.armrests__0.material} castShadow receiveShadow /><mesh geometry={nodes.back__0.geometry} material={nodes.back__0.material} castShadow receiveShadow /><mesh geometry={nodes.pillars__0.geometry} material={nodes.pillars__0.material} castShadow receiveShadow /></group></group>
                    <group name="Stair Base" position={[-16.16, 15.37, -962]}><mesh name="Cube 3" geometry={nodes['Cube 3'].geometry} material={materials['Cube 3 Material']} castShadow receiveShadow position={[0, -14.37, 60.57]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={1} /><mesh name="Cube 2" geometry={nodes['Cube 2'].geometry} material={materials['Cube 2 Material']} castShadow receiveShadow position={[0, -9.42, 38.68]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={1} /><mesh name="Cube" geometry={nodes.Cube.geometry} material={materials['Cube Material']} castShadow receiveShadow position={[0, 0, -21.73]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={1} /></group>

                    <PerspectiveCamera name="Camera" makeDefault={false} far={100000} near={10} fov={47} position={[-6.17, 7.6, 93.6]} />

                    {/* Original Spline floor */}
                    <mesh
                        name="Plane"
                        geometry={nodes.Plane.geometry}
                        material={materials['Plane Material']}
                        castShadow
                        receiveShadow
                        position={[-29.55, -0.9, -69.64]}
                        rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
                    />

                    {/* Glassy reflector overlay on floor */}
                    <mesh
                        rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
                        position={[-29.55, -0.82, -69.64]}
                        receiveShadow
                    >
                        <planeGeometry args={[1200, 400]} />
                        <MeshReflectorMaterial
                            resolution={1024}
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