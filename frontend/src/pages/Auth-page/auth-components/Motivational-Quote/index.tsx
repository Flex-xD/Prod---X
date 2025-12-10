import { Brain } from 'lucide-react';
import { motion } from 'framer-motion';

const quotes = [
    "Every focused hour brings you closer to your goals",
    "Great things are done by a series of small things brought together",
    "Productivity is never an accident. It's the result of commitment to excellence",
    "The secret of getting ahead is getting started",
    "Don't count the days, make the days count"
];

export const MotivationalQuote = () => {
    const todayQuote = quotes[new Date().getDate() % quotes.length];

    return (
        <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
            className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-blue-700 rounded-3xl p-10 text-white shadow-2xl"
        >
            <motion.div
                animate={{
                    backgroundPosition: ["0% 0%", "100% 100%"],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 opacity-20"
                style={{
                    background: "linear-gradient(45deg, #a855f7, #3b82f6, #8b5cf6)",
                    backgroundSize: "200% 200%",
                }}
            />

            <div className="relative flex items-start gap-5">
                <motion.div
                    initial={{ rotate: -180, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
                    className="w-14 h-14 bg-white/20 backdrop-blur-lg rounded-3xl flex items-center justify-center flex-shrink-0"
                >
                    <Brain className="w-8 h-8" />
                </motion.div>
                <div>
                    <motion.h3
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9 }}
                        className="font-bold text-xl mb-3"
                    >
                        Today's Focus Wisdom
                    </motion.h3>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                        className="text-purple-50 leading-relaxed text-lg font-light"
                    >
                        "{todayQuote}"
                    </motion.p>
                </div>
            </div>
        </motion.div>
    );
};