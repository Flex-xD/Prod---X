import { useState } from 'react';
import { CheckCircle2, Flame, Clock } from 'lucide-react';
import DashboardHeader from './dashboard-components/dashboard-header';
import StatCard from './dashboard-components/stat-card';
import GroupTimerStatCard from './dashboard-components/group-timer-stat-card';
import TasksCard from './dashboard-components/tasks-card';
import CalendarCard from './dashboard-components/calendar-card';
import WeeklyGraphCard from './dashboard-components/weekly-graph-card';
import FocusTimerCard from './dashboard-components/focus-timer-card';
import AiTipCard from './dashboard-components/ai-tip-card';
import ActivityMessageCard from './dashboard-components/activity-message-card';
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

const formatFocusHours = (seconds: number): string => (seconds / 3600).toFixed(1);

const Dashboard = () => {
  const user_id = userAppStore((state) => state.user_id);
  const safeUserId = user_id ?? "";

  const { mutateAsync: createTaskMutation, isPending: createTaskPending } = useCreateTaskMutation(safeUserId);
  const { mutateAsync: updateTaskStatus, isPending: isUpdateTaskStatusPending } = useToggleTaskMutation();
  const { data: todaysTask } = useGetTodaysTasks(safeUserId);
  const tasksToDisplay = todaysTask?.data.tasks ?? [];

  // CHANGED: all four data sources below are new — real backend data replacing the dummy data
  const { data: summary, isLoading: isSummaryLoading } = useGetDashboardSummary();
  const { data: weeklyGraph } = useGetWeeklyGraph();
  const { data: calendar } = useGetCalendar();
  const { data: aiTip, isLoading: isTipLoading } = useGetAiTip();
  const { data: activityMessage, isLoading: isActivityLoading } = useGetActivityMessage();

  const tasksCompletedToday = summary?.data.tasksToday.completed ?? 0;
  const tasksCreatedToday = summary?.data.tasksToday.created ?? 0;
  const currentStreak = summary?.data.streak.current ?? 0;
  const weeklyFocusSeconds = summary?.data.weeklyFocusSeconds ?? 0;

  const weeklyData = weeklyGraph?.data ?? [];
  const maxHours = weeklyData.length ? Math.max(...weeklyData.map((d) => d.hours), 1) : 1;

  const handleToggleTask = async (taskId: string, isTaskPending: boolean) => {
    await updateTaskStatus({ taskId, isTaskPending });
  };

  const onAddTask = async (taskData: ITaskData) => {
    await createTaskMutation(taskData);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-purple-50 to-blue-50">
      <DashboardHeader />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* ── 4 stat boxes ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Tasks Completed"
            value={`${tasksCompletedToday}/${tasksCreatedToday}`}
            subtitle="Today"
            icon={<CheckCircle2 className="w-8 h-8" />}
            badgeText="Today"
            colorFrom="green-500"
            colorTo="emerald-300"
          />

          <GroupTimerStatCard data={summary?.data.latestGroupTimer ?? null} delay={0.1} />

          <StatCard
            title="Current Streak"
            value={`${currentStreak} Day${currentStreak === 1 ? '' : 's'}`}
            subtitle={currentStreak > 0 ? 'Hot!' : 'Start today'}
            icon={<Flame className="w-8 h-8" />}
            badgeText={currentStreak > 0 ? '🔥 Hot!' : 'Get started'}
            colorFrom="orange-500"
            colorTo="red-600"
            delay={0.2}
          />

          <StatCard
            title="Focus Time"
            value={`${formatFocusHours(weeklyFocusSeconds)}h`}
            subtitle="This Week"
            icon={<Clock className="w-8 h-8" />}
            badgeText="This Week"
            colorFrom="blue-500"
            colorTo="indigo-600"
            delay={0.3}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <TasksCard
              tasks={tasksToDisplay}
              handleToggleTask={handleToggleTask}
              onToggleTaskPending={isUpdateTaskStatusPending}
              onAddTask={onAddTask}
              createTaskPending={createTaskPending}
            />
            <CalendarCard calendarData={calendar?.data ?? []} />
            <WeeklyGraphCard weeklyData={weeklyData} maxHours={maxHours} />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            <FocusTimerCard />
            <AiTipCard tip={aiTip?.data.tip} isLoading={isTipLoading} />
            <ActivityMessageCard message={activityMessage?.data.message} isLoading={isActivityLoading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;