import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Clock3, CheckCircle2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { Pill, SectionDivider } from './timer-components/ui';
import type { IGroupTimer, IProductivityTimer, ViewMode } from './timer-components/types';
import { MAX_INDIVIDUAL_TIMERS, MAX_GROUP_TIMERS } from './timer-components/constants';
import { enter, pressSpring, quick } from '@/lib/motion';
import TimerPageHeader from './timer-components/timer-page-header';
import EmptyGroupState from './timer-components/empty-group-state';
import GroupTimerCard from './timer-components/group-timer-card';
import CapacityTracker from './timer-components/capacity-tracker';
import IndividualTimerCard from './timer-components/individual-timer-card';
import IndividualTimerDetail from './timer-components/individual-timer-detail';
import GroupTimerDetail from './timer-components/group-timer-detail';
import CreateTimerModal from './timer-components/create-timer-modal';
import useGetActiveGroupProductivityTimers from '@/custom-hooks/group-productivity-timer/get-group-productivity-timer';
import useGetActiveProductivityTimer from '@/custom-hooks/productivity-timer/get-productivity-timer';
import useGetPendingGroupTimerInvites from '@/custom-hooks/group-productivity-timer/get-pending-invites';
import useGetExpiredProductivityTimer from '@/custom-hooks/productivity-timer/get-expired-productivity-timer';
import useGetCompletedGroupProductivityTimers from '@/custom-hooks/group-productivity-timer/get-completed-group-productivity-timer';
import useGetCompletedProductivityTimer from '@/custom-hooks/productivity-timer/get-completed-productivity-timer';
import { useLiveGroupTimerUpdates } from '@/custom-hooks/group-productivity-timer/use-live-group-timer-updates';
import useGetExpiredGroupProductivityTimers from '@/custom-hooks/group-productivity-timer/get-expired-group-producitivty-timer';

type DashboardTab = 'active' | 'completed' | 'expired';

const TimerPage = () => {
    const [showModal, setShowModal] = useState(false);
    const [view, setView] = useState<ViewMode>('dashboard');
    const [selectedInd, setSelectedInd] = useState<IProductivityTimer | null>(null);
    const [selectedGrp, setSelectedGrp] = useState<IGroupTimer | null>(null);
    const [dashboardTab, setDashboardTab] = useState<DashboardTab>('active');
    // * True while the open detail view's stopwatch is running — back-navigation
    // * is blocked until the user pauses or submits.
    const [detailTimerRunning, setDetailTimerRunning] = useState(false);
    useLiveGroupTimerUpdates();

    const { data: activeGroupProductivityTimers } = useGetActiveGroupProductivityTimers();
    const { data: activeProducitivityTimers } = useGetActiveProductivityTimer();
    const { data: pendingInvites } = useGetPendingGroupTimerInvites();
    const { data: expiredGroupTimers } = useGetExpiredGroupProductivityTimers();
    const { data: expiredIndividualTimers } = useGetExpiredProductivityTimer();
    const { data: completedGroupTimers } = useGetCompletedGroupProductivityTimers();
    const { data: completedIndividualTimers } = useGetCompletedProductivityTimer();

    useEffect(() => {
        if (!selectedGrp) return;
        const updated =
            activeGroupProductivityTimers?.data.find((t) => t._id === selectedGrp._id) ??
            completedGroupTimers?.data.find((t) => t._id === selectedGrp._id) ??
            expiredGroupTimers?.data.find((t) => t._id === selectedGrp._id);
        if (updated && updated !== selectedGrp) setSelectedGrp(updated);
    }, [activeGroupProductivityTimers, completedGroupTimers, expiredGroupTimers, selectedGrp]);

    useEffect(() => {
        if (!selectedInd) return;
        const updated =
            activeProducitivityTimers?.data.find((t) => t._id === selectedInd._id) ??
            completedIndividualTimers?.data.find((t) => t._id === selectedInd._id) ??
            expiredIndividualTimers?.data.find((t) => t._id === selectedInd._id);
        if (updated && updated !== selectedInd) setSelectedInd(updated);
    }, [activeProducitivityTimers, completedIndividualTimers, expiredIndividualTimers, selectedInd]);

    const activeGroupTimersLength = activeGroupProductivityTimers?.data ? activeGroupProductivityTimers.data.length : 0;
    const activeIndividualTimersLength = activeProducitivityTimers?.data ? activeProducitivityTimers.data.length : 0;

    const canCreateIndividual = activeIndividualTimersLength < MAX_INDIVIDUAL_TIMERS;
    const canCreateGroup = activeGroupTimersLength < MAX_GROUP_TIMERS;

    const handleBack = () => {
        if (detailTimerRunning) {
            toast.error('Pause or submit your productivity before going back !');
            return;
        }
        setView('dashboard');
        setSelectedInd(null);
        setSelectedGrp(null);
    };

    const openIndividual = (timer: IProductivityTimer) => {
        setSelectedInd(timer);
        setView('individual-detail');
    };

    const openGroup = (timer: IGroupTimer) => {
        setSelectedGrp(timer);
        setView('group-detail');
    };

    const pendingInvitesCount = pendingInvites?.data?.length ?? 0;
    const expiredCount = (expiredGroupTimers?.data?.length ?? 0) + (expiredIndividualTimers?.data?.length ?? 0);
    const completedCount = (completedGroupTimers?.data?.length ?? 0) + (completedIndividualTimers?.data?.length ?? 0);

    const TABS: { key: DashboardTab; label: string; icon: typeof Clock3; count?: number }[] = [
        { key: 'active', label: 'Active', icon: Clock3 },
        { key: 'completed', label: 'Completed', icon: CheckCircle2, count: completedCount },
        { key: 'expired', label: 'Expired', icon: AlertTriangle, count: expiredCount },
    ];

    const EMPTY = 'rounded-lg border-2 border-dashed border-line bg-surface p-8 text-center text-sm font-medium text-ink-faint';

    return (
        <div className="min-h-screen bg-paper">
            <TimerPageHeader
                view={view}
                selectedInd={selectedInd}
                selectedGrp={selectedGrp}
                onBack={handleBack}
                onNewTimer={() => setShowModal(true)}
            />

            <div className="mx-auto max-w-4xl px-6 py-8">
                <AnimatePresence mode="wait">
                    {view === 'dashboard' && (
                        <motion.div
                            key="dashboard"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={quick}
                        >
                            {/* Tabs: one shared underline slides with pressSpring.
                                Green marks where you are, the way ::selection does. */}
                            <div
                                role="group"
                                aria-label="Timer status"
                                className="mb-8 flex flex-wrap items-center gap-1 border-b-2 border-ink"
                            >
                                {TABS.map(({ key, label, icon: Icon, count }) => (
                                    <button
                                        key={key}
                                        type="button"
                                        aria-pressed={dashboardTab === key}
                                        onClick={() => setDashboardTab(key)}
                                        className={`relative flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors duration-fast ${
                                            dashboardTab === key
                                                ? 'text-ink'
                                                : 'text-ink-faint hover:text-ink-soft'
                                        }`}
                                    >
                                        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                                        {label}
                                        {!!count && (
                                            <span
                                                className={`rounded-full px-1.5 py-0.5 font-mono text-[10px] font-bold tabular-nums ${
                                                    dashboardTab === key
                                                        ? 'bg-ink text-paper'
                                                        : 'bg-paper-deep text-ink-soft'
                                                }`}
                                            >
                                                {count}
                                            </span>
                                        )}
                                        {dashboardTab === key && (
                                            <motion.span
                                                layoutId="timer-tab-active"
                                                transition={pressSpring}
                                                aria-hidden="true"
                                                className="absolute inset-x-0 -bottom-[2px] h-0.5 bg-progress"
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Tab content swaps as one block; sections below carry
                                the arrival. One entrance per section, not per card. */}
                            <AnimatePresence mode="wait" initial={false}>
                                {dashboardTab === 'active' && (
                                    <motion.div
                                        key="tab-active"
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -6 }}
                                        transition={quick}
                                    >
                                        {pendingInvitesCount > 0 && (
                                            <motion.section {...enter(0)} className="mb-10">
                                                <div className="mb-5 flex items-center justify-between gap-4">
                                                    <div>
                                                        <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-ink">
                                                            Pending Invitations
                                                        </h2>
                                                        <p className="mt-0.5 text-xs font-medium text-ink-faint">
                                                            Group timers waiting on your response
                                                        </p>
                                                    </div>
                                                    <Pill color="focus">{pendingInvitesCount} pending</Pill>
                                                </div>
                                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                    {/* popLayout: cards collapse out when accepted
                                                        or declined, the grid reflows behind them. */}
                                                    <AnimatePresence mode="popLayout" initial={false}>
                                                        {pendingInvites?.data.map((timer) => (
                                                            <GroupTimerCard
                                                                key={timer._id}
                                                                timer={timer}
                                                                onClick={() => {}}
                                                                isPendingInvite
                                                            />
                                                        ))}
                                                    </AnimatePresence>
                                                </div>
                                            </motion.section>
                                        )}

                                        <motion.section {...enter(0.06)} className="mb-10">
                                            <div className="mb-5 flex items-center justify-between gap-4">
                                                <div>
                                                    <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-ink">
                                                        Group Timers
                                                    </h2>
                                                    <p className="mt-0.5 text-xs font-medium text-ink-faint">
                                                        Created or joined sessions
                                                    </p>
                                                </div>
                                                <Pill color={activeGroupTimersLength > 0 ? 'focus' : 'neutral'}>
                                                    {activeGroupTimersLength} active
                                                </Pill>
                                            </div>

                                            <CapacityTracker used={activeGroupTimersLength} max={MAX_GROUP_TIMERS} />

                                            {activeGroupTimersLength === 0 ? (
                                                <div className="overflow-hidden rounded-lg border-2 border-ink bg-surface shadow-hard">
                                                    <EmptyGroupState onCreateClick={() => setShowModal(true)} />
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                    {activeGroupProductivityTimers?.data.map((timer) => (
                                                        <GroupTimerCard
                                                            key={timer._id}
                                                            timer={timer}
                                                            onClick={() => openGroup(timer)}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </motion.section>

                                        <SectionDivider>Individual Sessions</SectionDivider>

                                        <motion.section {...enter(0.12)}>
                                            <div className="mb-4 flex items-center justify-between gap-4">
                                                <div>
                                                    <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-ink">
                                                        Your Focus Sessions
                                                    </h2>
                                                    <p className="mt-0.5 font-mono text-xs text-ink-faint">
                                                        {activeIndividualTimersLength}/{MAX_INDIVIDUAL_TIMERS} slots used
                                                    </p>
                                                </div>
                                            </div>

                                            <CapacityTracker used={activeIndividualTimersLength} max={MAX_INDIVIDUAL_TIMERS} />

                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                {activeProducitivityTimers?.data.map((timer) => (
                                                    <IndividualTimerCard
                                                        key={timer._id}
                                                        timer={timer}
                                                        onClick={() => openIndividual(timer)}
                                                    />
                                                ))}

                                                {canCreateIndividual && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowModal(true)}
                                                        className="group flex min-h-36 flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-line p-8 transition-all duration-fast hover:-translate-y-px hover:border-ink active:translate-x-[2px] active:translate-y-[2px]"
                                                    >
                                                        <span className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-ink bg-surface text-ink transition-colors duration-fast group-hover:bg-focus">
                                                            <Plus className="h-6 w-6" aria-hidden="true" />
                                                        </span>
                                                        <span className="text-xs font-bold uppercase tracking-wider text-ink-faint transition-colors duration-fast group-hover:text-ink">
                                                            New Session
                                                        </span>
                                                    </button>
                                                )}
                                            </div>
                                        </motion.section>
                                    </motion.div>
                                )}

                                {dashboardTab === 'completed' && (
                                    <motion.div
                                        key="tab-completed"
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -6 }}
                                        transition={quick}
                                    >
                                        <motion.section {...enter(0)} className="mb-10">
                                            <div className="mb-5 flex items-center justify-between gap-4">
                                                <div>
                                                    <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-ink">
                                                        Completed Group Timers
                                                    </h2>
                                                    <p className="mt-0.5 text-xs font-medium text-ink-faint">
                                                        Goals you've finished and archived
                                                    </p>
                                                </div>
                                                <Pill color="progress">
                                                    {completedGroupTimers?.data?.length ?? 0} completed
                                                </Pill>
                                            </div>

                                            {(completedGroupTimers?.data?.length ?? 0) === 0 ? (
                                                <div className={EMPTY}>No completed group timers yet.</div>
                                            ) : (
                                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                    {completedGroupTimers?.data.map((timer) => (
                                                        <GroupTimerCard
                                                            key={timer._id}
                                                            timer={timer}
                                                            onClick={() => openGroup(timer)}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </motion.section>

                                        <SectionDivider>Completed Individual Sessions</SectionDivider>

                                        <motion.section {...enter(0.06)}>
                                            <div className="mb-5 flex items-center justify-between gap-4">
                                                <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-ink">
                                                    Finished Focus Sessions
                                                </h2>
                                                <Pill color="progress">
                                                    {completedIndividualTimers?.data?.length ?? 0} completed
                                                </Pill>
                                            </div>

                                            {(completedIndividualTimers?.data?.length ?? 0) === 0 ? (
                                                <div className={EMPTY}>No completed sessions yet.</div>
                                            ) : (
                                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                    {completedIndividualTimers?.data.map((timer) => (
                                                        <IndividualTimerCard
                                                            key={timer._id}
                                                            timer={timer}
                                                            onClick={() => openIndividual(timer)}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </motion.section>
                                    </motion.div>
                                )}

                                {dashboardTab === 'expired' && (
                                    <motion.div
                                        key="tab-expired"
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -6 }}
                                        transition={quick}
                                    >
                                        <motion.section {...enter(0)} className="mb-10">
                                            <div className="mb-5 flex items-center justify-between gap-4">
                                                <div>
                                                    <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-ink">
                                                        Expired Group Timers
                                                    </h2>
                                                    <p className="mt-0.5 text-xs font-medium text-ink-faint">
                                                        Sessions past their deadline
                                                    </p>
                                                </div>
                                                <Pill color="alert">{expiredGroupTimers?.data?.length ?? 0} expired</Pill>
                                            </div>

                                            {(expiredGroupTimers?.data?.length ?? 0) === 0 ? (
                                                <div className={EMPTY}>No expired group timers.</div>
                                            ) : (
                                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                    {expiredGroupTimers?.data.map((timer) => (
                                                        <GroupTimerCard
                                                            key={timer._id}
                                                            timer={timer}
                                                            onClick={() => openGroup(timer)}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </motion.section>

                                        <SectionDivider>Expired Individual Sessions</SectionDivider>

                                        <motion.section {...enter(0.06)}>
                                            <div className="mb-5 flex items-center justify-between gap-4">
                                                <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-ink">
                                                    Past Focus Sessions
                                                </h2>
                                                <Pill color="alert">{expiredIndividualTimers?.data?.length ?? 0} expired</Pill>
                                            </div>

                                            {(expiredIndividualTimers?.data?.length ?? 0) === 0 ? (
                                                <div className={EMPTY}>No expired sessions.</div>
                                            ) : (
                                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                    {expiredIndividualTimers?.data.map((timer) => (
                                                        <IndividualTimerCard
                                                            key={timer._id}
                                                            timer={timer}
                                                            onClick={() => openIndividual(timer)}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </motion.section>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}

                    {view === 'individual-detail' && selectedInd && (
                        <motion.div
                            key="individual-detail"
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={quick}
                        >
                            <IndividualTimerDetail
                                timer={selectedInd}
                                onBack={handleBack}
                                onRunningChange={setDetailTimerRunning}
                            />
                        </motion.div>
                    )}

                    {view === 'group-detail' && selectedGrp && (
                        <motion.div
                            key="group-detail"
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={quick}
                        >
                            <GroupTimerDetail
                                timer={selectedGrp}
                                onBack={handleBack}
                                onRunningChange={setDetailTimerRunning}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {showModal && (
                    <CreateTimerModal
                        onClose={() => setShowModal(false)}
                        canCreateIndividual={canCreateIndividual}
                        canCreateGroup={canCreateGroup}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default TimerPage;