import { motion } from 'framer-motion';
import { cn } from '@/utils/utils';
import { LEVEL_BG, cellFill } from '../shared';
import type { Level } from '../dummy-data';

// 28 days. Each digit is one day's activity level (0 empty ... 3 most).
const WITHOUT_RECORD = '3221100010000000000000000000';
const WITH_RECORD = '3221123012231232102312321223';

const toLevels = (digits: string): Level[] => Array.from(digits, (d) => Number(d) as Level);

/** Both rows play on the same clock, so the first row visibly stops while the second keeps going. */
function DayRow({ title, caption, digits }: { title: string; caption: string; digits: string }) {
    return (
        <div>
            <h3 className="text-base font-bold">{title}</h3>
            <motion.div
                aria-hidden
                className="mt-3 grid grid-cols-[repeat(28,minmax(0,1fr))] gap-[3px]"
                variants={{ hidden: {}, show: {} }}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.6 }}
            >
                {toLevels(digits).map((level, i) => (
                    <span key={i} className="relative aspect-square rounded-xs bg-paper-deep">
                        {level > 0 && (
                            <motion.span
                                variants={cellFill}
                                custom={i * 0.05}
                                className={cn('absolute inset-0 rounded-xs', LEVEL_BG[level])}
                            />
                        )}
                    </span>
                ))}
            </motion.div>
            <p className="mt-3 max-w-md text-ink-soft">{caption}</p>
        </div>
    );
}

function StorySection() {
    return (
        <section className="border-b-2 border-ink bg-surface">
            <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-24">
                <div>
                    <h2 className="max-w-lg text-3xl font-bold sm:text-4xl">Good days disappear unless something keeps them.</h2>
                    <div className="mt-6 max-w-md space-y-4 text-lg text-ink-soft">
                        <p>
                            You have a strong day and plan to repeat it. A week later you remember it went well, but not
                            what you did or how long you worked.
                        </p>
                        <p>
                            Prod-X keeps the evidence. Each timer you finish and each task you close is added to the
                            calendar the same day.
                        </p>
                        <p className="font-semibold text-ink">
                            After a few weeks the calendar answers the question for you: how consistent have I been?
                        </p>
                    </div>
                </div>

                <div className="space-y-10">
                    <DayRow
                        title="Without a record"
                        digits={WITHOUT_RECORD}
                        caption="A few good days at the start, then nothing you can point to. Which days were good is a guess."
                    />
                    <DayRow
                        title="With a record"
                        digits={WITH_RECORD}
                        caption="Every day you worked stays on the calendar, and so do the gaps. You can see the pattern."
                    />
                </div>
            </div>
        </section>
    );
}

export default StorySection;