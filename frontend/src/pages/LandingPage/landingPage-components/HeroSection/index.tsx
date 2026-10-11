import { motion } from 'framer-motion';
import { Flame, ArrowRight, Users, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import StreakPreview from '../StreakPreview';

const sp = { type: 'spring', damping: 28, stiffness: 300 } as const;

function HeroSection() {
    return (
        <section
            className="pt-36 pb-24 relative overflow-hidden"
            style={{ background: 'linear-gradient(160deg,#f8f7ff 0%,#fdf4ff 35%,#f0f9ff 65%,#fafafa 100%)' }}
        >
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ...sp }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, ...sp }}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-6"
                        style={{ background: '#f5f3ff', border: '1px solid #ddd6fe' }}
                    >
                        <Flame className="w-3.5 h-3.5 text-violet-500" />
                        <span className="text-xs font-bold text-violet-600">Built around one idea: don't break the chain</span>
                    </motion.div>

                    <h1 className="text-5xl lg:text-6xl font-black leading-[1.05] text-slate-900 mb-6">
                        Watch your progress.
                        <span
                            className="block mt-1"
                            style={{ background: 'linear-gradient(135deg, #7C3AED, #4F46E5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                        >
                            Keep it going.
                        </span>
                    </h1>

                    <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-md mb-9">
                        Every focus session, finished task, and group sprint lands on one streak you can actually
                        see. Once it's visible, you stop wanting to let it drop.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 mb-10">
                        <Link to="/auth">
                            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                <Button
                                    className="px-7 py-6 rounded-2xl text-base font-bold text-white w-full sm:w-auto flex items-center gap-2"
                                    style={{ background: 'linear-gradient(135deg, #7C3AED, #4F46E5)', boxShadow: '0 10px 28px rgba(124,58,237,0.4)' }}
                                >
                                    Start your streak <ArrowRight className="w-4 h-4" />
                                </Button>
                            </motion.div>
                        </Link>
                        <a href="#how-it-works">
                            <Button
                                variant="outline"
                                className="px-7 py-6 rounded-2xl text-base font-bold border-2 border-slate-200 hover:border-violet-300 hover:bg-violet-50/50 w-full sm:w-auto"
                            >
                                See how it works
                            </Button>
                        </a>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex -space-x-3">
                            {['#7C3AED,#4F46E5', '#EC4899,#F43F5E', '#10B981,#0D9488', '#F59E0B,#EF4444'].map((grad, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3 + i * 0.08, ...sp }}
                                    className="w-9 h-9 rounded-full border-2 border-white"
                                    style={{ background: `linear-gradient(135deg, ${grad})`, boxShadow: '0 4px 10px rgba(0,0,0,0.12)' }}
                                />
                            ))}
                        </div>
                        <p className="text-sm font-semibold text-slate-500">
                            Joined by people already on <span className="text-slate-900 font-black">30+ day streaks</span>
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.15, ...sp }}
                    className="relative rounded-3xl overflow-hidden text-white"
                    style={{
                        background: 'linear-gradient(145deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)',
                        boxShadow: '0 32px 80px rgba(79,46,220,0.42)',
                    }}
                >
                    <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full" style={{ background: 'radial-gradient(circle, rgba(129,140,248,0.22), transparent)' }} />
                    <div className="absolute bottom-0 -left-10 w-48 h-48 rounded-full" style={{ background: 'radial-gradient(circle, rgba(192,132,252,0.16), transparent)' }} />

                    <div className="relative z-10 p-8">
                        <div className="flex items-center justify-between mb-7">
                            <div>
                                <p className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1">Current streak</p>
                                <div className="flex items-center gap-2">
                                    <Flame className="w-6 h-6 text-amber-300" />
                                    <span className="text-4xl font-black">47 days</span>
                                </div>
                            </div>
                            <motion.div
                                animate={{ rotate: [0, 8, -8, 0] }}
                                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                                style={{ background: 'rgba(255,255,255,0.12)' }}
                            >
                                <Flame className="w-5 h-5 text-amber-300" />
                            </motion.div>
                        </div>

                        <div className="overflow-x-auto pb-1">
                            <StreakPreview weeks={20} rows={7} cellSize={12} gap={4} />
                        </div>

                        <div className="grid grid-cols-3 gap-3 mt-7">
                            <div className="rounded-2xl p-3.5" style={{ background: 'rgba(255,255,255,0.08)' }}>
                                <CheckCircle2 className="w-4 h-4 text-emerald-300 mb-1.5" />
                                <p className="text-lg font-black leading-none">8</p>
                                <p className="text-xs text-indigo-300 font-semibold mt-0.5">Tasks today</p>
                            </div>
                            <div className="rounded-2xl p-3.5" style={{ background: 'rgba(255,255,255,0.08)' }}>
                                <Flame className="w-4 h-4 text-amber-300 mb-1.5" />
                                <p className="text-lg font-black leading-none">4.2h</p>
                                <p className="text-xs text-indigo-300 font-semibold mt-0.5">Focus time</p>
                            </div>
                            <div className="rounded-2xl p-3.5" style={{ background: 'rgba(255,255,255,0.08)' }}>
                                <Users className="w-4 h-4 text-pink-300 mb-1.5" />
                                <p className="text-lg font-black leading-none">3</p>
                                <p className="text-xs text-indigo-300 font-semibold mt-0.5">In your squad</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

export default HeroSection;