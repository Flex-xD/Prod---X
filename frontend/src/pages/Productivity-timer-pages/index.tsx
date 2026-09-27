import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Clock3, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Pill, SectionDivider } from './timer-components/ui';
import type { IGroupTimer, IProductivityTimer, ViewMode } from './timer-components/types';
import { MAX_INDIVIDUAL_TIMERS, MAX_GROUP_TIMERS, sp } from './timer-components/constants';
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
    const [dashboardTab, setDashboardTab] = useState<DashboardTab>('active')
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

    return (
        <div
            className="min-h-screen"
            style={{ background: 'linear-gradient(160deg,#f8f7ff 0%,#fdf4ff 35%,#f0f9ff 65%,#fafafa 100%)' }}
        >
            <TimerPageHeader
                view={view}
                selectedInd={selectedInd}
                selectedGrp={selectedGrp}
                onBack={handleBack}
                onNewTimer={() => setShowModal(true)}
            />

            <div className="max-w-4xl mx-auto px-6 py-8">
                <AnimatePresence mode="wait">
                    {view === 'dashboard' && (
                        <motion.div
                            key="dashboard"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            transition={{ duration: 0.22 }}
                        >
                            <div className="flex items-center gap-2 mb-8">
                                {TABS.map(({ key, label, icon: Icon, count }) => (
                                    <button
                                        key={key}
                                        onClick={() => setDashboardTab(key)}
                                        className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-sm font-bold transition-all"
                                        style={
                                            dashboardTab === key
                                                ? { background: 'linear-gradient(135deg,#7C3AED,#4F46E5)', color: 'white', boxShadow: '0 6px 16px rgba(124,58,237,0.3)' }
                                                : { background: '#f8fafc', color: '#94a3b8', border: '1px solid rgba(0,0,0,0.05)' }
                                        }
                                    >
                                        <Icon className="w-3.5 h-3.5" /> {label}
                                        {!!count && (
                                            <span
                                                className="ml-1 text-[10px] font-black px-1.5 py-0.5 rounded-full"
                                                style={dashboardTab === key ? { background: 'rgba(255,255,255,0.25)' } : { background: '#e2e8f0', color: '#64748b' }}
                                            >
                                                {count}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>

                            {dashboardTab === 'active' && pendingInvitesCount > 0 && (
                                <section className="mb-10">
                                    <div className="flex items-center justify-between mb-5">
                                        <div>
                                            <h2 className="text-base font-black text-slate-900">Pending Invitations</h2>
                                            <p className="text-xs text-slate-400 font-medium mt-0.5">Group timers waiting on your response</p>
                                        </div>
                                        <Pill color="violet">{pendingInvitesCount} pending</Pill>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {pendingInvites?.data.map((timer, i) => (
                                            <GroupTimerCard key={timer._id} timer={timer} index={i} onClick={() => { }} isPendingInvite />
                                        ))}
                                    </div>
                                </section>
                            )}

                            {dashboardTab === 'active' && (
                                <>
                                    <section className="mb-10">
                                        <div className="flex items-center justify-between mb-5">
                                            <div>
                                                <h2 className="text-base font-black text-slate-900">Group Timers</h2>
                                                <p className="text-xs text-slate-400 font-medium mt-0.5">Created or joined sessions</p>
                                            </div>
                                            <Pill color={activeGroupTimersLength > 0 ? 'rose' : 'slate'}>{activeGroupTimersLength} active</Pill>
                                        </div>

                                        {/* CHANGED: new — group timers get the same slot tracker individual timers have */}
                                        <CapacityTracker used={activeGroupTimersLength} max={MAX_GROUP_TIMERS} />

                                        {activeGroupTimersLength === 0 ? (
                                            <div className="rounded-3xl bg-white overflow-hidden" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.05)' }}>
                                                <EmptyGroupState onCreateClick={() => setShowModal(true)} />
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {activeGroupProductivityTimers?.data.map((timer, i) => (
                                                    <GroupTimerCard key={timer._id} timer={timer} index={i} onClick={() => openGroup(timer)} />
                                                ))}
                                            </div>
                                        )}
                                    </section>

                                    <SectionDivider>Individual Sessions</SectionDivider>

                                    <section>
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <h2 className="text-base font-black text-slate-900">Your Focus Sessions</h2>
                                                <p className="text-xs text-slate-400 font-medium mt-0.5">
                                                    {activeIndividualTimersLength}/{MAX_INDIVIDUAL_TIMERS} slots used
                                                </p>
                                            </div>
                                        </div>

                                        <CapacityTracker used={activeIndividualTimersLength} max={MAX_INDIVIDUAL_TIMERS} />

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {activeProducitivityTimers?.data.map((timer, i) => (
                                                <IndividualTimerCard key={timer._id} timer={timer} index={i} onClick={() => openIndividual(timer)} />
                                            ))}

                                            {canCreateIndividual && (
                                                <motion.button
                                                    initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: activeIndividualTimersLength * 0.07, ...sp }}
                                                    whileHover={{ y: -5, borderColor: '#7C3AED' }}
                                                    whileTap={{ scale: 0.97 }}
                                                    onClick={() => setShowModal(true)}
                                                    className="rounded-3xl flex flex-col items-center justify-center gap-3 p-8 min-h-36 transition-all group"
                                                    style={{ border: '2px dashed #e2e8f0', background: 'transparent' }}
                                                >
                                                    <motion.div
                                                        className="w-12 h-12 rounded-2xl flex items-center justify-center"
                                                        style={{ background: '#f5f3ff', border: '1px solid #ddd6fe' }}
                                                        whileHover={{ rotate: 90 }} transition={{ duration: 0.3 }}
                                                    >
                                                        <Plus className="w-6 h-6 text-violet-500" />
                                                    </motion.div>
                                                    <span className="text-sm font-bold text-slate-400 group-hover:text-violet-500 transition-colors">
                                                        New Session
                                                    </span>
                                                </motion.button>
                                            )}
                                        </div>
                                    </section>
                                </>
                            )}

                            {dashboardTab === 'completed' && (
                                <>
                                    <section className="mb-10">
                                        <div className="flex items-center justify-between mb-5">
                                            <div>
                                                <h2 className="text-base font-black text-slate-900">Completed Group Timers</h2>
                                                <p className="text-xs text-slate-400 font-medium mt-0.5">Goals you've finished and archived</p>
                                            </div>
                                            <Pill color="slate">{completedGroupTimers?.data?.length ?? 0} completed</Pill>
                                        </div>

                                        {(completedGroupTimers?.data?.length ?? 0) === 0 ? (
                                            <div className="rounded-3xl bg-white p-8 text-center text-sm text-slate-400 font-medium"
                                                style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.05)' }}>
                                                No completed group timers yet.
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {completedGroupTimers?.data.map((timer, i) => (
                                                    <GroupTimerCard key={timer._id} timer={timer} index={i} onClick={() => openGroup(timer)} />
                                                ))}
                                            </div>
                                        )}
                                    </section>

                                    <SectionDivider>Completed Individual Sessions</SectionDivider>

                                    <section>
                                        <div className="flex items-center justify-between mb-4">
                                            <h2 className="text-base font-black text-slate-900">Finished Focus Sessions</h2>
                                            <Pill color="slate">{completedIndividualTimers?.data?.length ?? 0} completed</Pill>
                                        </div>

                                        {(completedIndividualTimers?.data?.length ?? 0) === 0 ? (
                                            <div className="rounded-3xl bg-white p-8 text-center text-sm text-slate-400 font-medium"
                                                style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.05)' }}>
                                                No completed sessions yet.
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {completedIndividualTimers?.data.map((timer, i) => (
                                                    <IndividualTimerCard key={timer._id} timer={timer} index={i} onClick={() => openIndividual(timer)} />
                                                ))}
                                            </div>
                                        )}
                                    </section>
                                </>
                            )}

                            {dashboardTab === 'expired' && (
                                <>
                                    <section className="mb-10">
                                        <div className="flex items-center justify-between mb-5">
                                            <div>
                                                <h2 className="text-base font-black text-slate-900">Expired Group Timers</h2>
                                                <p className="text-xs text-slate-400 font-medium mt-0.5">Sessions past their deadline</p>
                                            </div>
                                            <Pill color="slate">{expiredGroupTimers?.data?.length ?? 0} expired</Pill>
                                        </div>

                                        {(expiredGroupTimers?.data?.length ?? 0) === 0 ? (
                                            <div className="rounded-3xl bg-white p-8 text-center text-sm text-slate-400 font-medium"
                                                style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.05)' }}>
                                                No expired group timers.
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {expiredGroupTimers?.data.map((timer, i) => (
                                                    <GroupTimerCard key={timer._id} timer={timer} index={i} onClick={() => openGroup(timer)} />
                                                ))}
                                            </div>
                                        )}
                                    </section>

                                    <SectionDivider>Expired Individual Sessions</SectionDivider>

                                    <section>
                                        <div className="flex items-center justify-between mb-4">
                                            <h2 className="text-base font-black text-slate-900">Past Focus Sessions</h2>
                                            <Pill color="slate">{expiredIndividualTimers?.data?.length ?? 0} expired</Pill>
                                        </div>

                                        {(expiredIndividualTimers?.data?.length ?? 0) === 0 ? (
                                            <div className="rounded-3xl bg-white p-8 text-center text-sm text-slate-400 font-medium"
                                                style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.05)' }}>
                                                No expired sessions.
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {expiredIndividualTimers?.data.map((timer, i) => (
                                                    <IndividualTimerCard key={timer._id} timer={timer} index={i} onClick={() => openIndividual(timer)} />
                                                ))}
                                            </div>
                                        )}
                                    </section>
                                </>
                            )}
                        </motion.div>
                    )}

                    {view === 'individual-detail' && selectedInd && (
                        <motion.div key="individual-detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <IndividualTimerDetail timer={selectedInd} onBack={handleBack} />
                        </motion.div>
                    )}

                    {view === 'group-detail' && selectedGrp && (
                        <motion.div key="group-detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <GroupTimerDetail timer={selectedGrp} onBack={handleBack} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {showModal && <CreateTimerModal onClose={() => setShowModal(false)} canCreateIndividual={canCreateIndividual} canCreateGroup={canCreateGroup} />}
            </AnimatePresence>
        </div>
    );
};

export default TimerPage;