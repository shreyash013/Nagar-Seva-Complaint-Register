export interface Complaint {
  id: string;
  date: string;
  citizenName: string;
  category: string;
  description: string;
  ward: string;
  area?: string;
  image?: string;
  status: "Pending" | "In Progress" | "Resolved";
  assignedTo?: string;
  timeline: { status: string; date: string; note: string }[];
}

const STORAGE_KEY = "smart_nagar_complaints";
const DEPARTMENTS_KEY = "smart_nagar_departments";
const EMPLOYEES_KEY = "smart_nagar_employees";

// BroadcastChannel for instant cross-tab real-time sync
const syncChannel =
  typeof window !== "undefined" && "BroadcastChannel" in window
    ? new BroadcastChannel("smart_nagar_sync_channel")
    : null;

export function notifySync() {
  if (typeof window === "undefined") return;
  try {
    syncChannel?.postMessage({ type: "SYNC_DATA", timestamp: Date.now() });
    window.dispatchEvent(new Event("smart_nagar_sync"));
  } catch (e) {
    console.error("Failed to emit sync notification", e);
  }
}

// Cross-domain API sync helpers for Netlify deployments
async function syncToApi(payload: Record<string, unknown> | Complaint) {
  if (typeof window === "undefined") return;
  const targets = ["/api/complaints", "https://shirol-nagar-admin.netlify.app/api/complaints"];
  for (const url of targets) {
    try {
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } catch {
      // Ignore network errors
    }
  }
}

export async function fetchRemoteComplaints() {
  if (typeof window === "undefined") return;
  const targets = ["/api/complaints", "https://shirol-nagar-admin.netlify.app/api/complaints"];
  for (const url of targets) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const remoteList: Complaint[] = await res.json();
        if (Array.isArray(remoteList) && remoteList.length > 0) {
          const current = localStorage.getItem(STORAGE_KEY);
          if (JSON.stringify(remoteList) !== current) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(remoteList));
            notifySync();
          }
          break;
        }
      }
    } catch {
      // Ignore network errors
    }
  }
}

export function subscribeToSync(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  const handleMessage = () => {
    callback();
    fetchRemoteComplaints();
  };
  const handleEvent = () => {
    callback();
    fetchRemoteComplaints();
  };

  if (syncChannel) {
    syncChannel.onmessage = handleMessage;
  }
  window.addEventListener("smart_nagar_sync", handleEvent);
  window.addEventListener("storage", handleEvent);
  window.addEventListener("focus", handleEvent);

  fetchRemoteComplaints();
  const interval = setInterval(() => {
    callback();
    fetchRemoteComplaints();
  }, 1200);

  return () => {
    window.removeEventListener("smart_nagar_sync", handleEvent);
    window.removeEventListener("storage", handleEvent);
    window.removeEventListener("focus", handleEvent);
    clearInterval(interval);
  };
}

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
      area: "Main Market",
      status: "In Progress",
      assignedTo: "Santosh K.",
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
      area: "Shivaji Chowk",
      status: "Pending",
      assignedTo: "Amit Deshmukh",
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
      area: "Subhash Nagar",
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
  notifySync();
}

export function addComplaint(complaint: Complaint) {
  const complaints = getComplaints();
  complaints.unshift(complaint);
  saveComplaints(complaints);
  syncToApi(complaint);
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
    syncToApi({ action: "update_status", id, newStatus });
  }
}

export function assignComplaint(id: string, officerName: string) {
  const complaints = getComplaints();
  const index = complaints.findIndex(c => c.id === id);
  if (index !== -1) {
    complaints[index].assignedTo = officerName;
    complaints[index].status = "In Progress";
    complaints[index].timeline.push({
      status: "In Progress",
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      note: `Assigned to ${officerName}`
    });
    saveComplaints(complaints);
    syncToApi({ action: "assign", id, officerName });
  }
}

// --- Department Management Models & Functions ---

export interface Department {
  id: string;
  name: string;
  nameMr?: string;
  code: string;
  head?: string;
  headName?: string;
  headEmail?: string;
  officerCount?: number;
  activeTasks?: number;
  icon?: string;
  color?: string;
  description?: string;
  createdAt?: string;
}

export interface DepartmentEmployee {
  id: string;
  name: string;
  departmentId: string;
  departmentName: string;
  designation: string;
  email: string;
  phone: string;
  status: "Active" | "Inactive";
  joinedDate: string;
}

export function getDepartments(): Department[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(DEPARTMENTS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse departments from localStorage", e);
    }
  }
  const defaultDepartments: Department[] = [
    {
      id: "DEPT-101",
      name: "Water Supply & Sanitation",
      nameMr: "पाणी पुरवठा व स्वच्छता विभाग",
      code: "WATER",
      head: "Shri. Rajesh Patil",
      officerCount: 6,
      activeTasks: 12,
      icon: "Droplet",
      color: "bg-blue-500",
      description: "Handles drinking water pipelines, pump houses, and supply schedules."
    },
    {
      id: "DEPT-102",
      name: "Solid Waste Management",
      nameMr: "घनकचरा व्यवस्थापन विभाग",
      code: "GARBAGE",
      head: "Smt. Sunita Jadhav",
      officerCount: 8,
      activeTasks: 19,
      icon: "Trash2",
      color: "bg-emerald-500",
      description: "Manages daily door-to-door garbage collection and town cleanliness."
    },
    {
      id: "DEPT-103",
      name: "Electricity & Streetlights",
      nameMr: "विद्युत व पथदिवे विभाग",
      code: "STREETLIGHTS",
      head: "Shri. Prakash Pawar",
      officerCount: 4,
      activeTasks: 8,
      icon: "Lightbulb",
      color: "bg-amber-500",
      description: "Maintains streetlight poles, LED transformers, and power lines."
    },
    {
      id: "DEPT-104",
      name: "Roads & Civil Infrastructure",
      nameMr: "रस्ते व बांधकाम विभाग",
      code: "ROADS",
      head: "Shri. Nitin Gavali",
      officerCount: 5,
      activeTasks: 14,
      icon: "Route",
      color: "bg-purple-500",
      description: "Repairs potholes, tar roads, gutters, and public structures."
    }
  ];
  localStorage.setItem(DEPARTMENTS_KEY, JSON.stringify(defaultDepartments));
  return defaultDepartments;
}

export function saveDepartments(departments: Department[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(DEPARTMENTS_KEY, JSON.stringify(departments));
  notifySync();
}

export function addDepartment(department: Department) {
  const depts = getDepartments();
  depts.unshift(department);
  saveDepartments(depts);
}

export function deleteDepartment(id: string) {
  const depts = getDepartments().filter(d => d.id !== id);
  saveDepartments(depts);
}

export function getDepartmentEmployees(): DepartmentEmployee[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(EMPLOYEES_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse employees from localStorage", e);
    }
  }
  const defaultEmployees: DepartmentEmployee[] = [
    {
      id: "EMP-501",
      name: "Santosh K.",
      departmentId: "DEPT-101",
      departmentName: "Water Supply & Sanitation",
      designation: "Senior Field Inspector",
      email: "santosh.k@shirolnagar.gov.in",
      phone: "+91 98221 04512",
      status: "Active",
      joinedDate: "2024-02-01"
    },
    {
      id: "EMP-502",
      name: "Vijay E.",
      departmentId: "DEPT-103",
      departmentName: "Electricity & Streetlights",
      designation: "Electrical Supervisor",
      email: "vijay.e@shirolnagar.gov.in",
      phone: "+91 94230 11984",
      status: "Active",
      joinedDate: "2024-02-15"
    },
    {
      id: "EMP-503",
      name: "Amit Deshmukh",
      departmentId: "DEPT-102",
      departmentName: "Solid Waste Management",
      designation: "Sanitation Supervisor",
      email: "amit.d@shirolnagar.gov.in",
      phone: "+91 98902 33411",
      status: "Active",
      joinedDate: "2024-03-01"
    },
    {
      id: "EMP-504",
      name: "Sachin Patil",
      departmentId: "DEPT-104",
      departmentName: "Roads & Infrastructure",
      designation: "Civil Engineer Assistant",
      email: "sachin.p@shirolnagar.gov.in",
      phone: "+91 97654 88210",
      status: "Active",
      joinedDate: "2024-03-10"
    }
  ];
  localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(defaultEmployees));
  return defaultEmployees;
}

export function saveDepartmentEmployees(employees: DepartmentEmployee[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(employees));
  notifySync();
}

export function addDepartmentEmployee(employee: DepartmentEmployee) {
  const employees = getDepartmentEmployees();
  employees.unshift(employee);
  saveDepartmentEmployees(employees);
}

export function deleteDepartmentEmployee(id: string) {
  const employees = getDepartmentEmployees().filter(e => e.id !== id);
  saveDepartmentEmployees(employees);
}

// --- Auth State ---

export type Role = "mayor" | "officer" | "admin" | "citizen";

export interface User {
  id: string;
  name: string;
  role: Role;
  uniqueId?: string;
}

const AUTH_KEY = "smart_nagar_auth";

export function login(user: User) {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  notifySync();
}

export function logout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_KEY);
  notifySync();
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

export function generateSystemUniqueId(role: Role): string {
  const prefixMap: Record<Role, string> = {
    admin: "SNP-ADM",
    mayor: "SNP-MYR",
    officer: "SNP-OFF",
    citizen: "SNP-CIT"
  };
  const prefix = prefixMap[role] || "SNP-USR";
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${num}`;
}
