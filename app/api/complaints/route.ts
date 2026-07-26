import { NextResponse } from "next/server";

// Server-side in-memory shared state & database store
// This ensures cross-origin Netlify sites (citizen site & admin site) sync live complaints!
interface ComplaintItem {
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

// Initial seed complaints
const globalComplaintsStore: ComplaintItem[] = [
  {
    id: "SH-2024-1426",
    date: "Jul 26, 2026",
    citizenName: "Citizen User",
    category: "Roads",
    description: "Complaint registered online.",
    ward: "Ward 1",
    area: "Shivaji Chowk",
    status: "Pending",
    timeline: [
      { status: "Complaint Submitted", date: "Jul 26, 2026", note: "Complaint registered online." }
    ]
  },
  {
    id: "SH-2024-8260",
    date: "Jul 26, 2026",
    citizenName: "Citizen User",
    category: "Water",
    description: "Go",
    ward: "Ward 1",
    area: "Shivaji Chowk",
    status: "Pending",
    timeline: [
      { status: "Complaint Submitted", date: "Jul 26, 2026", note: "Complaint registered online." }
    ]
  },
  {
    id: "SH-2024-6761",
    date: "Jul 26, 2026",
    citizenName: "Citizen User",
    category: "Garbage",
    description: "Come",
    ward: "Ward 1",
    area: "Shivaji Chowk",
    status: "Pending",
    timeline: [
      { status: "Complaint Submitted", date: "Jul 26, 2026", note: "Complaint registered online." }
    ]
  },
  {
    id: "SH-2026-LIVE-77",
    date: "Jul 26, 2026",
    citizenName: "Shreyash Patil (Live Test)",
    category: "Water Supply",
    description: "Live test complaint for water pipeline leakage near Shivaji Chowk",
    ward: "Ward 1",
    area: "Shivaji Chowk",
    status: "In Progress",
    assignedTo: "Amit Deshmukh",
    timeline: [
      { status: "Complaint Submitted", date: "Jul 26, 2026", note: "Complaint registered online." },
      { status: "In Progress", date: "Jul 26, 2026", note: "Assigned to Amit Deshmukh" }
    ]
  },
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

const CLOUD_STORE_URL = "https://jsonblob.com/api/jsonBlob/019f9f24-be19-7e68-9053-367a244ba7bd";

async function getCloudComplaints(): Promise<ComplaintItem[]> {
  try {
    const res = await fetch(CLOUD_STORE_URL, { cache: "no-store" });
    if (res.ok) {
      const data: ComplaintItem[] = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (e) {
    console.error("Failed to read from cloud store", e);
  }
  return globalComplaintsStore;
}

async function saveCloudComplaints(list: ComplaintItem[]) {
  try {
    await fetch(CLOUD_STORE_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(list)
    });
  } catch (e) {
    console.error("Failed to save to cloud store", e);
  }
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function GET() {
  const complaints = await getCloudComplaints();
  return NextResponse.json(complaints, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const currentList = await getCloudComplaints();

    if (body.action === "update_status") {
      const { id, newStatus } = body;
      const item = currentList.find((c) => c.id === id);
      if (item) {
        item.status = newStatus;
        item.timeline.push({
          status: newStatus,
          date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          note: `Status updated to ${newStatus}`
        });
        await saveCloudComplaints(currentList);
      }
      return NextResponse.json(currentList, { status: 200, headers: corsHeaders });
    }

    if (body.action === "assign") {
      const { id, officerName } = body;
      const item = currentList.find((c) => c.id === id);
      if (item) {
        item.assignedTo = officerName;
        item.status = "In Progress";
        item.timeline.push({
          status: "In Progress",
          date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          note: `Assigned to ${officerName}`
        });
        await saveCloudComplaints(currentList);
      }
      return NextResponse.json(currentList, { status: 200, headers: corsHeaders });
    }

    // Default POST: Add new complaint
    const newComplaint: ComplaintItem = body;
    if (!newComplaint.id) {
      newComplaint.id = `SH-2024-${Math.floor(1000 + Math.random() * 9000)}`;
    }
    
    // Unshift to place latest complaint at top
    const exists = currentList.some((c) => c.id === newComplaint.id);
    if (!exists) {
      currentList.unshift(newComplaint);
    } else {
      const index = currentList.findIndex((c) => c.id === newComplaint.id);
      if (index !== -1) currentList[index] = newComplaint;
    }

    await saveCloudComplaints(currentList);
    return NextResponse.json(currentList, { status: 200, headers: corsHeaders });
  } catch (err) {
    console.error("API error", err);
    return NextResponse.json({ error: "Failed to process complaint" }, { status: 500, headers: corsHeaders });
  }
}
