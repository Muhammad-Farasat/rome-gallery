import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

// 1. Receive scrollData (the Ref) instead of progress (the static number)
function HeavenlyDoor({ scrollData }) {
    const leftDoor = useRef();
    const rightDoor = useRef();
    const portalRef = useRef();

    const baseTex = useTexture('/Door.png');

    const leftTex = useMemo(() => {
        const tex = baseTex.clone();
        tex.repeat.set(0.5, 1);
        tex.offset.set(0, 0);
        return tex;
    }, [baseTex]);

    const rightTex = useMemo(() => {
        const tex = baseTex.clone();
        tex.repeat.set(0.5, 1);
        tex.offset.set(0.5, 0);
        return tex;
    }, [baseTex]);

    useFrame(() => {
        // 2. Read the progress directly from the ref every frame
        if (!scrollData || !scrollData.current) return;
        const progress = scrollData.current.progress;

        // Sync: Door opens fully between 0.0 and 0.2 scroll progress
        const doorProgress = THREE.MathUtils.clamp(progress / 0.20, 0, 1);

        // 90 degree rotation
        const angle = THREE.MathUtils.lerp(0, Math.PI / 2, doorProgress);

        if (leftDoor.current) leftDoor.current.rotation.y = angle;
        if (rightDoor.current) rightDoor.current.rotation.y = -angle;

        // Slide hinges outward
        const slide = THREE.MathUtils.lerp(0, 15, doorProgress);
        if (leftDoor.current) leftDoor.current.position.x = -7.5 - slide;
        if (rightDoor.current) rightDoor.current.position.x = 7.5 + slide;

        // Light Veil Fading
        if (portalRef.current) {
            const opacity = THREE.MathUtils.mapLinear(progress, 0, 0.15, 1, 0);
            portalRef.current.material.opacity = THREE.MathUtils.clamp(opacity, 0, 1);
        }
    });

    return (
        <group position={[-6.17, 7.6, 110]}>
            <mesh ref={portalRef} position={[0, 5, -1]}>
                <planeGeometry args={[200, 100]} />
                <meshBasicMaterial color="#ffffff" transparent depthWrite={false} />
            </mesh>

            <group ref={leftDoor} position={[-7.5, 0, 0]}>
                <mesh position={[-12, 3.5, 0]} castShadow>
                    <boxGeometry args={[40, 24, 1]} />
                    <meshStandardMaterial map={leftTex} roughness={0.3} />
                </mesh>
            </group>

            <group ref={rightDoor} position={[7.5, 0, 0]}>
                <mesh position={[13, 3.5, 0]} castShadow>
                    <boxGeometry args={[40, 24, 1]} />
                    <meshStandardMaterial map={rightTex} roughness={0.3} />
                </mesh>
            </group>
        </group>
    );
}

export default HeavenlyDoor;