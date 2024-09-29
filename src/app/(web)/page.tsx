"use client";

import { motion } from 'framer-motion';
import React from 'react';
import { Button } from "@/components/ui/button";
import DotPattern from "@/components/ui/dot-pattern";
import { cn } from "@/lib/utils";
import BlurIn from "@/components/ui/blur-in";
import AnimatedImage from '@/components/AnimatedImage';
import { GlobeDemo } from '@/components/Globe';
import Link from 'next/link';

const MotionDiv = motion.div;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function Home() {
  return (
    <main>
      <div className="z-0 relative max-h-screen w-full pb-40 overflow-hidden bg-[radial-gradient(97.14%_56.45%_at_51.63%_0%,_#7D56F4_0%,_#4517D7_30%,_#000_100%)]">
        <DotPattern
          className={cn("[mask-image:radial-gradient(50vw_circle_at_center,white,transparent)]")}
        />
        <MotionDiv
          className="relative z-10 flex flex-col lg:flex-row items-center justify-between min-h-screen space-y-6 lg:space-y-0 lg:space-x-12 px-4 lg:px-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left: Text Section */}
          <motion.div variants={itemVariants} className="lg:w-1/2">
            <BlurIn
              word="Compliance Development Using AIML & GenAI"
              className="font-display text-left lg:text-left text-4xl font-bold text-white w-full max-w-3xl z-10"
              duration={1}
            />
            <motion.h2
              className="text-xl text-white text-opacity-60 tracking-normal text-left max-w-2xl z-10 mt-4"
              variants={itemVariants}
            >
             Automating Compliance Script Generation for Diverse Operating Systems
            </motion.h2>

            <div className="z-20 mt-6">
              <Link href={"/upload"}>
              <Button size="lg" className="bg-white text-slate py-2 px-4 rounded">
                Get Started
                </Button>
                </Link>
            </div>
          </motion.div>

          {/* Right: Image Section */}
          <motion.div variants={itemVariants} className='lg:w-1/2'>
          <GlobeDemo/>
          </motion.div>
        </MotionDiv>
      </div>
    </main>
  );
}
