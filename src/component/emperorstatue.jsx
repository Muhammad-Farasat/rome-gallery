"use client";
import { Suspense, useRef, useMemo, useState } from "react"; // Added useState
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
    podiumColor = "#dcdcdc",
    podiumOffset = [0, 0, 0],
    podiumSize = [12, 16, 12],
    description
}) {
    if (!url) return null;

    const { scene } = useGLTF(url);
    const clonedScene = useMemo(() => scene.clone(), [scene]);
    const htmlRef = useRef();

    // --- INTERACTIVE ROTATION REFS ---
    const interactiveGroupRef = useRef();
    const [isDragging, setIsDragging] = useState(false);
    const rotationVelocity = useRef(0);
    const currentRotation = useRef(0);
    const lastPointerX = useRef(0);

    // --- EXISTING FITTING LOGIC (Untouched) ---
    const { scaledSize, offsetToBottom } = useMemo(() => {
        const bbox = new THREE.Box3().setFromObject(clonedScene);
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        bbox.getSize(size);
        bbox.getCenter(center);
        const scaledWidth = size.x * scale;
        const scaledHeight = size.y * scale;
        const scaledDepth = size.z * scale;
        const yOffset = -(bbox.min.y * scale);
        return {
            scaledSize: { x: scaledWidth, y: scaledHeight, z: scaledDepth },
            offsetToBottom: yOffset
        };
    }, [clonedScene, scale]);

    // const podiumWidth = scaledSize.x * 1.2;
    // const podiumDepth = scaledSize.z * 1.2;
    // const podiumHeight = 12;

    const { localOffset } = useMemo(() => {
        const bbox = new THREE.Box3().setFromObject(clonedScene);
        const center = new THREE.Vector3();
        bbox.getCenter(center);
        // We want the rotation to happen around the X and Z center, 
        // but keep the Y (height) so the base stays at 0
        return {
            localOffset: [-center.x * scale, -bbox.min.y * scale, -center.z * scale]
        };
    }, [clonedScene, scale]);

    useFrame((state) => {
        if (!htmlRef.current) return;

        // 1. EXISTING SCROLL FADE LOGIC (Untouched)
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

        // 2. INTERACTIVE ROTATION LOGIC
        if (interactiveGroupRef.current) {
            // Apply a friction/damping effect to the manual rotation
            if (!isDragging) {
                rotationVelocity.current *= 0.95; // Slows down when released
            }
            currentRotation.current += rotationVelocity.current;
            interactiveGroupRef.current.rotation.y = currentRotation.current;
        }
    });

    // --- POINTER EVENT HANDLERS ---
    const handlePointerDown = (e) => {
        e.stopPropagation(); // Prevents scroll interference on the mesh
        setIsDragging(true);
        lastPointerX.current = e.clientX;
        document.body.style.cursor = 'grabbing';
    };

    const handlePointerUp = () => {
        setIsDragging(false);
        document.body.style.cursor = 'auto';
    };

    const handlePointerMove = (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - lastPointerX.current;
        // Sensitivity control (0.007 is smooth for marble)
        rotationVelocity.current = deltaX * 0.007;
        lastPointerX.current = e.clientX;
    };

    return (
        <group position={position} rotation={rotation}>
            {/* 1. THE PODIUM (Untouched) */}
            <group position={podiumOffset}>
                <mesh castShadow receiveShadow position={[0, -podiumSize[1] / 2, 0]}>
                    <boxGeometry args={podiumSize} />
                    <meshStandardMaterial color="#ffffff" roughness={0.3} />
                </mesh>
                <mesh position={[0, -podiumSize[1] + 0.2, 0]}>
                    <boxGeometry args={[podiumSize[0] + 0.5, 0.5, podiumSize[2] + 0.5]} />
                    <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.2} />
                </mesh>
            </group>

            {/* 2. THE INTERACTIVE STATUE BUST */}
            <group
                ref={interactiveGroupRef}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                onPointerMove={handlePointerMove}
                onPointerOver={() => !isDragging && (document.body.style.cursor = 'grab')}
                onPointerOut={() => !isDragging && (document.body.style.cursor = 'auto')}
            >
                <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
                    <primitive
                        object={clonedScene}
                        scale={scale}
                        // position={[0, offsetToBottom, 0]}
                        position={localOffset}
                    />
                </Float>
            </group>

            {/* 3. INFO TEXT (Untouched) */}
            {name && (
                <Html position={textOffset} center transform distanceFactor={30} rotation={textRotation}>
                    <div ref={htmlRef} style={{
                        opacity: 0,
                        transition: 'opacity 0.3s ease-out',
                        width: '600px',
                        pointerEvents: 'none',
                        color: 'white',
                    }}>
                        <h1 style={{ fontSize: '5rem', color: '#FFDF00', margin: 0, fontFamily: 'serif', letterSpacing: '12px', fontWeight: 'normal', textTransform: 'uppercase' }}>{name}</h1>
                        <p style={{ fontSize: '1.4rem', color: '#444', fontStyle: 'italic', marginTop: '5px', maxWidth: '400px', display: 'inline-block' }}>{quote}</p>
                        <p style={{
                            fontSize: '0.9rem',
                            color: '#888',
                            marginTop: '10px',
                            maxWidth: '350px',
                            fontWeight: 'normal',
                            lineHeight: '1.4'
                        }}>
                            {description}
                        </p>
                    </div>
                </Html>
            )}
        </group>
    );
}

export default EmperorStatue;