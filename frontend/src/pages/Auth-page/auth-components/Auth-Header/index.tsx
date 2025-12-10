import { Zap, Flame } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2,
        },
    },
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export const AuthHeader = () => (
    <motion.header
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12"
    >
        <motion.div variants={item} className="flex items-center gap-4">
            <motion.div
                whileHover={{ scale: 1.1, rotate: 12 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400 }}
                className="w-14 h-14 bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl flex items-center justify-center shadow-xl"
            >
                <Zap className="w-8 h-8 text-white" />
            </motion.div>
            <div>
                <h1 className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent text-4xl font-black tracking-tight">
                    ProdX
                </h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-sm text-slate-500 font-medium"
                >
                    Level up your productivity
                </motion.p>
            </div>
        </motion.div>

        <motion.div variants={item}>
            <Badge variant="secondary" className="bg-white/90 backdrop-blur-md shadow-lg px-4 py-2 hidden sm:flex">
                <Flame className="w-4 h-4 mr-2 text-orange-500 animate-pulse" />
                <span className="font-semibold">Join 10k+ focused users</span>
            </Badge>
        </motion.div>
    </motion.header>
);