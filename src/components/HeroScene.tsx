
'use client';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr, Float, Stars, Environment } from '@react-three/drei';
import { Suspense, useEffect, useRef, useState } from 'react';

function Blob() {
  return (
    <Float speed={1.2} rotationIntensity={0.6} floatIntensity={0.6}>
      <mesh>
        <icosahedronGeometry args={[1.2, 8]} />
        <meshStandardMaterial color="#7c3aed" roughness={0.2} metalness={0.7} />
      </mesh>
    </Float>
  );
}

export default function HeroScene() {
  const [enabled, setEnabled] = useState(false);
  const [reduced, setReduced] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      for (const e of entries) { if (e.isIntersecting) setEnabled(true); }
    }, { rootMargin: '0px 0px -40% 0px', threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  if (reduced) return <div ref={ref} className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-900/20 to-transparent" />;

  return (
    <div ref={ref} className="absolute inset-0 -z-10">
      {enabled && (
        <Canvas dpr={[1, 2]}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.2} />
            <directionalLight position={[4,5,2]} intensity={1.2} />
            <Stars radius={90} depth={40} count={2000} factor={3} fade />
            <Blob />
            <Environment preset="city" />
            <AdaptiveDpr pixelated />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}
