import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import SkeletonBlock from '../skeleton-block';

interface ActivityMessageCardProps {
    message?: string;
    isLoading: boolean;
}

const ActivityMessageCard = ({ message, isLoading }: ActivityMessageCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.7, type: 'spring', damping: 28, stiffness: 280 }}
            className="relative rounded-3xl overflow-hidden text-white"
            style={{
                background: 'linear-gradient(145deg, #064e3b 0%, #065f46 40%, #047857 100%)',
                boxShadow: '0 16px 48px rgba(4,120,87,0.38)',
            }}
        >
            <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full" style={{ background: 'radial-gradient(circle, rgba(110,231,183,0.2), transparent)' }} />
            <div className="absolute bottom-0 -left-6 w-28 h-28 rounded-full" style={{ background: 'radial-gradient(circle, rgba(52,211,153,0.15), transparent)' }} />

            <div className="relative z-10 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <motion.div
                        animate={{ rotate: [0, 15, -15, 10, 0] }}
                        transition={{ duration: 1.6, delay: 1.2, repeat: Infinity, repeatDelay: 5 }}
                        className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(255,255,255,0.15)' }}
                    >
                        <Sparkles className="w-5 h-5 text-emerald-200" />
                    </motion.div>
                    <div>
                        <h3 className="font-black text-sm text-white">Your Day So Far</h3>
                        <p className="text-xs text-emerald-300 font-semibold mt-0.5">Updates as you go</p>
                    </div>
                </div>

                {isLoading ? (
                    <div className="space-y-2">
                        <SkeletonBlock className="h-3.5 w-full" style={{ background: 'rgba(255,255,255,0.2)' }} />
                        <SkeletonBlock className="h-3.5 w-3/5" style={{ background: 'rgba(255,255,255,0.2)' }} />
                    </div>
                ) : (
                    <p className="text-sm leading-relaxed font-medium" style={{ color: 'rgba(255,255,255,0.88)' }}>
                        {message}
                    </p>
                )}
            </div>
        </motion.div>
    );
};

export default ActivityMessageCard;