/**
 * @file components/NetworkBackground/NetworkBackground.jsx
 * @description Animated SVG-style canvas that renders a live network topology map.
 * Floating nodes connected by faint lines drift slowly across the screen.
 * Uses requestAnimationFrame for smooth 60fps animation.
 * @returns {JSX.Element} A full-screen fixed canvas element.
 */

import React, { useEffect, useRef } from 'react';
import styles from './NetworkBackground.module.css';

const NODE_COUNT = 55;
const CONNECTION_DISTANCE = 140;
const NODE_SPEED = 0.35;

const NetworkBackground = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const nodesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const initNodes = () => {
      nodesRef.current = Array.from({ length: NODE_COUNT }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * NODE_SPEED,
        vy: (Math.random() - 0.5) * NODE_SPEED,
        radius: Math.random() * 2 + 1.5,
        pulsePhase: Math.random() * Math.PI * 2,
      }));
    };

    const draw = (timestamp) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const nodes = nodesRef.current;

      // Update positions
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
      });

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < CONNECTION_DISTANCE) {
            const opacity = (1 - distance / CONNECTION_DISTANCE) * 0.18;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(0, 194, 255, ${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw nodes with pulse
      nodes.forEach((node) => {
        const pulse = Math.sin(timestamp * 0.001 + node.pulsePhase) * 0.5 + 0.5;
        const glowRadius = node.radius + pulse * 3;

        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, glowRadius * 3);
        gradient.addColorStop(0, `rgba(0, 194, 255, ${0.6 + pulse * 0.3})`);
        gradient.addColorStop(1, 'rgba(0, 194, 255, 0)');

        ctx.beginPath();
        ctx.arc(node.x, node.y, glowRadius * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 194, 255, ${0.7 + pulse * 0.3})`;
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(draw);
    };

    resize();
    initNodes();
    animationRef.current = requestAnimationFrame(draw);
    window.addEventListener('resize', () => { resize(); initNodes(); });

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} />;
};

export default NetworkBackground;
