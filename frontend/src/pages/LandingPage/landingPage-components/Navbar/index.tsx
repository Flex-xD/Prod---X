import { motion, useScroll, useTransform } from 'framer-motion';
import { Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const NAV_LINKS = ['Features', 'How it works', 'Testimonials'];
const sp = { type: 'spring', damping: 28, stiffness: 300 } as const;

function LandingNavbar() {
    const { scrollY } = useScroll();
    const bg = useTransform(scrollY, [0, 80], ['rgba(255,255,255,0.7)', 'rgba(255,255,255,0.92)']);
    const shadow = useTransform(scrollY, [0, 80], ['none', '0 4px 24px rgba(124,58,237,0.08)']);

    return (
        <motion.nav
            className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl"
            style={{ background: bg, boxShadow: shadow, borderBottom: '1px solid rgba(0,0,0,0.06)' }}
        >
            <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3">
                    <motion.div
                        whileHover={{ rotate: 15, scale: 1.08 }}
                        transition={sp}
                        className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #7C3AED, #4F46E5)', boxShadow: '0 6px 20px rgba(124,58,237,0.35)' }}
                    >
                        <Zap className="w-5 h-5 text-white" />
                    </motion.div>
                    <span
                        className="text-xl font-black"
                        style={{ background: 'linear-gradient(135deg, #7C3AED, #4F46E5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                    >
                        ProdX
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    {NAV_LINKS.map((item) => (
                        <a
                            key={item}
                            href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                            className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
                        >
                            {item}
                        </a>
                    ))}
                </div>

                <div className="flex items-center gap-2.5">
                    <Link to="/auth">
                        <Button variant="ghost" className="text-sm font-bold text-violet-600 hover:bg-violet-50 hover:text-violet-700">
                            Sign in
                        </Button>
                    </Link>
                    <Link to="/auth">
                        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                className="text-sm font-bold text-white px-5 rounded-2xl"
                                style={{ background: 'linear-gradient(135deg, #7C3AED, #4F46E5)', boxShadow: '0 6px 20px rgba(124,58,237,0.35)' }}
                            >
                                Start free
                            </Button>
                        </motion.div>
                    </Link>
                </div>
            </div>
        </motion.nav>
    );
}

export default LandingNavbar;