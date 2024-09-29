"use client";

import React from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { GlobeDemo } from './Globe';

interface AnimatedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}


const globeConfig = {
  pointSize: 1.5,
  globeColor: "#1d072e",
  showAtmosphere: true,
  atmosphereColor: "#ffffff",
  atmosphereAltitude: 0.2,
  emissive: "#000000",
  emissiveIntensity: 0.2,
  shininess: 1.0,
  polygonColor: "rgba(255,255,255,0.6)",
  ambientLight: "#ffffff",
  directionalLeftLight: "#ffaa00",
  directionalTopLight: "#ff8800",
  pointLight: "#ffffff",
  arcTime: 3000,
  arcLength: 0.9,
  rings: 2,
  maxRings: 4,
  initialPosition: { lat: 40.7128, lng: -74.006 },
  autoRotate: true,
  autoRotateSpeed: 0.5,
};

const arcData = [
  { order: 1, startLat: 37.7749, startLng: -122.4194, endLat: 51.5074, endLng: -0.1278, arcAlt: 0.3, color: "#ff0000" },
  { order: 2, startLat: 40.7128, startLng: -74.006, endLat: 35.6762, endLng: 139.6503, arcAlt: 0.4, color: "#00ff00" },
  // More arcs can be added here
];

const AnimatedImage: React.FC<AnimatedImageProps> = ({ src, alt, width, height, className }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 300, damping: 30 };
  const rotateX = useSpring(useTransform(y, [-300, 300], [5, -5]), springConfig);
  const rotateY = useSpring(useTransform(x, [-300, 300], [-5, 5]), springConfig);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0, true);
    y.set(0, true);
  };

  return (
    <motion.div 
      className="flex justify-center items-center overflow-visible p-10"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1000 }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <GlobeDemo />
       
      </motion.div>
    </motion.div>
  );
};

export default AnimatedImage;