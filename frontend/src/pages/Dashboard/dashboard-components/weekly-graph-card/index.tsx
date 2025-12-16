import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WeeklyData {
    day: string;
    tasks: number;
    hours: number;
}

interface WeeklyGraphCardProps {
    weeklyData: WeeklyData[];
    maxHours: number;
}

const WeeklyGraphCard = ({ weeklyData, maxHours }: WeeklyGraphCardProps) => {
    return (
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
                                        ? 'bg-gradient-to-t from-purple-600 to-blue-600'
                                        : 'bg-gradient-to-t from-purple-400 to-blue-400'
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
    );
};

export default WeeklyGraphCard;