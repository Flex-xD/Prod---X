import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

const MotivationalCard = () => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
        >
            <Card className="rounded-3xl border-0 shadow-xl bg-gradient-to-br from-green-500 to-teal-600 text-white">
                <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <Sparkles className="w-6 h-6" />
                        <h3 className="font-bold text-lg">Great Work! 🎉</h3>
                    </div>
                    <p className="text-green-100 leading-relaxed">
                        You've completed 2 tasks today! Just 2 more to reach your daily goal. Keep the energy up!
                    </p>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default MotivationalCard;