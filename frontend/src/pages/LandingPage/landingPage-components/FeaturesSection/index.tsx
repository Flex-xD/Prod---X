import { motion } from 'framer-motion';
import { Timer, Users, ListChecks, Calendar, TrendingUp, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import StreakPreview from '../StreakPreview';

const sp = { type: 'spring', damping: 28, stiffness: 280 } as const;

const FEATURES = [
    {
        icon: Timer,
        title: 'Focus timer',
        desc: 'Start a session, work, submit the time when you\'re done. No fake averages — just what you actually sat down and did.',
        grad: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
        shadow: 'rgba(124,58,237,0.35)',
        span: 'md:col-span-3',
    },
    {
        icon: Users,
        title: 'Group timers',
        desc: 'Invite up to five people into a session with a shared goal. Everyone\'s ranked live — nobody wants to be the one lagging.',
        grad: 'linear-gradient(135deg, #EC4899, #F43F5E)',
        shadow: 'rgba(236,72,153,0.35)',
        span: 'md:col-span-3',
    },
    {
        icon: ListChecks,
        title: 'Tasks that count',
        desc: 'A finished task keeps the streak alive too, even on a no-timer day.',
        grad: 'linear-gradient(135deg, #10B981, #0D9488)',
        shadow: 'rgba(16,185,129,0.35)',
        span: 'md:col-span-2',
    },
    {
        icon: TrendingUp,
        title: 'Weekly focus graph',
        desc: 'See the week shape up live, scaled to how you actually work — minutes or hours.',
        grad: 'linear-gradient(135deg, #3B82F6, #4F46E5)',
        shadow: 'rgba(59,130,246,0.35)',
        span: 'md:col-span-2',
    },
    {
        icon: Sparkles,
        title: 'A new tip, every day',
        desc: 'One short, specific suggestion based on how your day\'s going — not a generic quote.',
        grad: 'linear-gradient(135deg, #F59E0B, #EF4444)',
        shadow: 'rgba(245,158,11,0.35)',
        span: 'md:col-span-2',
    },
];

function FeaturesSection() {
    return (
        <section id="features" className="py-24" style={{ background: 'linear-gradient(160deg,#f8f7ff 0%,#fdf4ff 50%,#fafafa 100%)' }}>
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ...sp }}
                    viewport={{ once: true }}
                    className="mb-14 max-w-xl"
                >
                    <Badge className="px-3.5 py-1.5 bg-violet-50 text-violet-600 border-violet-200 mb-4">
                        Everything feeds one streak
                    </Badge>
                    <h2 className="text-3xl lg:text-4xl font-black text-slate-900">
                        Timers, tasks, and group sessions all count.
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
                    {FEATURES.map((f, i) => (
                        <motion.div
                            key={f.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -4, boxShadow: `0 24px 48px ${f.shadow}` }}
                            transition={{ duration: 0.4, delay: i * 0.06, ...sp }}
                            viewport={{ once: true }}
                            className={`relative rounded-3xl overflow-hidden text-white p-7 ${f.span}`}
                            style={{ background: f.grad, boxShadow: `0 8px 28px ${f.shadow}` }}
                        >
                            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full" style={{ background: 'rgba(255,255,255,0.12)', filter: 'blur(20px)' }} />
                            <div className="relative z-10">
                                <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-5" style={{ background: 'rgba(255,255,255,0.18)' }}>
                                    <f.icon className="w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-black mb-2">{f.title}</h3>
                                <p className="text-sm font-medium opacity-85 leading-relaxed">{f.desc}</p>
                            </div>
                        </motion.div>
                    ))}

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -4 }}
                        transition={{ duration: 0.4, delay: 0.36, ...sp }}
                        viewport={{ once: true }}
                        className="md:col-span-4 rounded-3xl bg-white p-7"
                        style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.07)', border: '1px solid rgba(0,0,0,0.05)' }}
                    >
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: '#f5f3ff', border: '1px solid #ddd6fe' }}>
                                <Calendar className="w-5 h-5 text-violet-500" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900">A full year, mapped</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <div className="inline-block p-1">
                                <StreakPreview weeks={28} rows={7} cellSize={10} gap={3} />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

export default FeaturesSection;