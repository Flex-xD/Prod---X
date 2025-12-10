import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Target, TrendingUp, Clock, Award, Zap, BookOpen, Calendar } from 'lucide-react';

function HeroSection() {
    return (
        <section className="pt-32 pb-20 overflow-hidden relative">
            {/* BACKGROUND ELEMENTS */}
            <div className="absolute inset-0 bg-linear-to-br from-white via-blue-50/50 to-purple-50/30"></div>
            <div className="absolute top-20 right-20 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative">
                {/* LEFT CONTENT */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="space-y-8"
                >
                    <Badge className="px-4 py-2 bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200 font-inter">
                        🎓 Perfect for Students & Professionals
                    </Badge>

                    <h1 className="text-5xl lg:text-6xl font-bold font-poppins text-slate-900 leading-tight">
                        Study Smarter,
                        <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
                            Achieve More
                        </span>
                    </h1>

                    <p className="text-xl text-slate-600 font-inter leading-relaxed max-w-lg">
                        Transform your learning journey with AI-powered study tools, focus timers, and progress tracking designed for academic success.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <motion.div
                            whileHover={{ scale: 1.03  }}
                            transition={{duration:0.1 , ease:"easeIn"}}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button className="bg-linear-to-r from-blue-600 to-purple-600 text-white px-8 py-6 rounded-xl text-lg font-inter font-medium hover:shadow-xl hover:shadow-blue-200/50 transition-all duration-300 flex items-center gap-2">
                                <Zap className="w-5 h-5" />
                                Start Free Trial
                            </Button>
                        </motion.div>
                        <Button variant="outline" className="px-8 py-6 rounded-xl text-lg font-inter font-medium border-2 border-slate-300 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-300 flex items-center gap-2">
                            <BookOpen className="w-5 h-5" />
                            View Demo
                        </Button>
                    </div>

                    {/* STATS */}
                    <div className="flex items-center gap-8 pt-8">
                        <div className="flex items-center gap-4">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <motion.div
                                        key={i}
                                        className="w-10 h-10 bg-linear-to-r from-blue-500 to-purple-500 rounded-full border-2 border-white shadow-lg"
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.1 }}
                                    />
                                ))}
                            </div>
                            <div>
                                <p className="text-slate-600 font-inter text-sm">
                                    Join <span className="font-semibold text-slate-900">50,000+</span> learners
                                </p>
                                <div className="flex items-center gap-1">
                                    <Sparkles className="w-4 h-4 text-yellow-500" />
                                    <span className="text-xs text-slate-500">4.9/5 rating</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* RIGHT DASHBOARD */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="relative h-[500px]"
                >
                    {/*  Dashboard Card */}
                    <motion.div
                        className="absolute inset-0 bg-white rounded-3xl shadow-2xl border border-slate-200/80 backdrop-blur-sm p-8"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <div className="space-y-6">
                            {/* Header */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-poppins font-bold text-slate-900 text-lg">Study Dashboard</h3>
                                    <p className="text-slate-500 text-sm font-inter">Computer Science Major</p>
                                </div>
                                <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
                                    <TrendingUp className="w-3 h-3 mr-1" />
                                    +12% this week
                                </Badge>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-blue-50 rounded-2xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Clock className="w-4 h-4 text-blue-600" />
                                        <span className="text-sm font-inter font-medium text-blue-700">Focus Time</span>
                                    </div>
                                    <div className="text-2xl font-bold font-poppins text-slate-900">4.2h</div>
                                    <div className="text-xs text-slate-500">Today</div>
                                </div>
                                <div className="bg-purple-50 rounded-2xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Target className="w-4 h-4 text-purple-600" />
                                        <span className="text-sm font-inter font-medium text-purple-700">Tasks Done</span>
                                    </div>
                                    <div className="text-2xl font-bold font-poppins text-slate-900">8/10</div>
                                    <div className="text-xs text-slate-500">Daily goal</div>
                                </div>
                            </div>

                            {/* Progress Bars */}
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm font-inter mb-2">
                                        <span className="text-slate-700">Algorithms</span>
                                        <span className="text-slate-500">75%</span>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-2">
                                        <motion.div
                                            className="bg-blue-500 h-2 rounded-full"
                                            initial={{ width: 0 }}
                                            animate={{ width: '75%' }}
                                            transition={{ delay: 0.5, duration: 1 }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm font-inter mb-2">
                                        <span className="text-slate-700">Database Systems</span>
                                        <span className="text-slate-500">60%</span>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-2">
                                        <motion.div
                                            className="bg-purple-500 h-2 rounded-full"
                                            initial={{ width: 0 }}
                                            animate={{ width: '60%' }}
                                            transition={{ delay: 0.7, duration: 1 }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Floating Cards */}
                    <motion.div
                        className="absolute -top-6 -right-6 w-64 bg-white rounded-2xl shadow-lg p-6 border border-slate-200"
                        animate={{ y: [0, -15, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                        style={{ rotate: -3 }}
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-linear-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                                <Award className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <div className="font-poppins font-bold text-slate-900">7 Day Streak! 🔥</div>
                                <div className="text-xs text-slate-500 font-inter">Keep going!</div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="absolute -bottom-8 -left-8 w-56 bg-white rounded-2xl shadow-lg p-6 border border-slate-200"
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        style={{ rotate: 2 }}
                    >
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-inter font-medium text-slate-700">Upcoming</span>
                            </div>
                            <div className="text-sm font-inter text-slate-600">Midterm: Data Structures</div>
                            <div className="text-xs text-slate-500">in 3 days</div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}

export default HeroSection;