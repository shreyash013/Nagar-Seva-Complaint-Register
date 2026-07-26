"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Percent,
  Clock,
  Droplet,
  Trash2,
  Lightbulb,
  Route,
  Eye,
  X
} from "lucide-react";
import { getComplaints, updateComplaintStatus, Complaint, getCurrentUser } from "@/lib/store";

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

    const handleStorage = () => refreshComplaints();
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
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
  const pendingCount = complaints.filter((c) => c.status === "Pending").length;
  const inProgressCount = complaints.filter((c) => c.status === "In Progress").length;
  const resolutionRate = totalCount > 0 ? ((resolvedCount / totalCount) * 100).toFixed(1) : "0.0";

  // Category counts
  const categoriesList = [
    { name: "Water Supply", icon: Droplet, color: "bg-secondary", textCol: "text-secondary" },
    { name: "Solid Waste", icon: Trash2, color: "bg-orange-600", textCol: "text-orange-700" },
    { name: "Streetlights", icon: Lightbulb, color: "bg-primary", textCol: "text-primary" },
    { name: "Roads", icon: Route, color: "bg-outline", textCol: "text-outline" }
  ];

  const categoryMetrics = categoriesList.map((cat) => {
    const count = complaints.filter(
      (c) =>
        c.category.toLowerCase().includes(cat.name.toLowerCase()) ||
        (cat.name === "Solid Waste" && c.category.toLowerCase().includes("garbage"))
    ).length;
    const pct = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
    return { ...cat, count, pct };
  });

  // Ward counts for top wards
  const wards = ["Ward 1", "Ward 2", "Ward 3", "Ward 4", "Ward 5", "Ward 6", "Ward 7"];
  const maxWardCount = Math.max(...wards.map((w) => complaints.filter((c) => c.ward === w).length), 1);
  const wardMetrics = wards.map((w) => {
    const count = complaints.filter((c) => c.ward === w).length;
    const heightPct = Math.max(15, Math.round((count / maxWardCount) * 100));
    return { label: w.replace("Ward ", "W"), ward: w, count, height: `${heightPct}%` };
  });

  // High Priority / Active Escalations
  const activeComplaints = complaints.filter((c) => c.status !== "Resolved");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return (
          <span className="px-3 py-1 rounded-full bg-error-container text-on-error-container font-sans text-label-sm font-semibold">
            Critical
          </span>
        );
      case "In Progress":
        return (
          <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-800 font-sans text-label-sm font-semibold">
            High
          </span>
        );
      case "Resolved":
        return (
          <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 font-sans text-label-sm font-semibold">
            Resolved
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <main className="flex-1 p-margin-mobile md:p-margin-desktop w-full max-w-container-max mx-auto pb-32 md:pb-margin-desktop">
      {/* View Detail Modal */}
      {viewComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/50 backdrop-blur-sm p-4">
          <div className="bg-surface rounded-xl shadow-lg max-w-xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-outline-variant pb-4 mb-4">
              <div>
                <h2 className="font-heading text-title-lg font-bold text-on-surface">Complaint Detail</h2>
                <p className="font-sans text-label-md text-on-surface-variant">ID: {viewComplaint.id}</p>
              </div>
              <button
                onClick={() => setViewComplaint(null)}
                className="p-2 hover:bg-surface-container rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-on-surface-variant" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-surface-container-low p-3 rounded-lg">
                <p className="font-sans text-label-sm text-on-surface-variant">Citizen Name</p>
                <p className="font-sans text-body-md font-semibold text-on-surface">{viewComplaint.citizenName}</p>
              </div>
              <div className="bg-surface-container-low p-3 rounded-lg">
                <p className="font-sans text-label-sm text-on-surface-variant">Category</p>
                <p className="font-sans text-body-md font-semibold text-on-surface">{viewComplaint.category}</p>
              </div>
              <div className="bg-surface-container-low p-3 rounded-lg">
                <p className="font-sans text-label-sm text-on-surface-variant">Ward</p>
                <p className="font-sans text-body-md font-semibold text-on-surface">{viewComplaint.ward}</p>
              </div>
              <div className="bg-surface-container-low p-3 rounded-lg">
                <p className="font-sans text-label-sm text-on-surface-variant mb-1">Status</p>
                <select
                  value={viewComplaint.status}
                  onChange={(e) =>
                    handleStatusChange(viewComplaint.id, e.target.value as "Pending" | "In Progress" | "Resolved")
                  }
                  className="w-full bg-surface border border-outline-variant rounded px-2 py-1 font-sans text-label-md font-semibold focus:outline-none focus:border-primary"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <p className="font-sans text-label-sm text-on-surface-variant mb-1 font-semibold">Description</p>
              <p className="font-sans text-body-md text-on-surface bg-surface-container-lowest border border-outline-variant rounded-lg p-3">
                {viewComplaint.description}
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setViewComplaint(null)}
                className="px-4 py-2 bg-primary text-on-primary font-sans font-semibold rounded-lg hover:bg-primary-container"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-stack-lg gap-4 pt-4 md:pt-0">
        <div>
          <h1 className="font-heading text-headline-lg-mobile md:text-headline-lg text-on-surface font-bold">
            Command Center
          </h1>
          <p className="text-on-surface-variant font-sans text-body-md mt-1">Nagaradhyaksh Executive Dashboard</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-48">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
            <select
              value={filterTime}
              onChange={(e) => setFilterTime(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface border border-outline-variant rounded-lg font-sans text-label-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary appearance-none font-medium"
            >
              <option>All Time</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </div>
          <button
            onClick={refreshComplaints}
            className="bg-surface border border-outline-variant rounded-lg px-3 py-2 text-on-surface hover:bg-surface-container-low transition-colors flex items-center gap-2 font-sans text-label-md font-medium"
            title="Refresh Live Data"
          >
            <Filter className="w-5 h-5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Key Metrics Bento Grid (Dynamic) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-gutter mb-stack-lg">
        <div className="bg-surface border border-outline-variant rounded-xl p-4 md:p-6 flex flex-col justify-between h-32 md:h-40 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="font-sans text-label-md text-on-surface-variant font-medium">Total Complaints</span>
            <div className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-heading text-[32px] md:text-[40px] text-on-surface leading-none font-bold">
              {totalCount}
            </div>
            <div className="flex items-center text-secondary font-sans text-label-sm mt-1 font-semibold">
              <span>
                {pendingCount} Pending • {inProgressCount} In Progress
              </span>
            </div>
          </div>
        </div>

        <div className="bg-surface border border-outline-variant rounded-xl p-4 md:p-6 flex flex-col justify-between h-32 md:h-40 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="font-sans text-label-md text-on-surface-variant font-medium">Resolved</span>
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-heading text-[32px] md:text-[40px] text-on-surface leading-none font-bold">
              {resolvedCount}
            </div>
            <div className="flex items-center text-green-700 font-sans text-label-sm mt-1 font-semibold">
              <span>Live Count</span>
            </div>
          </div>
        </div>

        <div className="bg-surface border border-outline-variant rounded-xl p-4 md:p-6 flex flex-col justify-between h-32 md:h-40 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="font-sans text-label-md text-on-surface-variant font-medium">Resolution Rate</span>
            <div className="w-8 h-8 rounded-full bg-secondary-container/30 flex items-center justify-center text-secondary">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-heading text-[32px] md:text-[40px] text-on-surface leading-none font-bold">
              {resolutionRate}%
            </div>
            <div className="flex items-center text-on-surface-variant font-sans text-label-sm mt-1 font-semibold">
              <span>
                {resolvedCount} of {totalCount} completed
              </span>
            </div>
          </div>
        </div>

        <div className="bg-surface border border-outline-variant rounded-xl p-4 md:p-6 flex flex-col justify-between h-32 md:h-40 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="font-sans text-label-md text-on-surface-variant font-medium">Active Escalations</span>
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-heading text-[32px] md:text-[40px] text-on-surface leading-none font-bold">
              {pendingCount + inProgressCount}
            </div>
            <div className="flex items-center text-orange-700 font-sans text-label-sm mt-1 font-semibold">
              <span>Action required</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter mb-stack-lg">
        {/* Ward-wise Volume */}
        <div className="lg:col-span-2 bg-surface border border-outline-variant rounded-xl p-6 flex flex-col shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-heading text-title-md text-on-surface font-semibold">Ward-wise Volume</h3>
            <span className="text-on-surface-variant font-sans text-label-md">Live Ward Breakdown</span>
          </div>
          <div className="flex-1 min-h-[300px] bg-surface-container-low rounded-lg flex items-end justify-around p-4 gap-2 border border-outline-variant/50">
            {wardMetrics.map((bar) => (
              <div key={bar.label} className="w-full flex flex-col items-center gap-2 group">
                <span className="font-sans text-xs text-on-surface font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  {bar.count}
                </span>
                <div
                  className="w-full bg-primary/70 hover:bg-primary rounded-t-sm transition-all duration-300"
                  style={{ height: bar.height }}
                ></div>
                <span className="font-sans text-label-sm text-on-surface-variant truncate font-medium">
                  {bar.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Trends */}
        <div className="bg-surface border border-outline-variant rounded-xl p-6 flex flex-col shadow-sm">
          <h3 className="font-heading text-title-md text-on-surface mb-6 font-semibold">Category Breakdown</h3>
          <div className="space-y-6 flex-1">
            {categoryMetrics.map((cat) => {
              const IconComp = cat.icon;
              return (
                <div key={cat.name}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <IconComp className={`${cat.textCol} w-5 h-5`} />
                      <span className="font-sans text-label-md text-on-surface font-medium">{cat.name}</span>
                    </div>
                    <span className="font-sans text-label-sm text-on-surface-variant flex items-center font-semibold">
                      {cat.count} ({cat.pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-surface-container-high rounded-full h-2">
                    <div
                      className={`${cat.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${Math.max(5, cat.pct)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Live Priority / Active Escalations Table */}
      <div className="bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-outline-variant flex justify-between items-center">
          <h3 className="font-heading text-title-md text-on-surface font-semibold">Live Pending & Active Complaints</h3>
          <span className="font-sans text-label-sm text-on-surface-variant font-medium">
            Showing {activeComplaints.length} active issue(s)
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant font-sans text-label-sm text-on-surface-variant">
                <th className="py-3 px-6 font-medium">ID</th>
                <th className="py-3 px-6 font-medium">Citizen</th>
                <th className="py-3 px-6 font-medium">Category</th>
                <th className="py-3 px-6 font-medium">Ward</th>
                <th className="py-3 px-6 font-medium">Status</th>
                <th className="py-3 px-6 font-medium">Assigned To</th>
                <th className="py-3 px-6 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="font-sans text-body-md text-on-surface">
              {activeComplaints.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-on-surface-variant">
                    No active escalations. All complaints are resolved! 🎉
                  </td>
                </tr>
              ) : (
                activeComplaints.map((complaint) => (
                  <tr
                    key={complaint.id}
                    className="border-b border-outline-variant/50 hover:bg-surface-container-lowest transition-colors"
                  >
                    <td className="py-4 px-6 font-sans text-label-md font-medium text-primary">{complaint.id}</td>
                    <td className="py-4 px-6 font-medium">{complaint.citizenName}</td>
                    <td className="py-4 px-6">{complaint.category}</td>
                    <td className="py-4 px-6">{complaint.ward}</td>
                    <td className="py-4 px-6">{getStatusBadge(complaint.status)}</td>
                    <td className="py-4 px-6 text-label-sm">{complaint.assignedTo || "Unassigned"}</td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setViewComplaint(complaint)}
                        className="text-primary hover:text-primary-container font-sans text-label-md font-semibold inline-flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" /> View / Update
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
