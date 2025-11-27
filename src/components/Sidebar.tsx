import { Button } from './ui/button';
import { Atom } from 'lucide-react';
import rosatomLogo from '@/assets/rosatom-logo.png';

interface SidebarProps {
  onSmrModelChange: (model: string) => void;
  onAnalyze: () => void;
}

export default function Sidebar({ onAnalyze }: SidebarProps) {

  return (
    <aside className="w-80 bg-sidebar-bg border-r border-border flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Atom className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Myanmar</h1>
              <h2 className="text-xl font-bold text-primary">SMR Site Scout</h2>
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-3 border-l-4 border-accent pl-3">
          Strategic SMR Placement for a Sustainable Future
        </p>
      </div>

      {/* Analysis Section */}
      <div className="p-6 flex-1 overflow-auto">
        <Button 
          onClick={onAnalyze}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md"
        >
          Analyze Selected Site
        </Button>

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-foreground mb-2">Site Summary / Recommendations</h3>
          <div className="bg-muted/30 p-4 rounded-md text-sm text-muted-foreground leading-relaxed">
            Click any location on the map to analyze SMR site suitability. The system evaluates 
            critical hazards (seismic faults, flood zones) and opportunities (water access, grid 
            connection, infrastructure). Recommendations will highlight pros, cons, and suggest 
            improvements or alternative sites.
          </div>
        </div>

        <div className="mt-6 p-4 bg-accent/10 rounded-md border border-accent/30">
          <h4 className="text-sm font-semibold text-foreground mb-2">Critical Hazards</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• <span className="font-semibold">Sagaing Fault:</span> Major seismic risk</li>
            <li>• <span className="font-semibold">Kyaukkyan Fault:</span> Moderate seismic risk</li>
            <li>• <span className="font-semibold">Ayeyarwady Basin:</span> Flood prone area</li>
            <li>• <span className="font-semibold">Ayeyarwady Delta:</span> High flood risk</li>
          </ul>
        </div>

        <div className="mt-4 p-4 bg-success/10 rounded-md border border-success/30">
          <h4 className="text-sm font-semibold text-foreground mb-2">Key Opportunities</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Proximity to water sources (cooling)</li>
            <li>• Existing grid infrastructure</li>
            <li>• Transport and road access</li>
            <li>• Low population density zones</li>
          </ul>
        </div>
      </div>

      {/* Footer with Rosatom branding */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-center">
          <img 
            src={rosatomLogo} 
            alt="Rosatom HackAtom" 
            className="h-12 object-contain opacity-80 hover:opacity-100 transition-opacity"
          />
        </div>
        <p className="text-xs text-center text-muted-foreground mt-2">
          Powered by Rosatom · HackAtom Initiative
        </p>
      </div>
    </aside>
  );
}