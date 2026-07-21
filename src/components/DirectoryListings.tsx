import React, { useState } from 'react';
import { Billboard } from '../types';
import { 
  Phone, 
  MapPin, 
  Briefcase, 
  Star, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  MessageCircle, 
  Send, 
  Calendar, 
  Search, 
  ExternalLink,
  Sparkles,
  Info
} from 'lucide-react';

interface DirectoryListingsProps {
  billboards: Billboard[];
  onBook?: (billboard: Billboard) => void;
  onEnquire: (billboard: Billboard) => void;
  selectedArea: string;
  searchQuery: string;
  onSelectBillboard?: (billboard: Billboard) => void;
}

export default function DirectoryListings({ 
  billboards, 
  onBook, 
  onEnquire,
  selectedArea,
  searchQuery,
  onSelectBillboard
}: DirectoryListingsProps) {
  // States for interactive listings
  const [revealedPhones, setRevealedPhones] = useState<Record<string, boolean>>({});
  const [activeImageIndices, setActiveImageIndices] = useState<Record<string, number>>({});
  
  // WhatsApp Simulation Panel States
  const [activeWhatsAppBillboard, setActiveWhatsAppBillboard] = useState<Billboard | null>(null);
  const [whatsappMessages, setWhatsappMessages] = useState<Array<{sender: 'user' | 'owner', text: string, time: string}>>([]);
  const [userMsgInput, setUserMsgInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Toggle phone number reveal
  const togglePhone = (id: string) => {
    setRevealedPhones(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Gallery Navigation Handlers
  const handleNextImage = (id: string, max: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndices(prev => {
      const current = prev[id] || 0;
      return { ...prev, [id]: (current + 1) % max };
    });
  };

  const handlePrevImage = (id: string, max: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndices(prev => {
      const current = prev[id] || 0;
      return { ...prev, [id]: (current - 1 + max) % max };
    });
  };

  // WhatsApp Simulator
  const openWhatsAppSim = (billboard: Billboard) => {
    setActiveWhatsAppBillboard(billboard);
    setWhatsappMessages([
      { 
        sender: 'owner', 
        text: `Hello! Thanks for reaching out to ${billboard.agency} regarding "${billboard.name}". How can we help you with your advertising campaign today?`, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }
    ]);
  };

  const handleSendWhatsAppMsg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userMsgInput.trim() || !activeWhatsAppBillboard) return;

    const newMsg = {
      sender: 'user' as const,
      text: userMsgInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setWhatsappMessages(prev => [...prev, newMsg]);
    const queryText = userMsgInput;
    setUserMsgInput('');
    setIsTyping(true);

    // Dynamic Simulated Owner Responses
    setTimeout(() => {
      let responseText = "Sure! Let me check the availability for you. Would you like to reserve a week or a whole month?";
      if (queryText.toLowerCase().includes('price') || queryText.toLowerCase().includes('cost') || queryText.toLowerCase().includes('how much')) {
        responseText = `The base price is ₹${activeWhatsAppBillboard.pricePerMonth.toLocaleString('en-IN')}/month. Since it's currently ${activeWhatsAppBillboard.availability}, we can offer a 10% coupon 'NASHIK10' if you reserve today!`;
      } else if (queryText.toLowerCase().includes('size') || queryText.toLowerCase().includes('dimension')) {
        responseText = `The dimensions are exactly ${activeWhatsAppBillboard.size}. It features premium ${activeWhatsAppBillboard.lighting} setup for maximum night traction!`;
      } else if (queryText.toLowerCase().includes('book') || queryText.toLowerCase().includes('reserve')) {
        responseText = `Awesome! Please click the blue "Book Now" button on our card listing to lock the slot dates instantly. Our online calendar is fully automated.`;
      } else if (queryText.toLowerCase().includes('location') || queryText.toLowerCase().includes('where')) {
        responseText = `It is located at ${activeWhatsAppBillboard.location}. You can use the "Location tab" on the top navigation bar to simulate a real driving route directly to this billboard!`;
      }

      setWhatsappMessages(prev => [...prev, {
        sender: 'owner',
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setIsTyping(false);
    }, 1500);
  };

  // Filter logic
  const filteredBillboards = billboards.filter(b => {
    const matchesArea = selectedArea === 'All Areas' || b.area.toLowerCase() === selectedArea.toLowerCase();
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.location.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.agency.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesArea && matchesSearch;
  });

  return (
    <div id="listings-section" className="space-y-6 relative">
      {filteredBillboards.length === 0 ? (
        <div id="no-listings-found" className="bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-sm max-w-xl mx-auto">
          <div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
            <Search size={28} />
          </div>
          <h3 className="font-sans font-bold text-lg text-gray-900">No Billboard Agencies Found</h3>
          <p className="text-gray-500 text-sm mt-2">
            We couldn't find any results matching "{searchQuery}" in {selectedArea}. Try adjusting your search query or area filters!
          </p>
        </div>
      ) : (
        <div id="listings-grid" className="space-y-4">
          {filteredBillboards.map((b) => {
            const currentImgIdx = activeImageIndices[b.id] || 0;
            const isPhoneRevealed = revealedPhones[b.id] || false;

            return (
              <div 
                key={b.id} 
                id={`billboard-card-${b.id}`}
                className="bg-white rounded-[10px] p-[18px] sm:p-5 border border-gray-200/80 shadow-xs hover:shadow-md transition-shadow duration-200 flex flex-col md:flex-row gap-5 items-stretch relative"
              >
                {/* 1. Left Side: Image Gallery with Slider & Overlapping Arrow */}
                <div 
                  id={`image-gallery-container-${b.id}`}
                  onClick={() => onSelectBillboard?.(b)}
                  className="relative w-full md:w-[185px] h-[185px] rounded-[8px] overflow-hidden bg-gray-50 border border-gray-200 shrink-0 group cursor-pointer"
                  title="Click to view full photo, video, and detailed info"
                >
                  {/* Slider Images */}
                  <img 
                    src={b.images[currentImgIdx]} 
                    alt={`${b.name} - slide ${currentImgIdx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                    referrerPolicy="no-referrer"
                  />

                  {/* Hoverable Specifications Overlay */}
                  <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3.5 text-white z-10">
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 border-b border-white/15 pb-1">Billboard Specs</p>
                      <div className="grid grid-cols-2 gap-y-1.5 gap-x-1 text-[10px]">
                        <div>
                          <span className="text-gray-400 block">Size:</span>
                          <span className="font-semibold">{b.size}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block">Traffic:</span>
                          <span className="font-semibold text-emerald-400">{(b.viewsPerDay / 1000).toFixed(0)}k/day</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block">Lighting:</span>
                          <span className="font-semibold truncate block">{b.lighting}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block">Status:</span>
                          <span className={`font-semibold ${
                            b.availability === 'Available' ? 'text-emerald-400' :
                            b.availability === 'Fast Filling' ? 'text-amber-400' :
                            'text-red-400'
                          }`}>{b.availability}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-[9px] text-gray-400 flex items-center gap-1">
                      <Info size={10} className="text-indigo-400" />
                      Hover to view details
                    </div>
                  </div>

                  {/* Left & Right Overlapping Navigation Arrows (Justdial Style) */}
                  {b.images.length > 1 && (
                    <>
                      {currentImgIdx > 0 && (
                        <button 
                          type="button"
                          onClick={(e) => handlePrevImage(b.id, b.images.length, e)}
                          className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/45 hover:bg-black/65 text-white w-[24px] h-[36px] rounded-r-[4px] flex items-center justify-center z-20 transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100"
                          title="Previous Image"
                        >
                          <ChevronLeft size={14} strokeWidth={3} />
                        </button>
                      )}
                      <button 
                        type="button"
                        onClick={(e) => handleNextImage(b.id, b.images.length, e)}
                        className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/45 hover:bg-black/65 text-white w-[24px] h-[36px] rounded-l-[4px] flex items-center justify-center z-20 transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100"
                        title="Next Image"
                      >
                        <ChevronRight size={14} strokeWidth={3} />
                      </button>
                    </>
                  )}

                  {/* Pagination Dots (Subtle) */}
                  <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-20">
                    {b.images.map((_, idx) => (
                      <span 
                        key={idx}
                        className={`w-1.2 h-1.2 rounded-full transition-all ${
                          idx === currentImgIdx ? 'bg-white scale-125' : 'bg-white/40'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* 2. Right Side: Card details mirroring Justdial layout */}
                <div id={`card-details-container-${b.id}`} className="flex-1 flex flex-col justify-between">
                  <div>
                    {/* Header: Title, Claimed badge, Top Search badge, Verified badge */}
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      {/* Thumbs up badge (for b2 / Metro Advertising Co) */}
                      {b.id === 'b2' && (
                        <div className="bg-[#1a2e40] text-white p-1 rounded-[4px] flex items-center justify-center w-[25px] h-[25px] shrink-0">
                          <span className="text-[12px] leading-none">👍</span>
                        </div>
                      )}
                      <h3 
                        onClick={() => onSelectBillboard?.(b)}
                        className="font-sans font-medium text-[21px] text-[#111111] leading-snug tracking-tight hover:text-indigo-600 cursor-pointer transition-colors flex items-center flex-wrap gap-2"
                        title="Click to view full photo, video, and detailed info"
                      >
                        <span>{b.name}</span>
                        {b.verified && (
                          <span className="inline-flex items-center gap-1 bg-[#107c10]/10 text-[#107c10] border border-[#107c10]/20 px-2 py-0.5 rounded-[4px] text-[11px] font-bold shrink-0 shadow-3xs" title="Verified Vendor">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#107c10]"></span>
                            Verified
                          </span>
                        )}
                      </h3>
                    </div>

                    {/* Ratings Section */}
                    <div className="flex items-center gap-2 text-sm flex-wrap mb-2">
                      <div className="bg-[#008c48] text-white font-bold text-[13px] px-1.5 py-0.5 rounded-[4px] flex items-center gap-0.5 shadow-3xs">
                        {b.rating.toFixed(1)} <Star size={11} fill="white" stroke="white" className="ml-0.5 mb-0.5" />
                      </div>
                      <span className="text-gray-500 text-[13px] font-medium font-sans">
                        {b.ratingsCount} {b.ratingsCount === 1 ? 'Rating' : 'Ratings'}
                      </span>
                      {b.isTopSearch && (
                        <>
                          <span className="text-gray-300">•</span>
                          <span className="flex items-center gap-1 text-[11px] font-medium bg-gray-50 text-gray-600 border border-gray-200 px-2 py-0.5 rounded-[4px]">
                            <Search size={11} className="text-amber-500 fill-amber-500/10" /> Top Search
                          </span>
                        </>
                      )}
                    </div>

                    {/* Location Info & Business Experience */}
                    <div className="flex items-center gap-1.5 text-[14px] text-gray-500 font-sans mb-3">
                      <MapPin size={15} strokeWidth={1.5} className="text-gray-400 shrink-0" />
                      <span className="text-[#333]">{b.location}</span>
                      <span className="text-gray-300 mx-0.5">•</span>
                      <Briefcase size={15} strokeWidth={1.5} className="text-gray-400 shrink-0" />
                      <span className="text-[#333]">
                        <strong className="font-bold">{b.yearsInBusiness} Years</strong> in Business
                      </span>
                    </div>

                    {/* Categories Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-0.5 mb-4">
                      {b.category.map((cat, i) => (
                        <span 
                          key={i} 
                          className="bg-gray-50 border border-gray-200 text-[#555] text-[12px] px-2.5 py-0.5 rounded-[4px] font-sans"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Buttons Section (Image 2 style layout: Show Number, WhatsApp, Book Slot) */}
                  <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-100 w-full mt-auto">
                    
                    {/* 1. Show Number / Phone Button (Vivid Green) */}
                    <button
                      type="button"
                      onClick={() => togglePhone(b.id)}
                      className="bg-[#008c02] hover:bg-[#007301] active:bg-[#005e01] text-white font-bold text-[14px] px-5 py-2.5 rounded-[4px] flex items-center justify-center gap-2 transition-all shrink-0 min-w-[145px] shadow-xs"
                    >
                      <Phone size={14} strokeWidth={2.5} />
                      <span>{isPhoneRevealed ? b.phone : (b.id === 'b2' ? '08105365855' : 'Show Number')}</span>
                    </button>

                    {/* 2. WhatsApp Button (White with WhatsApp icon) */}
                    <a
                      href="https://www.whatsapp.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white hover:bg-gray-50 active:bg-gray-100 border border-gray-300 text-gray-800 font-bold text-[14px] px-5 py-2.5 rounded-[4px] flex items-center justify-center gap-2 transition-all shrink-0 shadow-xs"
                    >
                      <MessageCircle size={15} className="text-emerald-500 fill-emerald-500/10" strokeWidth={2.5} />
                      <span>WhatsApp</span>
                    </a>

                    {/* 3. Send Enquiry Button (Clean subtle blue border) */}
                    <button
                      type="button"
                      onClick={() => onEnquire(b)}
                      className="bg-white hover:bg-indigo-50 active:bg-indigo-100 border border-indigo-200 text-indigo-700 font-semibold text-[13px] px-4 py-2.5 rounded-[4px] flex items-center justify-center gap-1 transition-all shrink-0 shadow-3xs"
                    >
                      <span>Send Enquiry</span>
                    </button>

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. Simulated Bottom-Right WhatsApp Conversation Slider */}
      {activeWhatsAppBillboard && (
        <div 
          id="whatsapp-simulator-panel" 
          className="fixed bottom-6 right-6 w-80 sm:w-96 bg-white border border-gray-200 rounded-2xl shadow-2xl z-40 overflow-hidden flex flex-col h-[420px] animate-in slide-in-from-bottom duration-200"
        >
          {/* Header */}
          <div className="bg-[#075e54] text-white p-3 flex items-center justify-between shadow">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-white/20 overflow-hidden relative border border-white/10 shrink-0">
                <img 
                  src={activeWhatsAppBillboard.images[0]} 
                  alt={activeWhatsAppBillboard.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h4 className="font-semibold text-sm leading-tight line-clamp-1">{activeWhatsAppBillboard.name}</h4>
                <p className="text-[10px] text-emerald-200 font-medium">
                  {isTyping ? 'Typing...' : 'Online • Representative'}
                </p>
              </div>
            </div>
            <button 
              type="button"
              onClick={() => setActiveWhatsAppBillboard(null)}
              className="text-white/80 hover:text-white font-bold p-1 hover:bg-white/10 rounded-full text-xs"
            >
              ✕
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-3 bg-[#ece5dd] overflow-y-auto space-y-2.5 flex flex-col justify-end">
            <div className="my-auto text-center">
              <span className="bg-white/70 backdrop-blur-xs text-[9px] text-gray-500 font-bold px-2 py-0.5 rounded shadow-xs uppercase">
                End-to-End Encrypted Simulation
              </span>
            </div>
            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
              {whatsappMessages.map((msg, idx) => (
                <div 
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-lg p-2 text-xs shadow-xs relative ${
                      msg.sender === 'user' 
                        ? 'bg-[#dcf8c6] text-gray-800 rounded-tr-none' 
                        : 'bg-white text-gray-800 rounded-tl-none'
                    }`}
                  >
                    <p className="leading-normal">{msg.text}</p>
                    <span className="text-[8px] text-gray-400 block text-right mt-1 font-mono">
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-lg p-2 rounded-tl-none text-xs text-gray-400 italic shadow-xs flex items-center gap-1.5">
                    <span className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </span>
                    Typing answers...
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Suggestions Quick Buttons */}
          <div className="bg-gray-50 border-t border-gray-150 p-1.5 flex gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
            <button 
              type="button"
              onClick={() => setUserMsgInput('What is the pricing details?')}
              className="text-[10px] bg-white border border-gray-200 text-gray-700 hover:bg-indigo-50 font-medium px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 transition-colors"
            >
              ₹ Pricing Query
            </button>
            <button 
              type="button"
              onClick={() => setUserMsgInput('Is this billboard available from next Monday?')}
              className="text-[10px] bg-white border border-gray-200 text-gray-700 hover:bg-indigo-50 font-medium px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 transition-colors"
            >
              📅 Slot Availability
            </button>
            <button 
              type="button"
              onClick={() => setUserMsgInput('What are the dimensions and specs?')}
              className="text-[10px] bg-white border border-gray-200 text-gray-700 hover:bg-indigo-50 font-medium px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 transition-colors"
            >
              📐 Size & Specs
            </button>
          </div>

          {/* Form Input */}
          <form onSubmit={handleSendWhatsAppMsg} className="p-2 bg-gray-100 border-t border-gray-200 flex items-center gap-2 shrink-0">
            <input 
              type="text" 
              placeholder="Type message..."
              value={userMsgInput}
              onChange={(e) => setUserMsgInput(e.target.value)}
              className="flex-1 bg-white text-xs border border-gray-200 rounded-full px-3.5 py-2 outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <button 
              type="submit"
              className="bg-[#075e54] hover:bg-[#128c7e] text-white p-2 rounded-full shadow-xs active:scale-95 transition-all shrink-0"
              title="Send WhatsApp message"
            >
              <Send size={14} className="ml-0.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
