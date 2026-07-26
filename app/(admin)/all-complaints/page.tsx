"use client";

import { useState, useEffect } from "react";
import { Search, Filter, SortAsc, Eye, UserPlus, X, Image as ImageIcon } from "lucide-react";
import {
  getComplaints,
  updateComplaintStatus,
  assignComplaint,
  Complaint,
  getCurrentUser,
  User,
  getDepartmentEmployees,
  DepartmentEmployee
} from "@/lib/store";

export default function AllComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [employees, setEmployees] = useState<DepartmentEmployee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterWard, setFilterWard] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Modal states
  const [viewComplaint, setViewComplaint] = useState<Complaint | null>(null);
  const [assignModalData, setAssignModalData] = useState<Complaint | null>(null);
  const [selectedOfficer, setSelectedOfficer] = useState("");

  useEffect(() => {
    queueMicrotask(() => {
      setUser(getCurrentUser());
      setComplaints(getComplaints());
      setEmployees(getDepartmentEmployees());
    });

    // Real-time synchronization listener & polling
    const refreshData = () => {
      setComplaints(getComplaints());
      setEmployees(getDepartmentEmployees());
    };

    window.addEventListener("storage", refreshData);
    window.addEventListener("focus", refreshData);
    const interval = setInterval(refreshData, 1500);

    return () => {
      window.removeEventListener("storage", refreshData);
      window.removeEventListener("focus", refreshData);
      clearInterval(interval);
    };
  }, []);

  const updateStatus = (id: string, newStatus: "Pending" | "In Progress" | "Resolved") => {
    updateComplaintStatus(id, newStatus);
    setComplaints(getComplaints());
  };

  const handleAssign = () => {
    if (assignModalData && selectedOfficer) {
      assignComplaint(assignModalData.id, selectedOfficer);
      setComplaints(getComplaints());
      setAssignModalData(null);
      setSelectedOfficer("");
    }
  };

  const getFilteredComplaints = () => {
    const list = complaints;
    return list.filter((c) => {
      const matchesSearch =
        c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.citizenName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesWard = filterWard ? c.ward.includes(filterWard) : true;
      const matchesStatus = filterStatus ? c.status === filterStatus : true;
      return matchesSearch && matchesWard && matchesStatus;
    });
  };

  const filteredComplaints = getFilteredComplaints();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-error-container/50 border-error-container text-on-error-container focus:ring-error";
      case "In Progress":
        return "bg-orange-50 border-orange-200 text-orange-700 focus:ring-orange-500";
      case "Resolved":
        return "bg-green-50 border-green-200 text-green-700 focus:ring-green-500";
      default:
        return "bg-surface-variant border-outline-variant text-on-surface-variant focus:ring-outline";
    }
  };

  if (!user) return null;

  const isMayor = user.role === "mayor";
  const isAdmin = user.role === "admin";

  return (
    <main className="flex-1 p-margin-mobile md:p-margin-desktop w-full max-w-container-max mx-auto pb-32 md:pb-margin-desktop relative">
      {/* View Details Modal */}
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
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(
                    viewComplaint.status
                  )}`}
                >
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

      {/* Assign Modal */}
      {assignModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/50 backdrop-blur-sm p-4">
          <div className="bg-surface rounded-xl shadow-lg max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="font-heading text-title-md font-bold text-on-surface">Assign Task to Department Staff</h2>
              <button
                onClick={() => setAssignModalData(null)}
                className="p-1 hover:bg-surface-container rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-on-surface-variant" />
              </button>
            </div>
            <p className="font-sans text-body-md text-on-surface-variant mb-4">
              Assign complaint <strong>{assignModalData.id}</strong> ({assignModalData.category}) to a department employee.
            </p>

            <div className="mb-6">
              <label className="block font-sans text-label-md text-on-surface font-semibold mb-2">
                Select Department Officer / Staff *
              </label>
              <select
                value={selectedOfficer}
                onChange={(e) => setSelectedOfficer(e.target.value)}
                className="w-full bg-surface border border-outline-variant rounded-xl p-3 font-sans text-body-md focus:outline-none focus:border-primary"
              >
                <option value="">-- Choose Officer --</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.name}>
                    {emp.name} ({emp.departmentName} - {emp.designation})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setAssignModalData(null)}
                className="px-4 py-2 bg-transparent text-on-surface-variant hover:bg-surface-container-high rounded-xl font-sans text-label-md font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAssign}
                disabled={!selectedOfficer}
                className="px-5 py-2 bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container disabled:opacity-50 rounded-xl font-sans text-label-md font-bold transition-colors shadow-sm"
              >
                Assign Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-stack-md">
        <div>
          <h1 className="font-heading text-headline-md font-bold text-on-surface">
            {isAdmin ? "Central Complaints Console (Master Admin)" : isMayor ? "Nagaradhyaksh Complaints Directory" : "Complaints Directory"}
          </h1>
          <p className="font-sans text-body-md text-on-surface-variant">
            Manage, filter, assign, and update status of all municipal citizen complaints in real-time.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-surface-container-low px-4 py-2 rounded-xl border border-outline-variant">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
          <span className="font-sans text-label-sm font-semibold text-on-surface">Live Real-time Sync Active</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface rounded-xl border border-outline-variant p-4 mb-6 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search by ID, Citizen, Description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant rounded-xl pl-10 pr-4 py-2.5 font-sans text-body-md focus:outline-none focus:border-primary"
          />
          <Search className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-3.5" />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-on-surface-variant" />
            <select
              value={filterWard}
              onChange={(e) => setFilterWard(e.target.value)}
              className="bg-surface-container-low border border-outline-variant rounded-xl px-3 py-2 font-sans text-label-md font-medium text-on-surface focus:outline-none focus:border-primary"
            >
              <option value="">All Wards (प्रभाग १ ते १०)</option>
              <option value="Ward 1">Ward 1</option>
              <option value="Ward 2">Ward 2</option>
              <option value="Ward 3">Ward 3</option>
              <option value="Ward 4">Ward 4</option>
              <option value="Ward 5">Ward 5</option>
              <option value="Ward 6">Ward 6</option>
              <option value="Ward 7">Ward 7</option>
              <option value="Ward 8">Ward 8</option>
              <option value="Ward 9">Ward 9</option>
              <option value="Ward 10">Ward 10</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <SortAsc className="w-4 h-4 text-on-surface-variant" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-surface-container-low border border-outline-variant rounded-xl px-3 py-2 font-sans text-label-md font-medium text-on-surface focus:outline-none focus:border-primary"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-surface rounded-xl border border-outline-variant shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant font-sans text-label-md text-on-surface-variant">
                <th className="p-4 font-semibold">Complaint ID</th>
                <th className="p-4 font-semibold">Citizen Name</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Ward</th>
                <th className="p-4 font-semibold">Photo</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Assigned Staff</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant font-sans text-body-md">
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-on-surface-variant">
                    No complaints found matching filters.
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((c) => (
                  <tr key={c.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="p-4 font-mono font-bold text-primary">{c.id}</td>
                    <td className="p-4 font-semibold text-on-surface">{c.citizenName}</td>
                    <td className="p-4 text-on-surface-variant">{c.category}</td>
                    <td className="p-4 text-on-surface-variant">{c.ward}</td>
                    <td className="p-4">
                      {c.image ? (
                        <button
                          onClick={() => setViewComplaint(c)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-sans text-label-xs font-bold transition-all border border-primary/20"
                          title="View uploaded photo evidence"
                        >
                          <ImageIcon className="w-3.5 h-3.5" />
                          View Photo
                        </button>
                      ) : (
                        <span className="text-on-surface-variant text-label-xs font-mono">No Image</span>
                      )}
                    </td>
                    <td className="p-4">
                      <select
                        value={c.status}
                        onChange={(e) =>
                          updateStatus(c.id, e.target.value as "Pending" | "In Progress" | "Resolved")
                        }
                        className={`px-3 py-1 rounded-full text-xs font-bold border focus:outline-none cursor-pointer ${getStatusColor(
                          c.status
                        )}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </td>
                    <td className="p-4 text-on-surface-variant font-medium">
                      {c.assignedTo ? (
                        <span className="text-on-surface font-semibold flex items-center gap-1">
                          👤 {c.assignedTo}
                        </span>
                      ) : (
                        <span className="text-amber-600 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => setViewComplaint(c)}
                        className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg transition-colors"
                        title="View Details & Photo"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          setAssignModalData(c);
                          setSelectedOfficer(c.assignedTo || "");
                        }}
                        className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg transition-colors"
                        title="Assign Department Employee"
                      >
                        <UserPlus className="w-4 h-4" />
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
