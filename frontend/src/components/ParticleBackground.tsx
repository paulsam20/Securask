import { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

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

        // Vibrant accent colors for light and dark
        const lightColors = [
            'rgba(99,102,241,',   // indigo
            'rgba(139,92,246,',   // violet
            'rgba(236,72,153,',   // pink
            'rgba(16,185,129,',   // emerald
            'rgba(59,130,246,',   // blue
        ];
        const darkColors = [
            'rgba(167,139,250,',  // violet-light
            'rgba(196,181,253,',  // purple-light
            'rgba(251,113,133,',  // rose-light
            'rgba(52,211,153,',   // emerald-light
            'rgba(96,165,250,',   // blue-light
        ];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        const initParticles = () => {
            particles = [];
            const colors = theme === 'dark' ? darkColors : lightColors;
            const count = Math.floor((canvas.width * canvas.height) / 12000);

            for (let i = 0; i < count; i++) {
                const size = Math.random() * 0.7 + 0.5;
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    dx: (Math.random() - 0.5) * 0.15,
                    dy: (Math.random() - 0.5) * 0.15,
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

        const drawParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            frame++;

            particles.forEach((p) => {
                const pulse = Math.sin(frame * p.pulseSpeed + p.pulsePhase) * 0.08;
                const twinkle = Math.sin(frame * (p.pulseSpeed * 1.7) + p.pulsePhase * 1.3) * 0.06;
                const alpha = Math.min(0.75, Math.max(0.12, p.opacity + pulse + twinkle));

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

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,255,${Math.min(0.95, alpha + 0.15).toFixed(2)})`;
                ctx.fill();

                // "Star" sparkle cross (subtle, Apple-like)
                if (p.kind === 'star') {
                    const s = p.size * (8 + p.sparkle * 8);
                    const glow = Math.min(0.7, alpha * (0.35 + p.sparkle * 0.35));
                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate((p.pulsePhase / 2) + frame * 0.002);
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

                // Update position
                p.x += p.dx;
                p.y += p.dy;

                // Wrap around edges
                if (p.x < -10) p.x = canvas.width + 10;
                if (p.x > canvas.width + 10) p.x = -10;
                if (p.y < -10) p.y = canvas.height + 10;
                if (p.y > canvas.height + 10) p.y = -10;
            });

            animationFrameId = requestAnimationFrame(drawParticles);
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        drawParticles();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, [theme]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            style={{ background: 'transparent' }}
        />
    );
}
