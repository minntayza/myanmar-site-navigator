import { useState } from 'react';
import { Button } from './ui/button';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Atom } from 'lucide-react';
import rosatomLogo from '@/assets/rosatom-logo.png';

interface SidebarProps {
  onSmrModelChange: (model: string) => void;
  onAnalyze: () => void;
}

export default function Sidebar({ onSmrModelChange, onAnalyze }: SidebarProps) {
  const [selectedModel, setSelectedModel] = useState('pressurized-water');

  const handleModelChange = (value: string) => {
    setSelectedModel(value);
    onSmrModelChange(value === 'pressurized-water' ? 'Pressurized Water SMR' : 'High-Temp Gas SMR');
  };

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
          Optimizing Energy Futures, Sustainably
        </p>
      </div>

      {/* SMR Model Selection */}
      <div className="p-6 flex-1 overflow-auto">
        <div className="mb-6">
          <h3 className="text-base font-semibold text-foreground mb-4">SMR Model Selection</h3>
          <RadioGroup value={selectedModel} onValueChange={handleModelChange}>
            <div className="flex items-center space-x-3 p-3 rounded-md hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="pressurized-water" id="pressurized-water" />
              <Label 
                htmlFor="pressurized-water" 
                className="flex items-center gap-2 cursor-pointer flex-1"
              >
                <Atom className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Pressurized Water SMR</span>
              </Label>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-md hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="high-temp-gas" id="high-temp-gas" />
              <Label 
                htmlFor="high-temp-gas" 
                className="flex items-center gap-2 cursor-pointer flex-1"
              >
                <Atom className="h-4 w-4 text-secondary" />
                <span className="text-sm font-medium">High-Temp Gas SMR</span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <Button 
          onClick={onAnalyze}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md"
        >
          Analyze Selected Site
        </Button>

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-foreground mb-2">Site Summary</h3>
          <div className="bg-muted/30 p-4 rounded-md text-sm text-muted-foreground">
            Click any location on the map to analyze site suitability for SMR placement. 
            The system evaluates water proximity, seismic activity, population density, 
            infrastructure access, and environmental factors.
          </div>
        </div>

        <div className="mt-6 p-4 bg-accent/10 rounded-md border border-accent/30">
          <h4 className="text-sm font-semibold text-foreground mb-2">Key Considerations</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Proximity to water sources (cooling)</li>
            <li>• Low seismic risk zones</li>
            <li>• Adequate grid infrastructure</li>
            <li>• Safe distance from population centers</li>
            <li>• Minimal environmental impact</li>
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