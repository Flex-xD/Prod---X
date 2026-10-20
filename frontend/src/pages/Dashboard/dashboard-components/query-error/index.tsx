interface QueryErrorProps {
    label: string;
    onRetry: () => void;
}

const QueryError = ({ label, onRetry }: QueryErrorProps) => (
    <div
        role="alert"
        className="rounded-lg border-2 border-ink bg-alert-tint px-5 py-4 flex flex-wrap items-center justify-between gap-3"
    >
        <p className="text-sm font-semibold text-ink">Unable to load {label}.</p>
        <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center rounded-lg border-2 border-ink bg-surface px-4 py-2 text-xs font-bold uppercase tracking-wider text-ink shadow-hard-sm transition-all duration-fast hover:shadow-hard active:translate-x-[2px] active:translate-y-[2px] active:shadow-hard-xs"
        >
            Try again
        </button>
    </div>
);

export default QueryError;