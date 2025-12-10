import { motion } from 'framer-motion';
import { Target, Clock, Trophy, Users } from 'lucide-react';

const features = [
    { icon: Target, text: "Set daily focus goals" },
    { icon: Clock, text: "Track deep work hours" },
    { icon: Trophy, text: "Compete with friends" },
    { icon: Users, text: "Join focus challenges" },
];

export const MobileFeatures = ({ className = "" }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className={className}
    >
        <motion.h3
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-2xl font-black text-slate-800 mb-8"
        >
            Why Join ProdX?
        </motion.h3>
        <div className="grid grid-cols-2 gap-4">
            {features.map((f, i) => {
                const Icon = f.icon;
                return (
                    <motion.div
                        key={f.text}
                        initial={{ opacity: 0, scale: 0.8, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: 1.9 + i * 0.1, type: "spring", stiffness: 300 }}
                        whileHover={{ scale: 1.08 }}
                        className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 text-center border border-white/50 shadow-lg"
                    >
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                            <Icon className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-xs font-bold text-slate-800 block">
                            {f.text}
                        </span>
                    </motion.div>
                );
            })}
        </div>
    </motion.div>
);