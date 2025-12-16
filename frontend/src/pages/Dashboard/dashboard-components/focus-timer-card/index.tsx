import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Play, Pause } from 'lucide-react';

const FocusTimerCard = () => {
    const [timerRunning, setTimerRunning] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
        >
            <Card className="rounded-3xl border-0 shadow-xl bg-gradient-to-br from-indigo-600 to-purple-700 text-white relative overflow-hidden">
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
    );
};

export default FocusTimerCard;