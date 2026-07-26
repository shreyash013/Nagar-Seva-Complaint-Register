import Link from "next/link";
import { PlusCircle, Receipt, Search, Clock, CheckCircle, TrendingUp, Droplet, Trash2 } from "lucide-react";

export default function CitizenDashboard() {
  return (
    <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-md md:py-stack-lg flex flex-col gap-stack-lg">
      {/* Hero & Quick Actions */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Welcome Card */}
        <div className="lg:col-span-8 bg-surface-container-low rounded-xl p-stack-md flex flex-col justify-between border border-outline-variant shadow-sm relative overflow-hidden min-h-[300px]">
          <div className="absolute inset-0 z-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Civic governance background"
              className="w-full h-full object-cover opacity-20 object-top"
              src="https://images.unsplash.com/photo-1577983084128-09559c95b706?q=80&w=2070&auto=format&fit=crop"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-surface-container-low via-surface-container-low/90 to-transparent"></div>
          </div>
          <div className="relative z-10 flex flex-col gap-stack-sm max-w-2xl">
            <h1 className="font-heading text-headline-lg-mobile md:text-display-lg text-on-surface font-bold leading-tight">
              Welcome, Citizen<br />
              <span className="text-primary-container font-sans font-semibold text-headline-lg-mobile md:text-headline-lg">
                नागरिक डॅशबोर्ड
              </span>
            </h1>
            <p className="font-sans text-body-lg text-on-surface-variant max-w-lg mt-2">
              Manage your civic services, track complaints, and stay updated with your ward&apos;s progress.{" "}
              <span className="block text-body-md mt-1 font-sans">
                तुमच्या नागरी सेवा व्यवस्थापित करा आणि अद्यतने मिळवा.
              </span>
            </p>
          </div>
          <div className="relative z-10 flex flex-wrap gap-4 mt-stack-md">
            <Link
              href="/submit-complaint"
              className="bg-primary-container text-on-primary font-sans text-label-md px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-primary transition-colors shadow-sm"
            >
              <PlusCircle className="w-5 h-5" />
              Submit a New Complaint
            </Link>
            <button className="border-2 border-primary-container text-primary-container font-sans text-label-md px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-surface-container transition-colors">
              <Receipt className="w-5 h-5" />
              Pay Taxes
            </button>
          </div>
        </div>
        {/* Quick Status */}
        <div className="lg:col-span-4 bg-surface rounded-xl p-stack-md border border-outline-variant flex flex-col gap-stack-sm shadow-sm">
          <div>
            <h2 className="font-heading text-title-md text-on-surface font-semibold">Track Status</h2>
            <p className="font-sans text-label-sm text-on-surface-variant mt-1 font-semibold">स्थिती तपासा</p>
          </div>
          <div className="mt-auto">
            <label className="block font-sans text-label-md text-on-surface mb-2 font-medium">
              Ticket ID / <span className="font-sans">अर्ज क्रमांक</span>
            </label>
            <form action="/track-complaints" className="flex gap-2">
              <input
                type="text"
                name="id"
                placeholder="e.g. SH-2024-892"
                className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2 text-body-md font-sans focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-on-surface placeholder:text-on-surface-variant"
              />
              <button type="submit" className="bg-secondary text-on-secondary p-2 rounded-lg hover:bg-secondary-container transition-colors flex items-center justify-center min-w-[48px]">
                <Search className="w-5 h-5" />
              </button>
            </form>
            <Link href="/track-complaints" className="text-primary font-sans text-label-sm mt-3 inline-block hover:underline font-semibold">
              View recent tracking history →
            </Link>
          </div>
        </div>
      </section>

      {/* Stats & Categories Bento */}
      <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-gutter">
        {/* Stat Card 1 */}
        <div className="bg-surface rounded-xl p-stack-md border border-outline-variant shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="font-sans text-label-md text-on-surface-variant font-medium">Active Complaints</p>
              <p className="font-sans text-label-sm text-on-surface-variant font-semibold">सक्रिय तक्रारी</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-error-container/50 flex items-center justify-center text-on-error-container">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-display-lg text-on-surface font-bold leading-none">2</span>
            <span className="font-sans text-label-sm bg-surface-container-high px-2 py-0.5 rounded text-on-surface-variant font-semibold">Needs Attention</span>
          </div>
        </div>
        {/* Stat Card 2 */}
        <div className="bg-surface rounded-xl p-stack-md border border-outline-variant shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="font-sans text-label-md text-on-surface-variant font-medium">Resolved Issues</p>
              <p className="font-sans text-label-sm text-on-surface-variant font-semibold">सोडवलेले प्रश्न</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-secondary-container/50 flex items-center justify-center text-on-secondary-container">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-display-lg text-on-surface font-bold leading-none">14</span>
            <span className="font-sans text-label-sm bg-surface-container-highest px-2 py-0.5 rounded text-on-surface-variant font-semibold">This Year</span>
          </div>
        </div>
        {/* Stat Card 3 */}
        <div className="bg-surface rounded-xl p-stack-md border border-outline-variant shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="font-sans text-label-md text-on-surface-variant font-medium">Resolution Success</p>
              <p className="font-sans text-label-sm text-on-surface-variant font-semibold">यशस्वीता दर</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-display-lg text-on-surface font-bold leading-none">87%</span>
            <span className="font-sans text-label-sm bg-surface-container-highest px-2 py-0.5 rounded text-on-surface-variant font-semibold">Average</span>
          </div>
        </div>

        {/* Category Links */}
        <div className="md:col-span-3 lg:col-span-2 grid grid-cols-2 gap-4">
          <Link href="/login" className="relative overflow-hidden bg-surface-container-low rounded-xl p-4 border border-outline-variant flex flex-col items-center justify-center text-center hover:shadow-md hover:-translate-y-0.5 transition-all group">
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-primary/5"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low to-transparent"></div>
            </div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-surface mb-3 flex items-center justify-center text-primary-container group-hover:bg-primary-container group-hover:text-on-primary transition-colors">
                <Droplet className="w-6 h-6" />
              </div>
              <p className="font-heading text-title-md text-on-surface mb-1 font-semibold">Water Supply</p>
              <p className="font-sans text-label-sm text-on-surface-variant font-semibold">पाणी पुरवठा</p>
            </div>
          </Link>
          <Link href="/login" className="relative overflow-hidden bg-surface-container-low rounded-xl p-4 border border-outline-variant flex flex-col items-center justify-center text-center hover:shadow-md hover:-translate-y-0.5 transition-all group">
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-primary/5"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low to-transparent"></div>
            </div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-surface mb-3 flex items-center justify-center text-primary-container group-hover:bg-primary-container group-hover:text-on-primary transition-colors">
                <Trash2 className="w-6 h-6" />
              </div>
              <p className="font-heading text-title-md text-on-surface mb-1 font-semibold">Waste Mgt</p>
              <p className="font-sans text-label-sm text-on-surface-variant font-semibold">कचरा व्यवस्थापन</p>
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}
