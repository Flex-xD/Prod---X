import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

const COLUMNS = [
    { title: 'Product', links: ['Dashboard', 'Focus timer', 'Group sessions', 'Tasks'] },
    { title: 'Resources', links: ['Help center', 'Changelog'] },
    { title: 'Company', links: ['About', 'Contact'] },
];

function Footer() {
    return (
        <footer className="bg-slate-900">
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-14">
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-2.5 mb-5">
                            <div
                                className="w-9 h-9 rounded-2xl flex items-center justify-center"
                                style={{ background: 'linear-gradient(135deg, #7C3AED, #4F46E5)' }}
                            >
                                <Zap className="w-4.5 h-4.5 text-white" />
                            </div>
                            <span className="text-lg font-black text-white">ProdX</span>
                        </div>
                        <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-sm">
                            A record of your focus, built one session at a time — so the only question left is
                            whether you'll keep it going.
                        </p>
                    </div>

                    {COLUMNS.map((col) => (
                        <div key={col.title}>
                            <h3 className="font-bold text-sm text-white mb-5">{col.title}</h3>
                            <ul className="space-y-3">
                                {col.links.map((link) => (
                                    <li key={link}>
                                        <a href="#" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-slate-500 text-sm font-medium">
                        ProdX. Built for people who don't want to break the chain.
                    </p>
                    <Link to="/auth" className="text-sm font-bold text-violet-400 hover:text-violet-300 transition-colors">
                        Get started →
                    </Link>
                </div>
            </div>
        </footer>
    );
}

export default Footer;