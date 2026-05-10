import { motion } from 'framer-motion';
import { Brain, Sparkles } from 'lucide-react';

interface AiTipCardProps {
    currentTip: string;
}

const AiTipCard = ({ currentTip }: AiTipCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5, type: 'spring', damping: 28, stiffness: 280 }}
            className="relative rounded-3xl overflow-hidden text-white"
            style={{
                background: 'linear-gradient(145deg, #78350f 0%, #b45309 45%, #d97706 100%)',
                boxShadow: '0 16px 48px rgba(217,119,6,0.38)',
            }}
        >
            {/* Orbs */}
            <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(253,230,138,0.25), transparent)' }} />
            <div className="absolute bottom-0 -left-6 w-28 h-28 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.18), transparent)' }} />

            <div className="relative z-10 p-6">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <div
                        className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(255,255,255,0.15)' }}
                    >
                        <Brain className="w-5 h-5 text-amber-200" />
                    </div>
                    <div>
                        <h3 className="font-black text-sm text-white">AI Tip of the Day</h3>
                        <div className="flex items-center gap-1 mt-0.5">
                            <Sparkles className="w-3 h-3 text-amber-300" />
                            <p className="text-xs text-amber-300 font-semibold">Powered by ProdX AI</p>
                        </div>
                    </div>
                </div>

                {/* Tip text */}
                <p className="text-sm leading-relaxed font-medium" style={{ color: 'rgba(255,255,255,0.9)' }}>
                    {currentTip}
                </p>

                {/* Bottom accent line */}
                <div
                    className="mt-4 h-0.5 w-12 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.3)' }}
                />
            </div>
        </motion.div>
    );
};

export default AiTipCard;