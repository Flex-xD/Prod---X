import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

const sp = { type: 'spring', damping: 28, stiffness: 280 } as const;

const SUPPORTING = [
    { name: 'Priya R.', role: 'Final-year CS student', text: 'I stopped negotiating with myself every morning.', grad: 'linear-gradient(135deg, #10B981, #0D9488)' },
    { name: 'Marcus O.', role: 'Freelance designer', text: 'Group sessions with two friends got me through a slump.', grad: 'linear-gradient(135deg, #3B82F6, #4F46E5)' },
];

function Testimonials() {
    return (
        <section id="testimonials" className="py-24" style={{ background: 'linear-gradient(160deg,#f8f7ff 0%,#fdf4ff 50%,#fafafa 100%)' }}>
            <div className="max-w-5xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ...sp }}
                    viewport={{ once: true }}
                    className="rounded-3xl p-10 lg:p-14 text-center mb-8 text-white relative overflow-hidden"
                    style={{ background: 'linear-gradient(145deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)', boxShadow: '0 24px 64px rgba(79,46,220,0.35)' }}
                >
                    <div className="absolute -top-10 -left-10 w-56 h-56 rounded-full" style={{ background: 'radial-gradient(circle, rgba(129,140,248,0.2), transparent)' }} />
                    <Flame className="w-8 h-8 text-amber-300 mx-auto mb-6 relative z-10" />
                    <p className="text-2xl lg:text-3xl font-black leading-snug max-w-2xl mx-auto mb-7 relative z-10">
                        "I'm not more disciplined than I was a year ago. I just have a calendar I don't want to see turn empty."
                    </p>
                    <div className="flex items-center justify-center gap-3 relative z-10">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black"
                            style={{ background: 'linear-gradient(135deg, #7C3AED, #4F46E5)' }}
                        >
                            JD
                        </div>
                        <div className="text-left">
                            <div className="font-bold text-sm">Jordan D.</div>
                            <div className="text-indigo-300 text-xs font-semibold">Software engineer · 112-day streak</div>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {SUPPORTING.map((t, i) => (
                        <motion.div
                            key={t.name}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -4 }}
                            transition={{ duration: 0.4, delay: i * 0.1, ...sp }}
                            viewport={{ once: true }}
                            className="rounded-3xl bg-white p-6 flex items-start gap-4"
                            style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.07)', border: '1px solid rgba(0,0,0,0.05)' }}
                        >
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                                style={{ background: t.grad }}
                            >
                                {t.name.split(' ').map((n) => n[0]).join('')}
                            </div>
                            <div>
                                <p className="text-slate-700 font-semibold mb-1.5">"{t.text}"</p>
                                <p className="text-sm text-slate-400 font-medium">{t.name} — {t.role}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Testimonials;