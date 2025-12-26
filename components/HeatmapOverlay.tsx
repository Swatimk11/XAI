
import React from 'react';
import type { GradCamRegion } from '../types';

interface HeatmapOverlayProps {
  region: GradCamRegion;
}

const HeatmapOverlay: React.FC<HeatmapOverlayProps> = ({ region }) => {
  const { x, y, r } = region;

  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${x * 100}%`,
    top: `${y * 100}%`,
    width: `${r * 2 * 100}%`,
    height: `${r * 2 * 100}%`,
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    background: `radial-gradient(circle, rgba(255,0,0,0.5) 0%, rgba(255,165,0,0.3) 40%, rgba(255,255,0,0.1) 70%, rgba(0,255,0,0) 100%)`,
    pointerEvents: 'none',
    mixBlendMode: 'overlay',
    opacity: 0.8,
  };

  return <div style={style} />;
};

export default HeatmapOverlay;
