import { useState, useRef, useCallback } from 'react';
import { Ring3D } from '@/components/Ring3D';
import { Sparkles, Gem, Box, Upload, X } from 'lucide-react';

const METALS = [
  { id: 'yellow', name: 'Yellow Gold', color: '#c8922a', swatch: '#C8922A' },
  { id: 'white',  name: 'White Gold',  color: '#b8b8c8', swatch: '#B8B8C8' },
  { id: 'rose',   name: 'Rose Gold',   color: '#c07060', swatch: '#C07060' },
];

const CUTS = [
  { id: 'round',   name: 'Round Brilliant' },
  { id: 'emerald', name: 'Emerald Cut' },
];

const DEFAULT_GLB = `${import.meta.env.BASE_URL}ring.glb`;

export default function Home() {
  const [activeMetal, setActiveMetal] = useState(METALS[0]);
  const [activeCut, setActiveCut] = useState(CUTS[0]);
  const [glbUrl, setGlbUrl] = useState<string>(DEFAULT_GLB);
  const [glbName, setGlbName] = useState<string | null>(null); // null = default model
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadGlb = useCallback((file: File) => {
    const ext = file.name.toLowerCase();
    if (!ext.endsWith('.glb') && !ext.endsWith('.gltf')) return;
    if (glbName) URL.revokeObjectURL(glbUrl); // only revoke object URLs, not the default
    setGlbUrl(URL.createObjectURL(file));
    setGlbName(file.name);
  }, [glbUrl, glbName]);

  const clearGlb = useCallback(() => {
    if (glbName) URL.revokeObjectURL(glbUrl);
    setGlbUrl(DEFAULT_GLB);
    setGlbName(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [glbUrl, glbName]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) loadGlb(file);
  }, [loadGlb]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#09090b]">

      {/* Full-screen 3D canvas */}
      <div className="absolute inset-0">
        <Ring3D
          metalColor={activeMetal.color}
          stoneCut={activeCut.id}
          glbUrl={glbUrl}
        />
      </div>

      {/* Configurator panel — bottom-left */}
      <div className="absolute bottom-6 left-6 z-20 w-[340px] bg-black/70 backdrop-blur-xl border border-white/[0.07] p-6 space-y-6">

        {/* Noble Metal */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-[#c8922a]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Noble Metal</span>
          </div>
          <div className="flex gap-6">
            {METALS.map((metal) => (
              <button
                key={metal.id}
                onClick={() => setActiveMetal(metal)}
                className="flex flex-col items-center gap-2.5 group"
              >
                <div
                  className={`w-10 h-10 rounded-full border-2 transition-all duration-300 shadow-lg
                    ${activeMetal.id === metal.id
                      ? 'border-white/60 scale-110 shadow-white/10'
                      : 'border-transparent opacity-40 group-hover:opacity-70 group-hover:scale-105'
                    }`}
                  style={{ backgroundColor: metal.swatch }}
                />
                <span className={`text-[10px] tracking-widest transition-colors ${activeMetal.id === metal.id ? 'text-white/80 font-medium' : 'text-white/30'}`}>
                  {metal.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="h-px bg-white/[0.06]" />

        {/* Diamond Cut */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-[#c8922a]">
            <Gem className="w-3.5 h-3.5" />
            <span>Diamond Cut</span>
          </div>
          <div className="flex gap-2.5">
            {CUTS.map((cut) => (
              <button
                key={cut.id}
                onClick={() => setActiveCut(cut)}
                className={`flex-1 py-2.5 border text-[11px] tracking-[0.18em] uppercase transition-all duration-300
                  ${activeCut.id === cut.id
                    ? 'border-[#c8922a]/70 text-[#c8922a] bg-[#c8922a]/8'
                    : 'border-white/10 text-white/30 hover:border-white/25 hover:text-white/55'
                  }`}
              >
                {cut.name}
              </button>
            ))}
          </div>
        </div>

        <div className="h-px bg-white/[0.06]" />

        {/* 3D Model import */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-[#c8922a]">
            <Box className="w-3.5 h-3.5" />
            <span>3D Model</span>
          </div>

          {glbName ? (
            /* Loaded model pill */
            <div className="flex items-center justify-between gap-3 px-4 py-3 border border-[#c8922a]/40 bg-[#c8922a]/5">
              <div className="flex items-center gap-2.5 min-w-0">
                <Box className="w-3.5 h-3.5 text-[#c8922a] shrink-0" />
                <span className="text-[11px] text-white/65 truncate">{glbName}</span>
              </div>
              <button onClick={clearGlb} className="shrink-0 text-white/25 hover:text-white/60 transition-colors" aria-label="Remove model">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            /* Drop zone */
            <div
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center gap-2 py-5 border border-dashed cursor-pointer transition-all duration-300 select-none
                ${isDragging
                  ? 'border-[#c8922a]/70 bg-[#c8922a]/8 text-[#c8922a]'
                  : 'border-white/12 hover:border-white/28 text-white/25 hover:text-white/45'
                }`}
            >
              <Upload className="w-4 h-4" />
              <p className="text-[11px] tracking-[0.12em] uppercase">Drop GLB / click to browse</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".glb,.gltf"
                className="sr-only"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) loadGlb(f); }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Subtle corner label */}
      <div className="absolute top-5 left-6 z-20 font-serif text-xl tracking-widest uppercase text-white/60 select-none pointer-events-none">
        Aurum &amp; Co.
      </div>
    </div>
  );
}
