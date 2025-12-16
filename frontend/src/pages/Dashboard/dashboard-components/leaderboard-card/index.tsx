import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Star, ChevronRight } from 'lucide-react';

interface LeaderboardItem {
    rank: number;
    name: string;
    score: number;
    avatar: string;
    isYou: boolean;
}

interface LeaderboardCardProps {
    leaderboard: LeaderboardItem[];
}

const LeaderboardCard = ({ leaderboard }: LeaderboardCardProps) => {
    return (
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
                                ? 'bg-gradient-to-r from-purple-100 to-blue-100 border-2 border-purple-300'
                                : 'bg-slate-50'
                                }`}
                        >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white ${user.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                                user.rank === 2 ? 'bg-gradient-to-br from-slate-300 to-slate-500' :
                                    'bg-gradient-to-br from-orange-400 to-orange-600'
                                }`}>
                                {user.rank}
                            </div>
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold">
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
    );
};

export default LeaderboardCard;