import { motion } from 'framer-motion';

interface StreakPreviewProps {
    weeks?: number;
    rows?: number;
    cellSize?: number;
    gap?: number;
    animate?: boolean;
}

const INTENSITY_STYLE = [
    { background: '#f1f5f9' },
    { background: 'rgba(255,255,255,0.14)' },
    { background: 'rgba(196,181,253,0.55)' },
    { background: '#A78BFA', boxShadow: '0 0 8px rgba(167,139,250,0.6)' },
];

const seed = (w: number, d: number) => {
    const n = Math.sin(w * 12.9898 + d * 78.233) * 43758.5453;
    const frac = n - Math.floor(n);
    if (frac > 0.82) return 3;
    if (frac > 0.62) return 2;
    if (frac > 0.4) return 1;
    return 0;
};

const StreakPreview = ({ weeks = 20, rows = 7, cellSize = 12, gap = 4, animate = true }: StreakPreviewProps) => (
    <div className="flex" style={{ gap }}>
        {Array.from({ length: weeks }).map((_, w) => (
            <div key={w} className="flex flex-col" style={{ gap }}>
                {Array.from({ length: rows }).map((_, d) => {
                    const intensity = seed(w, d);
                    return (
                        <motion.div
                            key={d}
                            initial={animate ? { opacity: 0, scale: 0.3 } : false}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: (w * rows + d) * 0.006, duration: 0.3, type: 'spring', damping: 20, stiffness: 300 }}
                            style={{
                                width: cellSize,
                                height: cellSize,
                                borderRadius: 3,
                                ...INTENSITY_STYLE[intensity],
                            }}
                        />
                    );
                })}
            </div>
        ))}
    </div>
);

export default StreakPreview;