import { motion } from 'framer-motion';
import { Timer, Users, ChevronRight, Lock } from 'lucide-react'; // CHANGED: added Lock
import type { TimerType } from '../../../types';
import { sp } from '../../../constants';

interface TypeSelectStepProps {
    onSelect: (type: TimerType) => void;
    canCreateIndividual: boolean; 
    canCreateGroup: boolean;      
}

const TYPE_OPTIONS = [
    {
        type: 'individual' as TimerType,
        label: 'Individual Timer',
        desc: 'Solo, distraction-free focus session',
        icon: Timer,
        grad: 'linear-gradient(135deg,#7C3AED,#4F46E5)',
        bg: '#f5f3ff',
        border: '#ddd6fe',
    },
    {
        type: 'group' as TimerType,
        label: 'Group Timer',
        desc: 'Invite up to 5 people and grind together',
        icon: Users,
        grad: 'linear-gradient(135deg,#EC4899,#F43F5E)',
        bg: '#fff1f2',
        border: '#fecdd3',
    },
];

const TypeSelectStep = ({ onSelect, canCreateIndividual, canCreateGroup }: TypeSelectStepProps) => (
    <motion.div
        key="type-select"
        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
        transition={sp}
        className="space-y-3"
    >
        {TYPE_OPTIONS.map(({ type, label, desc, icon: Icon, grad, bg, border }, i) => {

            const disabled = type === 'individual' ? !canCreateIndividual : !canCreateGroup;

            return (
                <motion.button
                    key={type}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07, ...sp }}
                    whileHover={disabled ? {} : { scale: 1.02, boxShadow: '0 8px 28px rgba(0,0,0,0.09)' }}
                    whileTap={disabled ? {} : { scale: 0.97 }}
                    disabled={disabled} 
                    onClick={() => !disabled && onSelect(type)} 
                    className="w-full p-4 rounded-2xl flex items-center gap-4 text-left border transition-shadow disabled:cursor-not-allowed"
                    style={disabled ? { background: '#f8fafc', borderColor: 'rgba(0,0,0,0.06)', opacity: 0.6 } : { background: bg, borderColor: border }}
                >
                    <div
                        className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shrink-0"
                        style={{ background: disabled ? 'linear-gradient(135deg,#94a3b8,#64748b)' : grad, boxShadow: '0 6px 16px rgba(0,0,0,0.18)' }}
                    >
                        {disabled ? <Lock className="w-4 h-4" /> : <Icon className="w-5 h-5" />}
                    </div>

                    <div className="flex-1">
                        <div className="font-bold text-slate-900 text-sm">{label}</div>
                        <div className="text-slate-500 text-xs mt-0.5">
                            {disabled ? "You're at your slot limit — free one up first" : desc}
                        </div>
                    </div>

                    {!disabled && <ChevronRight className="w-4 h-4 text-slate-400" />}
                </motion.button>
            );
        })}
    </motion.div>
);

export default TypeSelectStep;