import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const CountUp = ({ end, suffix = "" }: { end: number; suffix?: string }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <motion.span
            ref={ref}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
        >
            {isInView && (
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    {end}
                    {suffix}
                </motion.span>
            )}
        </motion.span>
    );
};

export const CommunityStats = () => (
    <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        whileHover={{ scale: 1.02 }}
        className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-xl"
    >
        <h4 className="font-bold text-slate-800 text-lg mb-6 text-center">Join Our Community</h4>
        <div className="grid grid-cols-3 gap-6 text-center">
            <div>
                <div className="text-4xl font-black text-purple-600">
                    <CountUp end={10} suffix="K+" />
                </div>
                <div className="text-xs text-slate-600 mt-1">Focused Users</div>
            </div>
            <div>
                <div className="text-4xl font-black text-blue-600">
                    <CountUp end={250} suffix="K+" />
                </div>
                <div className="text-xs text-slate-600 mt-1">Hours Tracked</div>
            </div>
            <div>
                <div className="text-4xl font-black text-green-600">
                    <CountUp end={95} suffix="%" />
                </div>
                <div className="text-xs text-slate-600 mt-1">Goal Success</div>
            </div>
        </div>
    </motion.div>
);