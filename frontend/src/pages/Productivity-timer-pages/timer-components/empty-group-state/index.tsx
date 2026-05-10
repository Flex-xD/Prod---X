import { motion } from 'framer-motion';
import { Users, Sparkles, Plus } from 'lucide-react';
import { MagBtn } from '../ui';

interface EmptyGroupStateProps {
    onCreateClick: () => void;
}

const EmptyGroupState = ({ onCreateClick }: EmptyGroupStateProps) => (
    <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col items-center justify-center py-14 text-center"
    >
        <div className="relative mb-6">
            <div
                className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto"
                style={{ background: 'linear-gradient(135deg,#fdf2f8,#fce7f3)', border: '1px solid #fbcfe8' }}
            >
                <Users className="w-9 h-9 text-pink-400" />
            </div>

            <motion.div
                className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white flex items-center justify-center"
                style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.12)' }}
                animate={{ rotate: [0, 18, -18, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 3.5 }}
            >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </motion.div>
        </div>

        <h4 className="text-lg font-black text-slate-800 mb-2">No Group Timers Yet</h4>
        <p className="text-slate-400 text-sm max-w-xs mb-7 leading-relaxed">
            You haven't joined any group session. Invite your squad and grind together!
        </p>

        <MagBtn
            onClick={onCreateClick}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl text-white text-sm font-bold"
            style={{
                background: 'linear-gradient(135deg,#EC4899,#F43F5E)',
                boxShadow: '0 10px 28px rgba(236,72,153,0.38)',
            }}
        >
            <Plus className="w-4 h-4" /> Create Group Timer
        </MagBtn>
    </motion.div>
);

export default EmptyGroupState;