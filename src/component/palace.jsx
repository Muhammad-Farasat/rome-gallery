"use client";
import Spline from '@splinetool/r3f-spline';
import { useRef } from 'react';

export default function Palace({ ...props }) {
  const splineRef = useRef();

  function onLoad(splineApp) {
    // This allows us to access the internal Three.js scene
    // We search for and disable Spline's default lights to make room for our God Rays
    splineApp.getAllObjects().forEach((obj) => {
      if (obj.type.includes('Light')) {
        obj.visible = false; 
      }
    });
    splineRef.current = splineApp;
  }

  return (
    <group {...props} dispose={null}>
      <Spline 
        scene="https://prod.spline.design/06MhAi5pkjH87O9s/scene.splinecode" 
        onLoad={onLoad}
      />
    </group>
  );
}