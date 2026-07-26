import { Search, Maximize, ArrowRight, User, Phone, Building2 } from "lucide-react";
import Image from "next/image";

const MAYOR_INFO = {
  name: "Shri. Anil Kadam",
  title: "City Mayor (नगराध्यक्ष)",
  phone: "+91 98765 00001"
};

const VICE_MAYOR_INFO = {
  name: "Smt. Priya Patil",
  title: "Vice City Mayor (उपनगराध्यक्ष)",
  phone: "+91 98765 00002"
};

const WARDS = [
  {
    id: "W1",
    name: "Shivaji Chowk Area",
    marathiName: "शिवाजी चौक परिसर",
    tags: ["Market Area", "Main Post Office"],
    colorClass: "bg-primary-container text-on-primary-container",
    corporators: [
      { name: "Ramesh Patil", phone: "+91 98765 43210" },
      { name: "Sunil Deshmukh", phone: "+91 98765 43211" }
    ]
  },
  {
    id: "W2",
    name: "Datta Nagar",
    marathiName: "दत्त नगर",
    tags: ["Residential", "Datta Mandir"],
    colorClass: "bg-secondary-container text-on-secondary-container",
    corporators: [
      { name: "Sunita Jadhav", phone: "+91 87654 32109" },
      { name: "Vijay Mane", phone: "+91 87654 32110" }
    ]
  },
  {
    id: "W3",
    name: "Shahu Colony",
    marathiName: "शाहू कॉलनी",
    tags: ["Mixed Use", "High School"],
    colorClass: "bg-surface-container-high text-on-surface",
    corporators: [
      { name: "Vijay Kadam", phone: "+91 76543 21098" },
      { name: "Anita Kulkarni", phone: "+91 76543 21099" }
    ]
  },
  {
    id: "W4",
    name: "Gavbhag",
    marathiName: "गावभाग",
    tags: ["Old City", "Heritage"],
    colorClass: "bg-primary-container text-on-primary-container",
    corporators: [
      { name: "Suresh Bhosale", phone: "+91 99887 76655" },
      { name: "Pooja Chavan", phone: "+91 99887 76656" }
    ]
  },
  {
    id: "W5",
    name: "Station Road",
    marathiName: "स्टेशन रोड",
    tags: ["Commercial", "Transport"],
    colorClass: "bg-secondary-container text-on-secondary-container",
    corporators: [
      { name: "Prakash Pawar", phone: "+91 98765 11223" },
      { name: "Meena Joshi", phone: "+91 98765 11224" }
    ]
  },
  {
    id: "W6",
    name: "Mahavir Nagar",
    marathiName: "महावीर नगर",
    tags: ["Residential", "Jain Temple"],
    colorClass: "bg-surface-container-high text-on-surface",
    corporators: [
      { name: "Amit Shah", phone: "+91 99887 33445" },
      { name: "Rajeshwari Desai", phone: "+91 99887 33446" }
    ]
  },
  {
    id: "W7",
    name: "Bypass Road Area",
    marathiName: "बायपास रोड परिसर",
    tags: ["New Development", "Highway"],
    colorClass: "bg-primary-container text-on-primary-container",
    corporators: [
      { name: "Kiran Shinde", phone: "+91 91234 56789" },
      { name: "Nitin Gavali", phone: "+91 91234 56790" }
    ]
  },
  {
    id: "W8",
    name: "Industrial Estate",
    marathiName: "औद्योगिक वसाहत",
    tags: ["MIDC", "Factories"],
    colorClass: "bg-secondary-container text-on-secondary-container",
    corporators: [
      { name: "Sanjay Raut", phone: "+91 99881 12233" },
      { name: "Sneha Patil", phone: "+91 99881 12234" }
    ]
  },
  {
    id: "W9",
    name: "Sambhaji Nagar",
    marathiName: "संभाजी नगर",
    tags: ["Suburban", "Garden"],
    colorClass: "bg-surface-container-high text-on-surface",
    corporators: [
      { name: "Ashok Chavan", phone: "+91 88776 65544" },
      { name: "Kavita Kamble", phone: "+91 88776 65545" }
    ]
  },
  {
    id: "W10",
    name: "Hanuman Nagar",
    marathiName: "हनुमान नगर",
    tags: ["Residential", "Lake View"],
    colorClass: "bg-primary-container text-on-primary-container",
    corporators: [
      { name: "Ganesh Naik", phone: "+91 77665 54433" },
      { name: "Smita More", phone: "+91 77665 54434" }
    ]
  }
];

export default function WardInfoPage() {
  return (
    <main className="flex-grow pt-8 pb-20 md:pb-12 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-on-surface mb-2">
          Ward Information <span className="text-secondary text-2xl font-normal ml-2">/ प्रभाग माहिती</span>
        </h1>
        <p className="font-sans text-base text-on-surface-variant">Explore detailed information about the wards in Shirol, including your elected representatives.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Search & City Leaders */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* City Leaders Section */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
            <div className="bg-primary/10 p-4 border-b border-outline-variant flex items-center gap-2">
              <Building2 className="text-primary w-5 h-5" />
              <h2 className="font-heading text-lg font-semibold text-primary">City Administration</h2>
            </div>
            <div className="p-6 flex flex-col gap-6">
              <div className="flex gap-4 items-center">
                <div className="bg-primary-container text-on-primary-container w-12 h-12 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="font-sans text-xs text-on-surface-variant font-semibold uppercase tracking-wider">{MAYOR_INFO.title}</p>
                  <h3 className="font-heading font-bold text-lg text-on-surface">{MAYOR_INFO.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="text-secondary w-4 h-4" />
                    <span className="font-sans text-sm text-on-surface-variant">{MAYOR_INFO.phone}</span>
                  </div>
                </div>
              </div>
              <div className="border-t border-outline-variant/50 pt-6 flex gap-4 items-center">
                <div className="bg-secondary-container text-on-secondary-container w-12 h-12 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="font-sans text-xs text-on-surface-variant font-semibold uppercase tracking-wider">{VICE_MAYOR_INFO.title}</p>
                  <h3 className="font-heading font-bold text-lg text-on-surface">{VICE_MAYOR_INFO.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="text-secondary w-4 h-4" />
                    <span className="font-sans text-sm text-on-surface-variant">{VICE_MAYOR_INFO.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search & Filter Card */}
          <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant shadow-sm">
            <h2 className="font-heading text-xl font-semibold text-on-surface mb-4">Find Your Ward</h2>
            <div className="flex flex-col gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-on-surface-variant w-5 h-5" />
                <input 
                  className="w-full pl-10 pr-4 py-2 bg-surface rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors font-sans text-sm" 
                  placeholder="Search by Area Name or PIN Code..." 
                  type="text"
                />
              </div>
              <div className="flex gap-4">
                <select className="flex-1 bg-surface border border-outline-variant rounded-lg px-3 py-2 font-sans text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none">
                  <option value="">Select Ward No.</option>
                  {WARDS.map(w => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
                <button className="bg-primary text-on-primary px-6 py-2 rounded-lg font-sans font-semibold text-sm hover:bg-primary-container transition-colors shadow-sm">
                  Filter
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Map Placeholder */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col h-[400px]">
            <div className="p-4 border-b border-outline-variant bg-surface flex justify-between items-center">
              <h3 className="font-heading text-lg font-semibold text-on-surface">Shirol Ward Map</h3>
              <button className="text-secondary hover:text-primary flex items-center gap-1 font-sans text-sm font-semibold">
                <Maximize className="w-4 h-4" /> View Full
              </button>
            </div>
            <div className="flex-grow bg-surface-variant relative overflow-hidden">
              <Image 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_DNQjzbPnsNbqBxefTT9MVDjx-sztDgOzFXD4VRlDXDKmA982c-IYwEsqnuUCxbtkMCEcI7f2xtcOwWB7EwhnS03wjQOaitM_161hkud0qS0kELwQs4bcAT1Ucvu889yh7if1Jjs5snf2ggptODExAYoFNFF-xFG5-39AUy_8wNg_TkLSWr7nAL_Eyz3fVfXYM6pLxEY1CcnSiTBuT7oYG-YuP6LbqLbG-TPyAkG2Y9nVCWwBKHq0sgrZcLhHDapsKG0IaMrJa-hP"
                alt="Map of Shirol Wards"
                fill
                className="object-cover opacity-80"
                unoptimized
              />
              
              {/* Map Overlay Pins */}
              <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group">
                <div className="bg-primary text-on-primary rounded-full w-8 h-8 flex items-center justify-center shadow-lg font-sans font-bold text-sm group-hover:scale-110 transition-transform">1</div>
                <div className="w-1 h-3 bg-primary"></div>
                <div className="w-2 h-2 rounded-full bg-primary shadow-sm"></div>
              </div>
              <div className="absolute top-1/2 left-2/3 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group">
                <div className="bg-secondary text-on-secondary rounded-full w-8 h-8 flex items-center justify-center shadow-lg font-sans font-bold text-sm group-hover:scale-110 transition-transform">2</div>
                <div className="w-1 h-3 bg-secondary"></div>
                <div className="w-2 h-2 rounded-full bg-secondary shadow-sm"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Ward List Section */}
        <div className="lg:col-span-7">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm h-full flex flex-col">
            <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface sticky top-0 z-10 rounded-t-xl">
              <h2 className="font-heading text-xl font-semibold text-on-surface">Ward Directory</h2>
              <span className="bg-surface-container px-3 py-1 rounded-full text-xs font-sans font-semibold text-primary">{WARDS.length} Wards Total</span>
            </div>
            
            <div className="flex-grow overflow-y-auto p-6 flex flex-col gap-4">
              {WARDS.map((ward) => (
                <div key={ward.id} className="bg-surface rounded-xl p-5 border border-outline-variant hover:shadow-md transition-shadow group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`${ward.colorClass} w-12 h-12 rounded-lg flex items-center justify-center font-heading font-bold text-xl`}>
                          {ward.id}
                      </div>
                      <div>
                        <h3 className="font-heading font-semibold text-lg text-on-surface">{ward.name}</h3>
                        <p className="font-sans text-sm text-on-surface-variant">{ward.marathiName}</p>
                      </div>
                    </div>
                    <button aria-label="View Details" className="text-secondary hover:text-primary bg-surface-container-low hover:bg-surface-container p-2 rounded-full transition-colors">
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Corporators Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {ward.corporators.map((corp, idx) => (
                      <div key={idx} className="bg-surface-container-low rounded-lg p-4">
                        <p className="font-sans text-xs text-on-surface-variant uppercase tracking-wider mb-2 font-semibold">Corporator {idx + 1}</p>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <User className="text-secondary w-4 h-4 shrink-0" />
                            <span className="font-sans text-sm font-bold text-on-surface">{corp.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="text-secondary w-4 h-4 shrink-0" />
                            <span className="font-sans text-sm text-on-surface-variant">{corp.phone}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-outline-variant/50 flex gap-2 flex-wrap">
                    {ward.tags.map((tag, idx) => (
                      <span key={idx} className="px-2 py-1 bg-surface-variant text-on-surface-variant text-xs font-sans rounded font-medium">{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
          </div>
        </div>
      </div>
    </main>
  );
}
