import { Link } from 'react-router-dom';
import { AnchorLink, Wordmark } from '../shared';

const PAGE_LINKS = [
    { label: 'How it works', href: '#how-it-works' },
    { label: 'The record', href: '#record' },
    { label: 'Features', href: '#features' },
    { label: 'Group sessions', href: '#groups' },
] as const;

const LINK_CLASS = 'text-sm font-semibold underline-offset-4 hover:underline';
const HEADING = 'text-[11px] font-bold uppercase tracking-[0.14em] text-ink-soft';

function Footer() {
    return (
        <footer className="border-t-2 border-ink bg-paper">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
                <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr]">
                    <div>
                        <Wordmark />
                        <p className="mt-4 max-w-sm text-ink-soft">A record of your focus, built one session at a time.</p>
                    </div>

                    <nav aria-label="On this page">
                        <p className={HEADING}>On this page</p>
                        <ul className="mt-3 space-y-2">
                            {PAGE_LINKS.map((l) => (
                                <li key={l.href}>
                                    <AnchorLink href={l.href} className={LINK_CLASS}>
                                        {l.label}
                                    </AnchorLink>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <nav aria-label="Account and legal">
                        <p className={HEADING}>Account</p>
                        <ul className="mt-3 space-y-2">
                            <li>
                                <Link to="/auth" className={LINK_CLASS}>
                                    Sign in or create an account
                                </Link>
                            </li>
                            <li>
                                <Link to="/privacy" className={LINK_CLASS}>
                                    Privacy policy
                                </Link>
                            </li>
                            <li>
                                <Link to="/terms" className={LINK_CLASS}>
                                    Terms of service
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>

                <p className="mt-10 border-t border-line pt-6 text-sm text-ink-soft">© {new Date().getFullYear()} Prod-X</p>
            </div>
        </footer>
    );
}

export default Footer;