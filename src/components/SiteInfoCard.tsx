import { X, Droplet, Activity, Users, Zap, Truck, Leaf } from 'lucide-react';
import { Button } from './ui/button';
import SuitabilityBadge from './SuitabilityBadge';
import FactorItem from './FactorItem';

interface SiteData {
  name: string;
  score: number;
  factors: {
    waterSource: { status: 'good' | 'warning' | 'bad'; detail: string };
    seismicActivity: { status: 'good' | 'warning' | 'bad'; detail: string };
    populationDensity: { status: 'good' | 'warning' | 'bad'; detail: string };
    gridConnection: { status: 'good' | 'warning' | 'bad'; detail: string };
    infrastructure: { status: 'good' | 'warning' | 'bad'; detail: string };
    environmentalImpact: { status: 'good' | 'warning' | 'bad'; detail: string };
  };
}

interface SiteInfoCardProps {
  data: SiteData;
  onClose: () => void;
  smrModel: string;
}

export default function SiteInfoCard({ data, onClose, smrModel }: SiteInfoCardProps) {
  return (
    <div className="bg-info-card-bg rounded-lg shadow-xl p-6 w-96 animate-fade-in border border-border">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-foreground mb-2">
            Site Suitability Score: {data.score}/100
          </h3>
          <SuitabilityBadge score={data.score} />
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-3 mb-4">
        <FactorItem
          icon={Droplet}
          label="Water Source Proximity"
          detail={data.factors.waterSource.detail}
          status={data.factors.waterSource.status}
        />
        
        <FactorItem
          icon={Activity}
          label="Seismic Activity"
          detail={data.factors.seismicActivity.detail}
          status={data.factors.seismicActivity.status}
        />
        
        <FactorItem
          icon={Users}
          label="Population Density (within 50km)"
          detail={data.factors.populationDensity.detail}
          status={data.factors.populationDensity.status}
        />
        
        <FactorItem
          icon={Zap}
          label="Grid Connection Access"
          detail={data.factors.gridConnection.detail}
          status={data.factors.gridConnection.status}
        />
        
        <FactorItem
          icon={Truck}
          label="Infrastructure & Transport"
          detail={data.factors.infrastructure.detail}
          status={data.factors.infrastructure.status}
        />
        
        <FactorItem
          icon={Leaf}
          label="Environmental Impact"
          detail={data.factors.environmentalImpact.detail}
          status={data.factors.environmentalImpact.status}
        />
      </div>

      <div className="pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold">SMR Model:</span> {smrModel}
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          <span className="font-semibold">Location:</span> Near {data.name}
        </p>
      </div>
    </div>
  );
}