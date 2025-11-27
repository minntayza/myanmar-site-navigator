import { LucideIcon, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface FactorItemProps {
  icon: LucideIcon;
  label: string;
  detail: string;
  status: 'good' | 'warning' | 'bad';
}

export default function FactorItem({ icon: Icon, label, detail, status }: FactorItemProps) {
  const getStatusIcon = () => {
    switch (status) {
      case 'good':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-warning" />;
      case 'bad':
        return <XCircle className="h-5 w-5 text-destructive" />;
    }
  };

  return (
    <div className="flex items-start gap-3 p-3 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors">
      <Icon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-foreground">{label}</div>
        <div className="text-sm text-muted-foreground">{detail}</div>
      </div>
      {getStatusIcon()}
    </div>
  );
}