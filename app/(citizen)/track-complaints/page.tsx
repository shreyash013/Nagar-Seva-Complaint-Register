"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { Search, Check } from "lucide-react";
import { getComplaints, subscribeToSync, Complaint } from "@/lib/store";

function TrackComplaintsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialId = searchParams.get("id") || "";
  const [searchId, setSearchId] = useState(initialId);
  const [currentId, setCurrentId] = useState(initialId);
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    queueMicrotask(() => {
      setComplaints(getComplaints());
    });

    const unsubscribe = subscribeToSync(() => {
      setComplaints(getComplaints());
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId.trim()) {
      setCurrentId(searchId.trim());
      router.push(`/track-complaints?id=${searchId.trim()}`);
    }
  };

  const trackedComplaint = complaints.find((c) => c.id === currentId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-orange-100 text-orange-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <main className="flex-1 w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-md flex flex-col gap-stack-lg mb-20 md:mb-0">
      {/* Page Header */}
      <div className="flex flex-col gap-2 pt-4 md:pt-0">
        <h1 className="font-heading text-headline-lg text-on-surface font-bold">My Tracking</h1>
        <p className="font-sans text-body-md text-on-surface-variant">
          View and track the status of your submitted complaints and requests.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter items-start">
        {/* Left Column: Active Tracking (Bento-style featured card) */}
        <div className="lg:col-span-2 flex flex-col gap-stack-md">
          {/* Search Box */}
          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter Ticket ID (e.g. SH-2024-892)"
              className="flex-1 bg-surface border border-outline-variant rounded-lg px-4 py-3 font-sans text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <button
              type="submit"
              className="bg-primary text-on-primary px-6 py-3 rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-colors font-sans text-label-md font-semibold flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              Track
            </button>
          </form>

          {trackedComplaint ? (
            <div className="bg-surface border border-outline-variant rounded-xl p-6 flex flex-col gap-stack-md shadow-sm">
              <div className="flex justify-between items-start border-b border-outline-variant pb-4">
                <div className="flex flex-col gap-1">
                  <span className="font-sans text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                    Active Complaint
                  </span>
                  <h2 className="font-heading text-title-md text-on-surface font-bold">
                    {trackedComplaint.category}
                  </h2>
                  <p className="font-sans text-body-md text-on-surface-variant mt-1 font-medium">
                    Ticket ID: {trackedComplaint.id}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full font-sans text-label-sm font-bold ${getStatusColor(
                    trackedComplaint.status
                  )}`}
                >
                  {trackedComplaint.status}
                </span>
              </div>

              {/* Timeline */}
              <div className="py-4 pl-4 border-l-2 border-outline-variant ml-4 flex flex-col gap-8 relative">
                {trackedComplaint.timeline.map((event, index) => {
                  const isLast = index === trackedComplaint.timeline.length - 1;
                  const isResolved = event.status === "Resolved";
                  return (
                    <div key={index} className="relative">
                      <div
                        className={`absolute -left-[27px] top-0 w-6 h-6 rounded-full flex items-center justify-center ${
                          isLast && !isResolved ? "bg-surface border-2 border-primary" : "bg-primary"
                        }`}
                      >
                        {isLast && !isResolved ? (
                          <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                        ) : (
                          <Check className="text-on-primary w-4 h-4" />
                        )}
                      </div>
                      <div className="flex flex-col gap-1">
                        <span
                          className={`font-sans text-label-md font-bold ${
                            isLast && !isResolved ? "text-primary" : "text-on-surface"
                          }`}
                        >
                          {event.status}
                        </span>
                        <span className="font-sans text-label-sm text-on-surface-variant">{event.date}</span>
                        <p
                          className={`font-sans text-body-md text-on-surface-variant mt-2 bg-surface-container-low p-3 rounded-md ${
                            isLast && !isResolved ? "border border-primary-container/30" : ""
                          }`}
                        >
                          {event.note}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {/* Show a pending step if not resolved */}
                {trackedComplaint.status !== "Resolved" && (
                  <div className="relative opacity-50">
                    <div className="absolute -left-[27px] top-0 w-6 h-6 rounded-full bg-surface border-2 border-outline-variant flex items-center justify-center"></div>
                    <div className="flex flex-col gap-1">
                      <span className="font-sans text-label-md text-on-surface-variant font-semibold">Resolved</span>
                      <span className="font-sans text-label-sm text-on-surface-variant">Pending</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-4 mt-4 pt-4 border-t border-outline-variant">
                <button className="px-6 py-2 bg-primary text-on-primary font-sans text-label-md rounded-md hover:bg-primary-container hover:text-on-primary-container transition-colors font-semibold">
                  Add Note
                </button>
                <button className="px-6 py-2 border border-outline-variant text-primary font-sans text-label-md rounded-md hover:bg-surface-container-low transition-colors font-semibold">
                  Contact Support
                </button>
              </div>
            </div>
          ) : currentId ? (
            <div className="bg-surface border border-outline-variant rounded-xl p-12 flex flex-col items-center justify-center text-center shadow-sm">
              <Search className="w-12 h-12 text-outline-variant mb-4" />
              <h3 className="font-heading text-title-md text-on-surface font-semibold mb-2">Complaint Not Found</h3>
              <p className="font-sans text-body-md text-on-surface-variant max-w-sm">
                No complaint was found with ID &quot;{currentId}&quot;. Please check and try again.
              </p>
            </div>
          ) : (
            <div className="bg-surface border border-outline-variant rounded-xl p-12 flex flex-col items-center justify-center text-center shadow-sm">
              <Search className="w-12 h-12 text-outline-variant mb-4" />
              <h3 className="font-heading text-title-md text-on-surface font-semibold mb-2">No Complaint Selected</h3>
              <p className="font-sans text-body-md text-on-surface-variant max-w-sm">
                Enter your Ticket ID above to view the tracking status of your complaint.
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Past Complaints List */}
        <div className="lg:col-span-1 flex flex-col gap-stack-md">
          <h3 className="font-heading text-title-md text-on-surface font-bold">Recent History</h3>
          <div className="flex flex-col gap-4">
            {complaints.length > 0 ? (
              complaints.map((complaint) => (
                <div
                  key={complaint.id}
                  onClick={() => {
                    setSearchId(complaint.id);
                    setCurrentId(complaint.id);
                    router.push(`/track-complaints?id=${complaint.id}`);
                  }}
                  className={`bg-surface border ${
                    currentId === complaint.id ? "border-primary" : "border-outline-variant"
                  } rounded-lg p-4 hover:shadow-sm transition-shadow cursor-pointer`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-sans text-label-sm text-on-surface-variant font-semibold">
                      {complaint.id}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full font-sans text-label-sm font-semibold ${getStatusColor(
                        complaint.status
                      )}`}
                    >
                      {complaint.status}
                    </span>
                  </div>
                  <h4 className="font-sans text-label-md text-on-surface mb-1 font-semibold">{complaint.category}</h4>
                  <p className="font-sans text-body-md text-on-surface-variant text-sm mb-3 line-clamp-2">
                    {complaint.description}
                  </p>
                  <div className="flex justify-between items-center pt-3 border-t border-outline-variant">
                    <span className="font-sans text-label-sm text-on-surface-variant">{complaint.date}</span>
                    {complaint.status === "Resolved" && (
                      <button
                        className="text-primary font-sans text-label-sm hover:underline font-semibold"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Provide Feedback
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-4 text-on-surface-variant font-sans text-body-md">
                No recent complaints found.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function TrackComplaints() {
  return (
    <Suspense fallback={<div className="p-margin-desktop text-center">Loading tracker...</div>}>
      <TrackComplaintsContent />
    </Suspense>
  );
}
