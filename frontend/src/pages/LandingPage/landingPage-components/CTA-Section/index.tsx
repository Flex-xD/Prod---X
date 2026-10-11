import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import StreakPreview from '../StreakPreview';

const sp = { type: 'spring', damping: 28, stiffness: 300 } as const;

function CtaSection() {
    return (
        <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(145deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)' }}>
            <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full" style={{ background: 'radial-gradient(circle, rgba(129,140,248,0.2), transparent)' }} />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full" style={{ background: 'radial-gradient(circle, rgba(192,132,252,0.16), transparent)' }} />

            <div className="absolute inset-0 flex items-center justify-center opacity-[0.07] pointer-events-none">
                <StreakPreview weeks={40} rows={12} cellSize={16} gap={6} animate={false} />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ...sp }}
                viewport={{ once: true }}
                className="relative z-10 max-w-2xl mx-auto px-6 text-center"
            >
                <h2 className="text-4xl font-black text-white mb-5">
                    Your streak starts today.
                </h2>
                <p className="text-lg text-indigo-200 font-medium mb-9">
                    Day one is free — it only takes one session to put the first square on the board.
                </p>
                <Link to="/auth">
                    <motion.div className="inline-block" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                        <Button
                            className="px-8 py-6 rounded-2xl text-base font-bold text-white flex items-center gap-2"
                            style={{ background: 'white', color: '#4338ca', boxShadow: '0 12px 32px rgba(0,0,0,0.25)' }}
                        >
                            Create your free account <ArrowRight className="w-4 h-4" />
                        </Button>
                    </motion.div>
                </Link>
            </motion.div>
        </section>
    );
}

export default CtaSection;