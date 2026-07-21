import React, { useState, useEffect, useMemo } from 'react';
import { Billboard, Booking, Inquiry } from './types';
import { NASHIK_BILLBOARDS, NASHIK_AREAS } from './data/billboards';
import DirectoryListings from './components/DirectoryListings';
import InteractiveMap from './components/InteractiveMap';
import BookingModal from './components/BookingModal';
import NavigationTab from './components/NavigationTab';
import BillboardDetail from './components/BillboardDetail';
import { 
  Building2, 
  Compass, 
  Navigation, 
  CalendarCheck, 
  PlusCircle, 
  Search, 
  MapPin, 
  IndianRupee, 
  Sparkles, 
  CheckCircle, 
  Volume2, 
  Clock, 
  User, 
  Info, 
  CloudSun,
  FileText,
  Briefcase,
  Menu,
  X
} from 'lucide-react';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'directory' | 'map' | 'navigation' | 'bookings' | 'owner-hub'>('directory');
  
  // App Data State (Synchronized across components)
  const [billboards, setBillboards] = useState<Billboard[]>(NASHIK_BILLBOARDS);
  const [bookings, setBookings] = useState<Booking[]>([
    // Initial seeded booking for high fidelity
    {
      id: 'bk-preset1',
      billboardId: 'b3',
      billboardName: 'Apex Outdoor Media & Hoardings',
      billboardImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
      agencyName: 'Apex Group',
      advertiserName: 'Sai Clipping Advertising',
      advertiserPhone: '+91 98220 11223',
      advertiserEmail: 'saiclipping1@gmail.com',
      startDate: '2026-08-01',
      endDate: '2026-08-31',
      creativeText: 'SAI CLIPPING - LEADING OUTDOOR CAMPAIGN BRANDING',
      totalPrice: 64900, // includes 18% GST
      status: 'Confirmed',
      createdAt: '2026-07-20T10:00:00.000Z',
      paymentStatus: 'Paid'
    }
  ]);
  
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  // Filtering States
  const [selectedArea, setSelectedArea] = useState<string>('All Areas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchOpen, setSearchOpen] = useState<boolean>(false);

  // Drawer & Advanced Filter States
  const [menuOpen, setMenuOpen] = useState(false);
  const [filterBillboardType, setFilterBillboardType] = useState<string>('All');
  const [filterLighting, setFilterLighting] = useState<string>('All');
  const [filterAvailability, setFilterAvailability] = useState<string>('All');
  const [sortByPrice, setSortByPrice] = useState<string>('');

  // Dynamic pre-filtering of billboards array based on Advanced Drawer Filters
  const filteredAndSortedBillboards = useMemo(() => {
    let result = [...billboards];

    // Filter by type
    if (filterBillboardType !== 'All') {
      result = result.filter(b => b.type === filterBillboardType);
    }

    // Filter by lighting
    if (filterLighting !== 'All') {
      result = result.filter(b => b.lighting === filterLighting);
    }

    // Filter by availability
    if (filterAvailability !== 'All') {
      result = result.filter(b => b.availability === filterAvailability);
    }

    // Sort by price per month
    if (sortByPrice === 'low-to-high') {
      result.sort((a, b) => a.pricePerMonth - b.pricePerMonth);
    } else if (sortByPrice === 'high-to-low') {
      result.sort((a, b) => b.pricePerMonth - a.pricePerMonth);
    }

    return result;
  }, [billboards, filterBillboardType, filterLighting, filterAvailability, sortByPrice]);

  // Booking Modal State
  const [selectedBillboardForBooking, setSelectedBillboardForBooking] = useState<Billboard | null>(null);
  
  // Target Billboard for Direct Navigation shortcut
  const [navigationTargetBillboard, setNavigationTargetBillboard] = useState<Billboard | null>(null);

  // Success Notification state
  const [successBooking, setSuccessBooking] = useState<Booking | null>(null);
  const [showEnquirySuccess, setShowEnquirySuccess] = useState<string | null>(null);
  const [selectedBillboardId, setSelectedBillboardId] = useState<string | null>(null);

  // Live Nashik Clock state
  const [currentTime, setCurrentTime] = useState<string>('');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Media Owner Hub Form state (for adding custom billboards)
  const [newB_Name, setNewB_Name] = useState('');
  const [newB_Agency, setNewB_Agency] = useState('');
  const [newB_Location, setNewB_Location] = useState('');
  const [newB_Area, setNewB_Area] = useState('CIDCO');
  const [newB_Size, setNewB_Size] = useState('40ft x 20ft');
  const [newB_Price, setNewB_Price] = useState('40000');
  const [newB_Type, setNewB_Type] = useState<'Digital LED' | 'Classic Hoarding' | 'Unipole' | 'Gantry' | 'Bus Shelter'>('Classic Hoarding');
  const [newB_Lighting, setNewB_Lighting] = useState<'Lit (Front-lit)' | 'Lit (Back-lit)' | 'Non-Lit' | 'LED Digital Display'>('Lit (Front-lit)');
  const [newB_Desc, setNewB_Desc] = useState('');

  // Instant booking helper
  const handleOpenBookingModal = (billboard: Billboard) => {
    setSelectedBillboardForBooking(billboard);
  };

  const handleCloseBookingModal = () => {
    setSelectedBillboardForBooking(null);
  };

  // Submit Booking Callback (propagated from booking modal)
  const handleBookingSubmit = (newBooking: Booking) => {
    // 1. Add to booking list
    setBookings(prev => [newBooking, ...prev]);

    // 2. Mark corresponding billboard as booked (Real-time update!)
    setBillboards(prev => prev.map(b => {
      if (b.id === newBooking.billboardId) {
        return {
          ...b,
          availability: 'Booked',
          availableFrom: newBooking.endDate
        };
      }
      return b;
    }));

    // 3. Close Modal and trigger success slip
    setSelectedBillboardForBooking(null);
    setSuccessBooking(newBooking);

    // Auto-scroll to top to see success confirmation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Quick Enquiry Form callback
  const handleSendEnquiry = (billboard: Billboard) => {
    const nameInput = prompt('Enter your Company or Name for Enquiry:');
    if (!nameInput) return;
    const phoneInput = prompt('Enter your Contact Number:');
    if (!phoneInput) return;

    const newInquiry: Inquiry = {
      id: 'enq-' + Math.random().toString(36).substr(2, 9),
      billboardId: billboard.id,
      billboardName: billboard.name,
      agencyName: billboard.agency,
      name: nameInput,
      phone: phoneInput,
      message: `Enquired about billboard slot ${billboard.name} in area ${billboard.area}. Pre-approved.`,
      createdAt: new Date().toISOString()
    };

    setInquiries(prev => [newInquiry, ...prev]);
    setShowEnquirySuccess(billboard.name);
    setTimeout(() => setShowEnquirySuccess(null), 4000);
  };

  // Media Owner Hub Actions
  const handleToggleAvailability = (id: string, currentVal: string) => {
    const nextStates: Record<string, 'Available' | 'Fast Filling' | 'Booked' | 'Under Maintenance'> = {
      'Available': 'Fast Filling',
      'Fast Filling': 'Booked',
      'Booked': 'Under Maintenance',
      'Under Maintenance': 'Available'
    };
    
    setBillboards(prev => prev.map(b => {
      if (b.id === id) {
        return { ...b, availability: nextStates[currentVal] };
      }
      return b;
    }));
  };

  const handleUpdatePrice = (id: string, newRate: number) => {
    if (!newRate || isNaN(newRate)) return;
    setBillboards(prev => prev.map(b => {
      if (b.id === id) {
        return { 
          ...b, 
          pricePerMonth: newRate,
          pricePerWeek: Math.round(newRate * 0.28)
        };
      }
      return b;
    }));
  };

  const handleAddNewBillboard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newB_Name || !newB_Location) {
      alert('Please fill out Name and Location fields.');
      return;
    }

    // Generate random coordinates inside our SVG coordinate space (keeping within 15-85 range so it's fully viewable)
    const randomLat = Math.floor(Math.random() * 60) + 20;
    const randomLong = Math.floor(Math.random() * 60) + 20;

    const newB: Billboard = {
      id: 'b-custom-' + Math.random().toString(36).substr(2, 5),
      name: newB_Name,
      agency: newB_Agency || 'Local Nashik Agency',
      location: newB_Location,
      area: newB_Area,
      rating: 4.0,
      ratingsCount: 0,
      yearsInBusiness: 1,
      category: ['Outdoor Services', 'Newly Added Billboard'],
      images: [
        'https://images.unsplash.com/photo-1541535650810-10d26f5c2ab3?auto=format&fit=crop&w=800&q=80'
      ],
      size: newB_Size,
      type: newB_Type,
      pricePerMonth: parseInt(newB_Price) || 35000,
      pricePerWeek: Math.round((parseInt(newB_Price) || 35000) * 0.28),
      viewsPerDay: Math.floor(Math.random() * 50000) + 40000,
      availability: 'Available',
      availableFrom: 'Instant',
      latitude: randomLat,
      longitude: randomLong,
      lighting: newB_Lighting,
      phone: '+91 94222 00333',
      whatsapp: '919422200333',
      claimed: true,
      isTopSearch: false,
      description: `${newB_Name} located on-street at ${newB_Location}, serving local advertisers in Nashik.`
    };

    setBillboards(prev => [newB, ...prev]);
    
    // Reset Form fields
    setNewB_Name('');
    setNewB_Agency('');
    setNewB_Location('');
    setNewB_Desc('');
    
    alert(`Success! "${newB_Name}" has been successfully plotted onto the Nashik Live Map & listed in the Directory.`);
    setActiveTab('directory');
  };

  // Action: Launch drive navigation direct from Listing Card
  const handleLaunchNavigation = (billboard: Billboard) => {
    setNavigationTargetBillboard(billboard);
    setActiveTab('navigation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="app-root-container" className="min-h-screen bg-slate-50 text-gray-800 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      
      {/* 1. APP HEADER BAR (Justdial / Modern HUD hybrid look) */}
      <header id="app-main-header" className="bg-white border-b border-gray-150 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          
          {/* Left Side: 3-line Menu Button + Logo */}
          <div className="flex items-center gap-3 shrink-0">
            {/* 3 lines menu button */}
            <button
              id="menu-toggle-button"
              type="button"
              onClick={() => setMenuOpen(true)}
              className="p-2 -ml-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-slate-100 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              aria-label="Open Filter Drawer"
            >
              <Menu size={24} />
            </button>

            {/* Logo Brand Title */}
            <div className="flex items-center">
              <img 
                src="https://lh3.googleusercontent.com/d/1xZvEvejzlcEV1ciWd2xpgJAWVuuWdLqq"
                alt="Brand Logo"
                className="h-10 sm:h-12 w-auto object-contain max-w-[180px] sm:max-w-[240px]"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Search Toggle Icon Button directly to the right of the logo */}
          <div id="header-search-container" className="flex-1 flex items-center justify-start">
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2.5 rounded-full border border-indigo-100 bg-indigo-50/45 text-indigo-600 hover:bg-indigo-50/80 hover:scale-105 active:scale-95 transition-all flex items-center justify-center shadow-3xs relative"
              title="Search Billboards"
              aria-label="Toggle Search Box"
            >
              <Search size={18} className="stroke-[2.5]" />
              {searchQuery && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-600 rounded-full border border-white" />
              )}
            </button>

            {/* Quick search query info badge next to search icon for instant visibility */}
            {searchQuery && (
              <span className="ml-2.5 hidden md:inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full border border-indigo-100">
                <span>🔍 "{searchQuery}"</span>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="hover:text-red-500 text-[10px] font-sans font-black"
                >
                  ✕
                </button>
              </span>
            )}
          </div>

          {/* Quick tab shortcuts for desktop screens */}
          <div className="hidden lg:flex items-center gap-1.5 shrink-0">
            {[
              { id: 'directory', label: 'Directory' },
              { id: 'map', label: 'Live Map' },
              { id: 'bookings', label: 'Bookings' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`text-xs px-3.5 py-1.5 rounded-full font-bold transition-all ${
                  activeTab === t.id 
                    ? 'bg-indigo-900 text-white shadow-xs' 
                    : 'text-gray-600 hover:bg-slate-100 hover:text-gray-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

        </div>
      </header>

      {/* FLOATING SEARCH BAR OVERLAY */}
      {searchOpen && (
        <div 
          id="floating-search-overlay" 
          className="fixed inset-x-0 top-[65px] sm:top-[73px] z-40 bg-white/95 backdrop-blur-md shadow-lg border-b border-indigo-100 animate-in slide-in-from-top duration-300 ease-out"
        >
          <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-600" size={18} />
              <input 
                type="text"
                autoFocus
                placeholder="Search by landmark, area road, size, agency or brand..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs sm:text-sm border border-indigo-150 rounded-full pl-11 pr-10 py-2.5 bg-slate-50/50 outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-500 focus:bg-white transition-all placeholder:text-gray-400"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold"
                >
                  Clear
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="text-xs font-extrabold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-4 py-2.5 rounded-full transition-colors shrink-0"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* FILTER DRAWER / SIDEBAR MENU OVERLAY */}
      {menuOpen && (
        <div id="filter-drawer-overlay" className="fixed inset-0 z-50 flex justify-start animate-in fade-in duration-200">
          {/* Backdrop */}
          <div 
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" 
          />

          {/* Drawer content panel */}
          <div className="relative w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-300 z-10">
            {/* Drawer Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-indigo-900 text-white">
              <div className="flex items-center gap-2">
                <Compass className="animate-spin-slow text-indigo-200" size={18} />
                <h3 className="font-sans font-black text-base tracking-tight">Filters & Navigation</h3>
              </div>
              <button 
                type="button"
                onClick={() => setMenuOpen(false)}
                className="p-1.5 rounded-lg bg-indigo-800 text-indigo-100 hover:text-white hover:bg-indigo-700 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Drawer Body - Scrollable */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              
              {/* Location Area Filter */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Nashik Area Selection</h4>
                <div className="grid grid-cols-2 gap-1.5">
                  {NASHIK_AREAS.map((area) => (
                    <button
                      key={area}
                      onClick={() => {
                        setSelectedArea(area);
                        setMenuOpen(false);
                      }}
                      className={`text-left text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border transition-all ${
                        selectedArea === area 
                          ? 'bg-indigo-900 border-indigo-900 text-white' 
                          : 'bg-slate-50 border-gray-150 text-gray-600 hover:bg-slate-100'
                      }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>

              {/* Billboard Type Filter */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Billboard Format</h4>
                <select
                  value={filterBillboardType}
                  onChange={(e) => setFilterBillboardType(e.target.value)}
                  className="w-full text-xs border border-gray-200 bg-white rounded-lg px-2.5 py-2 outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="All">All Formats</option>
                  <option value="Classic Hoarding">Classic Hoarding</option>
                  <option value="Digital LED">Digital LED</option>
                  <option value="Unipole">Unipole</option>
                  <option value="Gantry">Gantry</option>
                  <option value="Bus Shelter">Bus Shelter</option>
                </select>
              </div>

              {/* Lighting Technology Filter */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Lighting Technology</h4>
                <select
                  value={filterLighting}
                  onChange={(e) => setFilterLighting(e.target.value)}
                  className="w-full text-xs border border-gray-200 bg-white rounded-lg px-2.5 py-2 outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="All">All Lighting Options</option>
                  <option value="Lit (Front-lit)">Lit (Front-lit)</option>
                  <option value="Lit (Back-lit)">Lit (Back-lit)</option>
                  <option value="Non-Lit">Non-Lit</option>
                  <option value="LED Digital Display">LED Digital Display</option>
                </select>
              </div>

              {/* Campaign Availability Status Filter */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Availability Status</h4>
                <div className="flex flex-wrap gap-1.5">
                  {['All', 'Available', 'Fast Filling', 'Booked', 'Under Maintenance'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilterAvailability(status)}
                      className={`text-[10px] font-bold px-2 py-1 rounded border transition-all ${
                        filterAvailability === status
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'bg-slate-50 border-gray-150 text-gray-600 hover:bg-slate-100'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rent Price Sorter */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Sort by Rent Rate</h4>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => setSortByPrice(sortByPrice === 'low-to-high' ? '' : 'low-to-high')}
                    className={`text-[11px] font-bold py-1.5 px-2 rounded-lg border transition-all ${
                      sortByPrice === 'low-to-high'
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'bg-slate-50 border-gray-150 text-gray-500'
                    }`}
                  >
                    📈 Low to High
                  </button>
                  <button
                    onClick={() => setSortByPrice(sortByPrice === 'high-to-low' ? '' : 'high-to-low')}
                    className={`text-[11px] font-bold py-1.5 px-2 rounded-lg border transition-all ${
                      sortByPrice === 'high-to-low'
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'bg-slate-50 border-gray-150 text-gray-500'
                    }`}
                  >
                    📉 High to Low
                  </button>
                </div>
              </div>

            </div>

            {/* Drawer Footer with Clear Filters and Close */}
            <div className="p-4 border-t border-gray-200 bg-slate-50 flex items-center gap-2">
              <button
                onClick={() => {
                  setFilterBillboardType('All');
                  setFilterLighting('All');
                  setFilterAvailability('All');
                  setSortByPrice('');
                  setSelectedArea('All Areas');
                  setSearchQuery('');
                }}
                className="flex-1 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 hover:bg-slate-200 bg-slate-100 border border-gray-200 rounded-xl transition-all"
              >
                Clear Filters
              </button>
              <button
                onClick={() => setMenuOpen(false)}
                className="flex-1 py-2 text-xs font-bold text-white bg-indigo-900 hover:bg-indigo-800 rounded-xl shadow-xs transition-all"
              >
                Apply & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. SUB-BAR FILTERS (Areas Ribbon Only) - ONLY visible on Dashboard Directory & Map */}
      {(activeTab === 'directory' || activeTab === 'map') && !selectedBillboardId && (
        <section id="filters-panel-subbar" className="bg-white border-b border-gray-150 py-3 px-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* Area Navigation scroll ribbon */}
            <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none w-full">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider shrink-0">Areas:</span>
              <div className="flex gap-1.5 overflow-x-auto scrollbar-none py-0.5">
                {NASHIK_AREAS.map((area) => (
                  <button
                    key={area}
                    type="button"
                    onClick={() => setSelectedArea(area)}
                    className={`text-xs px-3.5 py-1.5 rounded-full font-semibold transition-all shrink-0 border ${
                      selectedArea === area 
                        ? 'bg-indigo-900 border-indigo-900 text-white shadow-xs' 
                        : 'bg-slate-50 border-gray-200 text-gray-600 hover:bg-slate-100 hover:text-gray-900'
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </section>
      )}

      {/* 3. APP NAVIGATION TAB SWITCHER REMOVED */}

      {/* 4. MAIN CENTRAL CONTENT AREA */}
      <main id="app-main-content" className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        
        {selectedBillboardId ? (
          (() => {
            const selectedB = billboards.find((item) => item.id === selectedBillboardId);
            if (!selectedB) return <p className="text-gray-500 font-sans p-4">Billboard not found</p>;
            return (
              <BillboardDetail 
                billboard={selectedB} 
                onBack={() => {
                  setSelectedBillboardId(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
                onEnquire={(bld) => {
                  handleSendEnquiry(bld);
                }}
              />
            );
          })()
        ) : (
          <>
            {/* Success Confirmation slip after booking reservation */}
        {successBooking && (
          <div id="booking-success-card" className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-6 shadow-lg animate-in fade-in zoom-in-95 duration-300 relative overflow-hidden max-w-3xl mx-auto">
            {/* Visual Confetti style stars */}
            <div className="absolute top-4 right-4 text-emerald-600 animate-spin-slow">
              <Sparkles size={24} />
            </div>

            <div className="flex gap-4 items-start">
              <div className="bg-emerald-600 text-white p-3 rounded-full shrink-0">
                <CheckCircle size={28} />
              </div>
              <div className="space-y-4 flex-1">
                <div>
                  <h3 className="font-sans font-black text-xl text-emerald-900 tracking-tight">
                    Instant Hoarding Slot Reserved!
                  </h3>
                  <p className="text-xs text-emerald-700 mt-1">
                    Your payment was successfully approved. Billboard availability has been automatically updated in our real-time database.
                  </p>
                </div>

                {/* Simulated Slip invoice summary */}
                <div className="bg-white border border-emerald-200 rounded-2xl p-4 text-xs space-y-2 text-gray-700 max-w-xl">
                  <div className="flex justify-between font-bold border-b border-gray-100 pb-2 mb-2 text-gray-900 text-sm">
                    <span>Receipt ID: {successBooking.id}</span>
                    <span className="text-emerald-600">CONFIRMED</span>
                  </div>
                  <div className="grid grid-cols-2 gap-y-1.5 text-gray-600">
                    <div>
                      <span className="text-gray-400 block text-[10px]">BILLBOARD NAME</span>
                      <span className="font-semibold text-gray-900">{successBooking.billboardName}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px]">AGENCY OWNER</span>
                      <span className="font-semibold text-gray-900">{successBooking.agencyName}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px]">RESERVATION SCHEDULE</span>
                      <span className="font-semibold text-gray-900">{successBooking.startDate} to {successBooking.endDate}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px]">TOTAL VALUE PAID</span>
                      <span className="font-bold text-indigo-700 text-sm">₹{successBooking.totalPrice.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                {/* Success Next steps */}
                <div className="flex gap-3">
                  <button 
                    type="button"
                    onClick={() => {
                      setSuccessBooking(null);
                      setActiveTab('bookings');
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2 rounded-lg transition-colors"
                  >
                    View My Bookings
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      // Navigate to simulate drive shortcut
                      const bb = billboards.find(b => b.id === successBooking.billboardId);
                      if (bb) {
                        setNavigationTargetBillboard(bb);
                        setActiveTab('navigation');
                      }
                      setSuccessBooking(null);
                    }}
                    className="bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold text-xs px-4 py-2 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Navigation size={12} className="rotate-45" />
                    <span>Simulate Driving Route</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setSuccessBooking(null)}
                    className="text-emerald-700 hover:text-emerald-900 text-xs font-semibold px-2 py-2"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Alert of Quick enquiry successfully sent */}
        {showEnquirySuccess && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold px-4 py-3 rounded-xl shadow-md max-w-xl mx-auto flex items-center gap-2 animate-in fade-in slide-in-from-top duration-200">
            <CheckCircle size={16} className="text-blue-600 shrink-0" />
            <span>Enquiry submitted to media manager regarding <strong>"{showEnquirySuccess}"</strong>! They will contact you shortly.</span>
          </div>
        )}

        {/* TAB 1: DIRECTORY LISTINGS (Looking EXACTLY like Image 2, paired with Stats) */}
        {activeTab === 'directory' && (
          <div id="directory-tab-view" className="space-y-6">
            {/* List block */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-sans font-extrabold text-xl text-gray-900 tracking-tight flex items-center gap-2">
                    <Building2 className="text-indigo-600" size={18} />
                    Verified Outdoor Advertising Vendors in Nashik
                  </h3>
                  <p className="text-xs text-gray-500">
                    Displaying filtered agencies in <strong>{selectedArea}</strong> ({billboards.filter(b => selectedArea === 'All Areas' || b.area.toLowerCase() === selectedArea.toLowerCase()).length} listings).
                  </p>
                </div>
                {selectedArea !== 'All Areas' && (
                  <button 
                    onClick={() => setSelectedArea('All Areas')}
                    className="text-xs text-indigo-600 font-bold hover:underline"
                  >
                    Clear Area Filter
                  </button>
                )}
              </div>

              {/* Directory listings cards with hoverable galleries */}
              <DirectoryListings 
                billboards={filteredAndSortedBillboards}
                onBook={handleOpenBookingModal}
                onEnquire={handleSendEnquiry}
                selectedArea={selectedArea}
                searchQuery={searchQuery}
                onSelectBillboard={(b) => setSelectedBillboardId(b.id)}
              />
            </div>
          </div>
        )}

        {/* TAB 2: FULL INTERACTIVE MAP OF NASHIK */}
        {activeTab === 'map' && (
          <div id="map-tab-view" className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-gray-150 shadow-3xs text-xs text-gray-600 flex items-start gap-2.5">
              <Info size={16} className="text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-800">Map Control Panel Instruction:</p>
                <p className="mt-0.5">
                  Double click to zoom the coordinates. Pulsing green pins are available immediately for campaigns. Click a pin to lock coordinates, view prorated monthly packages, and click <strong>"Book Instantly"</strong> to secure your campaign dates.
                </p>
              </div>
            </div>

            <InteractiveMap 
              billboards={filteredAndSortedBillboards}
              onBook={handleOpenBookingModal}
              selectedArea={selectedArea}
              onSelectBillboard={(b) => {
                setSelectedBillboardId(b.id);
              }}
            />
          </div>
        )}

        {/* TAB 3: GPS DRIVE SIMULATOR NAVIGATION SIGHT PREVIEW */}
        {activeTab === 'navigation' && (
          <div id="navigation-tab-view">
            <NavigationTab 
              billboards={billboards}
              defaultSelected={navigationTargetBillboard}
              activeBookingCreative={bookings.length > 0 ? {
                text: bookings[0].creativeText,
                url: bookings[0].creativeUrl
              } : null}
            />
          </div>
        )}

        {/* TAB 4: MY BOOKINGS LIST */}
        {activeTab === 'bookings' && (
          <div id="bookings-tab-view" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-sans font-black text-2xl text-gray-900 tracking-tight">
                  My Campaign Registrations
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Active billboard rentals locked on your advertiser billing account.
                </p>
              </div>
              <span className="bg-slate-100 text-slate-800 font-bold text-xs px-3 py-1 rounded-full">
                {bookings.length} Active Slots
              </span>
            </div>

            {bookings.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 max-w-xl mx-auto shadow-xs">
                <CalendarCheck size={36} className="text-indigo-600/30 mx-auto mb-3" />
                <h4 className="font-sans font-bold text-lg text-gray-800">No Reservations Yet</h4>
                <p className="text-gray-500 text-xs mt-2 leading-relaxed">
                  You haven't reserved any billboard advertising slots yet. Go to the "Dashboard Directory" or "Interactive Map" tab, choose an available hoardings agency and complete the instant secure slot booking!
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('directory')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-5 py-2.5 rounded-lg shadow-md mt-5 transition-all"
                >
                  Browse Available Billboards
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {bookings.map((bk) => {
                  const isPreset = bk.id === 'bk-preset1';
                  
                  return (
                    <div 
                      key={bk.id} 
                      className="bg-white rounded-2xl p-5 border border-gray-150 shadow-sm flex flex-col justify-between"
                    >
                      <div>
                        {/* Status bar */}
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                            BOOKING ID: {bk.id}
                          </span>
                          <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1 uppercase">
                            <CheckCircle size={10} /> {bk.status}
                          </span>
                        </div>

                        {/* Billboard info */}
                        <div className="flex gap-3 mb-4 border-b border-gray-100 pb-4">
                          <img 
                            src={bk.billboardImage} 
                            alt={bk.billboardName} 
                            className="w-16 h-16 rounded-xl object-cover border border-gray-200 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <h4 className="font-bold text-sm text-gray-900 leading-tight line-clamp-2">
                              {bk.billboardName}
                            </h4>
                            <p className="text-xs text-gray-400 mt-1">Vendor: {bk.agencyName}</p>
                          </div>
                        </div>

                        {/* Slot detail values */}
                        <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs text-gray-600 mb-4">
                          <div>
                            <span className="text-gray-400 block text-[9px] font-bold uppercase tracking-wider">Start Date</span>
                            <span className="font-semibold text-gray-900">{bk.startDate}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block text-[9px] font-bold uppercase tracking-wider">End Date</span>
                            <span className="font-semibold text-gray-900">{bk.endDate}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block text-[9px] font-bold uppercase tracking-wider">Advertiser Account</span>
                            <span className="font-semibold text-gray-900 truncate block">{bk.advertiserName}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block text-[9px] font-bold uppercase tracking-wider">Total Booking Cost</span>
                            <span className="font-black text-indigo-700">₹{bk.totalPrice.toLocaleString('en-IN')}</span>
                          </div>
                        </div>

                        {/* Creative Content Render Box */}
                        <div className="bg-slate-50 border border-gray-200 rounded-xl p-3 text-xs mb-4">
                          <span className="font-bold text-slate-500 text-[9px] block uppercase tracking-wider mb-1.5">Draft Poster Creative Slogan</span>
                          {bk.creativeUrl ? (
                            <div className="flex gap-2.5 items-center">
                              <img src={bk.creativeUrl} alt="creative upload preview" className="w-14 h-10 object-cover rounded border border-gray-200" referrerPolicy="no-referrer" />
                              <p className="text-[11px] text-gray-600 italic">Custom design file uploaded successfully and formatted for printing.</p>
                            </div>
                          ) : (
                            <p className="text-indigo-900 font-bold italic tracking-wide font-mono text-[11px]">
                              "{bk.creativeText || 'SAI GARMENTS MONSOON SALE'}"
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Booking Action Buttons */}
                      <div className="flex gap-2 pt-3 border-t border-gray-100 mt-auto">
                        <button
                          type="button"
                          onClick={() => {
                            // Quick navigate to driving simulator for this booking
                            const bb = billboards.find(b => b.id === bk.billboardId);
                            if (bb) {
                              setNavigationTargetBillboard(bb);
                              setActiveTab('navigation');
                            }
                          }}
                          className="flex-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-1 shadow-3xs"
                        >
                          <Navigation size={12} className="rotate-45" />
                          <span>Simulate Drive Site</span>
                        </button>
                        
                        <a
                          href={`tel:${isPreset ? '+919922088310' : bk.advertiserPhone}`}
                          className="border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold py-2 px-3 rounded-lg text-center transition-all"
                        >
                          Contact Manager
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: MEDIA OWNERS CONTROL HUB */}
        {activeTab === 'owner-hub' && (
          <div id="owner-hub-tab-view" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Col: Add New Billboard Form */}
            <div className="lg:col-span-4 bg-white p-5 rounded-3xl border border-gray-150 shadow-sm flex flex-col justify-between">
              <form onSubmit={handleAddNewBillboard} className="space-y-4">
                <div>
                  <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                    Ploting Terminal
                  </span>
                  <h3 className="font-sans font-black text-xl text-gray-900 tracking-tight mt-2">
                    Plot Custom Hoarding
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Add a physical advertising hoarding to the Nashik database. It will immediately plot onto the interactive vector map!
                  </p>
                </div>

                <div className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Billboard Landmark Name *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g., Dwarka Flyover Pillar Gantry"
                      value={newB_Name}
                      onChange={(e) => setNewB_Name(e.target.value)}
                      className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Agency Owner Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g., Media Connect Nashik"
                      value={newB_Agency}
                      onChange={(e) => setNewB_Agency(e.target.value)}
                      className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Nashik Area Sector *</label>
                      <select 
                        value={newB_Area}
                        onChange={(e) => setNewB_Area(e.target.value)}
                        className="w-full text-xs border border-gray-200 bg-white rounded-lg px-2.5 py-2 outline-none"
                      >
                        {NASHIK_AREAS.filter(a => a !== 'All Areas').map(area => (
                          <option key={area} value={area}>{area}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Format Type</label>
                      <select 
                        value={newB_Type}
                        onChange={(e: any) => setNewB_Type(e.target.value)}
                        className="w-full text-xs border border-gray-200 bg-white rounded-lg px-2.5 py-2 outline-none"
                      >
                        <option value="Classic Hoarding">Classic Hoarding</option>
                        <option value="Digital LED">Digital LED</option>
                        <option value="Unipole">Unipole</option>
                        <option value="Gantry">Gantry</option>
                        <option value="Bus Shelter">Bus Shelter</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Physical Location Address *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g., Mumbai Highway, near Dwarka Flyover, Nashik"
                      value={newB_Location}
                      onChange={(e) => setNewB_Location(e.target.value)}
                      className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Dimensions Size</label>
                      <input 
                        type="text" 
                        placeholder="e.g., 40ft x 20ft"
                        value={newB_Size}
                        onChange={(e) => setNewB_Size(e.target.value)}
                        className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Monthly Rate (₹) *</label>
                      <input 
                        type="number" 
                        required
                        placeholder="e.g., 45000"
                        value={newB_Price}
                        onChange={(e) => setNewB_Price(e.target.value)}
                        className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Lighting Technology</label>
                    <select 
                      value={newB_Lighting}
                      onChange={(e: any) => setNewB_Lighting(e.target.value)}
                      className="w-full text-xs border border-gray-200 bg-white rounded-lg px-2.5 py-2 outline-none"
                    >
                      <option value="Lit (Front-lit)">Lit (Front-lit)</option>
                      <option value="Lit (Back-lit)">Lit (Back-lit)</option>
                      <option value="Non-Lit">Non-Lit</option>
                      <option value="LED Digital Display">LED Digital Display</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-md active:scale-95"
                >
                  Plot On Map & List In Directory
                </button>
              </form>
            </div>

            {/* Right Col: Interactive Grid allowing Live Status updates */}
            <div className="lg:col-span-8 bg-white p-5 rounded-3xl border border-gray-150 shadow-sm flex flex-col">
              <div className="mb-4">
                <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                  Live Management Console
                </span>
                <h3 className="font-sans font-black text-xl text-gray-900 tracking-tight mt-2">
                  My Listed Inventory (Real-Time Status)
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Simulate acting as a local Media Owner. Toggle availability states or modify prices, and watch the updates instantly reflect across the entire App!
                </p>
              </div>

              <div className="overflow-x-auto flex-1">
                <table className="w-full text-xs text-left text-gray-500 border-collapse">
                  <thead className="text-gray-400 uppercase tracking-wider text-[9px] bg-slate-50 border-b border-gray-200">
                    <tr>
                      <th scope="col" className="px-3 py-2.5">Hoarding & Area</th>
                      <th scope="col" className="px-3 py-2.5">Type & Size</th>
                      <th scope="col" className="px-3 py-2.5">Monthly Rent</th>
                      <th scope="col" className="px-3 py-2.5">Real-Time Status</th>
                      <th scope="col" className="px-3 py-2.5 text-center">Interactive Toggle</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {billboards.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-3 py-3">
                          <span className="font-bold text-gray-900 block truncate max-w-[180px]">{b.name}</span>
                          <span className="text-[10px] text-gray-400 block mt-0.5">{b.area}</span>
                        </td>
                        <td className="px-3 py-3">
                          <span className="text-gray-800 block">{b.type}</span>
                          <span className="text-[10px] text-gray-400 block mt-0.5">{b.size}</span>
                        </td>
                        <td className="px-3 py-3">
                          <input 
                            type="number"
                            value={b.pricePerMonth}
                            onChange={(e) => handleUpdatePrice(b.id, parseInt(e.target.value))}
                            className="w-16 border border-gray-200 rounded px-1.5 py-0.5 font-mono text-gray-900 focus:border-indigo-500 text-xs"
                            title="Edit Monthly Rate"
                          />
                          <span className="text-[9px] text-gray-400 block mt-0.5 font-sans">Click to edit</span>
                        </td>
                        <td className="px-3 py-3">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            b.availability === 'Available' ? 'bg-emerald-50 text-emerald-700' :
                            b.availability === 'Fast Filling' ? 'bg-amber-50 text-amber-700' :
                            b.availability === 'Booked' ? 'bg-rose-50 text-rose-700' :
                            'bg-slate-50 text-slate-500'
                          }`}>
                            {b.availability}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleAvailability(b.id, b.availability)}
                            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-[10px] px-2.5 py-1 rounded border border-slate-800 transition-all active:scale-95"
                          >
                            Next State
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Inquiry list tracker */}
              <div className="mt-8 border-t border-gray-150 pt-5">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Live Inquiries / WhatsApp Logs</h4>
                {inquiries.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">No incoming advertiser logs. Inquiries submitted via card listings will log here in real-time.</p>
                ) : (
                  <div className="space-y-3">
                    {inquiries.map((enq) => (
                      <div key={enq.id} className="bg-slate-50 p-3 rounded-xl border border-gray-200 flex justify-between items-start text-xs">
                        <div>
                          <p className="font-bold text-gray-900">Enquiry regarding: {enq.billboardName}</p>
                          <p className="text-gray-500 mt-1">From: {enq.name} ({enq.phone})</p>
                          <p className="text-gray-400 text-[10px] mt-0.5">Logs generated: {new Date(enq.createdAt).toLocaleTimeString()}</p>
                        </div>
                        <span className="bg-blue-50 text-blue-700 font-bold text-[9px] px-2 py-0.5 rounded uppercase">
                          New Message
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

          </>
        )}
      </main>

      {/* 5. APP FOOTER */}
      <footer id="app-footer-credit" className="bg-white border-t border-gray-150 py-5 text-center text-xs text-gray-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Nashik Billboard Hub. All listed hoardings are verified by respective agencies.</p>
          <div className="flex gap-4">
            <span className="hover:text-indigo-600 cursor-pointer">Terms & Conditions</span>
            <span>•</span>
            <span className="hover:text-indigo-600 cursor-pointer">Ad Policies</span>
            <span>•</span>
            <span className="hover:text-indigo-600 cursor-pointer">Support Desk</span>
          </div>
        </div>
      </footer>

      {/* 6. INSTANT SECURE BOOKING CALENDAR MODAL */}
      {selectedBillboardForBooking && (
        <BookingModal 
          billboard={selectedBillboardForBooking}
          onClose={handleCloseBookingModal}
          onSubmit={handleBookingSubmit}
        />
      )}

    </div>
  );
}
