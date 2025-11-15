import { motion } from 'framer-motion';
import { Card, CardDescription,  CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {  TrendingUp,  Zap,  GraduationCap} from 'lucide-react';

function WorkingSection() {
    return (
        <section className="py-20 bg-linear-to-br from-blue-50/50 to-purple-50/50">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <Badge className="px-4 py-2 bg-purple-100 text-purple-700 border-purple-200 mb-4 font-inter">
                        🚀 Simple Setup
                    </Badge>
                    <h2 className="text-4xl lg:text-5xl font-bold font-poppins text-slate-900 mb-6">
                        Start Succeeding in
                        <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
                            3 Easy Steps
                        </span>
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {[
                        {
                            step: '01',
                            icon: <GraduationCap className="w-8 h-8" />,
                            title: 'Set Your Goals',
                            description: 'Define your courses, deadlines, and academic objectives. Our AI will help you create a realistic study plan.',
                            color: 'blue'
                        },
                        {
                            step: '02',
                            icon: <Zap className="w-8 h-8" />,
                            title: 'Start Studying',
                            description: 'Use our focus timer, note-taking tools, and study sessions to make learning efficient and engaging.',
                            color: 'purple'
                        },
                        {
                            step: '03',
                            icon: <TrendingUp className="w-8 h-8" />,
                            title: 'Track & Improve',
                            description: 'Monitor your progress with detailed analytics and get personalized recommendations for improvement.',
                            color: 'green'
                        }
                    ].map((step, index) => (
                        <motion.div
                            key={step.step}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -10 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            {/* Step Number Background */}
                            <div className="absolute -top-4 -left-4 text-8xl font-poppins font-bold text-slate-100/80 z-0">
                                {step.step}
                            </div>

                            <Card className="rounded-3xl border-0 shadow-lg bg-white p-8 relative z-10 hover:shadow-xl transition-all duration-300">
                                <div className={`w-16 h-16 bg-${step.color}-100 rounded-2xl flex items-center justify-center text-${step.color}-600 mb-6`}>
                                    {step.icon}
                                </div>
                                <CardTitle className="font-poppins text-2xl text-slate-900 mb-4">
                                    {step.title}
                                </CardTitle>
                                <CardDescription className="font-inter text-slate-600 text-lg leading-relaxed">
                                    {step.description}
                                </CardDescription>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>

    )
}

export default WorkingSection;