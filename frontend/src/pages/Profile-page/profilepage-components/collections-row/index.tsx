import { CheckSquare, Timer, Users } from 'lucide-react';
import type { ICollectionsRowProps, ICollection } from './collections-row-types';

const iconMap: Record<ICollection['iconName'], React.ReactNode> = {
    CheckSquare: <CheckSquare className="w-5 h-5" />,
    Timer: <Timer className="w-5 h-5" />,
    Users: <Users className="w-5 h-5" />,
};

const CollectionsRow = ({ collections }: ICollectionsRowProps) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {collections.map((col, i) => (
                <div
                    key={col.label}
                    className="fade-up-card relative bg-white/75 backdrop-blur-sm rounded-2xl border border-white/70 shadow-lg shadow-violet-100/20 p-5 flex items-center gap-4 cursor-default overflow-hidden group transition-transform duration-200 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-100/30"
                    style={{ animationDelay: `${0.1 + i * 0.07}s` }}
                >
                    {/* Icon */}
                    <div className={`p-3 rounded-xl ${col.iconBg} shrink-0 transition-transform duration-200 group-hover:scale-110`}>
                        {iconMap[col.iconName]}
                    </div>

                    {/* Value + label */}
                    <div>
                        <p className="text-2xl font-bold text-slate-800 leading-none tabular-nums">{col.value}</p>
                        <p className="text-xs text-slate-400 mt-1 font-medium">{col.label}</p>
                    </div>

                    {/* Bottom gradient accent */}
                    <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r ${col.gradient} opacity-70`} />

                    {/* Subtle background glow on hover */}
                    <div className={`absolute inset-0 bg-linear-to-br ${col.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-200 rounded-2xl`} />
                </div>
            ))}
        </div>
    );
};

export default CollectionsRow;