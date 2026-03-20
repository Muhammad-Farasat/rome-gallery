"use client";
import { Suspense, useRef, useMemo } from "react"; // Added useMemo
import { useFrame } from "@react-three/fiber";
import useSpline from '@splinetool/r3f-spline';
import { PerspectiveCamera, ContactShadows, Float, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Component for the Emperor Statues
function EmperorStatue({ url, position, rotation, scale = 1 }) {
    // If url is missing, this would crash. Added safety check.
    if (!url) return null;
    
    const { scene } = useGLTF(url);

    // We clone the scene so we can use the same component for different models
    const clonedScene = useMemo(() => scene.clone(), [scene]);

    return (
        <group position={position} rotation={rotation}>
            {/* Pedestal - Grounds the statue */}
            {/* <mesh position={[0, -4.5, 0]} castShadow receiveShadow>
                <boxGeometry args={[5, 9, ]} />
                <meshStandardMaterial color="#f0f0f0" roughness={0} />
            </mesh> */}

            {/* The Bust */}
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                <primitive object={clonedScene} scale={scale} position={[0, 1, 0]} />
            </Float>
        </group>
    );
}

export default function Scene({ scrollData, ...props }) {
    const { nodes, materials } = useSpline('https://prod.spline.design/06MhAi5pkjH87O9s/scene.splinecode');

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
            <color attach="background" args={['#f8f5f0']} />
            <fog attach="fog" args={['#ffffff', 80, 650]} />

            <group {...props} dispose={null}>
                <scene name="Scene 1">
                    {/* LIGHTS AND SHADOWS */}
                    <ContactShadows position={[0, -0.9, -300]} opacity={0.35} scale={900} blur={3.5} far={18} color="#c8bfb0" />
                    <ContactShadows position={[0, -0.9, -80]} opacity={0.30} scale={450} blur={3} far={14} color="#c8bfb0" />
                    <hemisphereLight name="Ambient Glow" intensity={1.2} color="#ffffff" groundColor="#e8e0d8" />
                    <pointLight name="Divine Portal" intensity={4.5} distance={900} color="#ffffff" position={[0, 60, -700]} />
                    <spotLight name="Ethereal Bloom" intensity={2.5} angle={Math.PI / 4} penumbra={1.0} distance={1200} color="#f8f4ff" position={[0, 300, -200]} />
                    
                    {/* === ROMAN EMPEROR STATUES (Fixed URLs) === */}
                    <Suspense fallback={null}>
                        {/* Right Side Statues */}
                        <EmperorStatue url="/augustus.glb" position={[25, 4, 30]} rotation={[0, -Math.PI / 96, 0]} scale={21} />
                        <EmperorStatue url="/trajan.glb" position={[25, 4, -380]} rotation={[0, -Math.PI / 4, 0]} scale={5} />
                        <EmperorStatue url="/constantine.glb" position={[25, 4, -700]} rotation={[0, -Math.PI / 4, 0]} scale={15} />

                        {/* Left Side Statues */}
                        <EmperorStatue url="/caesar.glb" position={[-25, 4, -180]} rotation={[0, Math.PI / 44, 0]} scale={8} />
                        <EmperorStatue url="/aurelius.glb" position={[-25, 4, -550]} rotation={[0, Math.PI / 4, 0]} scale={11} />
                    </Suspense>

                    {/* PILLARS & THRONE */}
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
                    <mesh name="Plane" geometry={nodes.Plane.geometry} material={materials['Plane Material']} castShadow receiveShadow position={[-29.55, -0.9, -69.64]} rotation={[-Math.PI / 2, 0, -Math.PI / 2]} />
                </scene>
            </group>
        </>
    );
}