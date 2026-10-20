import { useState } from 'react';
import { AnimatePresence, motion, useScroll } from 'framer-motion';
import { Menu, X, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { pressSpring, quick } from '@/lib/motion';
import { cn } from '@/utils/utils';
import { SECTION_IDS, scrollToSection, useActiveSection } from '../scroll';
import { LinkButton } from '../shared';

const NAV_LINKS = [
    { id: 'how-it-works', label: 'How it works' },
    { id: 'record', label: 'The record' },
    { id: 'features', label: 'Features' },
    { id: 'groups', label: 'Group sessions' },
] as const;

function LandingNavbar() {
    const { scrollYProgress } = useScroll();
    const active = useActiveSection(SECTION_IDS);
    const [open, setOpen] = useState(false);

    const go = (id: string) => (e: React.MouseEvent) => {
        e.preventDefault();
        setOpen(false);
        scrollToSection(id);
    };

    return (
        <header
            className="sticky top-0 z-50 border-b-2 border-ink bg-paper"
            onKeyDown={(e) => {
                if (e.key === 'Escape') setOpen(false);
            }}
        >
            <nav aria-label="Primary" className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
                <Link to="/" aria-label="Prod-X home" className='flex items-center'>
                    <span
                aria-hidden="true"
                className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-sm border-2 border-ink bg-ink text-paper"
            >
                <Zap className="h-5 w-5 text-sm" />
            </span>
            <div>
                <p className="hidden px-2 py-2 text-lg font-bold underline-offset-4  sm:inline">ProdX</p>
            </div>
                </Link>

                <ul className="hidden items-center gap-7 md:flex">
                    {NAV_LINKS.map((l) => (
                        <li key={l.id} className="relative">
                            <a
                                href={`#${l.id}`}
                                onClick={go(l.id)}
                                aria-current={active === l.id ? 'location' : undefined}
                                className={cn(
                                    'block py-1 text-sm font-bold transition-colors duration-fast hover:text-ink',
                                    active === l.id ? 'text-ink' : 'text-ink-soft',
                                )}
                            >
                                {l.label}
                            </a>
                            {active === l.id && (
                                <motion.span
                                    layoutId="nav-active"
                                    aria-hidden
                                    className="absolute inset-x-0 -bottom-1.5 h-0.5 bg-ink"
                                    transition={pressSpring}
                                />
                            )}
                        </li>
                    ))}
                </ul>

                <div className="flex items-center gap-2 sm:gap-3">
                    <button
                        type="button"
                        aria-expanded={open}
                        aria-controls="mobile-nav"
                        onClick={() => setOpen((o) => !o)}
                        className="inline-flex h-10 items-center gap-1.5 rounded-lg border-2 border-ink bg-surface px-3 text-sm font-bold text-ink md:hidden"
                    >
                        {open ? <X className="size-4" aria-hidden="true" /> : <Menu className="size-4" aria-hidden="true" />}
                        Menu
                    </button>
                    <Link to="/auth" className="hidden px-2 py-2 text-sm font-bold underline-offset-4 hover:underline sm:inline">
                        Sign in
                    </Link>
                    <LinkButton to="/auth" className="h-10 px-4 text-sm">
                        Start free
                    </LinkButton>
                </div>
            </nav>

            <AnimatePresence>
                {open && (
                    <motion.div
                        id="mobile-nav"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={quick}
                        className="absolute inset-x-0 top-full border-b-2 border-ink bg-paper md:hidden"
                    >
                        <ul className="mx-auto max-w-7xl px-4 sm:px-6">
                            {NAV_LINKS.map((l) => (
                                <li key={l.id} className="border-b border-line">
                                    <a href={`#${l.id}`} onClick={go(l.id)} className="block py-3.5 text-base font-bold">
                                        {l.label}
                                    </a>
                                </li>
                            ))}
                            <li className="sm:hidden">
                                <Link to="/auth" className="block py-3.5 text-base font-bold">
                                    Sign in
                                </Link>
                            </li>
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                aria-hidden
                style={{ scaleX: scrollYProgress }}
                className="absolute inset-x-0 -bottom-0.5 h-0.5 origin-left bg-progress"
            />
        </header>
    );
}

export default LandingNavbar;