import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Brain } from 'lucide-react';

interface AiTipCardProps {
    currentTip: string;
}

const AiTipCard = ({ currentTip }: AiTipCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
        >
            <Card className="rounded-3xl border-0 shadow-xl bg-gradient-to-br from-yellow-400 to-orange-500 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
                <CardContent className="p-6 relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                            <Brain className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold">AI Tip of the Day</h3>
                            <p className="text-xs text-orange-100">Powered by ProdX AI</p>
                        </div>
                    </div>
                    <p className="text-white leading-relaxed">
                        {currentTip}
                    </p>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default AiTipCard;