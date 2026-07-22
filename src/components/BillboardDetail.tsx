import React, { useState } from 'react';
import { Billboard } from '../types';
import { 
  ArrowLeft, 
  MapPin, 
  Briefcase, 
  Star, 
  Phone, 
  MessageCircle, 
  Send, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Video, 
  Image as ImageIcon,
  Share2,
  Edit3,
  ExternalLink,
  Map,
  X,
  FileText,
  ThumbsUp,
  Clock,
  Award,
  CheckCircle2
} from 'lucide-react';

interface BillboardDetailProps {
  billboard: Billboard;
  onBack: () => void;
  onEnquire: (billboard: Billboard) => void;
}

type TabType = 'Overview' | 'Services' | 'Business Details' | 'Photos' | 'Catalogue' | 'Reviews';

export default function BillboardDetail({ billboard, onBack, onEnquire }: BillboardDetailProps) {
  const [activeTab, setActiveTab] = useState<TabType>('Overview');
  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const [isPhoneRevealed, setIsPhoneRevealed] = useState(false);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [enquirySubmitted, setEnquirySubmitted] = useState(false);
  const [enquirerName, setEnquirerName] = useState('');
  const [enquirerPhone, setEnquirerPhone] = useState('');
  const [enquirerMsg, setEnquirerMsg] = useState('Interested in details & available campaign slots.');
  
  // Local Reviews State
  const [reviewsList, setReviewsList] = useState([
    { id: 1, name: 'Rohan Deshmukh', rating: 5, comment: 'Excellent high visibility location on the highway. Highly recommend this hoarding for auto and real estate brands.', date: '2 months ago' },
    { id: 2, name: 'Pooja Kulkarni', rating: 4, comment: 'Premium front lighting makes it highly readable at night. The service provider has good maintenance.', date: '3 weeks ago' }
  ]);
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Copy link helper for Share button
  const [copiedLink, setCopiedLink] = useState(false);
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleNextImage = () => {
    setCurrentImgIdx((prev) => (prev + 1) % billboard.images.length);
  };

  const handlePrevImage = () => {
    setCurrentImgIdx((prev) => (prev - 1 + billboard.images.length) % billboard.images.length);
  };

  const handleLocalEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquirerName || !enquirerPhone) return;
    setEnquirySubmitted(true);
    setTimeout(() => {
      onEnquire({
        ...billboard,
        name: `${billboard.name} (Campaign Enquiry by ${enquirerName})`
      });
      // Reset state & close modal shortly after
      setTimeout(() => {
        setShowEnquiryModal(false);
        setEnquirySubmitted(false);
        setEnquirerName('');
        setEnquirerPhone('');
      }, 1500);
    }, 600);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName || !newReviewText) return;
    setReviewsList([
      {
        id: Date.now(),
        name: newReviewName,
        rating: newReviewRating,
        comment: newReviewText,
        date: 'Just now'
      },
      ...reviewsList
    ]);
    setReviewSubmitted(true);
    setNewReviewName('');
    setNewReviewText('');
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  const formattedViews = billboard.viewsPerDay.toLocaleString('en-IN');
  const establishedYear = 2026 - billboard.yearsInBusiness;

  return (
    <div id="billboard-detail-container" className="bg-slate-50 min-h-screen pb-16 font-sans">
      {/* Detail Header back row */}
      <div className="bg-white border-b border-gray-150 py-3 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button 
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 font-bold text-sm transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-100"
          >
            <ArrowLeft size={16} strokeWidth={2.5} />
            <span>Back to Listings</span>
          </button>
          <div className="text-right">
            <span className="text-[11px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100 px-2.5 py-1 rounded-[4px]">
              {billboard.area} Sector
            </span>
          </div>
        </div>
      </div>

      {/* Main Justdial Layout Profile Card Box */}
      <div className="bg-white border-b border-gray-200 py-6 px-4 sm:px-6 shadow-3xs">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
          
          {/* Left Thumbnail Image matching layout */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border border-gray-200 shadow-3xs shrink-0 bg-slate-100">
            <img 
              src={billboard.images[0]} 
              alt={billboard.name} 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Header text content & Badges matching Justdial screenshot */}
          <div className="flex-1 space-y-2.5">
            {/* Title with thumbs up icon in dark circle */}
            <div className="flex items-start sm:items-center gap-2 flex-wrap">
              <div className="flex items-center justify-center bg-slate-800 text-white w-6 h-6 rounded-full shrink-0 shadow-3xs mt-1 sm:mt-0">
                <span className="text-[11px]">👍</span>
              </div>
              <h1 className="font-sans font-bold text-[22px] sm:text-[24px] text-[#111] tracking-tight leading-tight flex items-center gap-2 flex-wrap">
                <span>{billboard.name}</span>
                <img 
                  src="https://lh3.googleusercontent.com/d/1Iv2Cd9wwW7TjNeDF23qtsEQITRWqTq1z" 
                  alt="Trusted Badge" 
                  className="h-[1em] w-auto object-contain inline-block shrink-0 shadow-3xs rounded-[3px] align-middle" 
                  referrerPolicy="no-referrer"
                  title="Trusted Partner"
                />
                {billboard.verified && (
                  <img 
                    src="https://lh3.googleusercontent.com/d/1GmQEj8fuI11LJvJHqhYxeLXPLL0Si--i" 
                    alt="Verified Logo" 
                    className="h-[1em] w-auto object-contain inline-block shrink-0 shadow-3xs rounded-[3px] align-middle" 
                    referrerPolicy="no-referrer"
                    title="Verified Listing"
                  />
                )}
              </h1>
            </div>

            {/* Badges line exactly matching screenshot styling */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
              {/* Green rating badge */}
              <div className="bg-[#107c10] text-white font-extrabold text-[12px] px-2 py-0.5 rounded flex items-center gap-0.5">
                {billboard.rating.toFixed(1)} <Star size={11} fill="white" stroke="white" className="ml-0.5" />
              </div>
              <span className="text-gray-500 font-semibold">{billboard.ratingsCount} Ratings</span>

              {/* Tag category badge */}
              <span className="bg-[#555555] text-white text-[10px] font-bold px-2 py-0.5 rounded-[4px] tracking-wide uppercase">
                Hoarding Advertising Agencies
              </span>

              {/* Claimed check badge */}
              <span className="inline-flex items-center gap-1 bg-slate-100 text-gray-700 border border-gray-200 px-2 py-0.5 rounded-[4px] text-[11px] font-semibold">
                <span className="bg-slate-950 text-white w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-black">✓</span>
                Claimed
              </span>
            </div>

            {/* Address line row matching screenshot metadata */}
            <div className="flex flex-wrap items-center gap-2 text-[13px] sm:text-[14px] text-gray-600 border-t border-gray-100 pt-2.5">
              <div className="flex items-center gap-1">
                <MapPin size={15} className="text-gray-400" />
                <span className="font-semibold text-gray-800">{billboard.location}, Nashik</span>
              </div>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1">
                <span className="text-[#0f7b10] font-bold">Opens at 10:15 AM</span>
              </div>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1 text-gray-500 font-medium">
                <span>{billboard.yearsInBusiness} Years in Business</span>
              </div>
            </div>

            {/* Action Buttons precisely styled as screenshot */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              {/* Green Telephone Button */}
              <button
                type="button"
                onClick={() => setIsPhoneRevealed(!isPhoneRevealed)}
                className="bg-[#008c02] hover:bg-[#007301] active:bg-[#005e01] text-white font-bold text-[14px] px-5 py-2.5 rounded-[6px] flex items-center gap-2 transition-all shadow-xs"
              >
                <Phone size={15} strokeWidth={2.5} />
                <span>{isPhoneRevealed ? billboard.phone : '09980697289'}</span>
              </button>

              {/* Blue Send Enquiry Button */}
              <button
                type="button"
                onClick={() => setShowEnquiryModal(true)}
                className="bg-[#0082f1] hover:bg-[#0073d8] active:bg-[#005ebd] text-white font-bold text-[14px] px-5 py-2.5 rounded-[6px] flex items-center gap-2 transition-all shadow-xs"
              >
                <MessageCircle size={15} strokeWidth={2.5} className="fill-white/10" />
                <span>Send Enquiry</span>
              </button>

              {/* WhatsApp Redirect Button to www.whatsapp.com */}
              <a
                href="https://www.whatsapp.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white hover:bg-slate-50 border border-[#008c02] text-[#008c02] font-bold text-[14px] px-5 py-2.5 rounded-[6px] flex items-center gap-2 transition-all shadow-xs"
              >
                <MessageCircle size={16} strokeWidth={2.5} className="text-emerald-600 fill-emerald-600/10" />
                <span>WhatsApp</span>
              </a>

              {/* Share button */}
              <button
                type="button"
                onClick={handleShare}
                className="bg-white border border-gray-200 hover:bg-slate-50 text-gray-600 p-2.5 rounded-[6px] transition-all shadow-3xs relative"
                title="Share Billboard link"
              >
                <Share2 size={16} strokeWidth={2} />
                {copiedLink && (
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow whitespace-nowrap z-30">
                    Copied!
                  </span>
                )}
              </button>

              {/* Edit feedback button */}
              <button
                type="button"
                onClick={() => alert("Feedback system loaded. Suggest an update to this billboard details via saiclipping1@gmail.com.")}
                className="bg-white border border-gray-200 hover:bg-slate-50 text-gray-600 p-2.5 rounded-[6px] transition-all shadow-3xs"
                title="Edit / Suggest update"
              >
                <Edit3 size={16} strokeWidth={2} />
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Tabs navigation list matching screenshot tab bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <nav className="flex space-x-8 overflow-x-auto scrollbar-none" aria-label="Tabs">
            {(['Overview', 'Services', 'Business Details', 'Photos', 'Catalogue', 'Reviews'] as TabType[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-bold text-[14px] whitespace-nowrap transition-all flex items-center gap-1 ${
                  activeTab === tab
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
                }`}
              >
                <span>{tab}</span>
                {tab === 'Services' && <ExternalLink size={11} className="text-gray-400 shrink-0" />}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Tab Content panel */}
      <div className="max-w-6xl mx-auto px-4 mt-6">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'Overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Content Area */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Popular Services exactly styled */}
              <div className="bg-white rounded-[12px] p-6 border border-gray-200/80 shadow-3xs space-y-4">
                <h3 className="text-[18px] font-extrabold text-gray-900 tracking-tight">
                  Popular Services
                </h3>
                
                <div className="space-y-4 pt-2">
                  {/* Photo Visual block */}
                  <div className="space-y-2">
                    <div className="aspect-video max-h-[380px] rounded-xl overflow-hidden border border-gray-200 relative bg-slate-100">
                      <img 
                        src={billboard.images[0]} 
                        alt="Outdoor Hoarding Display" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                        Premium Hoarding Preview
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 italic">High visibility branding display situated at prime junction.</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <h4 className="font-bold text-gray-800 text-sm">Site Location Highlights</h4>
                  <p className="text-[13px] text-gray-600 mt-2 leading-relaxed">
                    {billboard.description}
                  </p>
                </div>
              </div>

              {/* Photos Gallery preview within overview */}
              <div className="bg-white rounded-[12px] p-6 border border-gray-200/80 shadow-3xs space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-[16px] font-extrabold text-gray-900 tracking-tight">
                    Site Media Gallery ({billboard.images.length})
                  </h3>
                  <button 
                    type="button" 
                    onClick={() => setActiveTab('Photos')}
                    className="text-xs font-bold text-indigo-600 hover:underline"
                  >
                    View All Photos
                  </button>
                </div>

                <div className="relative aspect-video rounded-xl bg-black overflow-hidden flex items-center justify-center">
                  <img 
                    src={billboard.images[currentImgIdx]} 
                    alt={`${billboard.name} Gallery`} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {billboard.images.length > 1 && (
                    <>
                      <button 
                        type="button" 
                        onClick={handlePrevImage} 
                        className="absolute left-2.5 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button 
                        type="button" 
                        onClick={handleNextImage} 
                        className="absolute right-2.5 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>

            </div>

            {/* Right Side Sidebar (GPS Map & quick summary info) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* GPS Coordinate map widget */}
              <div className="bg-white rounded-[12px] p-5 border border-gray-200/80 shadow-3xs space-y-4">
                <h4 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                  <Map size={16} className="text-indigo-600" />
                  GPS Coordinate Index
                </h4>

                <div className="bg-slate-100 border border-gray-200 rounded-lg p-3 relative overflow-hidden h-36 flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full text-slate-300" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="detail-grid" width="16" height="16" patternUnits="userSpaceOnUse">
                        <path d="M 16 0 L 0 0 0 16" fill="none" stroke="currentColor" strokeWidth="0.5" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#detail-grid)" />
                    <path d="M-10,40 Q120,10 200,80 T420,50" fill="none" stroke="#cbd5e1" strokeWidth="3" />
                  </svg>
                  
                  <div className="absolute flex flex-col items-center z-10">
                    <div className="relative">
                      <span className="absolute -inset-1.5 bg-indigo-500/30 rounded-full animate-ping"></span>
                      <MapPin size={22} className="text-indigo-600 drop-shadow relative" />
                    </div>
                    <span className="bg-indigo-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow mt-1">
                      Lat: {billboard.latitude}, Lng: {billboard.longitude}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-gray-500 space-y-2">
                  <p><strong>District:</strong> Nashik Highway Division</p>
                  <p><strong>Jurisdiction:</strong> Nashik Mahanagar Palika</p>
                  {billboard.googleMapLink && (
                    <a
                      href={billboard.googleMapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 w-full text-center flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-indigo-50 border border-slate-200 text-slate-800 hover:text-indigo-700 font-bold py-2 rounded-lg text-xs transition-colors"
                    >
                      <Map size={13} />
                      Open in Google Maps
                    </a>
                  )}
                </div>
              </div>

              {/* Agency business details box */}
              <div className="bg-white rounded-[12px] p-5 border border-gray-200/80 shadow-3xs space-y-3">
                <h4 className="font-bold text-gray-900 text-sm">Media Provider</h4>
                <div className="space-y-1">
                  <p className="font-bold text-xs text-gray-800">{billboard.agency}</p>
                  <p className="text-[11px] text-gray-400">Outdoor Advertising Campaign Specialists</p>
                </div>
                <div className="border-t border-gray-100 pt-2.5 text-xs text-gray-600 space-y-1.5">
                  <p className="flex items-center gap-1.5 font-semibold text-gray-800">
                    <img src="https://lh3.googleusercontent.com/d/1GmQEj8fuI11LJvJHqhYxeLXPLL0Si--i" alt="Verified Logo" className="h-4 w-auto object-contain inline-block" referrerPolicy="no-referrer" />
                    Claimed & Verified Profile
                  </p>
                  <p>📊 High Conversion Analytics</p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: SERVICES */}
        {activeTab === 'Services' && (
          <div className="bg-white rounded-[12px] p-6 border border-gray-200/80 shadow-3xs space-y-6">
            <div>
              <h3 className="text-[18px] font-extrabold text-gray-900 tracking-tight">
                Our Services & Campaign Capabilities
              </h3>
              <p className="text-xs text-gray-500 mt-1">Provided directly by the media partner agency: {billboard.agency}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="border border-gray-150 p-4 rounded-xl hover:shadow-xs transition-shadow">
                <span className="text-lg">📢</span>
                <h4 className="font-bold text-sm text-gray-800 mt-2">Billboard Campaign Planning</h4>
                <p className="text-xs text-gray-500 mt-1">Comprehensive scheduling, demographic mapping, and high-frequency traffic targeting advice.</p>
              </div>
              <div className="border border-gray-150 p-4 rounded-xl hover:shadow-xs transition-shadow">
                <span className="text-lg">🎨</span>
                <h4 className="font-bold text-sm text-gray-800 mt-2">Vinyl Printing & Fitting</h4>
                <p className="text-xs text-gray-500 mt-1">High DPI waterproof flexing material, weather resistance coating, and rapid overhead stretch installation.</p>
              </div>
              <div className="border border-gray-150 p-4 rounded-xl hover:shadow-xs transition-shadow">
                <span className="text-lg">💡</span>
                <h4 className="font-bold text-sm text-gray-800 mt-2">Illumination Management</h4>
                <p className="text-xs text-gray-500 mt-1">High-lumen metal halide or premium LED floodlights with automated solar dusk-to-dawn timers.</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: BUSINESS DETAILS */}
        {activeTab === 'Business Details' && (
          <div className="bg-white rounded-[12px] p-6 border border-gray-200/80 shadow-3xs space-y-6">
            <h3 className="text-[18px] font-extrabold text-gray-900 tracking-tight border-b border-gray-100 pb-3">
              Official Business Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
              <div className="space-y-4">
                <div className="grid grid-cols-2 py-2.5 border-b border-gray-50">
                  <span className="text-gray-400 font-medium">Business Name</span>
                  <span className="font-bold text-gray-800">{billboard.agency}</span>
                </div>
                <div className="grid grid-cols-2 py-2.5 border-b border-gray-50">
                  <span className="text-gray-400 font-medium">Core Industry</span>
                  <span className="font-bold text-gray-800">Hoarding Advertising Agencies</span>
                </div>
                <div className="grid grid-cols-2 py-2.5 border-b border-gray-50">
                  <span className="text-gray-400 font-medium">Year Established</span>
                  <span className="font-bold text-gray-800">Est. {establishedYear}</span>
                </div>
                <div className="grid grid-cols-2 py-2.5 border-b border-gray-50">
                  <span className="text-gray-400 font-medium">Years Active</span>
                  <span className="font-bold text-indigo-600">{billboard.yearsInBusiness} Years</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 py-2.5 border-b border-gray-50 items-center">
                  <span className="text-gray-400 font-medium">Verified Status</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1.5">
                    <img src="https://lh3.googleusercontent.com/d/1GmQEj8fuI11LJvJHqhYxeLXPLL0Si--i" alt="Verified Logo" className="h-5 w-auto object-contain inline-block" referrerPolicy="no-referrer" />
                    Fully Verified Merchant
                  </span>
                </div>
                <div className="grid grid-cols-2 py-2.5 border-b border-gray-50">
                  <span className="text-gray-400 font-medium">Primary Office Location</span>
                  <span className="font-bold text-gray-800">Nashik District, Maharashtra</span>
                </div>
                <div className="grid grid-cols-2 py-2.5 border-b border-gray-50">
                  <span className="text-gray-400 font-medium">Registration Compliance</span>
                  <span className="font-bold text-gray-800">Claimed & Approved</span>
                </div>
                <div className="grid grid-cols-2 py-2.5 border-b border-gray-50">
                  <span className="text-gray-400 font-medium">GPS Location Index</span>
                  <span className="font-bold text-gray-800">{billboard.latitude}, {billboard.longitude}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PHOTOS */}
        {activeTab === 'Photos' && (
          <div className="bg-white rounded-[12px] p-6 border border-gray-200/80 shadow-3xs space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-[18px] font-extrabold text-gray-900 tracking-tight">
                  High-Resolution Site Media
                </h3>
                <p className="text-xs text-gray-500 mt-1">Official photos capturing physical hoarding status and daytime visibility.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {billboard.images.map((imgUrl, index) => (
                <div 
                  key={index} 
                  className="rounded-xl overflow-hidden border border-gray-200 group relative cursor-pointer bg-slate-100 shadow-3xs"
                  onClick={() => setCurrentImgIdx(index)}
                >
                  <img 
                    src={imgUrl} 
                    alt={`Hoarding ${index + 1}`} 
                    className="w-full h-48 object-cover transition-transform group-hover:scale-105 duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 right-2 bg-slate-900/70 text-white font-mono font-bold text-[10px] px-2 py-0.5 rounded">
                    Photo {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: CATALOGUE */}
        {activeTab === 'Catalogue' && (
          <div className="bg-white rounded-[12px] p-6 border border-gray-200/80 shadow-3xs space-y-6">
            <div>
              <h3 className="text-[18px] font-extrabold text-gray-900 tracking-tight">
                Branding Catalogue & Specifications
              </h3>
              <p className="text-xs text-gray-500 mt-1">Recommended file parameters, formats, and design blueprints for banner print media.</p>
            </div>

            <div className="space-y-4 max-w-xl">
              <div className="flex items-center gap-3.5 border border-gray-150 p-4 rounded-xl bg-slate-50">
                <div className="bg-red-50 text-red-600 p-2.5 rounded-lg shrink-0">
                  <FileText size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-gray-800">Print Guideline Blueprint (PDF)</h4>
                  <p className="text-xs text-gray-400 mt-0.5">DPI scale guidelines, color profile templates, and bleed configurations for `{billboard.size}` size.</p>
                </div>
                <button 
                  type="button" 
                  onClick={() => alert("Catalogue download simulated. Guidelines sent to client email.")}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-md"
                >
                  Download
                </button>
              </div>

              <div className="flex items-center gap-3.5 border border-gray-150 p-4 rounded-xl bg-slate-50">
                <div className="bg-indigo-50 text-indigo-600 p-2.5 rounded-lg shrink-0">
                  <FileText size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-gray-800">Media Agency Credentials Kit (PDF)</h4>
                  <p className="text-xs text-gray-400 mt-0.5">Established case studies, previous campaigns, and compliance list for {billboard.agency}.</p>
                </div>
                <button 
                  type="button" 
                  onClick={() => alert("Credentials Kit simulated. File downloaded successfully.")}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-md"
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: REVIEWS */}
        {activeTab === 'Reviews' && (
          <div className="bg-white rounded-[12px] p-6 border border-gray-200/80 shadow-3xs space-y-8">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-[18px] font-extrabold text-gray-900 tracking-tight">
                  Directory Reviews
                </h3>
                <p className="text-xs text-gray-500 mt-1">Genuine verified customer feedback and campaign testimonials.</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1.5 justify-end">
                  <span className="font-black text-xl text-gray-900">{billboard.rating.toFixed(1)}</span>
                  <div className="bg-[#107c10] text-white font-extrabold text-[12px] px-1.5 py-0.5 rounded flex items-center">
                    ★
                  </div>
                </div>
                <span className="text-[11px] text-gray-400 font-bold">{billboard.ratingsCount} Ratings total</span>
              </div>
            </div>

            {/* Reviews display list */}
            <div className="space-y-6">
              {reviewsList.map((rev) => (
                <div key={rev.id} className="space-y-2 border-b border-gray-50 pb-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-indigo-700 text-xs">
                        {rev.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-[13px] text-gray-800">{rev.name}</h4>
                        <span className="text-[10px] text-gray-400">{rev.date}</span>
                      </div>
                    </div>
                    <div className="flex text-amber-400">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} size={13} fill="currentColor" stroke="currentColor" />
                      ))}
                    </div>
                  </div>
                  <p className="text-[13px] text-gray-600 leading-relaxed pl-10">
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>

            {/* Leave a review form */}
            <form onSubmit={handleAddReview} className="space-y-4 pt-4 border-t border-gray-100">
              <h4 className="font-extrabold text-sm text-gray-900">Write an Honest Review</h4>
              
              {reviewSubmitted && (
                <div className="bg-emerald-50 text-emerald-800 text-xs p-3 rounded-lg font-semibold">
                  ✓ Thank you! Your review has been added to our local listing directory.
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1">Your Full Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g., Sunil Patil"
                    value={newReviewName}
                    onChange={(e) => setNewReviewName(e.target.value)}
                    className="w-full text-xs border border-gray-200 rounded-[4px] px-3 py-2 outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1">Star Rating</label>
                  <select 
                    value={newReviewRating} 
                    onChange={(e) => setNewReviewRating(Number(e.target.value))}
                    className="w-full text-xs border border-gray-200 rounded-[4px] px-3 py-2 outline-none focus:border-indigo-500 bg-white"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                    <option value={3}>⭐⭐⭐ (3 Stars)</option>
                    <option value={2}>⭐⭐ (2 Stars)</option>
                    <option value={1}>⭐ (1 Star)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1">Your Review / Testimonial</label>
                <textarea 
                  required
                  rows={3}
                  placeholder="Share details of your reach experience or billboard maintenance feedback..."
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  className="w-full text-xs border border-gray-200 rounded-[4px] px-3 py-2 outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded"
              >
                Submit Review
              </button>
            </form>
          </div>
        )}

      </div>

      {/* Campaign Enquiry Modal popup exactly for Send Enquiry clicks */}
      {showEnquiryModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-gray-150 transform scale-100 transition-all">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-[15px]">Send Campaign Enquiry</h3>
                <p className="text-[11px] text-slate-300 mt-0.5">{billboard.name}</p>
              </div>
              <button 
                type="button" 
                onClick={() => setShowEnquiryModal(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5">
              {enquirySubmitted ? (
                <div className="text-center py-6 space-y-3">
                  <div className="bg-emerald-50 text-emerald-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 size={24} />
                  </div>
                  <h4 className="font-bold text-emerald-900 text-[15px]">Enquiry Submitted Successfully</h4>
                  <p className="text-xs text-emerald-700 leading-relaxed">
                    Your campaign enquiry has been received by the media owner. They will reach out via call or WhatsApp shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleLocalEnquiry} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1">Company / Brand Name *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g., Sai Garments"
                      value={enquirerName}
                      onChange={(e) => setEnquirerName(e.target.value)}
                      className="w-full text-xs border border-gray-200 rounded-[4px] px-3 py-2 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1">Contact Phone Number *</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="e.g., +91 98220 12345"
                      value={enquirerPhone}
                      onChange={(e) => setEnquirerPhone(e.target.value)}
                      className="w-full text-xs border border-gray-200 rounded-[4px] px-3 py-2 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1">Inquiry details / Campaign description</label>
                    <textarea 
                      rows={3}
                      value={enquirerMsg}
                      onChange={(e) => setEnquirerMsg(e.target.value)}
                      className="w-full text-xs border border-gray-200 rounded-[4px] px-3 py-2 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20"
                    />
                  </div>

                  <div className="pt-2 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowEnquiryModal(false)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs py-2.5 rounded transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 rounded transition-all flex items-center justify-center gap-1.5"
                    >
                      <Send size={11} />
                      <span>Submit Enquiry</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
