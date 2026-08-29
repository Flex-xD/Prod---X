import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X } from 'lucide-react';
import { sp, softSp, MAX_GROUP_INVITES } from '../constants';
import type { ModalStep, TimerType, ITimerForm, IUser } from '../types';
import TypeSelectStep from './steps/type-select-step';
import InviteStep from './steps/invite-step';
import DetailsStep from './steps';
import useCreateProductivityTimerMutation from '@/custom-hooks/productivity-timer/create-productivity-timer';
import useCreateGroupProductivityTimer from '@/custom-hooks/group-productivity-timer/create-group-timer';
import { userAppStore } from '@/store';
import { usePresence } from '@/context/user-presence-context';

interface CreateTimerModalProps {
    onClose: () => void;
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

const CreateTimerModal = ({ onClose }: CreateTimerModalProps) => {
    const [step, setStep] = useState<ModalStep>('type-select');
    const [timerType, setTimerType] = useState<TimerType>('individual');
    const [invitedUsers, setInvitedUsers] = useState<IUser[]>([]);
    const [form, setForm] = useState<ITimerForm>(EMPTY_FORM);
    const { seedOnlineUsers } = usePresence();

    const userId = userAppStore((state) => state.user_id);

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
    const { mutateAsync: createProductivityTimer } = useCreateProductivityTimerMutation(userId ?? "");
    const { mutateAsync: handleCreateGroupTimer } = useCreateGroupProductivityTimer(userId ?? "");

    // ? Handler function
    const handleSubmit = async () => {
        if (timerType == "individual") {
            await createProductivityTimer(form)
        } else {
            await handleCreateGroupTimer({ ...form, invitedUsersId });
        }
        onClose();
    }

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
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {/* Backdrop */}
            <motion.div
                className="absolute inset-0"
                style={{ background: 'rgba(15,10,40,0.65)', backdropFilter: 'blur(12px)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            />

            {/* Sheet */}
            <motion.div
                className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden z-10"
                style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.35)' }}
                initial={{ opacity: 0, y: 80 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 80 }}
                transition={softSp}
            >
                {/* Mobile drag pill */}
                <div className="flex justify-center pt-3 sm:hidden">
                    <div className="w-10 h-1 rounded-full bg-slate-200" />
                </div>

                {/* ── Gradient header ── */}
                <div
                    className="relative px-6 pt-6 pb-6 overflow-hidden"
                    style={{ background: 'linear-gradient(145deg, #1e1b4b 0%, #312e81 55%, #4c1d95 100%)' }}
                >
                    {/* Decorative orbs */}
                    <div
                        className="absolute -top-10 -right-10 w-44 h-44 rounded-full"
                        style={{ background: 'radial-gradient(circle, rgba(129,140,248,0.25), transparent)' }}
                    />
                    <div
                        className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full"
                        style={{ background: 'radial-gradient(circle, rgba(192,132,252,0.2), transparent)' }}
                    />

                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-5">
                            {/* Left: back + title */}
                            <div className="flex items-center gap-2.5">
                                {step !== 'type-select' && (
                                    <motion.button
                                        whileTap={{ scale: 0.88 }}
                                        onClick={() => handleBack(step)}
                                        className="w-8 h-8 rounded-xl flex items-center justify-center text-white"
                                        style={{ background: 'rgba(255,255,255,0.12)' }}
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                    </motion.button>
                                )}
                                <div>
                                    <AnimatePresence mode="wait">
                                        <motion.h2
                                            key={step}
                                            initial={{ opacity: 0, y: -6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 6 }}
                                            transition={{ duration: 0.18 }}
                                            className="text-lg font-black text-white"
                                        >
                                            {STEP_LABELS[step]}
                                        </motion.h2>
                                    </AnimatePresence>
                                    <p className="text-indigo-300 text-xs mt-0.5 font-medium">
                                        {STEP_SUBS(invitedUsers.length, timerType)[step]}
                                    </p>
                                </div>
                            </div>

                            {/* Close */}
                            <motion.button
                                whileTap={{ scale: 0.88 }}
                                onClick={onClose}
                                className="w-8 h-8 rounded-xl flex items-center justify-center text-white"
                                style={{ background: 'rgba(255,255,255,0.12)' }}
                            >
                                <X className="w-4 h-4" />
                            </motion.button>
                        </div>

                        {/* Step progress pills */}
                        <div className="flex gap-2 items-center">
                            {steps.map(s => (
                                <motion.div
                                    key={s}
                                    layout
                                    className="h-1.5 rounded-full"
                                    style={{ background: step === s ? 'white' : 'rgba(255,255,255,0.22)' }}
                                    animate={{ width: step === s ? 28 : 10 }}
                                    transition={sp}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Step body ── */}
                <div className="p-6 max-h-[68vh] overflow-y-auto">
                    <AnimatePresence mode="wait">
                        {step === 'type-select' && (
                            <TypeSelectStep key="type-select" onSelect={handleTypeSelect} />
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