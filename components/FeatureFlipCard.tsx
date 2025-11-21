'use client';

import { easeOut, motion } from 'motion/react';
import * as React from 'react';

interface FeatureFlipCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  backContent?: string;
}

export function FeatureFlipCard({ icon, title, description, backContent }: FeatureFlipCardProps) {
  const [isFlipped, setIsFlipped] = React.useState(false);

  const isTouchDevice =
    typeof window !== 'undefined' && 'ontouchstart' in window;

  const handleClick = () => {
    if (isTouchDevice) setIsFlipped(!isFlipped);
  };

  const handleMouseEnter = () => {
    if (!isTouchDevice) setIsFlipped(true);
  };

  const handleMouseLeave = () => {
    if (!isTouchDevice) setIsFlipped(false);
  };

  const cardVariants = {
    front: { rotateY: 0, transition: { duration: 0.6, ease: easeOut } },
    back: { rotateY: 180, transition: { duration: 0.6, ease: easeOut } },
  };

  return (
    <div
      className="relative w-full h-80 perspective-1000 cursor-pointer"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* FRONT: Feature Info */}
      <motion.div
        className="absolute inset-0 backface-hidden rounded-xl border border-border/40 p-8 flex flex-col items-center justify-center bg-transparent backdrop-blur-sm"
        animate={isFlipped ? 'back' : 'front'}
        variants={cardVariants}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="flex justify-center mb-4">{icon}</div>
        <h3 className="text-xl font-semibold text-center mb-4">{title}</h3>
        <p className="text-muted-foreground text-center leading-relaxed text-sm">{description}</p>
      </motion.div>

      {/* BACK: Additional Info */}
      <motion.div
        className="absolute inset-0 backface-hidden rounded-xl border border-primary/50 p-8 flex flex-col justify-center items-center bg-transparent backdrop-blur-md"
        initial={{ rotateY: 180 }}
        animate={isFlipped ? 'front' : 'back'}
        variants={cardVariants}
        style={{ transformStyle: 'preserve-3d', rotateY: 180 }}
      >
        <div className="flex justify-center mb-4 text-primary">{icon}</div>
        <h3 className="text-xl font-semibold text-center mb-4">{title}</h3>
        <p className="text-muted-foreground text-center leading-relaxed">
          {backContent || description}
        </p>
        <div className="mt-6 text-sm text-primary font-medium">
          Hover to flip back
        </div>
      </motion.div>
    </div>
  );
}
