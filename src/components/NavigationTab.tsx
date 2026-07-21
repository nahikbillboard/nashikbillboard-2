import React, { useState, useEffect } from 'react';
import { Billboard } from '../types';
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Milestone, 
  Car, 
  AlertTriangle, 
  TrendingUp, 
  Eye, 
  Sparkles, 
  Volume2, 
  CheckCircle 
} from 'lucide-react';

interface NavigationTabProps {
  billboards: Billboard[];
  defaultSelected?: Billboard | null;
  activeBookingCreative?: { text?: string, url?: string } | null;
}

const STARTING_POINTS = [
  { name: 'Dwarka Circle (Hwy Hub)', desc: 'Mumbai-Agra Highway bypass junction' },
  { name: 'Panchavati Kalaram Mandir', desc: 'Old Nashik spiritual & cultural sector' },
  { name: 'Nashik Road Railway Station', desc: 'Southeastern transit terminal' },
  { name: 'Trimbak Road Naka (Satpur)', desc: 'Western industrial boundary' },
  { name: 'Mumbai Naka Flyover', desc: 'Central arterial bridge interchange' }
];

export default function NavigationTab({ billboards, defaultSelected, activeBookingCreative }: NavigationTabProps) {
  const [selectedStart, setSelectedStart] = useState(STARTING_POINTS[0].name);
  const [selectedBillboardId, setSelectedBillboardId] = useState<string>('');
  
  // Navigation simulation state
  const [isNavigating, setIsNavigating] = useState(false);
  const [navProgress, setNavProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [voiceAlert, setVoiceAlert] = useState('Select starting point and billboard to start GPS simulation.');

  // Selected billboard ref
  const selectedBillboard = billboards.find(b => b.id === selectedBillboardId) || billboards[0];

  useEffect(() => {
    if (defaultSelected) {
      setSelectedBillboardId(defaultSelected.id);
    } else if (billboards.length > 0 && !selectedBillboardId) {
      setSelectedBillboardId(billboards[0].id);
    }
  }, [defaultSelected, billboards]);

  // Generate directions based on start -> end combination
  const getDirections = () => {
    if (!selectedBillboard) return [];
    
    const steps = [
      `Depart from ${selectedStart}. Recalculating optimum traffic path...`,
      'Merge onto main arterial highway and keep right towards the upcoming intersection.',
      `Turn slightly left onto road leading to ${selectedBillboard.area}. Speed limit: 50 km/h.`,
      `APPROACHING PHYSICAL SITE: Look straight ahead. Your target billboard "${selectedBillboard.name}" is visible on your left.`
    ];
    return steps;
  };

  const steps = getDirections();

  // Route specs
  const getRouteSpecs = () => {
    // Generate semi-random deterministic metrics
    const hash = (selectedStart.length + selectedBillboard.name.length) % 5;
    const distance = (3.5 + hash * 1.8).toFixed(1);
    const duration = Math.round(5 + hash * 3);
    const trafficStates = ['Free Flowing', 'Moderate Traffic', 'Heavy Congestion', 'Free Flowing', 'Moderate Traffic'];
    const currentTraffic = trafficStates[hash];
    
    return { distance, duration, traffic: currentTraffic };
  };

  const routeSpecs = getRouteSpecs();

  // Navigation Drive Simulator loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isNavigating) {
      setNavProgress(0);
      setCurrentStepIndex(0);
      setVoiceAlert('GPS Navigation Initiated. Drive safely and keep eyes on the road.');

      interval = setInterval(() => {
        setNavProgress(prev => {
          const next = prev + 5;
          if (next >= 100) {
            setIsNavigating(false);
            setCurrentStepIndex(steps.length - 1);
            setVoiceAlert('Destination arrived. Your active campaign billboard is clearly visible in high-contrast.');
            clearInterval(interval);
            return 100;
          }
          
          // Step transition timing
          const progressStep = Math.floor((next / 100) * steps.length);
          if (progressStep !== currentStepIndex && progressStep < steps.length) {
            setCurrentStepIndex(progressStep);
            
            // Generate vocal navigation log text
            if (progressStep === 1) setVoiceAlert('In 800 meters, take the flyover bypass.');
            else if (progressStep === 2) setVoiceAlert(`Turn left. Entering ${selectedBillboard.area} high-visibility zone.`);
            else if (progressStep === 3) setVoiceAlert(`Look ahead. Spotting "${selectedBillboard.name}". High daily views active!`);
          }
          
          return next;
        });
      }, 350); // 7 seconds total drive
    }
    return () => clearInterval(interval);
  }, [isNavigating, selectedStart, selectedBillboardId]);

  return (
    <div id="navigation-tab-container" className="bg-white rounded-3xl p-6 border border-gray-150 shadow-sm flex flex-col lg:flex-row gap-6 animate-in fade-in duration-200">
      
      {/* Left side: Route configuration and metrics panel */}
      <div id="nav-controls-panel" className="w-full lg:w-5/12 flex flex-col justify-between space-y-6">
        <div className="space-y-4">
          <div>
            <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
              Route Simulation
            </span>
            <h3 className="font-sans font-bold text-2xl text-gray-900 tracking-tight mt-2">
              Billboard Sight Navigation
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Select any billboard to simulate a real driver's route, calculate drive times, and pre-visualize your campaign on-street!
            </p>
          </div>

          {/* Router Settings Card */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-gray-100 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                <MapPin size={13} className="text-gray-400" /> Start Coordinate Hub
              </label>
              <select
                value={selectedStart}
                onChange={(e) => setSelectedStart(e.target.value)}
                disabled={isNavigating}
                className="w-full text-xs border border-gray-200 bg-white rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
              >
                {STARTING_POINTS.map((pt, i) => (
                  <option key={i} value={pt.name}>
                    {pt.name}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-gray-400 mt-1 pl-1">
                {STARTING_POINTS.find(p => p.name === selectedStart)?.desc}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                <Navigation size={13} className="text-gray-400" /> Destination Billboard Site
              </label>
              <select
                value={selectedBillboardId}
                onChange={(e) => setSelectedBillboardId(e.target.value)}
                disabled={isNavigating}
                className="w-full text-xs border border-gray-200 bg-white rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
              >
                {billboards.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.area})
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-gray-400 mt-1 pl-1 italic">
                Priced at ₹{selectedBillboard?.pricePerMonth.toLocaleString('en-IN')}/mo • {selectedBillboard?.size}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsNavigating(true)}
              disabled={isNavigating || !selectedBillboard}
              className={`w-full font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all ${
                isNavigating 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none border border-slate-200' 
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95'
              }`}
            >
              <Car size={15} className={isNavigating ? 'animate-bounce' : ''} />
              <span>{isNavigating ? 'Simulating Drive Route...' : 'Initiate Drive Navigation'}</span>
            </button>
          </div>

          {/* Telematics HUD details */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-slate-50 p-3 rounded-xl border border-gray-100 text-center">
              <Clock size={16} className="text-indigo-600 mx-auto mb-1.5" />
              <span className="text-[9px] text-gray-400 block font-bold uppercase tracking-wider">Est. Time</span>
              <span className="text-sm font-bold text-gray-900">{isNavigating ? Math.max(1, Math.round(routeSpecs.duration * (1 - navProgress/100))) : routeSpecs.duration} min</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-gray-100 text-center">
              <Milestone size={16} className="text-indigo-600 mx-auto mb-1.5" />
              <span className="text-[9px] text-gray-400 block font-bold uppercase tracking-wider">Distance</span>
              <span className="text-sm font-bold text-gray-900">{routeSpecs.distance} km</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-gray-100 text-center">
              <TrendingUp size={16} className="text-indigo-600 mx-auto mb-1.5" />
              <span className="text-[9px] text-gray-400 block font-bold uppercase tracking-wider">Traffic</span>
              <span className={`text-xs font-bold block mt-0.5 ${
                routeSpecs.traffic === 'Heavy Congestion' ? 'text-red-500' :
                routeSpecs.traffic === 'Moderate Traffic' ? 'text-amber-500' :
                'text-emerald-500'
              }`}>{routeSpecs.traffic}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Navigation Voice HUD panel */}
        <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl space-y-2.5 shadow-md">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
            <Volume2 size={15} className="animate-pulse" />
            <span>GPS VOICE ASSISTANCE CO-PILOT</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-mono">
            {voiceAlert}
          </p>
          
          {/* Progress drive bar */}
          {isNavigating && (
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
              <div 
                className="bg-indigo-500 h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${navProgress}%` }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Right side: Driving pre-visualization wind shield panel */}
      <div id="nav-preview-canvas" className="flex-1 flex flex-col space-y-3">
        <div className="flex justify-between items-center px-1">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <Eye size={13} className="text-indigo-500" /> Driver Windshield Pre-Visualization HUD
          </h4>
          <span className="text-[10px] text-indigo-600 font-semibold flex items-center gap-1">
            <CheckCircle size={10} /> Live Rendering
          </span>
        </div>

        {/* The windshield landscape mockup */}
        <div className="relative h-64 sm:h-80 bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-lg group">
          {/* Background street scene */}
          <img 
            src="https://images.unsplash.com/photo-1541535650810-10d26f5c2ab3?auto=format&fit=crop&w=1200&q=80" 
            alt="street scene" 
            className="w-full h-full object-cover brightness-[0.7] group-hover:scale-[1.01] transition-transform duration-700"
            referrerPolicy="no-referrer"
          />

          {/* Steer wheel and driver dashboard overlay */}
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent pointer-events-none flex items-end justify-center p-4">
            {/* Steering Wheel graphic mockup inside windshield */}
            <div className="w-44 h-20 rounded-t-full border-8 border-slate-800/95 shadow-inner opacity-80 flex items-center justify-center relative translate-y-8">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 text-[8px] font-bold text-slate-400 px-2 py-1 rounded border border-slate-700 shadow-md">
                GPS COMMUTE
              </div>
            </div>
          </div>

          {/* The Actual Physical Billboard Hoarding on the side of the road */}
          {/* Coordinates positioned carefully to overlay perfectly onto the billboard hoarding in the unsplash image */}
          <div 
            id="simulated-on-street-billboard"
            className="absolute top-[22%] right-[12%] w-[38%] h-[32%] bg-white/95 border-4 border-slate-800 shadow-xl overflow-hidden flex flex-col justify-center items-center p-2 text-center origin-center transition-all duration-300"
            style={{
              transform: isNavigating 
                ? `perspective(400px) rotateY(-18deg) scale(${1.0 + (navProgress / 100) * 0.25})`
                : 'perspective(400px) rotateY(-18deg)',
              boxShadow: '0 15px 30px rgba(0,0,0,0.5)'
            }}
          >
            {/* Real Campaign Design Rendered on street! */}
            {activeBookingCreative?.url ? (
              <img 
                src={activeBookingCreative.url} 
                alt="campaign creative mockup" 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex flex-col justify-between items-center h-full w-full bg-indigo-900 text-white p-2 relative">
                {/* Visual grid lines for alignment */}
                <div className="absolute inset-0 border border-white/10 pointer-events-none" />
                
                <div className="w-full text-right">
                  <span className="text-[7px] font-bold uppercase tracking-widest text-indigo-300">
                    {selectedBillboard?.agency}
                  </span>
                </div>

                <div className="my-auto space-y-1 z-10">
                  <h5 className="text-[11px] sm:text-[13px] font-black tracking-tight leading-none uppercase max-w-[140px] truncate text-center text-amber-300">
                    {activeBookingCreative?.text || 'SAI GARMENTS'}
                  </h5>
                  <p className="text-[6px] text-white/85 font-semibold font-mono tracking-wide leading-none uppercase">
                    {selectedBillboard?.location || 'CIDCO, NASHIK'}
                  </p>
                </div>

                <div className="w-full flex justify-between items-end border-t border-white/20 pt-1">
                  <span className="text-[5px] text-indigo-300 font-bold uppercase tracking-wider">Premium Hoarding</span>
                  <span className="text-[6px] font-black text-emerald-400 uppercase tracking-widest">Active Ad</span>
                </div>
              </div>
            )}
          </div>

          {/* Windshield navigation directions widget (top-left) */}
          <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-xs border border-slate-700/80 p-3 rounded-xl max-w-[240px] shadow-lg">
            <div className="flex gap-2.5 items-start">
              <div className="bg-indigo-600 text-white p-1.5 rounded-lg mt-0.5 animate-pulse">
                <Navigation size={14} className="rotate-45" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-300">CURRENT MANEUVER</p>
                <p className="text-xs font-bold text-white leading-tight mt-0.5">
                  {isNavigating ? steps[currentStepIndex] : `Planning route from ${selectedStart}...`}
                </p>
                {isNavigating && (
                  <p className="text-[9px] text-indigo-400 font-semibold mt-1">
                    Route progress: {navProgress}%
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Speedometer indicator widget (bottom-left) */}
          <div className="absolute bottom-4 left-4 bg-slate-900/85 backdrop-blur-xs border border-slate-800 p-2 rounded-xl flex items-center gap-2">
            <div className="text-right">
              <span className="text-[7px] font-bold text-slate-500 block">GPS SPEED</span>
              <span className="text-sm font-mono font-bold text-white">{isNavigating ? '42' : '0'}</span>
              <span className="text-[8px] text-slate-400 font-bold"> km/h</span>
            </div>
          </div>
        </div>

        {/* Quick simulation details text */}
        <div className="bg-indigo-50 border border-indigo-100 p-3.5 rounded-xl text-xs text-indigo-800 flex gap-2.5">
          <Sparkles size={16} className="text-indigo-600 shrink-0 mt-0.5" />
          <p className="leading-normal font-medium">
            <strong>Ad Pre-Visualization Engine:</strong> Your custom uploaded poster or campaign banner text is live-rendered above. Change your draft slogan in the booking slot modal or switch billboards to watch standard on-street visibility scale in real-time.
          </p>
        </div>
      </div>

    </div>
  );
}
