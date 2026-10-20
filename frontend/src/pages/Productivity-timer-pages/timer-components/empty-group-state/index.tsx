import { Users, Plus } from 'lucide-react';
import { PressBtn } from '../ui';

interface EmptyGroupStateProps {
    onCreateClick: () => void;
}

// Static by design: empty states arrive with their section (enter()
// on the parent), and nothing here loops or sparkles.
const EmptyGroupState = ({ onCreateClick }: EmptyGroupStateProps) => (
    <div className="flex flex-col items-center justify-center py-14 text-center">
        <span className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg border-2 border-ink bg-paper-deep text-ink-soft">
            <Users className="h-7 w-7" aria-hidden="true" />
        </span>

        <h4 className="text-base font-bold uppercase tracking-[0.1em] text-ink">No Group Timers Yet</h4>
        <p className="mb-7 mt-2 max-w-xs text-sm font-medium leading-relaxed text-ink-faint">
            You haven't joined any group session. Invite your squad and grind together!
        </p>

        <PressBtn variant="focus" onClick={onCreateClick}>
            <Plus className="h-4 w-4" aria-hidden="true" /> Create Group Timer
        </PressBtn>
    </div>
);

export default EmptyGroupState;