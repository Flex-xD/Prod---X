import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar } from '../../ui';
import { sp } from '../../constants';
import type { ITimerForm, IUser, TimerType } from '../../types';

interface DetailsStepProps {
    form: ITimerForm;
    onChange: (updated: ITimerForm) => void;
    timerType: TimerType;
    invitedUsers: IUser[];
    onSubmit: () => void;
}

const DetailsStep = ({ form, onChange, timerType, invitedUsers, onSubmit }: DetailsStepProps) => {
    const canSubmit = Boolean(form.title && form.deadline && form.specifiedTime);

    const set = (key: keyof ITimerForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        onChange({ ...form, [key]: e.target.value });

    return (
        <motion.div
            key="fill-details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={sp}
            className="space-y-4"
        >
            {/* Title */}
            <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                    Session Title <span className="text-rose-400">*</span>
                </label>
                <Input
                    placeholder="DSA Practice, System Design…"
                    value={form.title}
                    onChange={set('title')}
                    className="rounded-xl border-slate-200 focus-visible:ring-violet-400 text-sm"
                />
            </div>

            {/* Description */}
            <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                    Description
                </label>
                <Textarea
                    placeholder="What's the goal? (optional)"
                    value={form.description}
                    onChange={set('description')}
                    className="rounded-xl border-slate-200 focus-visible:ring-violet-400 resize-none h-20 text-sm"
                />
            </div>

            {/* Duration + Deadline */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                        Duration (mins) <span className="text-rose-400">*</span>
                    </label>
                    <Input
                        type="number"
                        placeholder="120"
                        value={form.specifiedTime}
                        onChange={set('specifiedTime')}
                        className="rounded-xl border-slate-200 focus-visible:ring-violet-400 text-sm"
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                        Deadline <span className="text-rose-400">*</span>
                    </label>
                    <Input
                        type="date"
                        value={form.deadline}
                        onChange={set('deadline')}
                        className="rounded-xl border-slate-200 focus-visible:ring-violet-400 text-sm"
                    />
                </div>
            </div>

            {/* Invited members summary (group only) */}
            {timerType === 'group' && invitedUsers.length > 0 && (
                <div
                    className="p-3 rounded-2xl flex items-center gap-3"
                    style={{ background: '#f5f3ff', border: '1px solid #ddd6fe' }}
                >
                    <div className="flex -space-x-2">
                        {invitedUsers.slice(0, 4).map((u, i) => (
                            <Avatar key={u._id} initials={u.initials} idx={i} size="sm" />
                        ))}
                    </div>
                    <span className="text-xs font-bold text-violet-700">
                        {invitedUsers.length} member{invitedUsers.length !== 1 ? 's' : ''} will be invited
                    </span>
                </div>
            )}

            {/* Submit */}
            <motion.button
                whileTap={{ scale: 0.97 }}
                disabled={!canSubmit}
                onClick={onSubmit}
                className="w-full py-4 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-40 mt-2 transition-all"
                style={{
                    background: 'linear-gradient(135deg,#7C3AED,#4F46E5)',
                    boxShadow: canSubmit ? '0 10px 28px rgba(124,58,237,0.4)' : 'none',
                }}
            >
                <Zap className="w-4 h-4" />
                {timerType === 'group' ? 'Create Group Timer' : 'Create Timer'}
            </motion.button>
        </motion.div>
    );
};

export default DetailsStep;