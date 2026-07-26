"use client";

import { useState, useEffect } from "react";
import { SortAsc, Filter, Calendar, Grid } from "lucide-react";
import { getComplaints, updateComplaintStatus, Complaint, getCurrentUser, User, subscribeToSync } from "@/lib/store";

export default function OfficerTasks() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("Category: All");
  const [filterStatus, setFilterStatus] = useState<string>("All Statuses");

  const refreshData = () => {
    setComplaints(getComplaints());
  };

  useEffect(() => {
    queueMicrotask(() => {
      setUser(getCurrentUser());
      refreshData();
    });
    
    const unsubscribe = subscribeToSync(() => {
      refreshData();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleUpdateStatus = (id: string, newStatus: "Pending" | "In Progress" | "Resolved") => {
    updateComplaintStatus(id, newStatus);
    refreshData();
  };

  // Filter for tasks assigned to the officer (or all if admin/mayor)
  const myTasks = complaints.filter((c) => {
    if (!user) return true;
    if (user.role === "admin" || user.role === "mayor") return true;
    return (
      c.assignedTo === user.name ||
      (c.assignedTo && c.assignedTo.toLowerCase() === user.name.toLowerCase()) ||
      c.assignedTo === "officer_demo" ||
      !c.assignedTo
    );
  });

  const displayedTasks = myTasks.filter((c) => {
    if (filterCategory !== "Category: All" && !c.category.toLowerCase().includes(filterCategory.toLowerCase()))
      return false;
    if (filterStatus !== "All Statuses" && c.status !== filterStatus) return false;
    return true;
  });

  return (
    <main className="flex-1 p-margin-mobile md:p-margin-desktop w-full max-w-container-max mx-auto pb-32 md:pb-margin-desktop">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-stack-lg gap-stack-md pt-4 md:pt-0">
        <div>
          <h2 className="font-heading text-headline-lg-mobile md:text-headline-lg text-primary mb-2 font-bold">
            My Assigned Complaints
          </h2>
          <p className="font-sans text-body-md text-on-surface-variant">
            Manage and update status for tasks assigned to you.
          </p>
        </div>
        {/* Filters */}
        <div className="flex flex-wrap gap-stack-sm w-full md:w-auto">
          <div className="relative group">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none bg-surface border border-outline-variant text-on-surface py-2 pl-4 pr-10 rounded-lg font-sans text-label-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full md:w-auto hover:bg-surface-container-low transition-colors font-medium"
            >
              <option>All Statuses</option>
              <option>Pending</option>
              <option>In Progress</option>
              <option>Resolved</option>
            </select>
            <SortAsc className="absolute right-3 top-2.5 text-on-surface-variant w-4 h-4 pointer-events-none" />
          </div>
          <div className="relative group">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="appearance-none bg-surface border border-outline-variant text-on-surface py-2 pl-4 pr-10 rounded-lg font-sans text-label-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full md:w-auto hover:bg-surface-container-low transition-colors font-medium"
            >
              <option>Category: All</option>
              <option>Water Supply</option>
              <option>Garbage</option>
              <option>Streetlights</option>
              <option>Roads</option>
            </select>
            <Filter className="absolute right-3 top-2.5 text-on-surface-variant w-4 h-4 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Task List Container */}
      <div className="space-y-stack-md">
        {displayedTasks.length === 0 ? (
          <div className="bg-surface border border-outline-variant rounded-xl p-8 text-center text-on-surface-variant font-sans">
            No complaints found matching your filter criteria.
          </div>
        ) : (
          displayedTasks.map((task) => {
            const isResolved = task.status === "Resolved";
            const isInProgress = task.status === "In Progress";

            return (
              <div
                key={task.id}
                className="bg-surface border border-outline-variant rounded-xl p-stack-md hover:shadow-md transition-shadow relative overflow-hidden group"
              >
                <div
                  className={`absolute top-0 left-0 w-1.5 h-full ${
                    isResolved ? "bg-green-500" : isInProgress ? "bg-orange-400" : "bg-error"
                  }`}
                ></div>
                <div className="flex flex-col lg:flex-row gap-stack-md justify-between">
                  {/* Left Details */}
                  <div className="flex-1 space-y-3 pl-2">
                    <div className="flex items-center gap-stack-sm flex-wrap">
                      <span
                        className={`px-3 py-1 rounded-full font-sans text-label-sm uppercase tracking-wider font-bold ${
                          isResolved
                            ? "bg-green-100 text-green-800"
                            : isInProgress
                            ? "bg-orange-100 text-orange-800"
                            : "bg-error-container text-on-error-container"
                        }`}
                      >
                        {task.status}
                      </span>
                      <span className="font-sans text-label-md text-on-surface-variant font-semibold">
                        Ticket ID: {task.id}
                      </span>
                      <span className="text-on-surface-variant">•</span>
                      <span className="font-sans text-label-md text-on-surface-variant font-semibold font-mono">
                        {task.ward}
                      </span>
                    </div>
                    <h3 className="font-heading text-title-md text-on-surface font-semibold">{task.category}</h3>
                    <p className="font-sans text-body-md text-on-surface-variant max-w-3xl">
                      {task.description}
                    </p>
                    <div className="flex items-center gap-4 pt-2">
                      <div className="flex items-center gap-1 text-on-surface-variant font-sans text-label-sm font-medium">
                        <Calendar className="w-4 h-4" />
                        Reported: {task.date}
                      </div>
                      <div className="flex items-center gap-1 text-on-surface-variant font-sans text-label-sm font-medium">
                        <Grid className="w-4 h-4" />
                        Citizen: {task.citizenName}
                      </div>
                    </div>
                  </div>
                  {/* Right Actions */}
                  <div className="flex flex-col sm:flex-row lg:flex-col gap-stack-sm lg:w-56 shrink-0 justify-between">
                    <div className="space-y-2 w-full">
                      <p className="font-sans text-label-sm text-on-surface-variant mb-1 font-semibold">
                        Update Status
                      </p>
                      <div className="flex rounded-lg border border-outline-variant overflow-hidden w-full">
                        <button
                          onClick={() => handleUpdateStatus(task.id, "In Progress")}
                          className={`flex-1 py-1.5 font-sans text-label-sm border-r border-outline-variant font-semibold transition-colors ${
                            task.status === "In Progress"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-surface text-on-surface hover:bg-surface-container-low"
                          }`}
                        >
                          In Progress
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(task.id, "Resolved")}
                          className={`flex-1 py-1.5 font-sans text-label-sm font-semibold transition-colors ${
                            task.status === "Resolved"
                              ? "bg-green-100 text-green-800"
                              : "bg-surface text-on-surface hover:bg-surface-container-low"
                          }`}
                        >
                          Resolved
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}
