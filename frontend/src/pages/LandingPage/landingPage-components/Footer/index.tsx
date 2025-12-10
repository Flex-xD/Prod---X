import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

function Footer() {
    return (
        <footer className="bg-slate-900 text-white">
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    {/* Company */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        viewport={{ once: true }}
                        className="lg:col-span-2"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                                <Brain className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <span className="bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent text-2xl font-bold font-poppins">
                                    EduFocus
                                </span>
                                <div className="w-2 h-1 bg-linear-to-r from-blue-400 to-purple-400 rounded-full ml-1"></div>
                            </div>
                        </div>
                        <p className="text-slate-400 font-inter text-sm leading-relaxed max-w-md">
                            Empowering students and lifelong learners with intelligent tools to make studying effective, enjoyable, and rewarding.
                        </p>
                    </motion.div>

                    {/* Links Columns */}
                    {[
                        {
                            title: 'Product',
                            links: ['Features', 'Study Tools', 'Pricing', 'Mobile App', 'Integrations']
                        },
                        {
                            title: 'Resources',
                            links: ['Blog', 'Tutorials', 'Webinars', 'Templates', 'Study Guides']
                        },
                        {
                            title: 'Company',
                            links: ['About', 'Careers', 'Contact', 'Partners', 'Press']
                        }
                    ].map((column, index) => (
                        <motion.div
                            key={column.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="font-poppins font-semibold text-white mb-6">
                                {column.title}
                            </h3>
                            <ul className="space-y-4">
                                {column.links.map((link) => (
                                    <li key={link}>
                                        <motion.a
                                            href="#"
                                            className="text-slate-400 font-inter text-sm hover:text-white transition-colors duration-200 relative cursor-pointer block py-1"
                                            whileHover={{ x: 4 }}
                                        >
                                            {link}
                                        </motion.a>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    viewport={{ once: true }}
                    className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center"
                >
                    <p className="text-slate-500 font-inter text-sm">
                        © 2024 EduFocus. Empowering learners everywhere.
                    </p>
                    <div className="flex gap-4 mt-6 md:mt-0">
                        {['Twitter', 'LinkedIn', 'Instagram', 'YouTube'].map((social) => (
                            <motion.a
                                key={social}
                                href="#"
                                className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all duration-300"
                                whileHover={{ scale: 1.1, y: -2 }}
                            >
                                {social.charAt(0)}
                            </motion.a>
                        ))}
                    </div>
                </motion.div>
            </div>
        </footer>
    )
}

export default Footer;