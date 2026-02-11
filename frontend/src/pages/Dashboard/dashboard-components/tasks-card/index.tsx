import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, Plus } from 'lucide-react';

export interface ITask {
    id: number;
    title: string;
    description: string;
    done: boolean;
    onToggleTask: (id: number) => void;

}

export interface TasksCardProps {
    tasks: ITask[];
    onToggleTask: (id: number) => void;
}

const addTasks = () => {
    // add the logic of adding tasks here ! ... 
}

const TasksCard = ({ tasks, onToggleTask }: TasksCardProps) => {
    return (
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
                        <Button className="bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-xl"
                            onClick={addTasks}
                        >
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
                            onClick={() => onToggleTask(task.id)}
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
    );
};

export default TasksCard;