"use client";
import { Suspense, useRef, useMemo, useState } from "react"; // Added useState
import { useThree, useFrame } from "@react-three/fiber";
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

    const { size } = useThree();
    const isMobile = size.width > 0 && size.width < 768;
    const mobileScaleFactor = isMobile ? 0.65 : 1;

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
        if (!clonedScene) return { localOffset: [0, 0, 0] };
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

        // Mobile needs to fade out SOONER so it doesn't get huge as we pass it
        const fadeInStart = isMobile ? 150 : 80;
        const fadeInEnd = isMobile ? 80 : 40;
        const fadeOutStart = isMobile ? 20 : 5;
        const fadeOutEnd = isMobile ? -30 : -15;

        if (distance < fadeInStart && distance > fadeOutEnd) {
            if (distance > fadeInEnd) opacity = THREE.MathUtils.mapLinear(distance, fadeInStart, fadeInEnd, 0, 1);
            else if (distance < fadeOutStart) opacity = THREE.MathUtils.mapLinear(distance, fadeOutStart, fadeOutEnd, 1, 0);
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

    // --- RESPONSIVE POSITIONING ---
    // If we're on mobile, we want to pull statues closer to the center (-3)
    const centerX = -3;
    const desktopCenterX = -6.17;
    const currentSceneCenter = isMobile ? centerX : desktopCenterX;

    const responsiveX = isMobile
        ? currentSceneCenter + (position[0] - desktopCenterX) * 0.5 // Pull towards mobile center
        : position[0];

    return (
        <group position={[responsiveX, position[1], position[2]]} rotation={rotation}>
            <group scale={mobileScaleFactor}>
                {/* 1. THE PODIUM */}
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
                            position={localOffset}
                        />
                    </Float>
                </group>
            </group>

            {/* 3. INFO TEXT */}
            {name && (
                <Html
                    position={textOffset}
                    center
                    transform
                    distanceFactor={isMobile ? 80 : 30}
                    rotation={textRotation}
                >
                    <div ref={htmlRef} style={{
                        opacity: 0,
                        transition: 'opacity 0.3s ease-out',
                        width: isMobile ? '100px' : '300px',
                        pointerEvents: 'none',
                        color: 'white',
                        textAlign: 'left',
                        // textShadow: isMobile ? '0px 0px 4px rgba(0,0,0,0.5)' : 'none'
                    }}>
                        <h1 style={{
                            fontSize: isMobile ? '16px' : '5rem',
                            color: '#FFDF00',
                            margin: 0,
                            fontFamily: 'serif',
                            letterSpacing: isMobile ? '2px' : '12px',
                            fontWeight: 'normal',
                            textTransform: 'uppercase',
                            lineHeight: 1
                        }}>{name}</h1>
                        <p style={{
                            fontSize: isMobile ? '8px' : '1.4rem',
                            color: '#fff',
                            fontStyle: 'italic',
                            marginTop: '2px',
                            maxWidth: isMobile ? '140px' : '400px',
                            display: 'inline-block'
                        }}>{quote}</p>
                        <p style={{
                            fontSize: isMobile ? '8px' : '0.9rem',
                            color: '#fff',
                            marginTop: '5px',
                            maxWidth: isMobile ? '130px' : '350px',
                            fontWeight: 'normal',
                            lineHeight: '1.2'
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