import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

function Testimonials() {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <Badge className="px-4 py-2 bg-green-100 text-green-700 border-green-200 mb-4 font-inter">
                        💬 Success Stories
                    </Badge>
                    <h2 className="text-4xl lg:text-5xl font-bold font-poppins text-slate-900 mb-6">
                        Loved by Students
                        <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
                            Worldwide
                        </span>
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        {
                            name: 'Alex Thompson',
                            role: 'Computer Science, Stanford',
                            text: 'EduFocus helped me maintain a 4.0 GPA while balancing research and extracurriculars. The focus timer is a game-changer!',
                            avatar: 'AT',
                            improvement: 'GPA: 3.2 → 4.0'
                        },
                        {
                            name: 'Maria Garcia',
                            role: 'Medical Student, Johns Hopkins',
                            text: 'As a med student, the volume of information is overwhelming. EduFocus made studying systematic and actually enjoyable.',
                            avatar: 'MG',
                            improvement: 'Board Scores: +35%'
                        },
                        {
                            name: 'James Chen',
                            role: 'Engineering, MIT',
                            text: 'The progress analytics identified my weak areas in calculus. Two months later, I went from struggling to topping the class!',
                            avatar: 'JC',
                            improvement: 'Class Rank: Top 5%'
                        }
                    ].map((testimonial, index) => (
                        <motion.div
                            key={testimonial.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -8 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <Card className="rounded-3xl border border-slate-200 shadow-lg bg-white p-8 relative hover:shadow-xl transition-all duration-300">
                                <div className="absolute top-6 right-6 text-4xl text-blue-600 opacity-10">"</div>
                                <CardContent className="p-0">
                                    <div className="flex items-center gap-2 mb-4">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <div key={star} className="w-5 h-5 bg-yellow-400 rounded-sm"></div>
                                        ))}
                                    </div>
                                    <p className="text-slate-600 font-inter text-lg leading-relaxed mb-6">
                                        {testimonial.text}
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-linear-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white font-inter font-bold shadow-lg">
                                            {testimonial.avatar}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-poppins font-semibold text-slate-900">
                                                {testimonial.name}
                                            </div>
                                            <div className="font-inter text-slate-500 text-sm">
                                                {testimonial.role}
                                            </div>
                                            <Badge className="bg-green-100 text-green-700 hover:bg-green-200 text-xs mt-1">
                                                {testimonial.improvement}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>

    )
}

export default Testimonials;