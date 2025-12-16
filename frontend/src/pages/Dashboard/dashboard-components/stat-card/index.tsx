import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface StatCardProps {
    title: string;
    value: string;
    subtitle: string;
    icon: React.ReactNode;
    badgeText: string;
    colorFrom: string;
    colorTo: string;
    progress?: number;
    delay?:number
}

const StatCard = ({ title, value, subtitle, icon, badgeText, colorFrom, colorTo, progress  , delay}: StatCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4  , delay:delay}}
        >
            <Card className={`rounded-3xl border-0 shadow-lg bg-gradient-to-br from-${colorFrom} to-${colorTo} text-white relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <CardContent className="p-6 relative z-10">
                    <div className="flex items-center justify-between mb-3">
                        {icon}
                        <Badge className="bg-white/20 text-white border-0">{badgeText}</Badge>
                    </div>
                    <div className="text-4xl font-bold mb-1">{value}</div>
                    <div className={`text-${colorFrom}-100 text-sm`}>{subtitle}</div>
                    {progress !== undefined && (
                        <div className="mt-3 bg-white/20 rounded-full h-2">
                            <motion.div
                                className="bg-white h-2 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1, delay: 0.5 }}
                            />
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default StatCard;