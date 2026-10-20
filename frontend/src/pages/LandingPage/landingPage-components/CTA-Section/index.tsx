import { useState } from 'react';
import { motion } from 'framer-motion';
import { quick } from '@/lib/motion';
import { cn } from '@/utils/utils';
import { LinkButton } from '../shared';

function CtaSection() {
    const [filled, setFilled] = useState(false);

    return (
        <section className="focus-ring-invert bg-ink text-paper">
            <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-24">
                <div>
                    <h2 className="text-3xl font-bold sm:text-4xl">Today’s square is empty.</h2>
                    <p className="mt-4 max-w-md text-lg text-paper/75">
                        Create a free account, run one session or finish one task, and the first square goes on your
                        calendar.
                    </p>
                    <div className="mt-8">
                        <LinkButton to="/auth" variant="onInk" onActiveChange={setFilled}>
                            Start your record
                        </LinkButton>
                    </div>
                </div>

                <div>
                    <motion.div
                        aria-hidden
                        className="grid max-w-sm grid-cols-7 gap-1.5"
                        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.03 } } }}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.6 }}
                    >
                        {Array.from({ length: 14 }, (_, i) => {
                            const today = i === 13;
                            return (
                                <motion.span
                                    key={i}
                                    variants={{ hidden: { opacity: 0, scale: 0.6 }, show: { opacity: 1, scale: 1 } }}
                                    transition={quick}
                                    className={cn(
                                        'relative aspect-square overflow-hidden rounded-sm',
                                        today ? 'border-2 border-dashed border-progress' : 'border border-paper/30',
                                    )}
                                >
                                    {today && (
                                        <motion.span
                                            className="absolute inset-0 bg-progress"
                                            initial={false}
                                            animate={{ scale: filled ? 1 : 0, opacity: filled ? 1 : 0 }}
                                            transition={quick}
                                        />
                                    )}
                                </motion.span>
                            );
                        })}
                    </motion.div>
                    <p className="mt-3 text-sm text-paper/75">Your calendar on day one. The dashed square is today.</p>
                </div>
            </div>
        </section>
    );
}

export default CtaSection; 