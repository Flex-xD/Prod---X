import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle } from 'lucide-react';
import type { ITask } from '../../tasks-card-types';

interface TaskItemProps {
    task: ITask;
    onToggle: (id: number) => void;
    index: number;
}

const TaskItem = ({ task, onToggle, index }: TaskItemProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onToggle(task.id)}
            className={`p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${task.done
                    ? 'bg-green-50 border-green-200'
                    : 'bg-slate-50 border-slate-200 hover:border-purple-300 hover:shadow-md'
                }`}
        >
            <div className="flex items-start gap-4">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    {task.done ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                    ) : (
                        <Circle className="w-6 h-6 text-slate-400" />
                    )}
                </motion.div>

                <div className="flex-1">
                    <h4
                        className={`font-semibold ${task.done
                                ? 'text-slate-400 line-through'
                                : 'text-slate-900'
                            }`}
                    >
                        {task.title}
                    </h4>

                    {task.description && (
                        <p
                            className={`text-sm mt-1 ${task.done ? 'text-slate-400' : 'text-slate-600'
                                }`}
                        >
                            {task.description}
                        </p>
                    )}
                </div>

                {task.done && (
                    <Badge className="bg-green-100 text-green-700">
                        Done!
                    </Badge>
                )}
            </div>
        </motion.div>
    );
};

export default TaskItem;
