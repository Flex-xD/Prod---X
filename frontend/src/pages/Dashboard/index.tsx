// frontend/src/pages/Dashboard/index.tsx
import DashboardHeader from './dashboard-components/dashboard-header';
import ProgressStrip from './dashboard-components/stat-card';
import TasksCard from './dashboard-components/tasks-card';
import CalendarCard from './dashboard-components/calendar-card';
import WeeklyGraphCard from './dashboard-components/weekly-graph-card';
import FocusTimerCard from './dashboard-components/focus-timer-card';
import AiTipCard from './dashboard-components/ai-tip-card';
import ActivityMessageCard from './dashboard-components/activity-message-card';
import QueryError from './dashboard-components/query-error';
import useCreateTaskMutation from '@/custom-hooks/task-mutation/create-task';
import type { ITaskData } from './dashboard-components/tasks-card/tasks-card-types';
import { userAppStore } from '@/store';
import useGetTodaysTasks from '@/custom-hooks/task-mutation/get-tasks';
import { useToggleTaskMutation } from '@/custom-hooks/task-mutation/toggle-task';
import useGetDashboardSummary from '@/custom-hooks/dashboard/get-summary';
import useGetWeeklyGraph from '@/custom-hooks/dashboard/get-weekly-graph';
import useGetAiTip from '@/custom-hooks/dashboard/get-ai-tip';
import useGetActivityMessage from '@/custom-hooks/dashboard/get-activity-message';
import useGetCalendar from '@/custom-hooks/dashboard/get-calender';

const Dashboard = () => {
    const user_id = userAppStore((state) => state.user_id);
    const safeUserId = user_id ?? '';

    const { mutate: createTaskMutation, isPending: createTaskPending } = useCreateTaskMutation(safeUserId);
    const { mutate: updateTaskStatus, isPending: isUpdateTaskStatusPending } = useToggleTaskMutation();

    const {
        data: todaysTask,
        isError: isTasksError,
        refetch: refetchTasks,
    } = useGetTodaysTasks(safeUserId);
    const tasksToDisplay = todaysTask?.data.tasks ?? [];

    const {
        data: summary,
        isLoading: isSummaryLoading,
        isError: isSummaryError,
        refetch: refetchSummary,
    } = useGetDashboardSummary();
    const {
        data: weeklyGraph,
        isError: isWeeklyError,
        refetch: refetchWeekly,
    } = useGetWeeklyGraph();
    const { data: calendar, isError: isCalendarError, refetch: refetchCalendar } = useGetCalendar();
    const {
        data: aiTip,
        isLoading: isTipLoading,
        isError: isTipError,
        refetch: refetchTip,
    } = useGetAiTip();
    const {
        data: activityMessage,
        isLoading: isActivityLoading,
        isError: isActivityError,
        refetch: refetchActivity,
    } = useGetActivityMessage();

    const weeklyData = weeklyGraph?.data ?? [];

    const handleToggleTask = (taskId: string, isTaskPending: boolean) => {
        if (taskId.startsWith('temp-')) return;
        updateTaskStatus({ taskId, isTaskPending });
    };

    const onAddTask = (taskData: ITaskData) => {
        createTaskMutation(taskData);
    };

    return (
        <div className="min-h-screen bg-paper">
            <DashboardHeader />

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
                {/* ── LEVEL 1: progress measurement strip ── */}
                <section className="mb-8">
                    {isSummaryError ? (
                        <QueryError label="today's progress" onRetry={refetchSummary} />
                    ) : (
                        <ProgressStrip summary={summary} isLoading={isSummaryLoading} />
                    )}
                </section>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Left column: tasks + activity record */}
                    <div className="space-y-6 lg:col-span-2">
                        {isTasksError ? (
                            <QueryError label="today's tasks" onRetry={refetchTasks} />
                        ) : (
                            <TasksCard
                                tasks={tasksToDisplay}
                                handleToggleTask={handleToggleTask}
                                onToggleTaskPending={isUpdateTaskStatusPending}
                                onAddTask={onAddTask}
                                createTaskPending={createTaskPending}
                                isLoading={todaysTask === undefined}
                            />
                        )}

                        {isCalendarError ? (
                            <QueryError label="your activity record" onRetry={refetchCalendar} />
                        ) : (
                            <CalendarCard
                                calendarData={calendar?.data ?? []}
                                isLoading={calendar === undefined}
                            />
                        )}

                        {isWeeklyError ? (
                            <QueryError label="this week's activity" onRetry={refetchWeekly} />
                        ) : (
                            <WeeklyGraphCard
                                weeklyData={weeklyData}
                                isLoading={weeklyGraph === undefined}
                            />
                        )}
                    </div>

                    {/* Right column: focus + context */}
                    <div className="space-y-6">
                        <FocusTimerCard />

                        {isTipError ? (
                            <QueryError label="your AI tip" onRetry={refetchTip} />
                        ) : (
                            <AiTipCard tip={aiTip?.data.tip} isLoading={isTipLoading} />
                        )}

                        {isActivityError ? (
                            <QueryError label="your day summary" onRetry={refetchActivity} />
                        ) : (
                            <ActivityMessageCard
                                message={activityMessage?.data.message}
                                isLoading={isActivityLoading}
                            />
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;