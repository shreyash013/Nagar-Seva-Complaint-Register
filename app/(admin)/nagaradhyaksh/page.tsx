"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Filter,
  AlertTriangle,
  Percent,
  Clock,
  Droplet,
  Trash2,
  Lightbulb,
  Route,
  Eye,
  X,
  Image as ImageIcon
} from "lucide-react";
import { getComplaints, updateComplaintStatus, Complaint, getCurrentUser, subscribeToSync } from "@/lib/store";

export default function NagaradhyakshDashboard() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [viewComplaint, setViewComplaint] = useState<Complaint | null>(null);
  const [filterTime, setFilterTime] = useState("All Time");

  const refreshComplaints = () => {
    setComplaints(getComplaints());
  };

  useEffect(() => {
    queueMicrotask(() => {
      getCurrentUser();
      refreshComplaints();
    });

    const unsubscribe = subscribeToSync(() => {
      refreshComplaints();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleStatusChange = (id: string, newStatus: "Pending" | "In Progress" | "Resolved") => {
    updateComplaintStatus(id, newStatus);
    refreshComplaints();
    if (viewComplaint && viewComplaint.id === id) {
      setViewComplaint((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  // Metrics Calculations
  const totalCount = complaints.length;
  const resolvedCount = complaints.filter((c) => c.status === "Resolved").length;
  const inProgressCount = complaints.filter((c) => c.status === "In Progress").length;
  const pendingCount = complaints.filter((c) => c.status === "Pending").length;
  const resolutionRate = totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) : 0;

  // Category Counts
  const waterCount = complaints.filter((c) => c.category.toLowerCase().includes("water")).length;
  const garbageCount = complaints.filter((c) => c.category.toLowerCase().includes("garbage") || c.category.toLowerCase().includes("solid")).length;
  const lightsCount = complaints.filter((c) => c.category.toLowerCase().includes("light")).length;
  const roadsCount = complaints.filter((c) => c.category.toLowerCase().includes("road")).length;

  return (
    <main className="flex-1 p-margin-mobile md:p-margin-desktop w-full max-w-container-max mx-auto pb-32 md:pb-margin-desktop relative">
      {/* Modal for Complaint Details & Photo */}
      {viewComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/50 backdrop-blur-sm p-4">
          <div className="bg-surface rounded-xl shadow-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-outline-variant pb-4 mb-4">
              <div>
                <h2 className="font-heading text-title-lg font-bold text-on-surface">Complaint Details</h2>
                <p className="font-sans text-label-md text-on-surface-variant">ID: {viewComplaint.id}</p>
              </div>
              <button
                onClick={() => setViewComplaint(null)}
                className="p-2 hover:bg-surface-container rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-on-surface-variant" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-surface-container-low p-4 rounded-lg">
                <p className="font-sans text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">
                  Citizen / Applier
                </p>
                <p className="font-sans text-body-md font-semibold text-on-surface">{viewComplaint.citizenName}</p>
              </div>
              <div className="bg-surface-container-low p-4 rounded-lg">
                <p className="font-sans text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">
                  Category
                </p>
                <p className="font-sans text-body-md font-semibold text-on-surface">{viewComplaint.category}</p>
              </div>
              <div className="bg-surface-container-low p-4 rounded-lg">
                <p className="font-sans text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">
                  Ward & Area
                </p>
                <p className="font-sans text-body-md font-semibold text-on-surface">
                  {viewComplaint.ward} {viewComplaint.area ? `(${viewComplaint.area})` : ""}
                </p>
              </div>
              <div className="bg-surface-container-low p-4 rounded-lg">
                <p className="font-sans text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">
                  Status
                </p>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary">
                  {viewComplaint.status}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <p className="font-sans text-label-sm text-on-surface-variant uppercase tracking-wider mb-2">
                Description
              </p>
              <p className="font-sans text-body-md text-on-surface bg-surface-container-lowest border border-outline-variant rounded-lg p-4">
                {viewComplaint.description}
              </p>
            </div>

            {/* Uploaded Photo Evidence */}
            {viewComplaint.image && (
              <div className="mb-6">
                <p className="font-sans text-label-sm text-on-surface-variant uppercase tracking-wider mb-2 font-semibold flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-primary" />
                  Uploaded Photo Evidence (नागरिकाचा फोटो पुरावा)
                </p>
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-3 flex justify-center bg-black/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={viewComplaint.image}
                    alt="Citizen Uploaded Evidence"
                    className="max-h-72 w-auto object-contain rounded-lg shadow-sm border border-outline-variant"
                  />
                </div>
              </div>
            )}

            <div>
              <p className="font-sans text-label-sm text-on-surface-variant uppercase tracking-wider mb-2">
                Timeline Updates
              </p>
              <div className="flex flex-col gap-3">
                {viewComplaint.timeline.map((t, idx) => (
                  <div key={idx} className="bg-surface-container border border-outline-variant/50 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-sans text-label-sm font-bold text-primary">{t.status}</span>
                      <span className="font-sans text-label-sm text-on-surface-variant">{t.date}</span>
                    </div>
                    <p className="font-sans text-body-sm text-on-surface">{t.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-stack-lg">
        <div>
          <h1 className="font-heading text-headline-lg text-on-surface font-bold">
            Executive Command Center <span className="font-sans font-normal text-title-md text-on-surface-variant ml-2">(नगराध्यक्ष डॅशबोर्ड)</span>
          </h1>
          <p className="font-sans text-body-md text-on-surface-variant mt-1">
            Real-time municipal grievance tracking and administrative analytics.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-surface border border-outline-variant rounded-xl p-1.5 shadow-xs">
            <Filter className="w-4 h-4 text-on-surface-variant ml-2 mr-1" />
            <select
              value={filterTime}
              onChange={(e) => setFilterTime(e.target.value)}
              className="bg-transparent font-sans text-label-md font-semibold text-on-surface focus:outline-none cursor-pointer pr-2"
            >
              <option value="All Time">All Time</option>
              <option value="This Month">This Month</option>
              <option value="This Week">This Week</option>
              <option value="Today">Today</option>
            </select>
          </div>
        </div>
      </div>

      {/* Top Metric Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter mb-stack-lg">
        <div className="bg-surface rounded-xl p-5 border border-outline-variant shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-sans text-label-sm text-on-surface-variant uppercase font-semibold">Total Complaints</span>
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="font-heading text-display-md font-bold text-on-surface">{totalCount}</span>
            <p className="font-sans text-label-xs text-on-surface-variant mt-1">Registered across 10 Wards</p>
          </div>
        </div>

        <div className="bg-surface rounded-xl p-5 border border-outline-variant shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-sans text-label-sm text-on-surface-variant uppercase font-semibold">Resolution Rate</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
              <Percent className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="font-heading text-display-md font-bold text-emerald-700">{resolutionRate}%</span>
            <p className="font-sans text-label-xs text-emerald-600 font-semibold mt-1">{resolvedCount} Resolved Complaints</p>
          </div>
        </div>

        <div className="bg-surface rounded-xl p-5 border border-outline-variant shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-sans text-label-sm text-on-surface-variant uppercase font-semibold">In Progress</span>
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="font-heading text-display-md font-bold text-amber-700">{inProgressCount}</span>
            <p className="font-sans text-label-xs text-amber-600 font-semibold mt-1">Active field operations</p>
          </div>
        </div>

        <div className="bg-surface rounded-xl p-5 border border-outline-variant shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-sans text-label-sm text-on-surface-variant uppercase font-semibold">Pending Action</span>
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-700">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="font-heading text-display-md font-bold text-red-700">{pendingCount}</span>
            <p className="font-sans text-label-xs text-red-600 font-semibold mt-1">Awaiting staff assignment</p>
          </div>
        </div>
      </section>

      {/* Category Breakdown & Ward Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter mb-stack-lg">
        {/* Category Breakdown */}
        <section className="lg:col-span-6 bg-surface rounded-xl p-6 border border-outline-variant shadow-xs">
          <h2 className="font-heading text-title-md font-bold text-on-surface mb-4">Department Category Breakdown</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/60 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                <Droplet className="w-5 h-5" />
              </div>
              <div>
                <p className="font-sans text-label-xs text-on-surface-variant uppercase font-bold">Water Supply</p>
                <p className="font-heading text-title-lg font-bold text-on-surface">{waterCount} Issues</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/60 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <p className="font-sans text-label-xs text-on-surface-variant uppercase font-bold">Solid Waste</p>
                <p className="font-heading text-title-lg font-bold text-on-surface">{garbageCount} Issues</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/60 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <p className="font-sans text-label-xs text-on-surface-variant uppercase font-bold">Streetlights</p>
                <p className="font-heading text-title-lg font-bold text-on-surface">{lightsCount} Issues</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/60 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                <Route className="w-5 h-5" />
              </div>
              <div>
                <p className="font-sans text-label-xs text-on-surface-variant uppercase font-bold">Roads & Drainage</p>
                <p className="font-heading text-title-lg font-bold text-on-surface">{roadsCount} Issues</p>
              </div>
            </div>
          </div>
        </section>

        {/* Live Recent Complaints Table */}
        <section className="lg:col-span-6 bg-surface rounded-xl p-6 border border-outline-variant shadow-xs">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-heading text-title-md font-bold text-on-surface">Recent Live Complaints</h2>
            <span className="font-sans text-label-xs bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-bold">
              Live Sync Active
            </span>
          </div>

          <div className="divide-y divide-outline-variant overflow-y-auto max-h-72">
            {complaints.length === 0 ? (
              <p className="text-on-surface-variant text-body-md py-6 text-center">No complaints registered yet.</p>
            ) : (
              complaints.slice(0, 5).map((c) => (
                <div key={c.id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-label-xs font-bold text-primary">{c.id}</span>
                      <span className="font-sans text-label-xs font-semibold text-on-surface">{c.ward}</span>
                      {c.image && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold">
                          <ImageIcon className="w-3 h-3" /> Photo
                        </span>
                      )}
                    </div>
                    <p className="font-sans text-body-sm font-semibold text-on-surface line-clamp-1">{c.description}</p>
                    <p className="font-sans text-label-xs text-on-surface-variant">By {c.citizenName} • {c.date}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewComplaint(c)}
                      className="p-1.5 hover:bg-surface-container rounded-lg transition-colors text-primary"
                      title="View Details & Photo"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <select
                      value={c.status}
                      onChange={(e) => handleStatusChange(c.id, e.target.value as "Pending" | "In Progress" | "Resolved")}
                      className="text-xs font-bold rounded-lg border border-outline-variant px-2 py-1 bg-surface"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
