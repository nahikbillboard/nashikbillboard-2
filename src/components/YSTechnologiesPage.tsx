import React from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  GraduationCap, 
  Code, 
  Cpu, 
  Calendar, 
  Rocket, 
  Building, 
  UserCheck, 
  Award, 
  Terminal, 
  CheckCircle2,
  Globe,
  Brain
} from 'lucide-react';

interface YSTechnologiesPageProps {
  onBack: () => void;
}

export default function YSTechnologiesPage({ onBack }: YSTechnologiesPageProps) {
  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Navigation / Back Header */}
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-bold text-sm bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl transition-all active:scale-95 cursor-pointer"
          >
            <ArrowLeft size={18} />
            Back to Nashik Billboard Hub
          </button>
          
          <div className="flex items-center gap-2">
            <span className="bg-indigo-600 text-white font-extrabold text-xs px-3 py-1 rounded-full tracking-wide uppercase flex items-center gap-1 shadow-xs">
              <Sparkles size={12} /> YS Technologies
            </span>
          </div>
        </div>

        {/* Hero Banner Section */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden border border-slate-800">
          <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3.5 py-1 rounded-full text-xs font-bold">
              <Building size={14} /> Next-Gen Technology & Software Architecture
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Crafted with Precision by <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">YS Technologies</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Engineered by brilliant minds passionate about AI, computer science, high-performance software, and transformative digital experiences for real-world enterprise applications.
            </p>
          </div>
        </div>

        {/* SECTION 1: Overview & Vision Section */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-indigo-600 font-extrabold text-sm tracking-wide uppercase">
            <Rocket size={18} /> About YS Technologies
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Innovation Driven by Young Tech Visionaries
          </h2>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            YS Technologies specializes in full-stack web applications, AI-driven automation, GIS location mapping platforms, and digital advertising solutions. Founded with a commitment to mathematical rigor, exceptional developer craftsmanship, and seamless user experiences.
          </p>
        </section>

        {/* SECTION 2: Layout with Sidebar and Creator Profiles */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* SIDEBAR */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-6 sticky top-6">
              <div className="border-b border-gray-100 pb-4">
                <h3 className="font-extrabold text-base text-gray-900 tracking-tight flex items-center gap-2">
                  <Terminal className="text-indigo-600" size={18} />
                  YS Tech Specs
                </h3>
                <p className="text-xs text-gray-500 mt-1">Foundational Engineering Overview</p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-gray-400 uppercase font-bold text-[10px] tracking-wider block mb-1">Company</span>
                  <p className="font-extrabold text-gray-800 text-sm">YS Technologies</p>
                </div>

                <div>
                  <span className="text-gray-400 uppercase font-bold text-[10px] tracking-wider block mb-1">Core Competencies</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-semibold text-[11px]">AI Models</span>
                    <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-semibold text-[11px]">React & TypeScript</span>
                    <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-semibold text-[11px]">Full-Stack App Architecture</span>
                    <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-semibold text-[11px]">GIS & Interactive Maps</span>
                  </div>
                </div>

                <div>
                  <span className="text-gray-400 uppercase font-bold text-[10px] tracking-wider block mb-1">Founders</span>
                  <p className="font-bold text-indigo-900">Sai Wagh & Yashraj Shinde</p>
                </div>

                <div>
                  <span className="text-gray-400 uppercase font-bold text-[10px] tracking-wider block mb-1">Focus</span>
                  <p className="text-gray-600 leading-relaxed font-medium">Advanced Algorithmic Development, JEE Physics & Math, Enterprise Web Systems.</p>
                </div>
              </div>

              <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl text-xs space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-indigo-900">
                  <Award className="text-indigo-600" size={16} /> Verified Excellence
                </div>
                <p className="text-indigo-800 leading-relaxed text-[11px]">
                  Engineered with standard-compliant, high-performance architecture powering Nashik Outdoor Billboard Directory.
                </p>
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT AREA: Below Sidebar / Next to Sidebar */}
          <main className="lg:col-span-3 space-y-8">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
              
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                  <UserCheck className="text-indigo-600" size={24} />
                  Leadership & Key Minds
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Meet the visionary minds behind YS Technologies.
                </p>
              </div>

              {/* PROFILES GRID */}
              <div className="space-y-8">
                
                {/* 1. SAI WAGH PROFILE */}
                <div className="bg-gradient-to-br from-indigo-50/50 via-white to-slate-50 p-6 sm:p-8 rounded-2xl border border-indigo-100/80 shadow-xs space-y-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-indigo-600 text-white font-black text-[10px] px-3 py-1 rounded-bl-xl tracking-wider uppercase">
                    Co-Founder & Developer
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-2xl shadow-md shrink-0">
                      SW
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-gray-900 tracking-tight">Sai Wagh</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 border border-amber-200 font-extrabold text-xs px-2.5 py-0.5 rounded-full">
                          <GraduationCap size={14} /> Aspiring Harvard Student
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="bg-white p-3.5 rounded-xl border border-gray-200 flex items-start gap-3">
                      <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                        <GraduationCap size={18} />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Academics</p>
                        <p className="text-xs font-bold text-gray-800 mt-0.5">11th JEE and 12th JEE</p>
                      </div>
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-gray-200 flex items-start gap-3">
                      <div className="p-2 bg-purple-50 text-purple-600 rounded-lg shrink-0">
                        <Brain size={18} />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">AI Experience</p>
                        <p className="text-xs font-bold text-gray-800 mt-0.5">Two Years in AI</p>
                      </div>
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-gray-200 flex items-start gap-3">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                        <Code size={18} />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Coding Journey</p>
                        <p className="text-xs font-bold text-gray-800 mt-0.5">Four Years in Coding</p>
                      </div>
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-gray-200 flex items-start gap-3">
                      <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
                        <Rocket size={18} />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">App Building</p>
                        <p className="text-xs font-bold text-gray-800 mt-0.5">One Year in Real Coding & Building Apps since the age of 13</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. YASHRAJ SHINDE PROFILE */}
                <div className="bg-gradient-to-br from-purple-50/50 via-white to-slate-50 p-6 sm:p-8 rounded-2xl border border-purple-100/80 shadow-xs space-y-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-purple-600 text-white font-black text-[10px] px-3 py-1 rounded-bl-xl tracking-wider uppercase">
                    Co-Founder & Developer
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-black text-2xl shadow-md shrink-0">
                      YS
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-gray-900 tracking-tight">Yashraj Shinde</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 border border-amber-200 font-extrabold text-xs px-2.5 py-0.5 rounded-full">
                          <GraduationCap size={14} /> Aspiring Harvard Student
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="bg-white p-3.5 rounded-xl border border-gray-200 flex items-start gap-3">
                      <div className="p-2 bg-purple-50 text-purple-600 rounded-lg shrink-0">
                        <GraduationCap size={18} />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Academics</p>
                        <p className="text-xs font-bold text-gray-800 mt-0.5">11th JEE and 12th JEE</p>
                      </div>
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-gray-200 flex items-start gap-3">
                      <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                        <Brain size={18} />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">AI Experience</p>
                        <p className="text-xs font-bold text-gray-800 mt-0.5">Two Years in AI</p>
                      </div>
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-gray-200 flex items-start gap-3">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                        <Code size={18} />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Coding Journey</p>
                        <p className="text-xs font-bold text-gray-800 mt-0.5">Four Years in Coding</p>
                      </div>
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-gray-200 flex items-start gap-3">
                      <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
                        <Rocket size={18} />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">App Building</p>
                        <p className="text-xs font-bold text-gray-800 mt-0.5">One Year in Real Coding & Building Apps since the age of 11</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </main>

        </div>

      </div>
    </div>
  );
}
