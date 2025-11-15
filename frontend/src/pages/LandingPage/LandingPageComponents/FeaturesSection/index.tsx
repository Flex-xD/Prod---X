import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target,  Users, Clock, Award, BookOpen, BarChart3 } from 'lucide-react';

const FeaturesSection = () => {
    return (
        <section className="py-20 bg-white/50 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <Badge className="px-4 py-2 bg-blue-100 text-blue-700 border-blue-200 mb-4 font-inter">
                        ✨ Smart Features
                    </Badge>
                    <h2 className="text-4xl lg:text-5xl font-bold font-poppins text-slate-900 mb-6">
                        Everything You Need to
                        <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
                            Excel Academically
                        </span>
                    </h2>
                    <p className="text-xl text-slate-600 font-inter max-w-3xl mx-auto leading-relaxed">
                        From focus sessions to progress analytics, we provide the tools that help students and lifelong learners achieve their goals.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        {
                            icon: <Clock className="w-8 h-8" />,
                            title: 'Smart Focus Timer',
                            description: 'Pomodoro technique with AI breaks optimized for maximum retention and minimal burnout.',
                            color: 'blue'
                        },
                        {
                            icon: <BookOpen className="w-8 h-8" />,
                            title: 'Study Session Planner',
                            description: 'AI-powered scheduling that adapts to your courses, deadlines, and learning pace.',
                            color: 'purple'
                        },
                        {
                            icon: <BarChart3 className="w-8 h-8" />,
                            title: 'Progress Analytics',
                            description: 'Track your learning patterns, identify weak areas, and get personalized improvement tips.',
                            color: 'green'
                        },
                        {
                            icon: <Target className="w-8 h-8" />,
                            title: 'Goal Tracking',
                            description: 'Set academic goals, break them into milestones, and celebrate your achievements.',
                            color: 'orange'
                        },
                        {
                            icon: <Users className="w-8 h-8" />,
                            title: 'Study Groups',
                            description: 'Collaborate with classmates, share notes, and learn together in virtual study rooms.',
                            color: 'pink'
                        },
                        {
                            icon: <Award className="w-8 h-8" />,
                            title: 'Achievement System',
                            description: 'Earn badges and rewards for consistency, progress, and academic achievements.',
                            color: 'indigo'
                        }
                    ].map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            transition={{ duration: 0.4, delay: index * 0.2 }}
                            viewport={{ once: true }}
                            className="group"
                        >
                            <Card className="rounded-3xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden bg-white relative">
                                <div className={`absolute top-0 left-0 w-full h-1 bg-linear-to-r from-${feature.color}-500 to-${feature.color}-600`}></div>
                                <CardHeader className="pb-4">
                                    <div className={`w-16 h-16 bg-${feature.color}-100 rounded-2xl flex items-center justify-center text-${feature.color}-600 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                        {feature.icon}
                                    </div>
                                    <CardTitle className="font-poppins text-xl text-slate-900 mb-3">
                                        {feature.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="font-inter text-slate-600 text-base leading-relaxed">
                                        {feature.description}
                                    </CardDescription>
                                    <motion.div
                                        className={`flex items-center gap-2 mt-6 text-${feature.color}-600 font-inter font-medium text-sm cursor-pointer group`}
                                        whileHover={{ x: 4 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        Learn more →
                                    </motion.div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>

    )
}

export default FeaturesSection