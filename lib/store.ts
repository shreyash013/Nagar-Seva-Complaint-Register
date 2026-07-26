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
      status: "In Progress",
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      note: `Assigned to ${officerName}`
    });
    if (complaints[index].status === "Pending") {
      complaints[index].status = "In Progress";
    }
    saveComplaints(complaints);
  }
}

// --- Department & Department Employee Models ---

export interface Department {
  id: string;
  code: string;
  name: string;
  headName: string;
  headEmail: string;
  description: string;
  createdAt: string;
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

const DEPARTMENTS_KEY = "smart_nagar_departments";
const EMPLOYEES_KEY = "smart_nagar_employees";

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
  const defaultDepts: Department[] = [
    {
      id: "DEPT-101",
      code: "WTR",
      name: "Water Supply & Sanitation",
      headName: "Er. Rajesh Kulkarni",
      headEmail: "water.head@shirolnagar.gov.in",
      description: "Manages drinking water distribution, pipeline maintenance, and sewage control.",
      createdAt: "2024-01-15"
    },
    {
      id: "DEPT-102",
      code: "SWM",
      name: "Solid Waste Management",
      headName: "Prakash Jadhav",
      headEmail: "swm.head@shirolnagar.gov.in",
      description: "Responsible for daily garbage collection, street sweeping, and waste treatment.",
      createdAt: "2024-01-15"
    },
    {
      id: "DEPT-103",
      code: "ELE",
      name: "Electricity & Streetlights",
      headName: "Vijay More",
      headEmail: "electrical.head@shirolnagar.gov.in",
      description: "Oversees public streetlight maintenance, municipal power grids, and solar projects.",
      createdAt: "2024-02-01"
    },
    {
      id: "DEPT-104",
      code: "RDS",
      name: "Roads & Infrastructure",
      headName: "Sunil Shinde",
      headEmail: "roads.head@shirolnagar.gov.in",
      description: "Handles road repair, drainage construction, and public building maintenance.",
      createdAt: "2024-02-10"
    }
  ];
  localStorage.setItem(DEPARTMENTS_KEY, JSON.stringify(defaultDepts));
  return defaultDepts;
}

export function saveDepartments(departments: Department[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(DEPARTMENTS_KEY, JSON.stringify(departments));
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
