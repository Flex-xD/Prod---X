import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, PressBtn } from '../../../ui';
import { quick } from '@/lib/motion';
import { initialsOf } from '../../../utils';
import type { ITimerForm, IUser, TimerType } from '../../../types';

interface DetailsStepProps {
    form: ITimerForm;
    onChange: (updated: ITimerForm) => void;
    timerType: TimerType;
    invitedUsers: IUser[];
    onSubmit: () => void;
}

const DetailsStep = ({ form, onChange, timerType, invitedUsers, onSubmit }: DetailsStepProps) => {
    const canSubmit = Boolean(form.title && form.deadline && form.specifiedTime);

    const set = (key: keyof ITimerForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        // specifiedTime is a number in ITimerForm: coerce instead of
        // pushing a string into the form state.
        if (key === 'specifiedTime') {
            const raw = e.target.value;
            onChange({ ...form, specifiedTime: raw === '' ? 0 : Number(raw) });
            return;
        }
        onChange({ ...form, [key]: e.target.value });
    };

    return (
        <motion.div
            key="fill-details"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={quick}
            className="space-y-4"
        >
            {/* Title */}
            <div>
                <label htmlFor="timer-title" className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-ink-soft">
                    Session Title <span className="text-alert-deep">*</span>
                </label>
                <Input
                    id="timer-title"
                    placeholder="DSA Practice, System Design..."
                    value={form.title}
                    onChange={set('title')}
                    className="rounded-lg text-sm"
                />
            </div>

            {/* Description */}
            <div>
                <label htmlFor="timer-description" className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-ink-soft">
                    Description
                </label>
                <Textarea
                    id="timer-description"
                    placeholder="What's the goal? (optional)"
                    value={form.description}
                    onChange={set('description')}
                    className="h-20 resize-none rounded-lg text-sm"
                />
            </div>

            {/* Duration + Deadline */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label htmlFor="timer-duration" className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-ink-soft">
                        Duration (mins) <span className="text-alert-deep">*</span>
                    </label>
                    <Input
                        id="timer-duration"
                        type="number"
                        placeholder="120"
                        value={form.specifiedTime || ''}
                        onChange={set('specifiedTime')}
                        className="rounded-lg text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="timer-deadline" className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-ink-soft">
                        Deadline <span className="text-alert-deep">*</span>
                    </label>
                    <Input
                        id="timer-deadline"
                        type="date"
                        value={form.deadline}
                        onChange={set('deadline')}
                        className="rounded-lg text-sm"
                    />
                </div>
            </div>

            {/* Invited members summary (group only): teal = informational */}
            {timerType === 'group' && invitedUsers.length > 0 && (
                <div className="flex items-center gap-3 rounded-lg border border-info bg-info-tint p-3">
                    <div className="flex -space-x-2">
                        {invitedUsers.slice(0, 4).map((u) => (
                            <Avatar key={u._id} initials={initialsOf(u.username)} size="sm" />
                        ))}
                    </div>
                    <span className="text-xs font-bold text-info-deep">
                        {invitedUsers.length} member{invitedUsers.length !== 1 ? 's' : ''} will be invited
                    </span>
                </div>
            )}

            {/* Submit: orange = this creates an active focus session */}
            <PressBtn variant="focus" disabled={!canSubmit} onClick={onSubmit} className="mt-2 w-full py-4">
                <Zap className="h-4 w-4" aria-hidden="true" />
                {timerType === 'group' ? 'Create Group Timer' : 'Create Timer'}
            </PressBtn>
        </motion.div>
    );
};

export default DetailsStep;