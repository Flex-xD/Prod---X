import { motion } from 'framer-motion';

interface StreakGridProps {
    weeks?: number;
    rows?: number;
    cellSize?: number;
    gap?: number;
    className?: string;
    dim?: boolean;
}

const INTENSITY_BG = [
    'rgba(20,23,31,0.06)',
    '#4A2A1F',
    '#C4441F',
    '#FF5A36',
];

const seedIntensity = (w: number, d: number) => {
    const n = Math.sin(w * 12.9898 + d * 78.233) * 43758.5453;
    const frac = n - Math.floor(n);
    if (frac > 0.86) return 3;
    if (frac > 0.68) return 2;
    if (frac > 0.45) return 1;
    return 0;
};

const StreakGrid = ({ weeks = 18, rows = 7, cellSize = 14, gap = 4, className, dim = false }: StreakGridProps) => {
    return (
        <div className={`flex ${className ?? ''}`} style={{ gap }}>
            {Array.from({ length: weeks }).map((_, w) => (
                <div key={w} className="flex flex-col" style={{ gap }}>
                    {Array.from({ length: rows }).map((_, d) => {
                        const intensity = seedIntensity(w, d);
                        const bg = INTENSITY_BG[intensity];
                        return (
                            <motion.div
                                key={d}
                                initial={{ opacity: 0, scale: 0.4 }}
                                animate={{ opacity: dim ? 0.35 : 1, scale: 1 }}
                                transition={{ delay: (w * rows + d) * 0.005, duration: 0.3 }}
                                style={{
                                    width: cellSize,
                                    height: cellSize,
                                    borderRadius: cellSize > 6 ? 3 : 1.5,
                                    background: bg,
                                    boxShadow: !dim && intensity === 3 ? '0 0 10px rgba(255,90,54,0.5)' : 'none',
                                }}
                            />
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default StreakGrid;