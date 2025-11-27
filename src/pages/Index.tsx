import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import MapView from '@/components/MapView';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [smrModel, setSmrModel] = useState('Pressurized Water SMR');
  const { toast } = useToast();

  const handleAnalyze = () => {
    toast({
      title: "Analysis Ready",
      description: "Click any location on the map to view detailed site suitability analysis.",
    });
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar 
        onSmrModelChange={setSmrModel}
        onAnalyze={handleAnalyze}
      />
      <main className="flex-1 p-4">
        <MapView smrModel={smrModel} />
      </main>
    </div>
  );
};

export default Index;