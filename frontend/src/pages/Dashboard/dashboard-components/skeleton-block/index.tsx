interface SkeletonBlockProps {
    className?: string;
    style?: React.CSSProperties;
}

const SkeletonBlock = ({ className, style }: SkeletonBlockProps) => (
    <div
        className= {`animate-pulse rounded-xl bg-slate-100 ${className ?? ""}`}
style = { style }
    />
);

export default SkeletonBlock;