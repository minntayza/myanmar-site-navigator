interface SuitabilityBadgeProps {
  score: number;
}

export default function SuitabilityBadge({ score }: SuitabilityBadgeProps) {
  const getSuitability = (score: number) => {
    if (score >= 70) return { label: 'High', className: 'bg-success text-success-foreground' };
    if (score >= 50) return { label: 'Medium', className: 'bg-warning text-warning-foreground' };
    return { label: 'Low', className: 'bg-destructive text-destructive-foreground' };
  };

  const suitability = getSuitability(score);

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${suitability.className}`}>
      {suitability.label}
    </span>
  );
}