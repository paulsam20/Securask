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
            // More particles for a richer background
            const count = Math.floor((canvas.width * canvas.height) / 9000);

            for (let i = 0; i < count; i++) {
                const size = Math.random() * 3.5 + 1;
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    dx: (Math.random() - 0.5) * 0.4,
                    dy: (Math.random() - 0.5) * 0.4,
                    size,
                    opacity: Math.random() * 0.5 + 0.15,
                    pulseSpeed: Math.random() * 0.02 + 0.005,
                    pulsePhase: Math.random() * Math.PI * 2,
                    color: colors[Math.floor(Math.random() * colors.length)],
                });
            }
        };

        const drawParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            frame++;

            particles.forEach((p) => {
                // Pulsing opacity
                const pulse = Math.sin(frame * p.pulseSpeed + p.pulsePhase) * 0.15;
                const alpha = Math.min(1, Math.max(0.05, p.opacity + pulse));

                // Glow effect: draw a soft halo first
                const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3.5);
                gradient.addColorStop(0, `${p.color}${(alpha * 0.55).toFixed(2)})`);
                gradient.addColorStop(1, `${p.color}0)`);
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * 3.5, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();

                // Solid center dot
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `${p.color}${alpha.toFixed(2)})`;
                ctx.fill();

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
