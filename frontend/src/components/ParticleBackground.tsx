import { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

/**
 * Particle Interface
 * Defines the properties of an individual animated element on the background.
 */
interface Particle {
    x: number;
    y: number;
    dx: number;
    dy: number;
    size: number;
    opacity: number;
    pulseSpeed: number;
    pulsePhase: number;
    color: string;
    kind: 'dot' | 'star';
    sparkle: number;
}

/**
 * ParticleBackground Component
 * Renders a high-performance, dynamic particle system using the HTML5 Canvas API.
 * Features:
 * - Theme-aware color palettes
 * - Smooth "twinkle" and "pulse" animations
 * - Apple-style "star" sparkle effects
 * - Responsive resizing and edge wrapping
 */
export default function ParticleBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { theme } = useTheme();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];
        let frame = 0;

        // Vibrant accent colors for light theme (more saturated)
        const lightColors = [
            'rgba(99,102,241,',   // indigo
            'rgba(139,92,246,',   // violet
            'rgba(236,72,153,',   // pink
            'rgba(16,185,129,',   // emerald
            'rgba(59,130,246,',   // blue
        ];
        // Soft gradient-like colors for dark theme (brighter accents)
        const darkColors = [
            'rgba(167,139,250,',  // violet-light
            'rgba(196,181,253,',  // purple-light
            'rgba(251,113,133,',  // rose-light
            'rgba(52,211,153,',   // emerald-light
            'rgba(96,165,250,',   // blue-light
        ];

        /**
         * Responsive: Adjusts canvas resolution to match window size
         */
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        /**
         * Factory: Populates the system with randomized particles based on screen area
         */
        const initParticles = () => {
            particles = [];
            const colors = theme === 'dark' ? darkColors : lightColors;
            // Scale density relative to screen size
            const count = Math.floor((canvas.width * canvas.height) / 12000);

            for (let i = 0; i < count; i++) {
                const size = Math.random() * 0.7 + 0.5;
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    dx: (Math.random() - 0.5) * 0.15, // Slow horizontal drift
                    dy: (Math.random() - 0.5) * 0.15, // Slow vertical drift
                    size,
                    opacity: Math.random() * 0.2 + 0.25,
                    pulseSpeed: Math.random() * 0.015 + 0.003,
                    pulsePhase: Math.random() * Math.PI * 2,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    kind: Math.random() < 0.22 ? 'star' : 'dot',
                    sparkle: Math.random(),
                });
            }
        };

        /**
         * Render Loop: Draws each frame of the animation
         */
        const drawParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the frame
            frame++;

            particles.forEach((p) => {
                // Calculate dynamic opacity using sine waves for life-like movement
                const pulse = Math.sin(frame * p.pulseSpeed + p.pulsePhase) * 0.08;
                const twinkle = Math.sin(frame * (p.pulseSpeed * 1.7) + p.pulsePhase * 1.3) * 0.06;
                const alpha = Math.min(0.75, Math.max(0.12, p.opacity + pulse + twinkle));

                // 1. Draw Glow: Multi-stop radial gradient for a soft halo effect
                const glowRadius = p.size * (p.kind === 'star' ? 10 : 7);
                const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowRadius);
                gradient.addColorStop(0, `rgba(255,255,255,${(alpha * 0.35).toFixed(2)})`);
                gradient.addColorStop(0.15, `${p.color}${(alpha * 0.45).toFixed(2)})`);
                gradient.addColorStop(0.55, `${p.color}${(alpha * 0.12).toFixed(2)})`);
                gradient.addColorStop(1, `${p.color}0)`);
                ctx.beginPath();
                ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();

                // 2. Draw Core: Small sharp dot at the center
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,255,${Math.min(0.95, alpha + 0.15).toFixed(2)})`;
                ctx.fill();

                // 3. Draw Sparkle: Subtle hair-lines for 'star' kind particles
                if (p.kind === 'star') {
                    const s = p.size * (8 + p.sparkle * 8);
                    const glow = Math.min(0.7, alpha * (0.35 + p.sparkle * 0.35));
                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate((p.pulsePhase / 2) + frame * 0.002); // rotate slowly over time
                    ctx.strokeStyle = `rgba(255,255,255,${glow.toFixed(2)})`;
                    ctx.lineWidth = 0.9;
                    ctx.lineCap = 'round';
                    ctx.beginPath();
                    ctx.moveTo(-s, 0);
                    ctx.lineTo(s, 0);
                    ctx.moveTo(0, -s);
                    ctx.lineTo(0, s);
                    ctx.stroke();
                    ctx.restore();
                }

                // Physics: Linear movement
                p.x += p.dx;
                p.y += p.dy;

                // Infinite Scroll: Wrap around edges for seamless motion
                if (p.x < -10) p.x = canvas.width + 10;
                if (p.x > canvas.width + 10) p.x = -10;
                if (p.y < -10) p.y = canvas.height + 10;
                if (p.y > canvas.height + 10) p.y = -10;
            });

            // Schedule next frame
            animationFrameId = requestAnimationFrame(drawParticles);
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        drawParticles();

        // Cleanup resources to prevent leaks (especially during HMR or unmount)
        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, [theme]); // Re-init system when theme changes

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            style={{ background: 'transparent' }}
        />
    );
}
