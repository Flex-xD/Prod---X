import { motion } from 'framer-motion';
import { Target, Clock, Trophy, Users, Brain, Sparkles } from 'lucide-react';

const features = [
    { icon: Target, text: "Set daily focus goals" },
    { icon: Clock, text: "Track deep work hours" },
    { icon: Trophy, text: "Compete with friends" },
    { icon: Users, text: "Join focus challenges" },
    { icon: Brain, text: "AI productivity tips" },
    { icon: Sparkles, text: "Build winning streaks" },
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.6,
        },
    },
};

const card = {
    hidden: { opacity: 0, y: 60, scale: 0.9 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 24
        }
    },
};

export const FeaturesGrid = () => (
    <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-5"
    >
        {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
                <motion.div
                    key={feature.text}
                    variants={card}
                    whileHover={{
                        y: -8,
                        scale: 1.05,
                        transition: { duration: 0.3 }
                    }}
                    className="group relative bg-white/70 backdrop-blur-xl rounded-3xl p-7 border border-white/50 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                >
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    />
                    <div className="relative flex items-center gap-4">
                        <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                            className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg"
                        >
                            <Icon className="w-6 h-6 text-white" />
                        </motion.div>
                        <span className="text-sm font-semibold text-slate-800">
                            {feature.text}
                        </span>
                    </div>
                </motion.div>
            );
        })}
    </motion.div>
);