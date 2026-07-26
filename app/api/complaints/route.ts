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

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function GET() {
  return NextResponse.json(globalComplaintsStore, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (body.action === "update_status") {
      const { id, newStatus } = body;
      const item = globalComplaintsStore.find((c) => c.id === id);
      if (item) {
        item.status = newStatus;
        item.timeline.push({
          status: newStatus,
          date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          note: `Status updated to ${newStatus}`
        });
      }
      return NextResponse.json(globalComplaintsStore, { status: 200, headers: corsHeaders });
    }

    if (body.action === "assign") {
      const { id, officerName } = body;
      const item = globalComplaintsStore.find((c) => c.id === id);
      if (item) {
        item.assignedTo = officerName;
        item.status = "In Progress";
        item.timeline.push({
          status: "In Progress",
          date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          note: `Assigned to ${officerName}`
        });
      }
      return NextResponse.json(globalComplaintsStore, { status: 200, headers: corsHeaders });
    }

    // Default POST: Add new complaint
    const newComplaint: ComplaintItem = body;
    if (!newComplaint.id) {
      newComplaint.id = `SH-2024-${Math.floor(1000 + Math.random() * 9000)}`;
    }
    
    // Unshift to place latest complaint at top
    const exists = globalComplaintsStore.some((c) => c.id === newComplaint.id);
    if (!exists) {
      globalComplaintsStore.unshift(newComplaint);
    }

    return NextResponse.json(globalComplaintsStore, { status: 200, headers: corsHeaders });
  } catch (err) {
    console.error("API error", err);
    return NextResponse.json({ error: "Failed to process complaint" }, { status: 500, headers: corsHeaders });
  }
}
