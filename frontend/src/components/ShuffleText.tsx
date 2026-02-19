import { useEffect, useState, useRef, useCallback } from 'react';

interface ShuffleTextProps {
    text: string;
    className?: string;
    duration?: number;
}

const CHARS = "ABCDEFGHJKLMNOPQRSTUVWXYZ0123456789@#$%&*";

export default function ShuffleText({ text, className = "", duration = 1000 }: ShuffleTextProps) {
    const [displayText, setDisplayText] = useState(text);
    const intervalRef = useRef<number | null>(null);

    const startAnimation = useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);

        let iteration = 0;
        const maxIterations = text.length;
        const intervalTime = 30;
        const step = maxIterations / (duration / intervalTime);

        intervalRef.current = window.setInterval(() => {
            setDisplayText(() =>
                text
                    .split("")
                    .map((_, index) => {
                        if (index < iteration) {
                            return text[index];
                        }
                        return CHARS[Math.floor(Math.random() * CHARS.length)];
                    })
                    .join("")
            );

            if (iteration >= maxIterations) {
                if (intervalRef.current) clearInterval(intervalRef.current);
            }

            iteration += step;
        }, intervalTime);
    }, [text, duration]);

    useEffect(() => {
        startAnimation();
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [startAnimation]);

    return (
        <span
            className={`font-mono ${className}`}
            onMouseEnter={startAnimation}
        >
            {displayText}
        </span>
    );
}
