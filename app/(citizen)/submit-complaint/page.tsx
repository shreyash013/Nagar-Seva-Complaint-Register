"use client";

import { Droplet, Trash2, Map, Lightbulb, Dog, TreePine, Waves, MoreHorizontal, Upload, Send, CheckCircle, ArrowRight, Image as ImageIcon } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { addComplaint, Complaint, getCurrentUser, User } from "@/lib/store";

export default function SubmitComplaint() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [trackingId, setTrackingId] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [descriptionText, setDescriptionText] = useState("");
  const router = useRouter();

  useEffect(() => {
    queueMicrotask(() => {
      setIsMounted(true);
      const currentUser = getCurrentUser();
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
      }
    });
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setSelectedFiles(files);
      
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const category = formData.get("category") as string;
    const ward = formData.get("ward") as string;
    const description = formData.get("description") as string;
    const area = formData.get("area") as string;
    const citizenName = (formData.get("citizenName") as string) || user?.name || "Anonymous Citizen";
    
    setTimeout(() => {
      const generatedId = `SH-2024-${Math.floor(1000 + Math.random() * 9000)}`;
      
      const newComplaint: Complaint = {
        id: generatedId,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        citizenName: citizenName,
        category: category.charAt(0).toUpperCase() + category.slice(1).replace("_", " "),
        description: description,
        ward: `Ward ${ward}`,
        area: area,
        image: imagePreview || undefined,
        status: "Pending",
        timeline: [
          { status: "Complaint Submitted", date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), note: "Complaint registered online." }
        ]
      };
      
      addComplaint(newComplaint);
      
      setTrackingId(generatedId);
      setIsSubmitting(false);
      setShowSuccessModal(true);
    }, 800);
  };

  if (!isMounted || !user) {
    return <div className="min-h-screen flex items-center justify-center bg-background text-primary">Loading...</div>;
  }

  return (
    <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-md md:py-stack-lg mb-20 md:mb-0 relative">
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/50 backdrop-blur-sm p-4">
          <div className="bg-surface rounded-xl shadow-lg max-w-md w-full p-8 flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="font-heading text-title-md font-bold text-on-surface mb-2">Complaint Submitted Successfully!</h2>
            <p className="font-sans text-body-md text-on-surface-variant mb-6">
              Your complaint has been registered. Our team will look into it shortly.
            </p>
            <div className="bg-surface-container-low border border-outline-variant rounded-lg p-4 w-full mb-6 flex flex-col items-center">
              <p className="font-sans text-label-sm text-on-surface-variant uppercase tracking-wide mb-1">Your Tracking ID</p>
              <p className="font-heading text-headline-lg font-bold text-primary">{trackingId}</p>
            </div>
            <div className="flex flex-col gap-3 w-full">
              <Link 
                href={`/track-complaints?id=${trackingId}`}
                className="w-full bg-primary text-on-primary py-3 rounded-lg font-sans text-label-md flex justify-center items-center gap-2 hover:bg-primary-container hover:text-on-primary-container transition-colors font-semibold"
              >
                Track My Complaint
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button 
                onClick={() => {
                  setShowSuccessModal(false);
                  router.push("/");
                }}
                className="w-full bg-transparent text-primary py-3 rounded-lg font-sans text-label-md border border-outline-variant hover:bg-surface-container transition-colors font-semibold"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-stack-md flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="font-heading text-headline-lg text-on-surface mb-2 font-bold">Submit a Complaint</h1>
          <p className="text-on-surface-variant font-sans text-body-md">Please provide details about the issue you are facing.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-sans text-label-sm text-on-surface-variant">Language:</span>
          <button className="font-sans text-label-md bg-surface-container-low text-primary px-3 py-1 rounded-full border border-outline-variant hover:bg-surface-container transition-colors">
            English / मराठी
          </button>
        </div>
      </div>

      {/* Form Bento Grid Layout */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        {/* Left Column: Details */}
        <div className="md:col-span-8 flex flex-col gap-stack-md">
          {/* Category Section */}
          <section className="bg-surface rounded-xl border border-outline-variant p-6">
            <h2 className="font-heading text-title-md text-on-surface mb-4 font-bold">1. Select Category <span className="text-on-surface-variant font-sans text-body-md ml-2 font-normal">वर्ग निवडा</span></h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <label className="cursor-pointer relative">
                <input className="peer sr-only" name="category" type="radio" value="water" defaultChecked />
                <div className="flex flex-col items-center justify-center p-4 border border-outline-variant rounded-lg bg-surface peer-checked:bg-surface-container-high peer-checked:border-primary peer-checked:shadow-sm transition-all hover:bg-surface-container-low h-full text-center">
                  <Droplet className="text-primary mb-2 w-8 h-8" />
                  <span className="font-sans text-label-md text-on-surface font-semibold">Water Supply<br/><span className="text-xs text-on-surface-variant font-normal">पाणीपुरवठा</span></span>
                </div>
              </label>
              
              <label className="cursor-pointer relative">
                <input className="peer sr-only" name="category" type="radio" value="garbage" />
                <div className="flex flex-col items-center justify-center p-4 border border-outline-variant rounded-lg bg-surface peer-checked:bg-surface-container-high peer-checked:border-primary peer-checked:shadow-sm transition-all hover:bg-surface-container-low h-full text-center">
                  <Trash2 className="text-primary mb-2 w-8 h-8" />
                  <span className="font-sans text-label-md text-on-surface font-semibold">Garbage<br/><span className="text-xs text-on-surface-variant font-normal">कचरा</span></span>
                </div>
              </label>
              
              <label className="cursor-pointer relative">
                <input className="peer sr-only" name="category" type="radio" value="roads" />
                <div className="flex flex-col items-center justify-center p-4 border border-outline-variant rounded-lg bg-surface peer-checked:bg-surface-container-high peer-checked:border-primary peer-checked:shadow-sm transition-all hover:bg-surface-container-low h-full text-center">
                  <Map className="text-primary mb-2 w-8 h-8" />
                  <span className="font-sans text-label-md text-on-surface font-semibold">Roads<br/><span className="text-xs text-on-surface-variant font-normal">रस्ते</span></span>
                </div>
              </label>
              
              <label className="cursor-pointer relative">
                <input className="peer sr-only" name="category" type="radio" value="streetlights" />
                <div className="flex flex-col items-center justify-center p-4 border border-outline-variant rounded-lg bg-surface peer-checked:bg-surface-container-high peer-checked:border-primary peer-checked:shadow-sm transition-all hover:bg-surface-container-low h-full text-center">
                  <Lightbulb className="text-primary mb-2 w-8 h-8" />
                  <span className="font-sans text-label-md text-on-surface font-semibold">Streetlights<br/><span className="text-xs text-on-surface-variant font-normal">रस्त्यावरील दिवे</span></span>
                </div>
              </label>

              <label className="cursor-pointer relative">
                <input className="peer sr-only" name="category" type="radio" value="stray_animals" />
                <div className="flex flex-col items-center justify-center p-4 border border-outline-variant rounded-lg bg-surface peer-checked:bg-surface-container-high peer-checked:border-primary peer-checked:shadow-sm transition-all hover:bg-surface-container-low h-full text-center">
                  <Dog className="text-primary mb-2 w-8 h-8" />
                  <span className="font-sans text-label-md text-on-surface font-semibold">Stray Animals<br/><span className="text-xs text-on-surface-variant font-normal">भटकी जनावरे</span></span>
                </div>
              </label>

              <label className="cursor-pointer relative">
                <input className="peer sr-only" name="category" type="radio" value="tree_trimming" />
                <div className="flex flex-col items-center justify-center p-4 border border-outline-variant rounded-lg bg-surface peer-checked:bg-surface-container-high peer-checked:border-primary peer-checked:shadow-sm transition-all hover:bg-surface-container-low h-full text-center">
                  <TreePine className="text-primary mb-2 w-8 h-8" />
                  <span className="font-sans text-label-md text-on-surface font-semibold">Tree Trimming<br/><span className="text-xs text-on-surface-variant font-normal">झाडांची छाटणी</span></span>
                </div>
              </label>

              <label className="cursor-pointer relative">
                <input className="peer sr-only" name="category" type="radio" value="drainage" />
                <div className="flex flex-col items-center justify-center p-4 border border-outline-variant rounded-lg bg-surface peer-checked:bg-surface-container-high peer-checked:border-primary peer-checked:shadow-sm transition-all hover:bg-surface-container-low h-full text-center">
                  <Waves className="text-primary mb-2 w-8 h-8" />
                  <span className="font-sans text-label-md text-on-surface font-semibold">Drainage<br/><span className="text-xs text-on-surface-variant font-normal">सांडपाणी</span></span>
                </div>
              </label>

              <label className="cursor-pointer relative">
                <input className="peer sr-only" name="category" type="radio" value="others" />
                <div className="flex flex-col items-center justify-center p-4 border border-outline-variant rounded-lg bg-surface peer-checked:bg-surface-container-high peer-checked:border-primary peer-checked:shadow-sm transition-all hover:bg-surface-container-low h-full text-center">
                  <MoreHorizontal className="text-primary mb-2 w-8 h-8" />
                  <span className="font-sans text-label-md text-on-surface font-semibold">Others<br/><span className="text-xs text-on-surface-variant font-normal">इतर</span></span>
                </div>
              </label>
            </div>
          </section>

          {/* Location & Personal Section */}
          <section className="bg-surface rounded-xl border border-outline-variant p-6">
            <h2 className="font-heading text-title-md text-on-surface mb-4 font-bold">2. Location & Personal Details <span className="text-on-surface-variant font-sans text-body-md ml-2 font-normal">ठिकाण आणि वैयक्तिक तपशील</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-sans text-label-md text-on-surface font-semibold">Your Full Name <span className="text-error">*</span></label>
                <input name="citizenName" defaultValue={user.name} required className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-sans text-body-md" placeholder="Enter your full name" type="text" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-sans text-label-md text-on-surface font-semibold">Ward Number (प्रभाग क्रमांक) <span className="text-error">*</span></label>
                <select name="ward" defaultValue="" required className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-sans text-body-md">
                  <option disabled value="">Select Ward</option>
                  <option value="1">Ward 1 - Shivaji Chowk Area (प्रभाग १)</option>
                  <option value="2">Ward 2 - Market Yard Area (प्रभाग २)</option>
                  <option value="3">Ward 3 - Station Road Area (प्रभाग ३)</option>
                  <option value="4">Ward 4 - Gavbhag Main Area (प्रभाग ४)</option>
                  <option value="5">Ward 5 - Datta Mandir Area (प्रभाग ५)</option>
                  <option value="6">Ward 6 - Industrial Estate Area (प्रभाग ६)</option>
                  <option value="7">Ward 7 - Subhash Nagar Area (प्रभाग ७)</option>
                  <option value="8">Ward 8 - Riverfront Road Area (प्रभाग ८)</option>
                  <option value="9">Ward 9 - Sangli Road Colony (प्रभाग ९)</option>
                  <option value="10">Ward 10 - New Extension Area (प्रभाग १०)</option>
                </select>
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="font-sans text-label-md text-on-surface font-semibold">Area / Landmark <span className="text-error">*</span></label>
                <input name="area" required className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-sans text-body-md" placeholder="Enter specific locality or landmark" type="text" />
              </div>
            </div>
          </section>

          {/* Description Section */}
          <section className="bg-surface rounded-xl border border-outline-variant p-6">
            <h2 className="font-heading text-title-md text-on-surface mb-4 font-bold">3. Complaint Description <span className="text-on-surface-variant font-sans text-body-md ml-2 font-normal">तक्रार वर्णन</span></h2>
            <div className="flex flex-col gap-2">
              <label className="font-sans text-label-md text-on-surface font-semibold">Detailed Information <span className="text-error">*</span></label>
              <textarea 
                name="description" 
                required 
                maxLength={500}
                value={descriptionText}
                onChange={(e) => setDescriptionText(e.target.value)}
                className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-sans text-body-md resize-none" 
                placeholder="Please describe the issue in detail..." 
                rows={4}
              ></textarea>
              <div className="flex justify-between items-center font-sans text-label-sm">
                <span className="text-on-surface-variant">Min. 10 characters required</span>
                <span className={`font-bold ${descriptionText.length >= 500 ? "text-error" : descriptionText.length > 0 ? "text-primary" : "text-on-surface-variant"}`}>
                  {descriptionText.length} / 500 characters
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Evidence & Submit */}
        <div className="md:col-span-4 flex flex-col gap-stack-md">
          {/* Photo Upload */}
          <section className="bg-surface rounded-xl border border-outline-variant p-6 flex-grow flex flex-col">
            <h2 className="font-heading text-title-md text-on-surface mb-4 font-bold">4. Evidence (Photo Upload) <span className="text-on-surface-variant font-sans text-body-md ml-2 font-normal">फोटो पुरावा</span></h2>
            <label className="border-2 border-dashed border-outline-variant rounded-xl flex-grow flex flex-col items-center justify-center p-6 bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer text-center group relative overflow-hidden">
              <input 
                type="file" 
                name="evidence" 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange}
              />
              {imagePreview ? (
                <div className="w-full h-full flex flex-col items-center justify-center space-y-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imagePreview} alt="Uploaded evidence" className="w-full h-40 object-cover rounded-lg shadow-sm border border-outline-variant" />
                  <p className="font-sans text-label-xs text-primary font-bold flex items-center gap-1">
                    <ImageIcon className="w-3.5 h-3.5" />
                    Image Attached (Click to replace)
                  </p>
                </div>
              ) : (
                <>
                  <Upload className="text-outline-variant group-hover:text-primary mb-2 w-12 h-12" />
                  <p className="font-sans text-label-md text-on-surface mb-1 font-semibold">Click to upload photo evidence</p>
                  <p className="font-sans text-label-sm text-on-surface-variant">JPG, PNG, GIF (max. 5MB)</p>
                  <span className="mt-4 px-4 py-2 bg-surface text-primary border border-outline-variant rounded-lg font-sans text-label-md hover:bg-surface-container-lowest transition-colors font-semibold">Select Photo</span>
                </>
              )}

              {selectedFiles.length > 0 && !imagePreview && (
                <div className="mt-4 text-left w-full max-w-[200px]">
                  <p className="font-sans text-label-sm text-on-surface-variant mb-1 font-semibold font-mono">{selectedFiles[0].name}</p>
                </div>
              )}
            </label>
          </section>

          {/* Actions */}
          <section className="bg-surface-container-low rounded-xl border border-outline-variant p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-2">
                <input required className="mt-1 w-4 h-4 text-primary bg-surface border-outline-variant rounded focus:ring-primary focus:ring-2" id="terms" type="checkbox" />
                <label className="font-sans text-label-sm text-on-surface-variant" htmlFor="terms">I declare that the information provided is true to my knowledge.</label>
              </div>
              <button 
                disabled={isSubmitting}
                className="w-full bg-primary text-on-primary py-3 rounded-lg font-sans text-label-md flex justify-center items-center gap-2 hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm font-semibold disabled:opacity-70" 
                type="submit"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full"></span>
                    Submitting...
                  </span>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Complaint
                  </>
                )}
              </button>
            </div>
          </section>
        </div>
      </form>
    </main>
  );
}
