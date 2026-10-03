import { motion } from 'framer-motion';
import { Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { IDashboardSummary } from '@/types/dashboard';

interface GroupTimerStatCardProps {
    data: IDashboardSummary['latestGroupTimer'];
    delay?: number;
}

const GroupTimerStatCard = ({ data, delay = 0 }: GroupTimerStatCardProps) => {
    return (
        <motion.div
            initial= {{ opacity: 0, y: 20 }
}
animate = {{ opacity: 1, y: 0 }}
transition = {{ duration: 0.4, delay, type: 'spring', damping: 28, stiffness: 280 }}
whileHover = {{ y: -4, boxShadow: '0 24px 48px rgba(236,72,153,0.35)' }}
className = "relative rounded-3xl overflow-hidden text-white cursor-default"
style = {{ background: 'linear-gradient(135deg, #EC4899, #F43F5E)', boxShadow: '0 8px 28px rgba(236,72,153,0.4)' }}
        >
    <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full" style = {{ background: 'rgba(255,255,255,0.12)', filter: 'blur(24px)' }} />

        < div className = "relative z-10 p-6" >
            <div className="flex items-start justify-between mb-4" >
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0" style = {{ background: 'rgba(255,255,255,0.18)' }}>
                    <Users className="w-8 h-8 p-1.5" />
                        </div>
                        < span className = "text-xs font-bold px-2.5 py-1 rounded-full" style = {{ background: 'rgba(255,255,255,0.2)' }}>
                            Group
                            </span>
                            </div>

{
    data ? (
        <>
        <div className= "text-lg font-black mb-1 leading-tight truncate" > { data.title } </div>
        < div className = "text-sm font-medium opacity-75 mb-3" >
            { data.participantCount } member{ data.participantCount !== 1 ? 's' : '' } · { data.progressPct }% done
                </div>
                < div className = "w-full rounded-full overflow-hidden" style = {{ height: 5, background: 'rgba(255,255,255,0.2)' }
}>
    <motion.div
                                className="h-full rounded-full bg-white"
initial = {{ width: 0 }}
animate = {{ width: `${data.progressPct}%` }}
transition = {{ duration: 1.2, delay: delay + 0.4, ease: [0.34, 1.2, 0.64, 1] }}
                            />
    </div>
    </>
                ) : (
    <>
    <div className= "text-lg font-black mb-1" > No active group timer </div>
        < Link to = "/timer" className = "flex items-center gap-1 text-sm font-bold opacity-90 hover:opacity-100 transition-opacity mt-2" >
            Create one < ArrowRight className = "w-3.5 h-3.5" />
                </Link>
                </>
                )}
</div>
    </motion.div>
    );
};

export default GroupTimerStatCard;