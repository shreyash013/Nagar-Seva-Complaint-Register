export interface Complaint {
  id: string;
  date: string;
  citizenName: string;
  category: string;
  description: string;
  ward: string;
  status: "Pending" | "In Progress" | "Resolved";
  assignedTo?: string;
  timeline: { status: string; date: string; note: string }[];
}

const STORAGE_KEY = "smart_nagar_complaints";

export function getComplaints(): Complaint[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse complaints from localStorage", e);
    }
  }
  
  // Default data if empty
  const defaultComplaints: Complaint[] = [
    {
      id: "SH-2024-892",
      date: "Oct 24, 2024",
      citizenName: "Ramesh Patil",
      category: "Water Supply",
      description: "Pipeline leakage near Main Square",
      ward: "Ward 4",
      status: "In Progress",
      assignedTo: "Assign",
      timeline: [
        { status: "Complaint Submitted", date: "Oct 24, 2024", note: "Complaint registered." },
        { status: "Forwarded to Dept", date: "Oct 24, 2024", note: "Sent to Water Dept." }
      ]
    },
    {
      id: "SH-2024-890",
      date: "Oct 23, 2024",
      citizenName: "Sita Sharma",
      category: "Solid Waste",
      description: "Garbage not collected for 3 days",
      ward: "Ward 1",
      status: "Pending",
      assignedTo: "Santosh K.",
      timeline: [
        { status: "Complaint Submitted", date: "Oct 23, 2024", note: "Complaint registered." }
      ]
    },
    {
      id: "SH-2024-885",
      date: "Oct 20, 2024",
      citizenName: "Amit Deshmukh",
      category: "Streetlights",
      description: "Streetlight out near Park",
      ward: "Ward 7",
      status: "Resolved",
      assignedTo: "Vijay E.",
      timeline: [
        { status: "Complaint Submitted", date: "Oct 20, 2024", note: "Complaint registered." },
        { status: "Resolved", date: "Oct 21, 2024", note: "Streetlight replaced." }
      ]
    }
  ];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultComplaints));
  return defaultComplaints;
}

export function saveComplaints(complaints: Complaint[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
}

export function addComplaint(complaint: Complaint) {
  const complaints = getComplaints();
  complaints.unshift(complaint);
  saveComplaints(complaints);
}

export function updateComplaintStatus(id: string, newStatus: "Pending" | "In Progress" | "Resolved") {
  const complaints = getComplaints();
  const index = complaints.findIndex(c => c.id === id);
  if (index !== -1) {
    complaints[index].status = newStatus;
    complaints[index].timeline.push({
      status: newStatus,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      note: `Status updated to ${newStatus}`
    });
    saveComplaints(complaints);
  }
}

export function assignComplaint(id: string, officerName: string) {
  const complaints = getComplaints();
  const index = complaints.findIndex(c => c.id === id);
  if (index !== -1) {
    complaints[index].assignedTo = officerName;
    complaints[index].timeline.push({
      status: "In Progress", // Optional: automatically set to In Progress when assigned
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      note: `Assigned to ${officerName}`
    });
    // Ensure status is at least In Progress if it was pending
    if (complaints[index].status === "Pending") {
      complaints[index].status = "In Progress";
    }
    saveComplaints(complaints);
  }
}

// --- Auth State ---

export type Role = "mayor" | "officer" | "admin" | "citizen";

export interface User {
  id: string;
  name: string;
  role: Role;
}

const AUTH_KEY = "smart_nagar_auth";

export function login(user: User) {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

export function logout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_KEY);
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(AUTH_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse auth from localStorage", e);
    }
  }
  return null;
}
