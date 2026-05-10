import { motion } from 'framer-motion';

// ─── Gradient map — avoids Tailwind's JIT purge issue with dynamic class names ─
const GRADIENT_MAP: Record<string, string> = {
    'green-500/emerald-300': 'linear-gradient(135deg, #22c55e, #6ee7b7)',
    'blue-500/indigo-600': 'linear-gradient(135deg, #3b82f6, #4f46e5)',
    'orange-500/red-600': 'linear-gradient(135deg, #f97316, #dc2626)',
    'purple-500/pink-600': 'linear-gradient(135deg, #a855f7, #db2777)',
};

const SHADOW_MAP: Record<string, string> = {
    'green-500/emerald-300': 'rgba(34,197,94,0.4)',
    'blue-500/indigo-600': 'rgba(59,130,246,0.4)',
    'orange-500/red-600': 'rgba(249,115,22,0.4)',
    'purple-500/pink-600': 'rgba(168,85,247,0.4)',
};

interface StatCardProps {
    title: string;
    value: string;
    subtitle: string;
    icon: React.ReactNode;
    badgeText: string;
    colorFrom: string;
    colorTo: string;
    progress?: number;
    delay?: number;
}

const StatCard = ({
    title, value, subtitle, icon, badgeText,
    colorFrom, colorTo, progress, delay = 0,
}: StatCardProps) => {
    const key = `${colorFrom}/${colorTo}`;
    const gradient = GRADIENT_MAP[key] ?? `linear-gradient(135deg, #7C3AED, #4F46E5)`;
    const shadow = SHADOW_MAP[key] ?? 'rgba(124,58,237,0.35)';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay, type: 'spring', damping: 28, stiffness: 280 }}
            whileHover={{ y: -4, boxShadow: `0 24px 48px ${shadow}` }}
            className="relative rounded-3xl overflow-hidden text-white cursor-default"
            style={{
                background: gradient,
                boxShadow: `0 8px 28px ${shadow}`,
            }}
        >
            {/* Decorative orb */}
            <div
                className="absolute -top-8 -right-8 w-36 h-36 rounded-full"
                style={{ background: 'rgba(255,255,255,0.12)', filter: 'blur(24px)' }}
            />
            <div
                className="absolute bottom-0 -left-6 w-24 h-24 rounded-full"
                style={{ background: 'rgba(255,255,255,0.08)', filter: 'blur(16px)' }}
            />

            <div className="relative z-10 p-6">
                {/* Icon + badge row */}
                <div className="flex items-start justify-between mb-4">
                    <div
                        className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(255,255,255,0.18)' }}
                    >
                        {icon}
                    </div>
                    <span
                        className="text-xs font-bold px-2.5 py-1 rounded-full"
                        style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}
                    >
                        {badgeText}
                    </span>
                </div>

                {/* Value */}
                <div className="text-4xl font-black mb-1 leading-none">{value}</div>

                {/* Subtitle */}
                <div className="text-sm font-medium opacity-75 mb-3">{subtitle}</div>

                {/* Optional progress bar */}
                {progress !== undefined && (
                    <div
                        className="w-full rounded-full overflow-hidden"
                        style={{ height: 5, background: 'rgba(255,255,255,0.2)' }}
                    >
                        <motion.div
                            className="h-full rounded-full bg-white"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1.2, delay: delay + 0.4, ease: [0.34, 1.2, 0.64, 1] }}
                        />
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default StatCard;