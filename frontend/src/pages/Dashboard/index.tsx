import { useState } from 'react';
import {
  CheckCircle2,
  Flame,
  Clock,
  TrendingUp,
} from 'lucide-react';
import DashboardHeader from './dashboard-components/dashboard-header';
import StatCard from './dashboard-components/stat-card';
import TasksCard from './dashboard-components/tasks-card';
import CalendarCard from './dashboard-components/calendar-card';
import WeeklyGraphCard from './dashboard-components/weekly-graph-card';
import FocusTimerCard from './dashboard-components/focus-timer-card';
import AiTipCard from './dashboard-components/ai-tip-card';
import LeaderboardCard from './dashboard-components/leaderboard-card';
import MotivationalCard from './dashboard-components/motivational-card';
import useCreateTaskMutation from '@/custom-hooks/task-mutation/create-task';
import { dummyTasks, leaderboard, weeklyData } from './dashboard-components/dashboard-dummy-data';
import type { ITaskData } from './dashboard-components/tasks-card/tasks-card-types';
import { userAppStore } from '@/store';
import useGetTodaysTasks from '@/custom-hooks/task-mutation/get-tasks';


const Dashboard = () => {
  const user_id = userAppStore((state) => state.user_id);
  const safeUserId = user_id ?? "";

  const [tasks, setTasks] = useState(dummyTasks);

  const { mutateAsync: createTaskMutation, isPending: createTaskPending } = useCreateTaskMutation(safeUserId);

  // ? Use the task's pending state from below
  const { data: todaysTask } = useGetTodaysTasks(safeUserId);
  
  const tasksToDisplay = todaysTask?.data.tasks ?? [];

  const focusTime = 245; // minutes today
  const dailyGoal = 240; // 4 hours

  // GitHub-style calendar data 
  const generateCalendarData = (): Array<Array<{ intensity: "high" | "medium" | "low" | "none"; hours: number }>> => {
    const data = [];
    for (let week = 0; week < 12; week++) {
      const weekData = [];
      for (let day = 0; day < 7; day++) {
        const intensity = Math.random();
        weekData.push({
          intensity: intensity > 0.7 ? 'high' : intensity > 0.4 ? 'medium' : intensity > 0.2 ? 'low' : 'none',
          hours: intensity > 0.2 ? Math.floor(Math.random() * 5) + 1 : 0,
        });
      }
      data.push(weekData);
    }
    return data as Array<Array<{ intensity: "high" | "medium" | "low" | "none"; hours: number }>>;
  };

  const calendarData = generateCalendarData();

  const currentStreak = 12;
  const tasksCompleted = tasks.filter((t) => t.done).length;
  const weeklyProgress = 68; // percentage

  const toggleTask = (id: number) => {
    setTasks(tasks.map((task) =>
      task.id === id ? { ...task, done: !task.done } : task
    ));
  };

  const maxHours = Math.max(...weeklyData.map((d) => d.hours));



  const aiTips = [
    "Try the Pomodoro technique: 25 min focus + 5 min break!",
    "Break large tasks into smaller 15-minute chunks",
    "Your peak productivity time is 9-11 AM. Schedule hard tasks then!",
    "Take a 10-minute walk between study sessions for better retention",
    "Review your notes within 24 hours to boost memory by 60%",
  ];

  const currentTip = aiTips[0]; // You can rotate this with useEffect if desired


  const onAddTask = async (taskData: ITaskData) => {
      await createTaskMutation(taskData);
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-purple-50 to-blue-50">
      <DashboardHeader />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Tasks Completed"
            value={`${tasksCompleted}/${tasks.length}`}
            subtitle="Today"
            icon={<CheckCircle2 className="w-8 h-8" />}
            badgeText="Today"
            colorFrom="green-500"
            colorTo="emerald-300"
          />
          <StatCard
            title="Focus Time Today"
            value={`${(focusTime / 60).toFixed(1)}h`}
            subtitle={`Goal: ${dailyGoal / 60}h`}
            icon={<Clock className="w-8 h-8" />}
            badgeText={`Goal: ${dailyGoal / 60}h`}
            colorFrom="blue-500"
            colorTo="indigo-600"
            progress={(focusTime / dailyGoal) * 100}
            delay={0.1}
          />
          <StatCard
            title="Current Streak"
            value={`${currentStreak} Days`}
            subtitle="Hot!"
            icon={<Flame className="w-8 h-8" />}
            badgeText="🔥 Hot!"
            colorFrom="orange-500"
            colorTo="red-600"
            delay={0.2}
          />
          <StatCard
            title="Weekly Goal"
            value={`${weeklyProgress}%`}
            subtitle="This Week"
            icon={<TrendingUp className="w-8 h-8" />}
            badgeText="This Week"
            colorFrom="purple-500"
            colorTo="pink-600"
            delay={0.3}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <TasksCard tasks={tasksToDisplay} onToggleTask={toggleTask} onAddTask={onAddTask} createTaskPending={createTaskPending} />
            <CalendarCard calendarData={calendarData} />
            <WeeklyGraphCard weeklyData={weeklyData} maxHours={maxHours} />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            <FocusTimerCard />
            <AiTipCard currentTip={currentTip} />
            <LeaderboardCard leaderboard={leaderboard} />
            <MotivationalCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;