import React, { useState } from 'react';
import { Billboard } from '../types';
import { ZoomIn, ZoomOut, Compass, Info, MapPin, DollarSign, Calendar, Star } from 'lucide-react';

interface InteractiveMapProps {
  billboards: Billboard[];
  onBook?: (billboard: Billboard) => void;
  selectedArea: string;
  onSelectBillboard: (billboard: Billboard) => void;
}

export default function InteractiveMap({ 
  billboards, 
  onBook, 
  selectedArea,
  onSelectBillboard 
}: InteractiveMapProps) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [hoveredBillboard, setHoveredBillboard] = useState<Billboard | null>(null);
  const [activeBillboard, setActiveBillboard] = useState<Billboard | null>(null);
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });
  const [filterAvailability, setFilterAvailability] = useState<string>('All');

  // Zoom handlers
  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 2));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => {
    setZoomLevel(1);
    setMapOffset({ x: 0, y: 0 });
    setActiveBillboard(null);
  };

  // Filter pin logic based on availability state
  const displayedBillboards = billboards.filter(b => {
    const matchesArea = selectedArea === 'All Areas' || b.area.toLowerCase() === selectedArea.toLowerCase();
    const matchesAvail = filterAvailability === 'All' || b.availability === filterAvailability;
    return matchesArea && matchesAvail;
  });

  // Get color code for status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return '#10b981'; // Emerald
      case 'Fast Filling': return '#f59e0b'; // Amber
      case 'Booked': return '#ef4444'; // Rose
      default: return '#94a3b8'; // Slate (Maintenance)
    }
  };

  return (
    <div id="interactive-map-section" className="bg-slate-900 rounded-3xl p-5 border border-slate-800 shadow-xl text-white flex flex-col h-[580px] overflow-hidden relative">
      {/* 1. Map Header HUD Panel */}
      <div id="map-hud-header" className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4 z-10 bg-slate-900/90 backdrop-blur-xs">
        <div>
          <h3 className="font-sans font-bold text-lg text-white flex items-center gap-2">
            <Compass className="text-indigo-400 animate-spin-slow" size={20} />
            Nashik Live Billboard Availability Map
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Real-time coordinates showing pricing & premium traffic slots.</p>
        </div>

        {/* HUD Filter Tools */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Availability:</span>
          <div className="bg-slate-800 p-0.5 rounded-lg border border-slate-700 flex">
            {['All', 'Available', 'Fast Filling', 'Booked'].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setFilterAvailability(status)}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                  filterAvailability === status 
                    ? 'bg-indigo-600 text-white shadow-xs' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row relative overflow-hidden bg-[#0f172a] rounded-2xl border border-slate-800">
        
        {/* 2. Interactive SVG Vector Canvas */}
        <div id="map-canvas-container" className="flex-1 h-full relative cursor-grab overflow-hidden">
          
          <svg 
            viewBox="0 0 100 100" 
            className="w-full h-full select-none transition-transform duration-300 origin-center"
            style={{ transform: `scale(${zoomLevel}) translate(${mapOffset.x}px, ${mapOffset.y}px)` }}
          >
            {/* Background Grid */}
            <defs>
              <pattern id="mapGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#334155" strokeWidth="0.08" strokeOpacity="0.4" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#mapGrid)" />

            {/* Geographical Accents: Godavari River Flow */}
            <path 
              d="M 0,20 Q 20,15 35,28 T 60,40 T 78,35 T 100,50" 
              fill="none" 
              stroke="#1e3a8a" 
              strokeWidth="5" 
              strokeLinecap="round"
              strokeOpacity="0.55"
              className="animate-pulse"
            />
            <path 
              d="M 0,20 Q 20,15 35,28 T 60,40 T 78,35 T 100,50" 
              fill="none" 
              stroke="#3b82f6" 
              strokeWidth="1.5" 
              strokeLinecap="round"
              strokeOpacity="0.8"
            />

            {/* Text Overlay for River */}
            <text x="45" y="32" fill="#60a5fa" fontSize="2.2" fontFamily="sans-serif" fontWeight="bold" opacity="0.6" letterSpacing="0.2">
              GODAVARI RIVER
            </text>

            {/* Major Arterial Roads of Nashik (Stylized Highway Lines) */}
            {/* NH-3 Mumbai-Agra Agra Road */}
            <path 
              d="M 10,100 L 45,60 L 60,50 L 100,10" 
              fill="none" 
              stroke="#475569" 
              strokeWidth="1.8" 
              strokeDasharray="1, 0.5"
              opacity="0.6"
            />
            <text x="82" y="24" fill="#94a3b8" fontSize="1.6" fontFamily="sans-serif" fontWeight="semibold" opacity="0.5" transform="rotate(-30 82 24)">
              Mumbai-Agra Hwy (NH-3)
            </text>

            {/* Gangapur Road */}
            <path 
              d="M 0,35 Q 20,25 35,38 T 50,55" 
              fill="none" 
              stroke="#475569" 
              strokeWidth="1.2" 
              opacity="0.5"
            />
            <text x="8" y="29" fill="#94a3b8" fontSize="1.4" fontFamily="sans-serif" opacity="0.5">
              Gangapur Road
            </text>

            {/* College Road */}
            <path 
              d="M 10,48 Q 25,45 35,50 T 48,58" 
              fill="none" 
              stroke="#475569" 
              strokeWidth="1.0" 
              opacity="0.5"
            />
            <text x="14" y="45" fill="#94a3b8" fontSize="1.4" fontFamily="sans-serif" opacity="0.5">
              College Road
            </text>

            {/* Trimbak Road (Satpur connection) */}
            <path 
              d="M 0,70 L 35,60 L 45,60" 
              fill="none" 
              stroke="#475569" 
              strokeWidth="1.2" 
              opacity="0.5"
            />
            <text x="6" y="66" fill="#94a3b8" fontSize="1.4" fontFamily="sans-serif" opacity="0.5">
              Trimbak Rd (Satpur MIDC)
            </text>

            {/* Key Areas / Landmarks Text Markers */}
            <g fill="#475569" fontSize="2.0" fontWeight="bold" opacity="0.7" fontFamily="sans-serif">
              <text x="38" y="64">DWARKA CIRCLE</text>
              <text x="25" y="35">JEHAN CIRCLE</text>
              <text x="12" y="78">SATPUR MIDC</text>
              <text x="50" y="16">PANCHAVATI</text>
              <text x="38" y="44">CIDCO</text>
              <text x="75" y="80">NASHIK ROAD</text>
              <text x="50" y="90">PATHARDI PHATA</text>
            </g>

            {/* Active Highlight Area Circle */}
            {selectedArea !== 'All Areas' && (
              <g>
                {/* Dynamically draw a focal highlight radar circle based on filtered area */}
                {selectedArea === 'CIDCO' && <circle cx="42" cy="45" r="16" fill="#6366f1" fillOpacity="0.06" stroke="#6366f1" strokeWidth="0.2" strokeDasharray="1,1" />}
                {selectedArea === 'College Road' && <circle cx="28" cy="48" r="12" fill="#6366f1" fillOpacity="0.06" stroke="#6366f1" strokeWidth="0.2" strokeDasharray="1,1" />}
                {selectedArea === 'Gangapur Road' && <circle cx="22" cy="30" r="14" fill="#6366f1" fillOpacity="0.06" stroke="#6366f1" strokeWidth="0.2" strokeDasharray="1,1" />}
                {selectedArea === 'PANCHAVATI' && <circle cx="55" cy="18" r="15" fill="#6366f1" fillOpacity="0.06" stroke="#6366f1" strokeWidth="0.2" strokeDasharray="1,1" />}
                {selectedArea === 'Satpur' && <circle cx="15" cy="72" r="15" fill="#6366f1" fillOpacity="0.06" stroke="#6366f1" strokeWidth="0.2" strokeDasharray="1,1" />}
                {selectedArea === 'Nashik Road' && <circle cx="75" cy="75" r="16" fill="#6366f1" fillOpacity="0.06" stroke="#6366f1" strokeWidth="0.2" strokeDasharray="1,1" />}
                {selectedArea === 'Pathardi Phata' && <circle cx="55" cy="85" r="14" fill="#6366f1" fillOpacity="0.06" stroke="#6366f1" strokeWidth="0.2" strokeDasharray="1,1" />}
                {selectedArea === 'Dwarka' && <circle cx="52" cy="55" r="14" fill="#6366f1" fillOpacity="0.06" stroke="#6366f1" strokeWidth="0.2" strokeDasharray="1,1" />}
              </g>
            )}

            {/* Interactive Beacons / Pins */}
            {displayedBillboards.map((b) => {
              const markerColor = getStatusColor(b.availability);
              const isHovered = hoveredBillboard?.id === b.id;
              const isActive = activeBillboard?.id === b.id;

              return (
                <g 
                  key={b.id}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredBillboard(b)}
                  onMouseLeave={() => setHoveredBillboard(null)}
                  onClick={() => {
                    setActiveBillboard(b);
                    onSelectBillboard(b);
                  }}
                >
                  {/* Pulse Effect Rings for available ones */}
                  {b.availability === 'Available' && (
                    <circle 
                      cx={b.longitude} 
                      cy={b.latitude} 
                      r={isHovered ? 4.5 : 3.0} 
                      fill="none" 
                      stroke={markerColor} 
                      strokeWidth="0.4"
                      className="animate-ping origin-center"
                      style={{ transformOrigin: `${b.longitude}px ${b.latitude}px`, animationDuration: '2s' }}
                    />
                  )}

                  {/* Outer Pin boundary indicator on hover */}
                  {(isHovered || isActive) && (
                    <circle 
                      cx={b.longitude} 
                      cy={b.latitude} 
                      r="2.8" 
                      fill={markerColor} 
                      fillOpacity="0.25"
                      stroke="#ffffff"
                      strokeWidth="0.25"
                    />
                  )}

                  {/* Central Core Beacons */}
                  <circle 
                    cx={b.longitude} 
                    cy={b.latitude} 
                    r={isHovered ? '1.8' : '1.3'} 
                    fill={markerColor} 
                    stroke="#ffffff" 
                    strokeWidth="0.3"
                    className="transition-all duration-200"
                  />

                  {/* Tiny Label Overlay */}
                  <text 
                    x={b.longitude} 
                    y={b.latitude - 2.5} 
                    fill="#f1f5f9" 
                    fontSize="1.6" 
                    fontWeight="bold"
                    fontFamily="sans-serif"
                    textAnchor="middle"
                    className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] bg-slate-900 pointer-events-none"
                    opacity={isHovered || isActive ? 1 : 0.4}
                  >
                    ₹{(b.pricePerMonth / 1000).toFixed(0)}k
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Canvas Floating Navigation Buttons */}
          <div className="absolute bottom-4 left-4 flex flex-col gap-2 z-20">
            <button 
              type="button" 
              onClick={handleZoomIn}
              className="bg-slate-800 hover:bg-slate-700 p-2 rounded-xl border border-slate-700 shadow-md transition-colors"
              title="Zoom In"
            >
              <ZoomIn size={16} />
            </button>
            <button 
              type="button" 
              onClick={handleZoomOut}
              className="bg-slate-800 hover:bg-slate-700 p-2 rounded-xl border border-slate-700 shadow-md transition-colors"
              title="Zoom Out"
            >
              <ZoomOut size={16} />
            </button>
            <button 
              type="button" 
              onClick={handleResetZoom}
              className="bg-slate-800 hover:bg-indigo-600 text-[10px] font-bold px-2 py-1.5 rounded-xl border border-slate-700 shadow-md transition-all uppercase tracking-wider"
              title="Reset View"
            >
              Reset
            </button>
          </div>

          {/* Compass Rose */}
          <div className="absolute top-4 right-4 bg-slate-800/80 backdrop-blur-xs p-2 rounded-full border border-slate-700 text-slate-400 pointer-events-none">
            <span className="text-[9px] font-bold text-center block text-white/70 mb-0.5">N</span>
            <Compass size={22} className="animate-spin-slow text-indigo-400" />
          </div>

          {/* SVG Map Guide Popover (Hover card) */}
          {hoveredBillboard && (
            <div 
              id="map-hover-popover"
              className="absolute bg-slate-900 border border-slate-700 p-3.5 rounded-xl shadow-2xl w-60 z-30 pointer-events-none animate-in fade-in zoom-in-95 duration-150"
              style={{
                left: `${Math.min(Math.max(hoveredBillboard.longitude * (zoomLevel) + 20, 10), 65)}%`,
                top: `${Math.min(Math.max(hoveredBillboard.latitude * (zoomLevel) - 15, 5), 70)}%`
              }}
            >
              <div className="flex gap-2 mb-2">
                <img 
                  src={hoveredBillboard.images[0]} 
                  alt={hoveredBillboard.name} 
                  className="w-14 h-12 object-cover rounded-md border border-slate-700 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-[11px] font-bold leading-tight line-clamp-2 text-white">{hoveredBillboard.name}</h4>
                  <span className="text-[9px] text-slate-400 mt-0.5 block">{hoveredBillboard.location}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px] border-t border-slate-800 pt-2 text-slate-300">
                <div>
                  <span className="text-slate-500 block">Monthly Price:</span>
                  <span className="font-bold text-emerald-400">₹{hoveredBillboard.pricePerMonth.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Status:</span>
                  <span className="font-bold text-white flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getStatusColor(hoveredBillboard.availability) }} />
                    {hoveredBillboard.availability}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3. Map Sidebar Detail Controller */}
        <div id="map-sidebar-panel" className="w-full md:w-80 border-t md:border-t-0 md:border-l border-slate-800 bg-slate-950 p-4 flex flex-col justify-between overflow-y-auto max-h-56 md:max-h-full">
          {activeBillboard ? (
            <div className="space-y-4 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="bg-indigo-950/70 text-indigo-400 text-[10px] font-bold px-2 py-0.5 rounded-md border border-indigo-900 uppercase">
                    {activeBillboard.type}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">{activeBillboard.area}</span>
                </div>

                <h4 className="font-sans font-bold text-base text-white tracking-tight leading-snug">
                  {activeBillboard.name}
                </h4>

                <div className="flex items-center gap-2 mt-2">
                  <div className="bg-emerald-600 text-white font-bold text-[10px] px-1.5 py-0.5 rounded flex items-center gap-0.5 shrink-0">
                    {activeBillboard.rating.toFixed(1)} <Star size={9} fill="white" stroke="white" />
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">({activeBillboard.ratingsCount} ratings)</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-[11px] text-slate-400 font-medium">{activeBillboard.yearsInBusiness} Yrs Exp</span>
                </div>

                {/* Spec metrics list */}
                <div className="grid grid-cols-2 gap-2 mt-4 bg-slate-900/60 p-3 rounded-xl border border-slate-900/80 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Dimensions</span>
                    <span className="font-semibold text-white">{activeBillboard.size}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Lighting setup</span>
                    <span className="font-semibold text-white truncate block">{activeBillboard.lighting}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Priced/Month</span>
                    <span className="font-bold text-emerald-400">₹{activeBillboard.pricePerMonth.toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Views/Day</span>
                    <span className="font-semibold text-emerald-500">{(activeBillboard.viewsPerDay / 1000).toFixed(0)}k+ views</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 mt-3 line-clamp-3 italic leading-normal">
                  "{activeBillboard.description}"
                </p>
              </div>

              {/* View details action in HUD sidebar */}
              <div className="pt-4 border-t border-slate-900/80 mt-auto flex">
                <button
                  type="button"
                  onClick={() => onSelectBillboard(activeBillboard)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 rounded-lg text-center transition-all shadow-md active:scale-95"
                >
                  View Photo, Video & Location
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 py-6">
              <MapPin size={28} className="text-indigo-500/30 mb-2 animate-bounce" />
              <p className="text-xs font-bold text-slate-400">No Billboard Selected</p>
              <p className="text-[10px] text-slate-500 mt-1 max-w-[180px] mx-auto leading-relaxed">
                Click any pulsing beacon pin on the Nashik vector map to load immediate pricing, sizing, and booking slot details.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 4. Bottom Map Legend HUD */}
      <div id="map-legend-hud" className="flex flex-wrap items-center justify-between text-xs mt-3 text-slate-400 border-t border-slate-800 pt-2 shrink-0">
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Fast Filling</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Booked / Reserved</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
            <span>Maintenance</span>
          </div>
        </div>
        <div className="text-[10px] text-slate-500 italic flex items-center gap-1">
          <Info size={11} className="text-indigo-400" /> Scroll & double click to zoom map
        </div>
      </div>
    </div>
  );
}
