import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import type { TasksCardProps } from './tasks-card-types';
import TasksHeader from './tasks-card-components/task-header';
import TaskList from './tasks-card-components/task-list';

const TasksCard = ({
    tasks,
    onToggleTask,
    onAddTask,
}: TasksCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
        >
            <Card className="rounded-3xl border-0 shadow-xl bg-white">
                <TasksHeader onAddTask={onAddTask} />

                <CardContent className="space-y-3">
                    <TaskList
                        tasks={tasks}
                        onToggleTask={onToggleTask}
                    />
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default TasksCard;
