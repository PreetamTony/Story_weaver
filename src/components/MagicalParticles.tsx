
import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  color: string;
}

const MagicalParticles = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const colors = ['#8b5cf6', '#a855f7', '#c084fc', '#fbbf24', '#f59e0b'];
    
    const generateParticles = () => {
      const newParticles: Particle[] = [];
      for (let i = 0; i < 20; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 6 + 2,
          opacity: Math.random() * 0.8 + 0.2,
          speed: Math.random() * 2 + 0.5,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
    
    const interval = setInterval(() => {
      setParticles(prevParticles => 
        prevParticles.map(particle => {
          const newY = particle.y - particle.speed;
          const newX = particle.x + Math.sin(particle.y / 100) * 0.5;
          const resetY = newY < -10 ? window.innerHeight + 10 : newY;
          const newOpacity = newY < -10 ? particle.opacity : particle.opacity;
          
          return {
            ...particle,
            y: resetY,
            x: newX,
            opacity: newOpacity,
          };
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full animate-sparkle"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            filter: 'blur(0.5px)',
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
          }}
        />
      ))}
    </div>
  );
};

export default MagicalParticles;
