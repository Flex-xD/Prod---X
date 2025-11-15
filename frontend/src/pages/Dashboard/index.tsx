import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle2, Circle, Flame, Clock, Trophy, TrendingUp,
  Calendar, Zap , Sparkles, ChevronRight,
  Plus, Play, Pause, Brain, Star
} from 'lucide-react';

const ProdXDashboard = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Complete Algorithm Assignment', description: 'Solve problem set 5-10', done: true },
    { id: 2, title: 'Review Database Concepts', description: 'SQL joins and normalization', done: true },
    { id: 3, title: 'Read Chapter 7 - OS', description: '', done: false },
    { id: 4, title: 'Practice Leetcode', description: '2 medium problems', done: false },
  ]);

  const [timerRunning, setTimerRunning] = useState(false);
  const [focusTime, setFocusTime] = useState(245); // minutes today
  const dailyGoal = 240; // 4 hours

  // GitHub-style calendar data (last 12 weeks)
  const generateCalendarData = () => {
    const data = [];
    for (let week = 0; week < 12; week++) {
      const weekData = [];
      for (let day = 0; day < 7; day++) {
        const intensity = Math.random();
        weekData.push({
          intensity: intensity > 0.7 ? 'high' : intensity > 0.4 ? 'medium' : intensity > 0.2 ? 'low' : 'none',
          hours: intensity > 0.2 ? Math.floor(Math.random() * 5) + 1 : 0
        });
      }
      data.push(weekData);
    }
    return data;
  };

  const calendarData = generateCalendarData();
  const currentStreak = 12;
  const tasksCompleted = tasks.filter(t => t.done).length;
  const weeklyProgress = 68; // percentage

  const toggleTask = (id:any) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, done: !task.done } : task
    ));
  };

  const weeklyData = [
    { day: 'Mon', tasks: 4, hours: 3.5 },
    { day: 'Tue', tasks: 6, hours: 4.2 },
    { day: 'Wed', tasks: 3, hours: 2.8 },
    { day: 'Thu', tasks: 5, hours: 4.5 },
    { day: 'Fri', tasks: 4, hours: 3.2 },
    { day: 'Sat', tasks: 2, hours: 2.0 },
    { day: 'Today', tasks: 2, hours: 4.1 },
  ];

  const maxHours = Math.max(...weeklyData.map(d => d.hours));

  const leaderboard = [
    { rank: 1, name: 'Sarah Chen', score: 142, avatar: 'SC', isYou: false },
    { rank: 2, name: 'You', score: 128, avatar: 'ME', isYou: true },
    { rank: 3, name: 'Alex Kumar', score: 115, avatar: 'AK', isYou: false },
  ];

  const aiTips = [
    "Try the Pomodoro technique: 25 min focus + 5 min break!",
    "Break large tasks into smaller 15-minute chunks",
    "Your peak productivity time is 9-11 AM. Schedule hard tasks then!",
    "Take a 10-minute walk between study sessions for better retention",
    "Review your notes within 24 hours to boost memory by 60%"
  ];

  const [currentTip, setCurrentTip] = useState(aiTips[0]);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent text-2xl font-bold">
                ProdX
              </span>
              <p className="text-xs text-slate-500">Welcome back, Alex! 👋</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-slate-600">
              <Calendar className="w-4 h-4 mr-2" />
              Nov 1, 2025
            </Button>
            <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
              AK
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Tasks Done */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="rounded-3xl border-0 shadow-lg bg-linear-to-br from-green-500 to-emerald-600 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <CheckCircle2 className="w-8 h-8" />
                  <Badge className="bg-white/20 text-white border-0">Today</Badge>
                </div>
                <div className="text-4xl font-bold mb-1">{tasksCompleted}/{tasks.length}</div>
                <div className="text-green-100 text-sm">Tasks Completed</div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Focus Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card className="rounded-3xl border-0 shadow-lg bg-linear-to-br from-blue-500 to-indigo-600 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <Clock className="w-8 h-8" />
                  <Badge className="bg-white/20 text-white border-0">Goal: {dailyGoal / 60}h</Badge>
                </div>
                <div className="text-4xl font-bold mb-1">{(focusTime / 60).toFixed(1)}h</div>
                <div className="text-blue-100 text-sm">Focus Time Today</div>
                <div className="mt-3 bg-white/20 rounded-full h-2">
                  <motion.div
                    className="bg-white h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(focusTime / dailyGoal) * 100}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Current Streak */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card className="rounded-3xl border-0 shadow-lg bg-linear-to-br from-orange-500 to-red-600 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <Flame className="w-8 h-8" />
                  <Badge className="bg-white/20 text-white border-0">🔥 Hot!</Badge>
                </div>
                <div className="text-4xl font-bold mb-1">{currentStreak} Days</div>
                <div className="text-orange-100 text-sm">Current Streak</div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Weekly Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Card className="rounded-3xl border-0 shadow-lg bg-linear-to-br from-purple-500 to-pink-600 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <TrendingUp className="w-8 h-8" />
                  <Badge className="bg-white/20 text-white border-0">This Week</Badge>
                </div>
                <div className="text-4xl font-bold mb-1">{weeklyProgress}%</div>
                <div className="text-purple-100 text-sm">Weekly Goal</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Column (2/3) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Today's Tasks */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="rounded-3xl border-0 shadow-xl bg-white">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        Today's Tasks
                      </CardTitle>
                      <p className="text-slate-500 text-sm mt-1">Keep the momentum going! 💪</p>
                    </div>
                    <Button className="bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-xl">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Task
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {tasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${task.done
                          ? 'bg-green-50 border-green-200'
                          : 'bg-slate-50 border-slate-200 hover:border-purple-300 hover:shadow-md'
                        }`}
                      onClick={() => toggleTask(task.id)}
                    >
                      <div className="flex items-start gap-4">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {task.done ? (
                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                          ) : (
                            <Circle className="w-6 h-6 text-slate-400" />
                          )}
                        </motion.div>
                        <div className="flex-1">
                          <h4 className={`font-semibold ${task.done ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                            {task.title}
                          </h4>
                          {task.description && (
                            <p className={`text-sm mt-1 ${task.done ? 'text-slate-400' : 'text-slate-600'}`}>
                              {task.description}
                            </p>
                          )}
                        </div>
                        {task.done && (
                          <Badge className="bg-green-100 text-green-700">Done!</Badge>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Productivity Calendar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card className="rounded-3xl border-0 shadow-xl bg-white">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Activity Calendar
                  </CardTitle>
                  <p className="text-slate-500 text-sm">Your productivity heatmap</p>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-1">
                    {calendarData.map((week, weekIndex) => (
                      <div key={weekIndex} className="flex flex-col gap-1">
                        {week.map((day, dayIndex) => (
                          <motion.div
                            key={`${weekIndex}-${dayIndex}`}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: (weekIndex * 7 + dayIndex) * 0.01 }}
                            whileHover={{ scale: 1.3 }}
                            className={`w-4 h-4 rounded-sm cursor-pointer transition-all ${day.intensity === 'high' ? 'bg-purple-600' :
                                day.intensity === 'medium' ? 'bg-purple-400' :
                                  day.intensity === 'low' ? 'bg-purple-200' :
                                    'bg-slate-100'
                              }`}
                            title={`${day.hours} hours`}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 mt-6 text-xs text-slate-600">
                    <span>Less</span>
                    <div className="flex gap-1">
                      <div className="w-4 h-4 rounded-sm bg-slate-100"></div>
                      <div className="w-4 h-4 rounded-sm bg-purple-200"></div>
                      <div className="w-4 h-4 rounded-sm bg-purple-400"></div>
                      <div className="w-4 h-4 rounded-sm bg-purple-600"></div>
                    </div>
                    <span>More</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Weekly Progress Graph */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card className="rounded-3xl border-0 shadow-xl bg-white">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Weekly Progress
                  </CardTitle>
                  <p className="text-slate-500 text-sm">Hours focused this week</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between gap-4 h-48">
                    {weeklyData.map((day, index) => (
                      <motion.div
                        key={day.day}
                        initial={{ height: 0 }}
                        animate={{ height: `${(day.hours / maxHours) * 100}%` }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="flex-1 flex flex-col items-center gap-3"
                      >
                        <div className="w-full relative group">
                          <div className={`w-full rounded-t-xl transition-all ${day.day === 'Today'
                              ? 'bg-linear-to-t from-purple-600 to-blue-600'
                              : 'bg-linear-to-t from-purple-400 to-blue-400'
                            }`} style={{ height: `${(day.hours / maxHours) * 180}px` }}>
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              {day.hours}h • {day.tasks} tasks
                            </div>
                          </div>
                        </div>
                        <span className={`text-xs font-medium ${day.day === 'Today' ? 'text-purple-600 font-bold' : 'text-slate-600'
                          }`}>
                          {day.day}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar - Right Column (1/3) */}
          <div className="space-y-8">
            {/* Productivity Timer */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="rounded-3xl border-0 shadow-xl bg-linear-to-br from-indigo-600 to-purple-700 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-lg">Focus Timer</h3>
                    <Clock className="w-6 h-6" />
                  </div>
                  <div className="text-5xl font-bold text-center mb-6">25:00</div>
                  <Button
                    className="w-full bg-white text-purple-600 hover:bg-white/90 rounded-xl py-6 font-semibold"
                    onClick={() => setTimerRunning(!timerRunning)}
                  >
                    {timerRunning ? (
                      <>
                        <Pause className="w-5 h-5 mr-2" />
                        Pause Session
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5 mr-2" />
                        Start Focus
                      </>
                    )}
                  </Button>
                  <p className="text-center text-indigo-200 text-sm mt-4">
                    Pomodoro • 25 min focus
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* AI Tip of the Day */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card className="rounded-3xl border-0 shadow-xl bg-linear-to-br from-yellow-400 to-orange-500 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <Brain className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold">AI Tip of the Day</h3>
                      <p className="text-xs text-orange-100">Powered by ProdX AI</p>
                    </div>
                  </div>
                  <p className="text-white leading-relaxed">
                    {currentTip}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Leaderboard */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card className="rounded-3xl border-0 shadow-xl bg-white">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold">Leaderboard</CardTitle>
                      <p className="text-slate-500 text-xs mt-1">This week's top performers</p>
                    </div>
                    <Trophy className="w-6 h-6 text-yellow-500" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {leaderboard.map((user, index) => (
                    <motion.div
                      key={user.rank}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-2xl flex items-center gap-4 transition-all ${user.isYou
                          ? 'bg-linear-to-r from-purple-100 to-blue-100 border-2 border-purple-300'
                          : 'bg-slate-50'
                        }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white ${user.rank === 1 ? 'bg-linear-to-br from-yellow-400 to-yellow-600' :
                          user.rank === 2 ? 'bg-linear-to-br from-slate-300 to-slate-500' :
                            'bg-linear-to-br from-orange-400 to-orange-600'
                        }`}>
                        {user.rank}
                      </div>
                      <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold">
                        {user.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-slate-900">{user.name}</div>
                        <div className="text-xs text-slate-500">{user.score} pts</div>
                      </div>
                      {user.rank === 1 && <Star className="w-5 h-5 text-yellow-500" />}
                    </motion.div>
                  ))}
                  <Button variant="ghost" className="w-full text-purple-600 hover:bg-purple-50">
                    View Full Leaderboard
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Motivational Message */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <Card className="rounded-3xl border-0 shadow-xl bg-linear-to-br from-green-500 to-teal-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Sparkles className="w-6 h-6" />
                    <h3 className="font-bold text-lg">Great Work! 🎉</h3>
                  </div>
                  <p className="text-green-100 leading-relaxed">
                    You've completed 2 tasks today! Just 2 more to reach your daily goal. Keep the energy up!
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProdXDashboard;