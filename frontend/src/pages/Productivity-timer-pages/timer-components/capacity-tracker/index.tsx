import { motion } from 'framer-motion';
import { sp } from '../constants';

interface CapacityTrackerProps {
    used: number;
    max: number;
}

const CapacityTracker = ({ used, max }: CapacityTrackerProps) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="mb-6 px-4 py-3.5 rounded-2xl flex items-center gap-4 bg-white"
        style={{ border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
    >
        <div className="flex-1">
            {/* Label row */}
            <div
                className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2"
                style={{ color: '#94a3b8' }}
            >
                <span>Session Slots</span>
                <span style={{ color: used >= max ? '#ef4444' : '#7C3AED' }}>
                    {used}/{max}
                </span>
            </div>

            {/* Slot segments */}
            <div className="flex gap-1.5">
                {Array.from({ length: max }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="flex-1 h-2 rounded-full"
                        style={{
                            background: i < used
                                ? 'linear-gradient(90deg,#7C3AED,#6366F1)'
                                : '#f1f5f9',
                        }}
                        initial={{ scaleX: 0, originX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: i * 0.06 + 0.1, ...sp }}
                    />
                ))}
            </div>
        </div>

        {/* "Slots Full" warning pill */}
        {used >= max && (
            <span className="text-xs font-bold text-rose-500 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-100 whitespace-nowrap">
                Slots Full
            </span>
        )}
    </motion.div>
);

export default CapacityTracker;