import { Landmark, Home, Droplet, FileText, Building2, Store, Users } from "lucide-react";

export default function ServicesPage() {
  return (
    <main className="flex-grow w-full max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12 flex flex-col gap-10">
      {/* Hero Section */}
      <section className="relative w-full rounded-xl overflow-hidden bg-surface-container min-h-[200px] flex items-center p-8 md:p-12 border border-outline-variant/50">
        <div className="relative z-10 max-w-2xl">
          <h1 className="font-heading text-headline-lg-mobile md:text-headline-lg font-semibold text-primary mb-4 leading-tight">
            Municipal Services Directory
          </h1>
          <p className="font-sans text-body-md md:text-body-lg text-on-surface-variant leading-relaxed">
            Access and apply for essential civic services online. Our streamlined portal ensures transparency, efficiency, and convenience for all citizens of Shirol Nagar Parishad.
          </p>
        </div>
        {/* Decorative Graphic/Background */}
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-primary-container/20 to-transparent pointer-events-none"></div>
        <Landmark className="absolute -right-10 -bottom-10 w-[240px] h-[240px] text-primary/5 pointer-events-none select-none" />
      </section>

      {/* Services Grid (Bento style) */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Service Card 1: Property Tax */}
        <div className="group bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col gap-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
          <div className="w-14 h-14 rounded-lg bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
            <Home className="w-7 h-7" />
          </div>
          <div className="flex-grow">
            <h2 className="font-heading text-title-md font-semibold text-on-surface mb-1">
              Property Tax
            </h2>
            <p className="font-sans text-label-md text-on-surface-variant mb-3 font-medium">मालमत्ता कर</p>
            <p className="font-sans text-body-md text-on-surface-variant line-clamp-2">
              View, assess, and pay your annual municipal property tax online securely.
            </p>
          </div>
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-outline-variant/30">
            <button className="bg-primary text-on-primary font-sans text-label-md px-5 py-2.5 rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-colors w-full text-center font-semibold">
              Apply Now
            </button>
          </div>
        </div>

        {/* Service Card 2: Water Connection */}
        <div className="group bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col gap-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
          <div className="w-14 h-14 rounded-lg bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
            <Droplet className="w-7 h-7" />
          </div>
          <div className="flex-grow">
            <h2 className="font-heading text-title-md font-semibold text-on-surface mb-1">
              Water Connection
            </h2>
            <p className="font-sans text-label-md text-on-surface-variant mb-3 font-medium">पाणी जोडणी</p>
            <p className="font-sans text-body-md text-on-surface-variant line-clamp-2">
              Apply for new residential or commercial water supply connections and view bills.
            </p>
          </div>
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-outline-variant/30">
            <button className="bg-primary text-on-primary font-sans text-label-md px-5 py-2.5 rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-colors w-full text-center font-semibold">
              Apply Now
            </button>
          </div>
        </div>

        {/* Service Card 3: Birth/Death Certificates */}
        <div className="group bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col gap-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
          <div className="w-14 h-14 rounded-lg bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
            <FileText className="w-7 h-7" />
          </div>
          <div className="flex-grow">
            <h2 className="font-heading text-title-md font-semibold text-on-surface mb-1">
              Birth/Death Certificates
            </h2>
            <p className="font-sans text-label-md text-on-surface-variant mb-3 font-medium">जन्म/मृत्यू प्रमाणपत्र</p>
            <p className="font-sans text-body-md text-on-surface-variant line-clamp-2">
              Register civil events and download digitally signed official certificates.
            </p>
          </div>
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-outline-variant/30">
            <button className="bg-surface text-primary border border-outline-variant font-sans text-label-md px-5 py-2.5 rounded-lg hover:bg-surface-container-low hover:border-primary transition-colors w-full text-center font-semibold">
              Know More
            </button>
          </div>
        </div>

        {/* Service Card 4: Building Permissions */}
        <div className="group bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col gap-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
          <div className="w-14 h-14 rounded-lg bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
            <Building2 className="w-7 h-7" />
          </div>
          <div className="flex-grow">
            <h2 className="font-heading text-title-md font-semibold text-on-surface mb-1">
              Building Permissions
            </h2>
            <p className="font-sans text-label-md text-on-surface-variant mb-3 font-medium">इमारत परवानगी</p>
            <p className="font-sans text-body-md text-on-surface-variant line-clamp-2">
              Submit architectural plans for approval and track your building permit status.
            </p>
          </div>
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-outline-variant/30">
            <button className="bg-primary text-on-primary font-sans text-label-md px-5 py-2.5 rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-colors w-full text-center font-semibold">
              Apply Now
            </button>
          </div>
        </div>

        {/* Service Card 5: Trade License */}
        <div className="group bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col gap-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
          <div className="w-14 h-14 rounded-lg bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
            <Store className="w-7 h-7" />
          </div>
          <div className="flex-grow">
            <h2 className="font-heading text-title-md font-semibold text-on-surface mb-1">
              Trade License
            </h2>
            <p className="font-sans text-label-md text-on-surface-variant mb-3 font-medium">व्यवसाय परवाना</p>
            <p className="font-sans text-body-md text-on-surface-variant line-clamp-2">
              Apply for or renew your municipal business license for commercial operations.
            </p>
          </div>
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-outline-variant/30">
            <button className="bg-primary text-on-primary font-sans text-label-md px-5 py-2.5 rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-colors w-full text-center font-semibold">
              Apply Now
            </button>
          </div>
        </div>

        {/* Service Card 6: Marriage Registration */}
        <div className="group bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col gap-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
          <div className="w-14 h-14 rounded-lg bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
            <Users className="w-7 h-7" />
          </div>
          <div className="flex-grow">
            <h2 className="font-heading text-title-md font-semibold text-on-surface mb-1">
              Marriage Registration
            </h2>
            <p className="font-sans text-label-md text-on-surface-variant mb-3 font-medium">विवाह नोंदणी</p>
            <p className="font-sans text-body-md text-on-surface-variant line-clamp-2">
              Register marriage records and obtain certified documentation online.
            </p>
          </div>
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-outline-variant/30">
            <button className="bg-surface text-primary border border-outline-variant font-sans text-label-md px-5 py-2.5 rounded-lg hover:bg-surface-container-low hover:border-primary transition-colors w-full text-center font-semibold">
              Know More
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
