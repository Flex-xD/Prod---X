import { motion } from 'framer-motion';
import { CheckCircle2, Clock3, AlertTriangle, ListTodo } from 'lucide-react';
import type { IProfileStats } from '@/types/user';

interface CategoryBreakdownProps {
    stats: IProfileStats;
}

const Row = ({ icon: Icon, label, value, color }: { icon: typeof CheckCircle2; label: string; value: number; color: string }) => (
    <div className="flex items-center justify-between py-2.5">
        <span className="flex items-center gap-2.5 text-sm font-semibold text-slate-600">
            <Icon className="w-4 h-4" style={{ color }} /> {label}
        </span>
        <span className="text-sm font-black text-slate-900">{value}</span>
    </div>
);

const CategoryBreakdown = ({ stats }: CategoryBreakdownProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2, type: 'spring', damping: 28, stiffness: 280 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
            <div className="rounded-3xl bg-white p-5" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.07)', border: '1px solid rgba(0,0,0,0.05)' }}>
                <h4 className="font-black text-slate-900 text-sm mb-1">Today's Tasks</h4>
                <div className="divide-y divide-slate-50">
                    <Row icon={ListTodo} label="Total" value={stats.tasks.totalToday} color="#64748b" />
                    <Row icon={CheckCircle2} label="Done" value={stats.tasks.done} color="#10b981" />
                    <Row icon={Clock3} label="Pending" value={stats.tasks.pending} color="#f59e0b" />
                </div>
            </div>

            <div className="rounded-3xl bg-white p-5" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.07)', border: '1px solid rgba(0,0,0,0.05)' }}>
                <h4 className="font-black text-slate-900 text-sm mb-1">Individual Timers</h4>
                <div className="divide-y divide-slate-50">
                    <Row icon={Clock3} label="Active" value={stats.individualTimers.active} color="#3b82f6" />
                    <Row icon={CheckCircle2} label="Completed" value={stats.individualTimers.completed} color="#10b981" />
                    <Row icon={AlertTriangle} label="Expired" value={stats.individualTimers.expired} color="#ef4444" />
                </div>
            </div>

            <div className="rounded-3xl bg-white p-5" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.07)', border: '1px solid rgba(0,0,0,0.05)' }}>
                <h4 className="font-black text-slate-900 text-sm mb-1">Group Timers</h4>
                <div className="divide-y divide-slate-50">
                    <Row icon={Clock3} label="Active" value={stats.groupTimers.active} color="#ec4899" />
                    <Row icon={CheckCircle2} label="Completed" value={stats.groupTimers.completed} color="#10b981" />
                    <Row icon={AlertTriangle} label="Expired" value={stats.groupTimers.expired} color="#ef4444" />
                </div>
            </div>
        </motion.div>
    );
};

export default CategoryBreakdown;