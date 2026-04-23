import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { CheckSquare, Clock, Users, Award, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { IPointsCardProps, IPointsBreakdown } from './points-card-types';

const iconMap: Record<IPointsBreakdown['iconName'], React.ReactNode> = {
    CheckSquare: <CheckSquare className="w-3.5 h-3.5" />,
    Clock: <Clock className="w-3.5 h-3.5" />,
    Users: <Users className="w-3.5 h-3.5" />,
};

const PointsCard = ({ totalPoints, rank, breakdown }: IPointsCardProps) => {
    // useInView — bars only animate when the card scrolls into view
    // This is critical: if bars animated on mount while offscreen, it's wasted paint
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-40px' });

    return (
        <div
            ref={ref}
            className="fade-up-card bg-white/75 backdrop-blur-sm rounded-3xl border border-white/70 shadow-xl shadow-violet-100/30 p-6"
            style={{ animationDelay: '0.3s' }}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-amber-50">
                        <Award className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-slate-700 leading-tight">Productivity Points</h2>
                        <p className="text-[11px] text-slate-400 mt-0.5 tabular-nums">{totalPoints.toLocaleString()} total earned</p>
                    </div>
                </div>
                <Badge className="bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-50 font-semibold text-xs gap-1">
                    <Zap className="w-3 h-3 fill-amber-500 text-amber-500" />
                    Rank #{rank}
                </Badge>
            </div>

            {/* Breakdown bars */}
            <div className="space-y-5">
                {breakdown.map((item, i) => (
                    <div key={item.label}>
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                <span className="text-slate-300">{iconMap[item.iconName]}</span>
                                {item.label}
                            </div>
                            <span className="text-xs font-bold text-slate-700 tabular-nums">
                                +{item.points.toLocaleString()} pts
                            </span>
                        </div>

                        {/* Track */}
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            {/*
                motion.div only used here — progress bars are THE high-value animation moment.
                animate is gated on isInView so it only runs when visible in the viewport.
              */}
                            <motion.div
                                className={`h-full ${item.color} rounded-full`}
                                initial={{ width: 0 }}
                                animate={{ width: isInView ? `${item.pct}%` : 0 }}
                                transition={{
                                    delay: i * 0.12,
                                    duration: 0.7,
                                    ease: [0.25, 0.46, 0.45, 0.94], // custom cubic-bezier — feels more physical
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PointsCard;