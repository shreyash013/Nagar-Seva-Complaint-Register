"use client";

import { useState, useEffect } from "react";
import { Search, Filter, SortAsc, Edit, Eye, UserPlus, X } from "lucide-react";
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
                  Ward
                </p>
                <p className="font-sans text-body-md font-semibold text-on-surface">{viewComplaint.ward}</p>
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
              <label className="block font-sans text-label-sm text-on-surface-variant mb-2">
                Select Department Employee
              </label>
              <select
                value={selectedOfficer}
                onChange={(e) => setSelectedOfficer(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 font-sans text-body-md font-medium"
              >
                <option value="">-- Choose Employee --</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={`${emp.name} (${emp.departmentName})`}>
                    {emp.name} — {emp.designation} [{emp.departmentName}]
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setAssignModalData(null)}
                className="px-4 py-2 text-on-surface-variant font-sans font-semibold rounded-lg hover:bg-surface-container-low"
              >
                Cancel
              </button>
              <button
                onClick={handleAssign}
                disabled={!selectedOfficer}
                className="px-4 py-2 bg-primary text-on-primary font-sans font-semibold rounded-lg hover:bg-primary-container disabled:opacity-50"
              >
                Assign Task
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-stack-lg gap-stack-md pt-4 md:pt-0">
        <div>
          <h2 className="font-heading text-headline-lg-mobile md:text-headline-lg text-primary mb-2 font-bold">
            All Complaints
          </h2>
          <p className="font-sans text-body-md text-on-surface-variant">
            Central management console to monitor, assign, and update all registered civic issues.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface border border-outline-variant rounded-xl p-4 mb-stack-md shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
          <input
            type="text"
            placeholder="Search by ID, Citizen, or Keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant rounded-lg pl-10 pr-4 py-2 font-sans text-body-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-on-surface"
          />
        </div>
        <div className="flex w-full md:w-auto gap-3">
          <div className="relative flex-1 md:flex-none">
            <select
              value={filterWard}
              onChange={(e) => setFilterWard(e.target.value)}
              className="w-full appearance-none bg-surface-container-low border border-outline-variant text-on-surface py-2 pl-4 pr-10 rounded-lg font-sans text-label-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-medium"
            >
              <option value="">All Wards</option>
              <option value="Ward 1">Ward 1</option>
              <option value="Ward 4">Ward 4</option>
              <option value="Ward 7">Ward 7</option>
            </select>
            <Filter className="absolute right-3 top-2.5 text-on-surface-variant w-4 h-4 pointer-events-none" />
          </div>
          <div className="relative flex-1 md:flex-none">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full appearance-none bg-surface-container-low border border-outline-variant text-on-surface py-2 pl-4 pr-10 rounded-lg font-sans text-label-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-medium"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
            <SortAsc className="absolute right-3 top-2.5 text-on-surface-variant w-4 h-4 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant font-sans text-label-sm text-on-surface-variant">
                <th className="py-4 px-6 font-semibold">Complaint ID</th>
                <th className="py-4 px-6 font-semibold">Date & Citizen</th>
                <th className="py-4 px-6 font-semibold">Category / Issue</th>
                <th className="py-4 px-6 font-semibold">Ward</th>
                <th className="py-4 px-6 font-semibold">Status</th>
                <th className="py-4 px-6 font-semibold">Assigned To</th>
                <th className="py-4 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="font-sans text-body-md text-on-surface divide-y divide-outline-variant/50">
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-on-surface-variant">
                    No complaints match your filters or assigned tasks.
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((complaint) => (
                  <tr key={complaint.id} className="hover:bg-surface-container-lowest transition-colors group">
                    <td className="py-4 px-6 font-sans text-label-md font-medium text-primary">{complaint.id}</td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-on-surface">{complaint.date}</div>
                      <div className="text-label-sm text-on-surface-variant">{complaint.citizenName}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-on-surface">{complaint.category}</div>
                      <div className="text-label-sm text-on-surface-variant truncate max-w-[200px]">
                        {complaint.description}
                      </div>
                    </td>
                    <td className="py-4 px-6">{complaint.ward}</td>
                    <td className="py-4 px-6">
                      {isMayor ? (
                        <span
                          className={`inline-block border text-label-sm font-semibold rounded-full px-3 py-1 text-center ${getStatusColor(
                            complaint.status
                          )}`}
                        >
                          {complaint.status}
                        </span>
                      ) : (
                        <select
                          value={complaint.status}
                          onChange={(e) =>
                            updateStatus(complaint.id, e.target.value as "Pending" | "In Progress" | "Resolved")
                          }
                          className={`border text-label-sm font-semibold rounded-full px-3 py-1 focus:outline-none focus:ring-1 appearance-none cursor-pointer text-center ${getStatusColor(
                            complaint.status
                          )}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      {complaint.assignedTo && complaint.assignedTo !== "Assign" ? (
                        <div className="text-label-sm font-medium">{complaint.assignedTo}</div>
                      ) : !isMayor ? (
                        <button
                          onClick={() => setAssignModalData(complaint)}
                          className="flex items-center gap-1 text-primary hover:text-primary-container text-label-sm font-medium bg-primary/5 px-2 py-1 rounded"
                        >
                          <UserPlus className="w-3 h-3" /> Assign
                        </button>
                      ) : (
                        <div className="text-label-sm text-on-surface-variant italic">Unassigned</div>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setViewComplaint(complaint)}
                          className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {isAdmin && (
                          <button
                            className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Placeholder */}
        <div className="p-4 border-t border-outline-variant flex justify-between items-center bg-surface-container-low text-label-sm text-on-surface-variant">
          <div>Showing {filteredComplaints.length} complaints</div>
          <div className="flex gap-1">
            <button
              className="px-3 py-1 rounded border border-outline-variant bg-surface hover:bg-surface-container-high transition-colors disabled:opacity-50"
              disabled
            >
              Previous
            </button>
            <button className="px-3 py-1 rounded border border-outline-variant bg-surface hover:bg-surface-container-high transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
