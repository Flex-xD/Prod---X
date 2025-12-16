import { Calendar, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DashboardHeader = () => {
    return (
        <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-linear-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center">
                        <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <span className="bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent text-2xl font-bold">
                            ProdX
                        </span>
                        <p className="text-xs text-slate-500">Welcome back, Alex! 👋</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" className="text-slate-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        Nov 1, 2025
                    </Button>
                    <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                        AK
                    </div>
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;