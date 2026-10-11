import { motion } from 'framer-motion';

const sp = { type: 'spring', damping: 28, stiffness: 300 } as const;

function StorySection() {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-5xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ...sp }}
                    viewport={{ once: true, amount: 0.4 }}
                    className="text-center"
                >
                    <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-6 max-w-2xl mx-auto leading-tight">
                        Most momentum dies quietly, in the first three days.
                    </h2>
                    <div className="space-y-5 text-lg text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
                        <p>
                            You have a good day. You mean to repeat it tomorrow. But with nothing to look at,
                            "I did well today" fades into "I think I did okay this week" — and soon you can't
                            remember the last time you actually focused.
                        </p>
                        <p>
                            ProdX doesn't nag you with reminders. It keeps a record — every session, every
                            finished task, every group sprint — and lays it out as one continuous streak.
                        </p>
                        <p className="text-slate-900 font-bold">
                            Once that streak exists, the question changes. It's no longer "should I work today?"
                            It's "am I really going to be the one who breaks 47 days?"
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

export default StorySection;