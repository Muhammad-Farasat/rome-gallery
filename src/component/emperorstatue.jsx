"use client";
import { Suspense, useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import useSpline from '@splinetool/r3f-spline';
import { PerspectiveCamera, ContactShadows, Float, useGLTF, Html, Environment, MeshReflectorMaterial } from '@react-three/drei';
import * as THREE from 'three';


function EmperorStatue({
    url,
    position,
    rotation,
    scale = 1,
    name,
    quote,
    textOffset,
    textRotation = [0, 0, 0],
    podiumColor = "#dcdcdc"
}) {
    if (!url) return null;

    const { scene } = useGLTF(url);
    const clonedScene = useMemo(() => scene.clone(), [scene]);
    const htmlRef = useRef();

    // --- ACCURATE FITTING LOGIC ---
    const { scaledSize, offsetToBottom } = useMemo(() => {
        // 1. Calculate the raw bounding box
        const bbox = new THREE.Box3().setFromObject(clonedScene);
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        bbox.getSize(size);
        bbox.getCenter(center);

        // 2. Adjust for the statue's scale
        const scaledWidth = size.x * scale;
        const scaledHeight = size.y * scale;
        const scaledDepth = size.z * scale;

        // 3. Calculate how much to move the bust so its bottom sits at local 0,0,0
        // We subtract the center and the half-height
        const yOffset = -(bbox.min.y * scale);

        return {
            scaledSize: { x: scaledWidth, y: scaledHeight, z: scaledDepth },
            offsetToBottom: yOffset
        };
    }, [clonedScene, scale]);

    // Podium dimensions: Slightly wider than the bust, and a fixed museum height
    const podiumWidth = scaledSize.x * 1.2;
    const podiumDepth = scaledSize.z * 1.2;
    const podiumHeight = 12; // Standard majestic height

    useFrame((state) => {
        if (!htmlRef.current) return;
        const camZ = state.camera.position.z;
        const statueZ = position[2];
        const distance = camZ - statueZ;
        let opacity = 0;
        if (distance < 80 && distance > -15) {
            if (distance > 40) opacity = THREE.MathUtils.mapLinear(distance, 80, 40, 0, 1);
            else if (distance < 5) opacity = THREE.MathUtils.mapLinear(distance, 5, -15, 1, 0);
            else opacity = 1;
        }
        htmlRef.current.style.opacity = opacity;
        htmlRef.current.style.transform = `translateY(${Math.sin(state.clock.elapsedTime) * 10}px)`;
    });

    return (
        <group position={position} rotation={rotation}>
            {/* 1. THE PODIUM (Fits the statue perfectly) */}
            <mesh position={[0, -podiumHeight / 2, 0]} castShadow receiveShadow>
                <boxGeometry args={[podiumWidth, podiumHeight, podiumDepth]} />
                <meshStandardMaterial color={podiumColor} roughness={0.4} metalness={0.1} />

                {/* Subtle Golden Base Trim */}
                <mesh position={[0, -podiumHeight / 2 + 0.2, 0]}>
                    <boxGeometry args={[podiumWidth * 1.05, 0.4, podiumDepth * 1.05]} />
                    <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.2} />
                </mesh>
            </mesh>

            {/* 2. THE STATUE BUST (Positioned to sit exactly on the podium) */}
            <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
                <primitive
                    object={clonedScene}
                    scale={scale}
                    position={[0, offsetToBottom, 0]}
                />
            </Float>

            {/* 3. INFO TEXT */}
            {name && (
                <Html position={textOffset} center transform distanceFactor={30} rotation={textRotation}>
                    <div ref={htmlRef} style={{
                        opacity: 0,
                        transition: 'opacity 0.3s ease-out',
                        width: '500px',
                        textAlign: textOffset[0] < 0 ? 'right' : 'left',
                        pointerEvents: 'none',
                        color: 'white',
                        textShadow: '0px 0px 20px rgba(0,0,0,0.5)'
                    }}>
                        <h1 style={{ fontSize: '5rem', color: '#cba052', margin: 0, fontFamily: 'serif', letterSpacing: '12px', fontWeight: 'normal', textTransform: 'uppercase' }}>{name}</h1>
                        <p style={{ fontSize: '1.4rem', color: '#444', fontStyle: 'italic', marginTop: '5px', maxWidth: '400px', display: 'inline-block' }}>{quote}</p>
                    </div>
                </Html>
            )}
        </group>
    );
}

export default EmperorStatue;