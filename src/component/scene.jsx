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
        const endZ = -630;
        const targetZ = THREE.MathUtils.lerp(startZ, endZ, scrollData.current.progress);

        state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.05);
        state.camera.position.y = 7.6;
        state.camera.lookAt(-6.17, 7.6, targetZ - 100);
    });

    return (
        <>
            <color attach="background" args={['#f0ece6']} />
            <fog attach="fog" args={['#f0ece6', 500, 1100]} />

            <group {...props} dispose={null}>
                <scene name="Scene 1">

                    <Environment preset="city" background={false} />

                    <directionalLight
                        name="Directional Light 2"
                        // castShadow
                        intensity={1}
                        shadow-mapSize-width={1024}
                        shadow-mapSize-height={1024}
                        shadow-camera-near={-10000}
                        shadow-camera-far={100000}
                        shadow-camera-left={-50}
                        shadow-camera-right={50}
                        shadow-camera-top={50}
                        shadow-camera-bottom={-50}
                        // color="#fff"
                        // position={[27.48, 328.43, -711.73]}
                        position={[20, 50, 20]}
                    // intensity={0.8}
                    />
                    {/* <directionalLight
                        name="Directional Light"
                        castShadow
                        intensity={0.1}
                        shadow-mapSize-width={1024}
                        shadow-mapSize-height={1024}
                        shadow-camera-near={-10000}
                        shadow-camera-far={100000}
                        shadow-camera-left={-1000}
                        shadow-camera-right={1000}
                        shadow-camera-top={1000}
                        shadow-camera-bottom={-1000}
                        position={[-51.56, 60.86, 16.52]}
                    /> */}
                    <hemisphereLight
                        name="Default Ambient Light"
                        intensity={0.75}
                        color="#fff"
                    />

                    <ContactShadows
                        position={[0, -0.88, -300]}
                        opacity={0.5}
                        scale={900}
                        blur={1.5}
                        far={15}
                        color="#2a2520"
                        frames={1}
                    />

                    <Suspense fallback={null}>
                        <EmperorStatue
                            url="/head_of_augustus.glb"
                            position={[10, 0, -40]}
                            rotation={[0, -Math.PI / 0.15, 0]}
                            scale={28}
                            name="Augustus"
                            quote="I found Rome a city of bricks and left it a city of marble."
                            textOffset={[4, 8, 30]}
                            textRotation={[0, Math.PI / 1.5, 0]}
                        />

                        <EmperorStatue
                            url="/caesar.glb"
                            position={[-20, 0, -220]}
                            rotation={[0, Math.PI / 4, 0]}
                            scale={12}
                            name="Caesar"
                            quote="Veni, Vidi, Vici."
                            textOffset={[32, 10, 0]}
                            textRotation={[0, -Math.PI / 2, 0]}
                        />

                        <EmperorStatue
                            url="/trajan.glb"
                            position={[20, 0, -400]}
                            rotation={[0, -Math.PI / 4, 0]}
                            scale={28}
                            name="Trajan"
                            quote="The best of princes."
                            textOffset={[-30, 44, 40]}
                            textRotation={[0, Math.PI / 4, 0]}
                        />

                        <EmperorStatue
                            url="/aurelius.glb"
                            position={[-20, 0, -550]}
                            rotation={[0, Math.PI / 4, 0]}
                            scale={3}
                            name="Aurelius"
                            quote="Our life is what our thoughts make it."
                            textOffset={[36, 0, 0]}
                            textRotation={[0, -Math.PI / 4, 0]}
                        />
                    </Suspense>

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

                    <mesh
                        name="Plane"
                        geometry={nodes.Plane.geometry}
                        material={materials['Plane Material']}
                        castShadow
                        receiveShadow
                        position={[-29.55, -0.9, -69.64]}
                        rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
                    />

                    <mesh
                        rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
                        position={[-29.55, -0.82, -69.64]}
                        receiveShadow
                    >
                        <planeGeometry args={[1200, 400]} />
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