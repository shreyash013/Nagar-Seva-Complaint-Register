"use client";

import { useState } from "react";
import { ShieldAlert, Plus, LayoutDashboard, ListTodo, Map, BarChart3, FileText, Settings, HelpCircle, SortAsc, Filter, Calendar, Grid, Edit, RefreshCw } from "lucide-react";

type ComplaintStatus = "in_progress" | "resolved";
type Priority = "High Priority" | "Medium Priority" | "Low Priority";

interface Task {
  id: string;
  priority: Priority;
  ward: string;
  title: string;
  description: string;
  date: string;
  category: string;
  status: ComplaintStatus;
}

const initialTasks: Task[] = [
  {
    id: "#SNP-2024-089",
    priority: "High Priority",
    ward: "Ward 4",
    title: "Major Water Pipeline Leakage",
    description: "Significant water leakage reported near the main square leading to waterlogging. Immediate attention required to prevent further damage to the newly constructed road and water wastage.",
    date: "Oct 24, 2024",
    category: "Water Supply",
    status: "in_progress",
  },
  {
    id: "#SNP-2024-072",
    priority: "Medium Priority",
    ward: "Ward 12",
    title: "Streetlights not functioning on MG Road",
    description: "Several consecutive streetlights are out on the stretch near the municipal park. Creating safety concerns for pedestrians during evening hours.",
    date: "Oct 22, 2024",
    category: "Electrical",
    status: "in_progress",
  }
];

export default function OfficerTasks() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filterPriority, setFilterPriority] = useState<string>("Sort by Priority");
  const [filterCategory, setFilterCategory] = useState<string>("Category: All");

  const updateStatus = (id: string, newStatus: ComplaintStatus) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const getPriorityColors = (priority: Priority) => {
    switch(priority) {
      case "High Priority": return { bg: "bg-error", badge: "bg-error-container text-on-error-container", border: "border-error-container" };
      case "Medium Priority": return { bg: "bg-orange-400", badge: "bg-orange-100 text-orange-800", border: "border-outline-variant" };
      case "Low Priority": return { bg: "bg-green-400", badge: "bg-green-100 text-green-800", border: "border-outline-variant" };
    }
  };

  // Basic filtering (can be expanded)
  const displayedTasks = tasks.filter(t => {
    if (filterCategory !== "Category: All" && t.category !== filterCategory) return false;
    return true;
  });

  // Sorting
  if (filterPriority === "High to Low") {
    displayedTasks.sort((a, b) => {
      const p = { "High Priority": 3, "Medium Priority": 2, "Low Priority": 1 };
      return p[b.priority] - p[a.priority];
    });
  } else if (filterPriority === "Low to High") {
    displayedTasks.sort((a, b) => {
      const p = { "High Priority": 3, "Medium Priority": 2, "Low Priority": 1 };
      return p[a.priority] - p[b.priority];
    });
  }

  return (
    <main className="flex-1 p-margin-mobile md:p-margin-desktop w-full max-w-container-max mx-auto pb-32 md:pb-margin-desktop">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-stack-lg gap-stack-md pt-4 md:pt-0">
        <div>
          <h2 className="font-heading text-headline-lg-mobile md:text-headline-lg text-primary mb-2 font-bold">My Assigned Complaints</h2>
          <p className="font-sans text-body-md text-on-surface-variant">Manage and update status for tasks assigned to you.</p>
        </div>
        {/* Filters & Sort */}
        <div className="flex flex-wrap gap-stack-sm w-full md:w-auto">
          <div className="relative group">
            <select 
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="appearance-none bg-surface border border-outline-variant text-on-surface py-2 pl-4 pr-10 rounded-lg font-sans text-label-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full md:w-auto hover:bg-surface-container-low transition-colors font-medium"
            >
              <option>Sort by Priority</option>
              <option>High to Low</option>
              <option>Low to High</option>
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
              <option>Electrical</option>
              <option>Sanitation</option>
              <option>Roads</option>
            </select>
            <Filter className="absolute right-3 top-2.5 text-on-surface-variant w-4 h-4 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Task List Container */}
      <div className="space-y-stack-md">
        {displayedTasks.map((task) => {
          const colors = getPriorityColors(task.priority);
          
          return (
            <div key={task.id} className={`bg-surface border ${colors.border} rounded-xl p-stack-md hover:shadow-md transition-shadow relative overflow-hidden group`}>
              <div className={`absolute top-0 left-0 w-1.5 h-full ${colors.bg}`}></div>
              <div className="flex flex-col lg:flex-row gap-stack-md justify-between">
                {/* Left Details */}
                <div className="flex-1 space-y-3 pl-2">
                  <div className="flex items-center gap-stack-sm flex-wrap">
                    <span className={`${colors.badge} px-3 py-1 rounded-full font-sans text-label-sm uppercase tracking-wider font-bold`}>{task.priority}</span>
                    <span className="font-sans text-label-md text-on-surface-variant font-semibold">Ticket ID: {task.id}</span>
                    <span className="text-on-surface-variant">•</span>
                    <span className="font-sans text-label-md text-on-surface-variant font-semibold">{task.ward}</span>
                  </div>
                  <h3 className="font-heading text-title-md text-on-surface font-semibold">{task.title}</h3>
                  <p className="font-sans text-body-md text-on-surface-variant line-clamp-2 max-w-3xl">
                    {task.description}
                  </p>
                  <div className="flex items-center gap-4 pt-2">
                    <div className="flex items-center gap-1 text-on-surface-variant font-sans text-label-sm font-medium">
                      <Calendar className="w-4 h-4" />
                      Reported: {task.date}
                    </div>
                    <div className="flex items-center gap-1 text-on-surface-variant font-sans text-label-sm font-medium">
                      <Grid className="w-4 h-4" />
                      {task.category}
                    </div>
                  </div>
                </div>
                {/* Right Actions */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-stack-sm lg:w-48 shrink-0 justify-between">
                  <div className="space-y-2 w-full">
                    <p className="font-sans text-label-sm text-on-surface-variant mb-1 font-semibold">Current Status</p>
                    <div className="flex rounded-lg border border-outline-variant overflow-hidden w-full">
                      <button 
                        onClick={() => updateStatus(task.id, "in_progress")}
                        className={`flex-1 py-1.5 font-sans text-label-sm border-r border-outline-variant font-semibold transition-colors ${task.status === "in_progress" ? "bg-secondary-container text-on-secondary-container" : "bg-surface text-on-surface hover:bg-surface-container-low"}`}
                      >
                        In Progress
                      </button>
                      <button 
                        onClick={() => updateStatus(task.id, "resolved")}
                        className={`flex-1 py-1.5 font-sans text-label-sm font-semibold transition-colors ${task.status === "resolved" ? "bg-green-100 text-green-800" : "bg-surface text-on-surface hover:bg-surface-container-low"}`}
                      >
                        Resolved
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full mt-auto">
                    <button className="flex-1 border border-outline-variant text-primary font-sans text-label-md py-2 px-3 rounded-lg hover:bg-surface-container-low transition-colors flex items-center justify-center gap-1 font-semibold">
                      <Edit className="w-4 h-4" />
                      Note
                    </button>
                    <button className="flex-1 bg-primary text-on-primary font-sans text-label-md py-2 px-3 rounded-lg hover:bg-primary-container transition-colors flex items-center justify-center gap-1 font-semibold">
                      <RefreshCw className="w-4 h-4" />
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Placeholder */}
      <div className="mt-stack-lg flex justify-center items-center gap-2">
        <button className="p-2 rounded-lg border border-outline-variant text-on-surface hover:bg-surface-container-low transition-colors disabled:opacity-50" disabled>
          &lt;
        </button>
        <span className="px-4 py-2 font-sans text-label-md bg-secondary-container text-on-secondary-container rounded-lg font-semibold">1</span>
        <button className="p-2 rounded-lg border border-outline-variant text-on-surface hover:bg-surface-container-low transition-colors disabled:opacity-50" disabled>
          &gt;
        </button>
      </div>
    </main>
  );
}
