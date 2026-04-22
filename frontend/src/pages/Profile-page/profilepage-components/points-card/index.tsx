import { motion } from 'framer-motion';
import { CheckSquare, Clock, Users, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { IPointsCardProps, IPointsBreakdown } from './points-card-types';

const iconMap: Record<IPointsBreakdown['iconName'], React.ReactNode> = {
    CheckSquare: <CheckSquare className="w-4 h-4" />,
    Clock: <Clock className="w-4 h-4" />,
    Users: <Users className="w-4 h-4" />,
};

const PointsCard = ({ totalPoints, rank, breakdown }: IPointsCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4, ease: 'easeOut' }}
            className="bg-white/70 backdrop-blur-sm rounded-3xl border border-white/60 shadow-xl shadow-purple-100/40 p-6"
        >
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-amber-100">
                        <Award className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                        <h2 className="text-base font-semibold text-slate-700">Productivity Points</h2>
                        <p className="text-xs text-slate-400">{totalPoints.toLocaleString()} total</p>
                    </div>
                </div>
                <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100 font-semibold">
                    Rank #{rank}
                </Badge>
            </div>

            <div className="space-y-4">
                {breakdown.map((item, i) => (
                    <div key={item.label}>
                        <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <span className="text-slate-400">{iconMap[item.iconName]}</span>
                                {item.label}
                            </div>
                            <span className="text-sm font-semibold text-slate-700">+{item.points.toLocaleString()}</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${item.pct}%` }}
                                transition={{ delay: 0.6 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                                className={`h-full ${item.color} rounded-full`}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default PointsCard;