import React, { useState, useRef } from 'react';
import { Billboard, Booking } from '../types';
import { X, Calendar, Calculator, Check, AlertCircle, Upload, Sparkles, Receipt } from 'lucide-react';

interface BookingModalProps {
  billboard: Billboard;
  onClose: () => void;
  onSubmit: (booking: Booking) => void;
}

export default function BookingModal({ billboard, onClose, onSubmit }: BookingModalProps) {
  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [creativeText, setCreativeText] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  
  // File Upload State
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Success indicator
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculation Logic
  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  };

  const days = calculateDays();
  const weeks = Math.ceil(days / 7);
  const months = days / 30;

  // Pricing: Choose monthly or weekly prorated rate
  const getBasePrice = () => {
    if (days === 0) return 0;
    if (days >= 30) {
      return Math.round(months * billboard.pricePerMonth);
    } else {
      return Math.round(weeks * billboard.pricePerWeek);
    }
  };

  const basePrice = getBasePrice();
  const discountAmount = promoApplied ? Math.round(basePrice * 0.10) : 0; // 10% off
  const taxableValue = basePrice - discountAmount;
  const gst = Math.round(taxableValue * 0.18); // 18% GST (CGST + SGST)
  const totalAmount = taxableValue + gst;

  // Promo Code Validation
  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'NASHIK10') {
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Invalid coupon code. Try NASHIK10 for 10% off!');
      setPromoApplied(false);
    }
  };

  // Drag and Drop Handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please upload an image file (PNG/JPG)');
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Submit Handler
  const handleBookNow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email || !startDate || !endDate) {
      alert('Please fill out all required field details.');
      return;
    }

    setIsSubmitting(true);

    // Simulate Network Delay
    setTimeout(() => {
      const bookingData: Booking = {
        id: 'bk-' + Math.random().toString(36).substr(2, 9),
        billboardId: billboard.id,
        billboardName: billboard.name,
        billboardImage: billboard.images[0],
        agencyName: billboard.agency,
        advertiserName: name,
        advertiserPhone: phone,
        advertiserEmail: email,
        startDate,
        endDate,
        creativeText,
        creativeUrl: filePreview || undefined,
        totalPrice: totalAmount,
        status: 'Confirmed',
        createdAt: new Date().toISOString(),
        paymentStatus: 'Paid' // Simulated instant gateway approval
      };

      onSubmit(bookingData);
      setIsSubmitting(false);
    }, 1200);
  };

  return (
    <div id="booking-modal-overlay" className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div id="booking-modal-container" className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl border border-gray-100 flex flex-col md:flex-row overflow-hidden max-h-[90vh] my-8 animate-in fade-in zoom-in duration-200">
        
        {/* Left Side: Summary & Quick Details */}
        <div id="booking-modal-sidebar" className="bg-slate-50 md:w-5/12 p-6 border-r border-gray-100 flex flex-col overflow-y-auto">
          <div className="mb-5">
            <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
              {billboard.type}
            </span>
            <h3 className="font-sans font-semibold text-xl text-gray-900 mt-2 tracking-tight leading-snug">
              {billboard.name}
            </h3>
            <p className="text-gray-500 text-sm font-medium mt-1">Managed by: {billboard.agency}</p>
          </div>

          {/* Quick Image Box */}
          <div className="relative h-44 rounded-xl overflow-hidden mb-5 group border border-gray-200 shadow-sm">
            <img 
              src={billboard.images[0]} 
              alt={billboard.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-3">
              <span className="text-white text-xs font-semibold tracking-wide bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-md">
                {billboard.size}
              </span>
            </div>
          </div>

          {/* Billboard Pricing Table */}
          <div className="space-y-2 mb-6 text-sm bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <h4 className="font-semibold text-gray-800 flex items-center gap-1.5 border-b border-gray-100 pb-2 mb-2">
              <Calculator size={16} className="text-indigo-600" /> Rate Details
            </h4>
            <div className="flex justify-between">
              <span className="text-gray-500">Weekly Rate:</span>
              <span className="font-semibold text-gray-900">₹{billboard.pricePerWeek.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Monthly Rate:</span>
              <span className="font-semibold text-gray-900">₹{billboard.pricePerMonth.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Est. Daily Views:</span>
              <span className="font-semibold text-emerald-600">{(billboard.viewsPerDay / 1000).toFixed(0)}k+ views</span>
            </div>
          </div>

          {/* Billing Calculation Box */}
          <div className="mt-auto bg-indigo-900 text-indigo-100 p-5 rounded-2xl shadow-inner space-y-3">
            <h4 className="font-semibold text-white flex items-center gap-2 border-b border-indigo-800 pb-2.5">
              <Receipt size={16} /> Instant Invoice Quote
            </h4>
            <div className="flex justify-between text-xs text-indigo-200">
              <span>DurationSelected:</span>
              <span className="font-semibold text-white">{days > 0 ? `${days} Days` : 'Select dates'}</span>
            </div>
            <div className="flex justify-between text-xs text-indigo-200">
              <span>Base Booking Rate:</span>
              <span className="font-semibold text-white">₹{basePrice.toLocaleString('en-IN')}</span>
            </div>
            {promoApplied && (
              <div className="flex justify-between text-xs text-emerald-300">
                <span>Coupon Discount (10%):</span>
                <span className="font-semibold">- ₹{discountAmount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-xs text-indigo-200">
              <span>GST @ 18% (CGST+SGST):</span>
              <span className="font-semibold text-white">₹{gst.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-white pt-2.5 border-t border-indigo-800">
              <span>Total Cost (incl. tax):</span>
              <span className="text-emerald-400">₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="text-[10px] text-indigo-300/80 text-center pt-1 italic">
              *Guaranteed availability locks upon successful reservation.
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Booking Form */}
        <form onSubmit={handleBookNow} className="flex-1 p-6 md:p-8 flex flex-col overflow-y-auto max-h-[90vh]">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="font-sans font-bold text-2xl text-gray-900 tracking-tight">Instant Advertising Reservation</h2>
              <p className="text-xs text-gray-500 mt-1">Fill this form to reserve your billboard instantly.</p>
            </div>
            <button 
              type="button" 
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-5 flex-1">
            {/* Contact Details */}
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">1. Advertiser Contact Details</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Company / Full Name *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g., Sai Garments Nashik"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Mobile Contact Number *</label>
                  <input 
                    type="tel" 
                    required
                    placeholder="e.g., +91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="mt-3">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Billing Email Address *</label>
                <input 
                  type="email" 
                  required
                  placeholder="e.g., marketing@saigarments.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Campaign Scheduling Dates */}
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">2. Choose Campaign Slot Dates</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                    <Calendar size={13} /> Start Date *
                  </label>
                  <input 
                    type="date" 
                    required
                    value={startDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                    <Calendar size={13} /> End Date *
                  </label>
                  <input 
                    type="date" 
                    required
                    value={endDate}
                    min={startDate || new Date().toISOString().split('T')[0]}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Interactive Design & Custom Image Upload Container */}
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">3. Upload Creative Mockup or Text Content</h4>
              
              {/* Drag & Drop File Container */}
              <div 
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center min-h-[140px] ${
                  dragActive ? 'border-indigo-500 bg-indigo-50/50' : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50/30'
                }`}
              >
                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                
                {filePreview ? (
                  <div className="w-full flex items-center justify-between p-2 bg-indigo-50 rounded-lg" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center gap-3">
                      <img src={filePreview} alt="creative upload" className="w-16 h-12 object-cover rounded border border-gray-200" referrerPolicy="no-referrer" />
                      <div className="text-left">
                        <p className="text-xs font-semibold text-gray-800 line-clamp-1">{uploadedFile?.name || 'Uploaded Creative'}</p>
                        <p className="text-[10px] text-gray-500">{(uploadedFile?.size ? (uploadedFile.size / 1024 / 1024).toFixed(2) : '0')} MB • PNG/JPG ready</p>
                      </div>
                    </div>
                    <button 
                      type="button" 
                      onClick={removeFile}
                      className="text-red-500 hover:bg-red-50 p-1.5 rounded-full"
                    >
                      <X size={15} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="bg-gray-100 p-2.5 rounded-full text-gray-500 mb-2">
                      <Upload size={18} />
                    </div>
                    <p className="text-xs font-semibold text-gray-800">Drag & drop your poster mockup, or <span className="text-indigo-600">browse files</span></p>
                    <p className="text-[10px] text-gray-400 mt-1">Supports JPEG, PNG up to 10MB (Standard billboard aspect ratio advised)</p>
                  </>
                )}
              </div>

              {/* Text Backup */}
              <div className="mt-3">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Alternate Slogan or Text to Print (Optional)</label>
                <textarea 
                  rows={2}
                  placeholder="e.g., 'Sai Garments - Huge monsoon discount! College Road, Nashik.'"
                  value={creativeText}
                  onChange={(e) => setCreativeText(e.target.value)}
                  className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none transition-all"
                />
              </div>
            </div>

            {/* Promo coupon form */}
            <div className="bg-slate-50 border border-gray-100 p-3 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={15} className="text-amber-500 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-gray-800">Have a Promo Coupon?</p>
                  <p className="text-[10px] text-gray-400">Use code <span className="font-mono font-bold text-gray-500">NASHIK10</span> for extra discount</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {promoApplied ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                    <Check size={12} /> Applied
                  </span>
                ) : (
                  <div className="flex gap-1.5">
                    <input 
                      type="text" 
                      placeholder="Enter code" 
                      value={promoCode}
                      onChange={(e) => {
                        setPromoCode(e.target.value);
                        setPromoError('');
                      }}
                      className="border border-gray-200 rounded-md px-2 py-1 text-xs outline-none bg-white font-mono uppercase w-24 focus:border-indigo-500"
                    />
                    <button 
                      type="button"
                      onClick={handleApplyPromo}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-2.5 py-1 rounded-md transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>
            </div>
            {promoError && (
              <p className="text-[10px] text-red-500 font-semibold flex items-center gap-1"><AlertCircle size={10} /> {promoError}</p>
            )}
          </div>

          {/* Form Actions */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3 justify-end">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSubmitting || days === 0}
              className={`px-6 py-2.5 text-sm font-semibold text-white rounded-lg flex items-center justify-center gap-2 shadow-md transition-all ${
                days === 0
                  ? 'bg-gray-300 cursor-not-allowed shadow-none'
                  : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/10 active:scale-95'
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Finalizing Reservation...
                </>
              ) : (
                'Secure Slot & Reserve Instantly'
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
