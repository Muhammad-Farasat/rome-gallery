"use client";
import { Suspense, useRef, useMemo } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import useSpline from '@splinetool/r3f-spline';
import { PerspectiveCamera, ContactShadows, Float, useGLTF, Html, Environment, MeshReflectorMaterial } from '@react-three/drei';
import * as THREE from 'three';
import EmperorStatue from "./emperorstatue";
import HeavenlyDoor from "./heavenlydoor";


function Dust({ count = 1000 }) {
  const mesh = useRef();
  const light = useThree((state) => state.light);

  // Generate random positions for the dust
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const xAngle = Math.random() * Math.PI;
      const yAngle = Math.random() * Math.PI;
      const zAngle = Math.random() * Math.PI;
      
      // Spread them throughout the hallway length
      temp.push({ t, factor, speed, xAngle, yAngle, zAngle, 
                  pos: [THREE.MathUtils.randFloatSpread(80), 
                        THREE.MathUtils.randFloat(0, 30), 
                        THREE.MathUtils.randFloatSpread(2000)] });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    particles.forEach((particle, i) => {
      let { t, factor, speed, xAngle, yAngle, zAngle, pos } = particle;
      t = particle.t += speed / 2;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      
      dummy.position.set(
        pos[0] + a * factor * 0.1,
        pos[1] + b * factor * 0.1,
        pos[2]
      );
      
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <dodecahedronGeometry args={[0.1, 0]} />
      <meshBasicMaterial color="#D4AF37" transparent opacity={0.3} />
    </instancedMesh>
  );
}
export default Dust