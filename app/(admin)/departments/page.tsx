"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  Users,
  Trash2,
  UserPlus,
  Search,
  ShieldCheck,
  Mail,
  Phone,
  Briefcase,
  X,
  CheckCircle2,
  Building
} from "lucide-react";
import {
  Department,
  DepartmentEmployee,
  getDepartments,
  addDepartment,
  deleteDepartment,
  getDepartmentEmployees,
  addDepartmentEmployee,
  deleteDepartmentEmployee,
  getComplaints
} from "@/lib/store";

export default function DepartmentsManagementPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<DepartmentEmployee[]>([]);
  const [activeTab, setActiveTab] = useState<"departments" | "employees">("departments");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDeptFilter, setSelectedDeptFilter] = useState("all");

  // Modals
  const [showAddDeptModal, setShowAddDeptModal] = useState(false);
  const [showAddEmpModal, setShowAddEmpModal] = useState(false);

  // New Department Form State
  const [deptName, setDeptName] = useState("");
  const [deptCode, setDeptCode] = useState("");
  const [deptHeadName, setDeptHeadName] = useState("");
  const [deptHeadEmail, setDeptHeadEmail] = useState("");
  const [deptDescription, setDeptDescription] = useState("");

  // New Employee Form State
  const [empName, setEmpName] = useState("");
  const [empDeptId, setEmpDeptId] = useState("");
  const [empDesignation, setEmpDesignation] = useState("");
  const [empEmail, setEmpEmail] = useState("");
  const [empPhone, setEmpPhone] = useState("");

  const refreshData = () => {
    setDepartments(getDepartments());
    setEmployees(getDepartmentEmployees());
  };

  useEffect(() => {
    queueMicrotask(() => {
      refreshData();
    });
  }, []);

  // Department Stats
  const complaints = getComplaints();
  const totalDepts = departments.length;
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((e) => e.status === "Active").length;

  // Handle Add Department
  const handleCreateDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptName || !deptHeadName) return;

    const newDept: Department = {
      id: `DEPT-${Math.floor(100 + Math.random() * 900)}`,
      code: deptCode.toUpperCase() || deptName.substring(0, 3).toUpperCase(),
      name: deptName,
      headName: deptHeadName,
      headEmail: deptHeadEmail || `${deptName.toLowerCase().replace(/\s+/g, ".")}@shirolnagar.gov.in`,
      description: deptDescription || "Municipal department for public services and urban administration.",
      createdAt: new Date().toISOString().split("T")[0]
    };

    addDepartment(newDept);
    setDeptName("");
    setDeptCode("");
    setDeptHeadName("");
    setDeptHeadEmail("");
    setDeptDescription("");
    setShowAddDeptModal(false);
    refreshData();
  };

  // Handle Add Employee
  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empName || !empDeptId) return;

    const targetDept = departments.find((d) => d.id === empDeptId);

    const newEmp: DepartmentEmployee = {
      id: `EMP-${Math.floor(500 + Math.random() * 500)}`,
      name: empName,
      departmentId: empDeptId,
      departmentName: targetDept ? targetDept.name : "General Municipal Dept",
      designation: empDesignation || "Field Officer",
      email: empEmail || `${empName.toLowerCase().replace(/\s+/g, ".")}@shirolnagar.gov.in`,
      phone: empPhone || "+91 98000 00000",
      status: "Active",
      joinedDate: new Date().toISOString().split("T")[0]
    };

    addDepartmentEmployee(newEmp);
    setEmpName("");
    setEmpDeptId("");
    setEmpDesignation("");
    setEmpEmail("");
    setEmpPhone("");
    setShowAddEmpModal(false);
    refreshData();
  };

  // Handle Delete Department
  const handleDeleteDept = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteDepartment(id);
      refreshData();
    }
  };

  // Handle Delete Employee
  const handleDeleteEmp = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove employee "${name}"?`)) {
      deleteDepartmentEmployee(id);
      refreshData();
    }
  };

  // Filtered lists
  const filteredDepartments = departments.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.headName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredEmployees = employees.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDeptFilter === "all" || e.departmentId === selectedDeptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-primary to-primary-fixed-variant p-6 rounded-2xl text-on-primary shadow-lg">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-white/20 text-white font-mono text-label-sm rounded-full font-semibold">
              Master Admin Control
            </span>
            <span className="text-white/80 font-sans text-label-sm">Shirol Municipal Council</span>
          </div>
          <h1 className="font-heading text-display-xs font-bold text-white mt-1">
            Department & Staff Management
          </h1>
          <p className="font-sans text-body-md text-white/90 max-w-2xl mt-1">
            Create departments, assign department admins, and manage field employees for task distribution.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAddDeptModal(true)}
            className="px-4 py-2.5 bg-white text-primary rounded-xl font-sans text-label-md font-bold flex items-center space-x-2 hover:bg-surface-container-light shadow-md transition-all"
          >
            <Building2 className="w-5 h-5" />
            <span>Add Department</span>
          </button>

          <button
            onClick={() => {
              if (departments.length > 0) {
                setEmpDeptId(departments[0].id);
              }
              setShowAddEmpModal(true);
            }}
            className="px-4 py-2.5 bg-secondary text-on-secondary rounded-xl font-sans text-label-md font-bold flex items-center space-x-2 hover:opacity-90 shadow-md transition-all"
          >
            <UserPlus className="w-5 h-5" />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant flex items-center space-x-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <p className="font-sans text-label-sm text-on-surface-variant font-medium">Total Departments</p>
            <h3 className="font-heading text-headline-sm font-bold text-on-surface">{totalDepts}</h3>
          </div>
        </div>

        <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant flex items-center space-x-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="font-sans text-label-sm text-on-surface-variant font-medium">Total Staff</p>
            <h3 className="font-heading text-headline-sm font-bold text-on-surface">{totalEmployees}</h3>
          </div>
        </div>

        <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant flex items-center space-x-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-tertiary-container text-on-tertiary-container flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="font-sans text-label-sm text-on-surface-variant font-medium">Active Duty Employees</p>
            <h3 className="font-heading text-headline-sm font-bold text-on-surface">{activeEmployees}</h3>
          </div>
        </div>

        <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant flex items-center space-x-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-primary-fixed text-primary flex items-center justify-center">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="font-sans text-label-sm text-on-surface-variant font-medium">Active Complaints</p>
            <h3 className="font-heading text-headline-sm font-bold text-on-surface">{complaints.length}</h3>
          </div>
        </div>
      </div>

      {/* Navigation Tabs & Controls */}
      <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center space-x-2 bg-surface p-1 rounded-xl border border-outline-variant">
          <button
            onClick={() => setActiveTab("departments")}
            className={`px-5 py-2 rounded-lg font-sans text-label-md font-semibold flex items-center space-x-2 transition-all ${
              activeTab === "departments"
                ? "bg-primary text-on-primary shadow-sm"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Departments ({departments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("employees")}
            className={`px-5 py-2 rounded-lg font-sans text-label-md font-semibold flex items-center space-x-2 transition-all ${
              activeTab === "employees"
                ? "bg-primary text-on-primary shadow-sm"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Department Staff ({employees.length})</span>
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-3 text-on-surface-variant" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-surface border border-outline-variant rounded-xl font-sans text-body-sm focus:outline-none focus:border-primary"
            />
          </div>

          {activeTab === "employees" && (
            <div className="relative">
              <select
                value={selectedDeptFilter}
                onChange={(e) => setSelectedDeptFilter(e.target.value)}
                className="pl-3 pr-8 py-2 bg-surface border border-outline-variant rounded-xl font-sans text-body-sm font-medium focus:outline-none focus:border-primary"
              >
                <option value="all">All Departments</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Tab 1: Departments Grid */}
      {activeTab === "departments" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDepartments.map((dept) => {
            const deptStaff = employees.filter((e) => e.departmentId === dept.id);

            return (
              <div
                key={dept.id}
                className="bg-surface-container-low rounded-2xl border border-outline-variant p-6 space-y-4 hover:shadow-md transition-shadow relative"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-title-md font-mono">
                      {dept.code}
                    </div>
                    <div>
                      <h3 className="font-heading text-title-lg font-bold text-on-surface">
                        {dept.name}
                      </h3>
                      <span className="font-mono text-label-xs text-on-surface-variant bg-surface px-2 py-0.5 rounded border border-outline-variant">
                        ID: {dept.id}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteDept(dept.id, dept.name)}
                    className="p-2 text-on-surface-variant hover:text-error hover:bg-error-container/40 rounded-lg transition-colors"
                    title="Delete Department"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <p className="font-sans text-body-sm text-on-surface-variant">
                  {dept.description}
                </p>

                <div className="pt-3 border-t border-outline-variant space-y-2">
                  <div className="flex items-center justify-between text-body-sm">
                    <span className="font-sans text-on-surface-variant flex items-center space-x-2">
                      <ShieldCheck className="w-4 h-4 text-primary" />
                      <span className="font-semibold text-on-surface">Dept Admin / Head:</span>
                    </span>
                    <span className="font-medium text-primary">{dept.headName}</span>
                  </div>

                  <div className="flex items-center justify-between text-body-sm">
                    <span className="font-sans text-on-surface-variant flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-on-surface-variant" />
                      <span>Contact Email:</span>
                    </span>
                    <span className="font-mono text-label-sm text-on-surface">{dept.headEmail}</span>
                  </div>

                  <div className="flex items-center justify-between text-body-sm pt-2">
                    <span className="font-sans text-on-surface-variant flex items-center space-x-2">
                      <Users className="w-4 h-4 text-secondary" />
                      <span>Assigned Staff:</span>
                    </span>
                    <span className="px-2.5 py-0.5 bg-secondary/10 text-secondary font-bold rounded-full text-label-sm">
                      {deptStaff.length} Employees
                    </span>
                  </div>
                </div>

                {/* Staff avatars summary */}
                {deptStaff.length > 0 && (
                  <div className="pt-3 border-t border-outline-variant flex items-center justify-between">
                    <div className="flex -space-x-2 overflow-hidden">
                      {deptStaff.slice(0, 4).map((emp) => (
                        <div
                          key={emp.id}
                          className="w-8 h-8 rounded-full bg-primary-fixed-variant text-primary font-bold text-label-xs flex items-center justify-center border-2 border-surface"
                          title={`${emp.name} (${emp.designation})`}
                        >
                          {emp.name.charAt(0)}
                        </div>
                      ))}
                      {deptStaff.length > 4 && (
                        <div className="w-8 h-8 rounded-full bg-surface-container-high text-on-surface font-bold text-label-xs flex items-center justify-center border-2 border-surface">
                          +{deptStaff.length - 4}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setSelectedDeptFilter(dept.id);
                        setActiveTab("employees");
                      }}
                      className="text-label-sm text-primary hover:underline font-semibold"
                    >
                      View Staff Directory →
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {filteredDepartments.length === 0 && (
            <div className="col-span-full py-12 text-center bg-surface-container-low rounded-2xl border border-dashed border-outline-variant space-y-3">
              <Building2 className="w-12 h-12 mx-auto text-on-surface-variant/50" />
              <h3 className="font-heading text-title-md font-bold text-on-surface">No Departments Found</h3>
              <p className="font-sans text-body-sm text-on-surface-variant max-w-sm mx-auto">
                No municipal departments match your search query. Click &quot;Add Department&quot; above to create one.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Department Employees Table */}
      {activeTab === "employees" && (
        <div className="bg-surface-container-low rounded-2xl border border-outline-variant overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container border-b border-outline-variant text-label-md text-on-surface-variant font-semibold">
                  <th className="p-4">Employee ID & Name</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Designation</th>
                  <th className="p-4">Contact Info</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant font-sans text-body-sm">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-surface-container-high/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center">
                          {emp.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-on-surface">{emp.name}</p>
                          <span className="font-mono text-label-xs text-on-surface-variant">{emp.id}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-surface border border-outline-variant rounded-lg font-medium text-on-surface">
                        {emp.departmentName}
                      </span>
                    </td>

                    <td className="p-4 text-on-surface font-medium">{emp.designation}</td>

                    <td className="p-4 space-y-1">
                      <div className="flex items-center space-x-2 text-on-surface text-label-sm">
                        <Mail className="w-3.5 h-3.5 text-on-surface-variant" />
                        <span>{emp.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-on-surface-variant text-label-sm">
                        <Phone className="w-3.5 h-3.5 text-on-surface-variant" />
                        <span>{emp.phone}</span>
                      </div>
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-label-xs font-semibold ${
                          emp.status === "Active"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-surface-container-high text-on-surface-variant"
                        }`}
                      >
                        {emp.status}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteEmp(emp.id, emp.name)}
                        className="p-2 text-on-surface-variant hover:text-error hover:bg-error-container/40 rounded-lg transition-colors"
                        title="Remove Employee"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredEmployees.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-on-surface-variant">
                      <Users className="w-10 h-10 mx-auto text-on-surface-variant/40 mb-2" />
                      <p className="font-semibold text-body-md">No Staff Employees Found</p>
                      <p className="text-body-sm">Click &quot;Add Employee&quot; above to register new department staff.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Add Department */}
      {showAddDeptModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant max-w-lg w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-outline-variant pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading text-title-lg font-bold text-on-surface">
                    Create New Department
                  </h3>
                  <p className="font-sans text-label-sm text-on-surface-variant">
                    Master Admin Control
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddDeptModal(false)}
                className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDepartment} className="space-y-4">
              <div>
                <label className="block font-sans text-label-md text-on-surface font-semibold mb-1">
                  Department Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Health & Public Hygiene"
                  value={deptName}
                  onChange={(e) => setDeptName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl font-sans text-body-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-sans text-label-md text-on-surface font-semibold mb-1">
                    Dept Code (3 Letters)
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="e.g. HPH"
                    value={deptCode}
                    onChange={(e) => setDeptCode(e.target.value)}
                    className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl font-sans text-body-sm font-mono uppercase focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block font-sans text-label-md text-on-surface font-semibold mb-1">
                    Dept Admin / Head Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Anil Bhosale"
                    value={deptHeadName}
                    onChange={(e) => setDeptHeadName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl font-sans text-body-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block font-sans text-label-md text-on-surface font-semibold mb-1">
                  Head Official Email
                </label>
                <input
                  type="email"
                  placeholder="e.g. health.head@shirolnagar.gov.in"
                  value={deptHeadEmail}
                  onChange={(e) => setDeptHeadEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl font-sans text-body-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-sans text-label-md text-on-surface font-semibold mb-1">
                  Department Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the department responsibilities and jurisdiction..."
                  value={deptDescription}
                  onChange={(e) => setDeptDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl font-sans text-body-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-outline-variant">
                <button
                  type="button"
                  onClick={() => setShowAddDeptModal(false)}
                  className="px-4 py-2 bg-surface-container-high text-on-surface rounded-xl font-sans text-label-md font-semibold hover:bg-surface-container-highest"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-on-primary rounded-xl font-sans text-label-md font-bold hover:bg-primary-fixed-variant"
                >
                  Save Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Employee */}
      {showAddEmpModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant max-w-lg w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-outline-variant pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading text-title-lg font-bold text-on-surface">
                    Onboard Department Employee
                  </h3>
                  <p className="font-sans text-label-sm text-on-surface-variant">
                    Master Admin Control
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddEmpModal(false)}
                className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEmployee} className="space-y-4">
              <div>
                <label className="block font-sans text-label-md text-on-surface font-semibold mb-1">
                  Assigned Department *
                </label>
                <select
                  required
                  value={empDeptId}
                  onChange={(e) => setEmpDeptId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl font-sans text-body-sm font-medium focus:outline-none focus:border-primary"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-sans text-label-md text-on-surface font-semibold mb-1">
                  Employee Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Mane"
                  value={empName}
                  onChange={(e) => setEmpName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl font-sans text-body-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-sans text-label-md text-on-surface font-semibold mb-1">
                  Designation / Role
                </label>
                <input
                  type="text"
                  placeholder="e.g. Junior Engineer / Field Inspector"
                  value={empDesignation}
                  onChange={(e) => setEmpDesignation(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl font-sans text-body-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-sans text-label-md text-on-surface font-semibold mb-1">
                    Official Email
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. ramesh.m@shirolnagar.gov.in"
                    value={empEmail}
                    onChange={(e) => setEmpEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl font-sans text-body-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block font-sans text-label-md text-on-surface font-semibold mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. +91 98765 43210"
                    value={empPhone}
                    onChange={(e) => setEmpPhone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl font-sans text-body-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-outline-variant">
                <button
                  type="button"
                  onClick={() => setShowAddEmpModal(false)}
                  className="px-4 py-2 bg-surface-container-high text-on-surface rounded-xl font-sans text-label-md font-semibold hover:bg-surface-container-highest"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-secondary text-on-secondary rounded-xl font-sans text-label-md font-bold hover:opacity-90"
                >
                  Register Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
