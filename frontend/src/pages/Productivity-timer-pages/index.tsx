import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Pill, SectionDivider } from './timer-components/ui';
import type { IGroupTimer, IProductivityTimer, ViewMode } from './timer-components/types';
import { dummyGroupTimers, dummyIndividualTimers, MAX_INDIVIDUAL_TIMERS, sp } from './timer-components/constants';
import TimerPageHeader from './timer-components/timer-page-header';
import EmptyGroupState from './timer-components/empty-group-state';
import GroupTimerCard from './timer-components/group-timer-card';
import CapacityTracker from './timer-components/capacity-tracker';
import IndividualTimerCard from './timer-components/individual-timer-card';
import IndividualTimerDetail from './timer-components/individual-timer-detail';
import GroupTimerDetail from './timer-components/group-timer-detail';
import CreateTimerModal from './timer-components/create-timer-modal';
import useGetUsersGroupTimers from '@/custom-hooks/group-productivity-timer/get-users-group-timer';
import useGetProductivityTimer from '@/custom-hooks/productivity-timer/get-productivity-timer';
import { userAppStore } from '@/store';

const TimerPage = () => {
    const [showModal, setShowModal] = useState(false);
    const [view, setView] = useState<ViewMode>('dashboard');
    const [selectedInd, setSelectedInd] = useState<IProductivityTimer | null>(null);
    const [selectedGrp, setSelectedGrp] = useState<IGroupTimer | null>(null);

    const userId = userAppStore((state) => state.user_id);

    // * Currently I am getting apiResponse<timerType>
    const {data:activeGroupProductivityTimers} = useGetUsersGroupTimers(userId ?? "");
    const {data:activeProductivityTimers} = useGetProductivityTimer(userId ?? "");

    // * Use the above actual data in use of the dummy data from the frontend

    console.log("This is the data of the activeGroupProductivityTimers : " , activeGroupProductivityTimers?.data);

    const canCreate = dummyIndividualTimers.length < MAX_INDIVIDUAL_TIMERS;

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
                            {/* Group Timers section */}
                            <section className="mb-10">
                                <div className="flex items-center justify-between mb-5">
                                    <div>
                                        <h2 className="text-base font-black text-slate-900">Group Timers</h2>
                                        <p className="text-xs text-slate-400 font-medium mt-0.5">Created or joined sessions</p>
                                    </div>
                                    <Pill color={dummyGroupTimers.length > 0 ? 'rose' : 'slate'}>
                                        {dummyGroupTimers.length} active
                                    </Pill>
                                </div>

                                {dummyGroupTimers.length === 0 ? (
                                    <div
                                        className="rounded-3xl bg-white overflow-hidden"
                                        style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.05)' }}
                                    >
                                        <EmptyGroupState onCreateClick={() => setShowModal(true)} />
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {dummyGroupTimers.map((timer, i) => (
                                            <GroupTimerCard
                                                key={timer.id}
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
                                            {dummyIndividualTimers.length}/{MAX_INDIVIDUAL_TIMERS} slots used
                                        </p>
                                    </div>
                                </div>

                                <CapacityTracker
                                    used={dummyIndividualTimers.length}
                                    max={MAX_INDIVIDUAL_TIMERS}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {dummyIndividualTimers.map((timer, i) => (
                                        <IndividualTimerCard
                                            key={timer.id}
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
                                            transition={{ delay: dummyIndividualTimers.length * 0.07, ...sp }}
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

            {/* ── Create timer modal ── */}
            <AnimatePresence>
                {showModal && <CreateTimerModal onClose={() => setShowModal(false)} />}
            </AnimatePresence>
        </div>
    );
};

export default TimerPage;