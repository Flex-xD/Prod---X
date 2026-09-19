import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Clock3, AlertTriangle } from 'lucide-react'; 
import { Pill, SectionDivider } from './timer-components/ui';
import type { IGroupTimer, IProductivityTimer, ViewMode } from './timer-components/types';
import { MAX_INDIVIDUAL_TIMERS, sp } from './timer-components/constants';
import TimerPageHeader from './timer-components/timer-page-header';
import EmptyGroupState from './timer-components/empty-group-state';
import GroupTimerCard from './timer-components/group-timer-card';
import CapacityTracker from './timer-components/capacity-tracker';
import IndividualTimerCard from './timer-components/individual-timer-card';
import IndividualTimerDetail from './timer-components/individual-timer-detail';
import GroupTimerDetail from './timer-components/group-timer-detail';
import CreateTimerModal from './timer-components/create-timer-modal';
import { userAppStore } from '@/store';
import useGetActiveGroupProductivityTimers from '@/custom-hooks/group-productivity-timer/get-group-productivity-timer';
import useGetActiveProductivityTimer from '@/custom-hooks/productivity-timer/get-productivity-timer';
import useGetPendingGroupTimerInvites from '@/custom-hooks/group-productivity-timer/get-pending-invites'; 
import useGetExpiredGroupProductivityTimers from '@/custom-hooks/group-productivity-timer/get-expired-group-producitivty-timer'; 
import useGetExpiredProductivityTimer from '@/custom-hooks/productivity-timer/get-expired-productivity-timer'; 
import { useLiveGroupTimerUpdates } from '@/custom-hooks/group-productivity-timer/use-live-group-timer-updates';

type DashboardTab = 'active' | 'expired';

const TimerPage = () => {
    const [showModal, setShowModal] = useState(false);
    const [view, setView] = useState<ViewMode>('dashboard');
    const [selectedInd, setSelectedInd] = useState<IProductivityTimer | null>(null);
    const [selectedGrp, setSelectedGrp] = useState<IGroupTimer | null>(null);
    const [dashboardTab, setDashboardTab] = useState<DashboardTab>('active'); 
    useLiveGroupTimerUpdates();


    // * Currently I am getting apiResponse<timerType>
    const { data: activeGroupProductivityTimers } = useGetActiveGroupProductivityTimers();
    console.log("activeGroupProductivityTimers : ", activeGroupProductivityTimers);

    const { data: activeProducitivityTimers } = useGetActiveProductivityTimer();
    console.log("Productivity-Timer : ", activeProducitivityTimers?.data);

    const { data: pendingInvites } = useGetPendingGroupTimerInvites();
    const { data: expiredGroupTimers } = useGetExpiredGroupProductivityTimers();
    const { data: expiredIndividualTimers } = useGetExpiredProductivityTimer();

    const activeProducitivityTimersLength = activeGroupProductivityTimers?.data ? activeGroupProductivityTimers?.data.length : 0;


    console.log("This is the data of the activeGroupProductivityTimers : ", activeGroupProductivityTimers?.data);
    const canCreate = activeProducitivityTimersLength < MAX_INDIVIDUAL_TIMERS;


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


    return (
        <div
            className="min-h-screen"
            style={{
                background: 'linear-gradient(160deg,#f8f7ff 0%,#fdf4ff 35%,#f0f9ff 65%,#fafafa 100%)',
            }}
        >
            {/* ── Sticky header ── */}
            <TimerPageHeader
                view={view}
                selectedInd={selectedInd}
                selectedGrp={selectedGrp}
                onBack={handleBack}
                onNewTimer={() => setShowModal(true)}
            />

            {/* ── Main content ── */}
            <div className="max-w-4xl mx-auto px-6 py-8">
                <AnimatePresence mode="wait">

                    {/* ───── Dashboard ───── */}
                    {view === 'dashboard' && (
                        <motion.div
                            key="dashboard"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.22 }}
                        >
                            {/*  new Active/Expired tab switcher */}
                            <div className="flex items-center gap-2 mb-8">
                                <button
                                    onClick={() => setDashboardTab('active')}
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-sm font-bold transition-all"
                                    style={
                                        dashboardTab === 'active'
                                            ? { background: 'linear-gradient(135deg,#7C3AED,#4F46E5)', color: 'white', boxShadow: '0 6px 16px rgba(124,58,237,0.3)' }
                                            : { background: '#f8fafc', color: '#94a3b8', border: '1px solid rgba(0,0,0,0.05)' }
                                    }
                                >
                                    <Clock3 className="w-3.5 h-3.5" /> Active
                                </button>
                                <button
                                    onClick={() => setDashboardTab('expired')}
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-sm font-bold transition-all"
                                    style={
                                        dashboardTab === 'expired'
                                            ? { background: 'linear-gradient(135deg,#7C3AED,#4F46E5)', color: 'white', boxShadow: '0 6px 16px rgba(124,58,237,0.3)' }
                                            : { background: '#f8fafc', color: '#94a3b8', border: '1px solid rgba(0,0,0,0.05)' }
                                    }
                                >
                                    <AlertTriangle className="w-3.5 h-3.5" /> Expired
                                    {expiredCount > 0 && (
                                        <span
                                            className="ml-1 text-[10px] font-black px-1.5 py-0.5 rounded-full"
                                            style={dashboardTab === 'expired' ? { background: 'rgba(255,255,255,0.25)' } : { background: '#e2e8f0', color: '#64748b' }}
                                        >
                                            {expiredCount}
                                        </span>
                                    )}
                                </button>
                            </div>

                            {/* : Pending Invitations section — only shown on the Active tab */}
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
                                            <GroupTimerCard
                                                key={timer._id}
                                                timer={timer}
                                                index={i}
                                                onClick={() => {}}
                                                isPendingInvite
                                            />
                                        ))}
                                    </div>
                                </section>
                            )}

                            {dashboardTab === 'active' ? (
                                <>
                                    {/* Group Timers section */}
                                    <section className="mb-10">
                                        <div className="flex items-center justify-between mb-5">
                                            <div>
                                                <h2 className="text-base font-black text-slate-900">Group Timers</h2>
                                                <p className="text-xs text-slate-400 font-medium mt-0.5">Created or joined sessions</p>
                                            </div>
                                            <Pill color={activeGroupProductivityTimers && activeGroupProductivityTimers?.data?.length > 0 ? 'rose' : 'slate'}>
                                                {activeGroupProductivityTimers?.data.length} active
                                            </Pill>
                                        </div>

                                        {activeGroupProductivityTimers?.data.length === 0 ? (
                                            <div
                                                className="rounded-3xl bg-white overflow-hidden"
                                                style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.05)' }}
                                            >
                                                <EmptyGroupState onCreateClick={() => setShowModal(true)} />
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {activeGroupProductivityTimers?.data.map((timer, i) => (
                                                    <GroupTimerCard
                                                        key={timer._id}
                                                        timer={timer}
                                                        index={i}
                                                        onClick={() => openGroup(timer)}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </section>

                                    <SectionDivider>Individual Sessions</SectionDivider>

                                    {/* Individual Timers section */}
                                    <section>
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <h2 className="text-base font-black text-slate-900">Your Focus Sessions</h2>
                                                <p className="text-xs text-slate-400 font-medium mt-0.5">
                                                    {activeProducitivityTimers?.data.length}/{MAX_INDIVIDUAL_TIMERS} slots used
                                                </p>
                                            </div>
                                        </div>

                                        <CapacityTracker
                                            used={activeProducitivityTimersLength}
                                            max={MAX_INDIVIDUAL_TIMERS}
                                        />

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {activeProducitivityTimers?.data.map((timer, i) => (
                                                <IndividualTimerCard
                                                    key={timer._id}
                                                    timer={timer}
                                                    index={i}
                                                    onClick={() => openIndividual(timer)}
                                                />
                                            ))}

                                            {/* "Add new" slot */}
                                            {canCreate && (
                                                <motion.button
                                                    initial={{ opacity: 0, y: 18 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: activeProducitivityTimersLength * 0.07, ...sp }}
                                                    whileHover={{ y: -5, borderColor: '#7C3AED' }}
                                                    whileTap={{ scale: 0.97 }}
                                                    onClick={() => setShowModal(true)}
                                                    className="rounded-3xl flex flex-col items-center justify-center gap-3 p-8 min-h-36 transition-all group"
                                                    style={{ border: '2px dashed #e2e8f0', background: 'transparent' }}
                                                >
                                                    <motion.div
                                                        className="w-12 h-12 rounded-2xl flex items-center justify-center"
                                                        style={{ background: '#f5f3ff', border: '1px solid #ddd6fe' }}
                                                        whileHover={{ rotate: 90 }}
                                                        transition={{ duration: 0.3 }}
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
                            ) : (
                                <>
                                    {/* Expired Group Timers section */}
                                    <section className="mb-10">
                                        <div className="flex items-center justify-between mb-5">
                                            <div>
                                                <h2 className="text-base font-black text-slate-900">Expired Group Timers</h2>
                                                <p className="text-xs text-slate-400 font-medium mt-0.5">Sessions past their deadline</p>
                                            </div>
                                            <Pill color="slate">{expiredGroupTimers?.data?.length ?? 0} expired</Pill>
                                        </div>

                                        {(expiredGroupTimers?.data?.length ?? 0) === 0 ? (
                                            <div
                                                className="rounded-3xl bg-white p-8 text-center text-sm text-slate-400 font-medium"
                                                style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.05)' }}
                                            >
                                                No expired group timers.
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {/* Change the types below from any to suitable ones */}
                                                {expiredGroupTimers?.data.map((timer:any, i:any) => (
                                                    <GroupTimerCard
                                                        key={timer._id}
                                                        timer={timer}
                                                        index={i}
                                                        onClick={() => openGroup(timer)}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </section>

                                    <SectionDivider>Expired Individual Sessions</SectionDivider>

                                    {/* Expired Individual Timers section */}
                                    <section>
                                        <div className="flex items-center justify-between mb-4">
                                            <h2 className="text-base font-black text-slate-900">Past Focus Sessions</h2>
                                            <Pill color="slate">{expiredIndividualTimers?.data?.length ?? 0} expired</Pill>
                                        </div>

                                        {(expiredIndividualTimers?.data?.length ?? 0) === 0 ? (
                                            <div
                                                className="rounded-3xl bg-white p-8 text-center text-sm text-slate-400 font-medium"
                                                style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.05)' }}
                                            >
                                                No expired sessions.
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {expiredIndividualTimers?.data.map((timer, i) => (
                                                    <IndividualTimerCard
                                                        key={timer._id}
                                                        timer={timer}
                                                        index={i}
                                                        onClick={() => openIndividual(timer)}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </section>
                                </>
                            )}
                        </motion.div>
                    )}

                    {/* ───── Individual detail ───── */}
                    {view === 'individual-detail' && selectedInd && (
                        <motion.div
                            key="individual-detail"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <IndividualTimerDetail timer={selectedInd} onBack={handleBack} />
                        </motion.div>
                    )}

                    {/* ───── Group detail ───── */}
                    {view === 'group-detail' && selectedGrp && (
                        <motion.div
                            key="group-detail"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <GroupTimerDetail timer={selectedGrp} onBack={handleBack} />
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>

            <AnimatePresence>
                {showModal && <CreateTimerModal onClose={() => setShowModal(false)} />}
            </AnimatePresence>
        </div>
    );
};

export default TimerPage;