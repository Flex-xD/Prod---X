import { motion } from 'framer-motion';
import { Play, Send, Flame } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const sp = { type: 'spring', damping: 28, stiffness: 280 } as const;

const STEPS = [
    { icon: Play, title: 'Start a session', body: 'Solo, or invite a few people in and set a shared goal. Either way, the clock is now on record.', grad: 'linear-gradient(135deg, #7C3AED, #4F46E5)' },
    { icon: Send, title: 'Log what you did', body: 'Stop, submit the time, close a task while you\'re at it. Both count toward today.', grad: 'linear-gradient(135deg, #EC4899, #F43F5E)' },
    { icon: Flame, title: 'Watch the chain grow', body: "Today's square lights up. Your streak ticks forward. Tomorrow, you'll want to keep it that way.", grad: 'linear-gradient(135deg, #F59E0B, #EF4444)' },
];

function WorkingSection() {
    return (
        <section id="how-it-works" className="py-24 bg-white">
            <div className="max-w-6xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ...sp }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <Badge className="px-3.5 py-1.5 bg-violet-50 text-violet-600 border-violet-200 mb-4">
                        Simple by design
                    </Badge>
                    <h2 className="text-3xl lg:text-4xl font-black text-slate-900">
                        Three steps. The same three, every day.
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                    <div className="hidden md:block absolute top-11 left-[16.5%] right-[16.5%] h-px" style={{ background: 'linear-gradient(90deg, transparent, #ddd6fe, transparent)' }} />

                    {STEPS.map((step, i) => (
                        <motion.div
                            key={step.title}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -6 }}
                            transition={{ duration: 0.45, delay: i * 0.12, ...sp }}
                            viewport={{ once: true }}
                            className="relative z-10 text-center"
                        >
                            <motion.div
                                whileHover={{ rotate: 8, scale: 1.08 }}
                                transition={sp}
                                className="w-16 h-16 rounded-3xl flex items-center justify-center text-white mx-auto mb-5"
                                style={{ background: step.grad, boxShadow: '0 10px 28px rgba(124,58,237,0.3)' }}
                            >
                                <step.icon className="w-7 h-7" />
                            </motion.div>
                            <h3 className="text-xl font-black text-slate-900 mb-2">{step.title}</h3>
                            <p className="text-slate-500 font-medium leading-relaxed max-w-xs mx-auto">{step.body}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default WorkingSection;