import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X } from 'lucide-react';
import { MAX_GROUP_INVITES } from '../constants';
import { progressUpdate, quick, spring } from '@/lib/motion';
import type { ModalStep, TimerType, ITimerForm, IUser } from '../types';
import TypeSelectStep from './steps/type-select-step';
import InviteStep from './steps/invite-step';
import DetailsStep from './steps/detail-step';
import useCreateProductivityTimerMutation from '@/custom-hooks/productivity-timer/create-productivity-timer';
import useCreateGroupProductivityTimer from '@/custom-hooks/group-productivity-timer/create-group-timer';
import { usePresence } from '@/context/user-presence-context';

interface CreateTimerModalProps {
    onClose: () => void;
    canCreateIndividual: boolean;
    canCreateGroup: boolean;
}

const EMPTY_FORM: ITimerForm = {
    title: '',
    description: '',
    deadline: '',
    specifiedTime: 0,
};

const STEP_LABELS: Record<ModalStep, string> = {
    'type-select': 'New Timer',
    'invite-users': 'Invite Your Squad',
    'fill-details': 'Session Details',
};

const STEP_SUBS = (inviteCount: number, timerType: TimerType): Record<ModalStep, string> => ({
    'type-select': 'Choose your mode',
    'invite-users': `${inviteCount} / ${MAX_GROUP_INVITES} members`,
    'fill-details': timerType === 'group' ? 'Group session' : 'Solo session',
});

const CreateTimerModal = ({ onClose, canCreateIndividual, canCreateGroup }: CreateTimerModalProps) => {
    const [step, setStep] = useState<ModalStep>('type-select');
    const [timerType, setTimerType] = useState<TimerType>('individual');
    const [invitedUsers, setInvitedUsers] = useState<IUser[]>([]);
    const [form, setForm] = useState<ITimerForm>(EMPTY_FORM);
    const { seedOnlineUsers } = usePresence();

    // ? DERIVED STATE
    const onlineInvitedUsersId = useMemo(() => {
        return invitedUsers.filter(user => user.isOnline == true).map(user => user._id);
    }, [invitedUsers]);

    const invitedUsersId = useMemo(() => {
        return invitedUsers.map(user => user._id);
    }, [invitedUsers]);

    useEffect(() => {
        seedOnlineUsers([...onlineInvitedUsersId]);
    }, [onlineInvitedUsersId, seedOnlineUsers]);

    // ? POST HOOKS
    // ! It is a bad practice to use ?? "" so fix it later on
    const { mutateAsync: createProductivityTimer } = useCreateProductivityTimerMutation();
    const { mutateAsync: handleCreateGroupTimer } = useCreateGroupProductivityTimer();

    // ? Handler function
    const handleSubmit = async () => {
        if (timerType == 'individual') {
            await createProductivityTimer(form);
        } else {
            await handleCreateGroupTimer({ ...form, invitedUsersId });
        }
        onClose();
    };

    // ── Derived step list (changes length based on type) ──────────────────────
    const steps: ModalStep[] = [
        'type-select',
        ...(timerType === 'group' ? (['invite-users'] as ModalStep[]) : []),
        'fill-details',
    ];

    // ── Navigation ────────────────────────────────────────────────────────────
    const handleTypeSelect = (t: TimerType) => {
        setTimerType(t);
        setStep(t === 'group' ? 'invite-users' : 'fill-details');
    };

    const handleBack = (step: ModalStep) => {
        const currentStep = steps.indexOf(step);
        setStep(steps[currentStep - 1]);
    };

    // ── Invite toggle ─────────────────────────────────────────────────────────
    const toggleInvite = (user: IUser) =>
        setInvitedUsers(prev =>
            prev.find(u => u._id === user._id)
                ? prev.filter(u => u._id !== user._id)
                : prev.length < MAX_GROUP_INVITES ? [...prev, user] : prev,
        );

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={quick}
        >
            {/* Backdrop: flat ink scrim, no blur */}
            <motion.div
                className="absolute inset-0 bg-ink/60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={quick}
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Sheet */}
            <motion.div
                role="dialog"
                aria-modal="true"
                aria-label="New timer"
                className="relative z-10 w-full overflow-hidden rounded-t-lg border-2 border-ink bg-surface shadow-hard-lg sm:max-w-md sm:rounded-lg"
                initial={{ opacity: 0, y: 80 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 80 }}
                transition={spring}
            >
                {/* Mobile drag pill */}
                <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-paper-deep sm:hidden" />

                {/* ── Ink header ── */}
                <div className="focus-ring-invert border-b-2 border-ink bg-ink px-6 py-5 text-paper">
                    <div className="mb-5 flex items-center justify-between gap-3">
                        {/* Left: back + title */}
                        <div className="flex min-w-0 items-center gap-2.5">
                            {step !== 'type-select' && (
                                <motion.button
                                    type="button"
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleBack(step)}
                                    aria-label="Back a step"
                                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-paper/15 text-paper transition-colors duration-fast hover:bg-paper/25 active:bg-paper/35"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                </motion.button>
                            )}
                            <div className="min-w-0">
                                <AnimatePresence mode="wait">
                                    <motion.h2
                                        key={step}
                                        initial={{ opacity: 0, y: -6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 6 }}
                                        transition={quick}
                                        className="truncate text-sm font-bold uppercase tracking-[0.14em] text-paper"
                                    >
                                        {STEP_LABELS[step]}
                                    </motion.h2>
                                </AnimatePresence>
                                <p className="mt-0.5 text-xs font-medium text-paper/60">
                                    {STEP_SUBS(invitedUsers.length, timerType)[step]}
                                </p>
                            </div>
                        </div>

                        {/* Close */}
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close dialog"
                            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-paper/15 text-paper transition-colors duration-fast hover:bg-paper/25 active:bg-paper/35"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Step progress pills: green fill marks how far you've come */}
                    <div className="flex items-center gap-2">
                        {steps.map(s => (
                            <motion.div
                                key={s}
                                className={`h-1.5 rounded-sm ${step === s ? 'bg-progress' : 'bg-paper/25'}`}
                                initial={false}
                                animate={{ width: step === s ? 28 : 10 }}
                                transition={progressUpdate}
                            />
                        ))}
                    </div>
                </div>

                {/* ── Step body ── */}
                <div className="max-h-[68vh] overflow-y-auto p-6">
                    <AnimatePresence mode="wait">
                        {step === 'type-select' && (
                            <TypeSelectStep key="type-select" onSelect={handleTypeSelect} canCreateIndividual={canCreateIndividual} canCreateGroup={canCreateGroup} />
                        )}
                        {step === 'invite-users' && (
                            <InviteStep
                                key="invite-users"
                                invitedUsers={invitedUsers}
                                onToggle={toggleInvite}
                                onContinue={() => setStep('fill-details')}
                            />
                        )}
                        {step === 'fill-details' && (
                            <DetailsStep
                                key="fill-details"
                                form={form}
                                onChange={setForm}
                                timerType={timerType}
                                invitedUsers={invitedUsers}
                                onSubmit={handleSubmit}
                            />
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default CreateTimerModal;