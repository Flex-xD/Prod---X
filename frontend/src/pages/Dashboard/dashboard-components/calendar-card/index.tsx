import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CalendarData {
    intensity: 'high' | 'medium' | 'low' | 'none';
    hours: number;
}

interface CalendarCardProps {
    calendarData: CalendarData[][];
}

const CalendarCard = ({ calendarData }: CalendarCardProps) => {
    return (
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
    );
};

export default CalendarCard;