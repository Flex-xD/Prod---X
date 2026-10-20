interface SkeletonBlockProps {
    className?: string;
    style?: React.CSSProperties;
}

const SkeletonBlock = ({ className, style }: SkeletonBlockProps) => (
    <div
        className={`animate-skeleton-pulse rounded-sm bg-paper-deep ${className ?? ""}`}
        style={style}
    />
);

export default SkeletonBlock;