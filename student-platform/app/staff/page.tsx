import { auth } from "@/auth";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { Users } from "lucide-react";
import { StaffDirectory } from "@/components/staff-directory";

export default async function StaffPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  // 1. Fetch ALL sections
  // We fetch raw data and will group it in Javascript to be flexible
  const allSections = await prisma.universitySection.findMany({
    where: {
        NOT: { instructor: null } // Filter out sections with no instructor
    },
    orderBy: { instructor: 'asc' }
  });

  // 2. Group by Instructor
  const staffMap = new Map<string, any[]>();

  allSections.forEach((sec) => {
    // Normalize name (trim spaces, handle 'null' strings)
    const name = sec.instructor?.trim() || "Unknown Staff";
    
    // Skip generic placeholder names if you want
    if (name === "Lecturer" || name === "Staff" || name === "--") return;

    if (!staffMap.has(name)) {
        staffMap.set(name, []);
    }
    staffMap.get(name)?.push(sec);
  });

  // Convert to array for the component
  const staffList = Array.from(staffMap.entries()).map(([name, sections]) => ({
    name,
    sections
  }));

  return (
    <div className="p-6 md:p-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b-4 border-[#004D98] pb-6">
        <div>
            <h1 className="text-4xl font-black uppercase italic text-[#004D98] tracking-tighter mb-2 flex items-center gap-3">
                <Users className="w-10 h-10 text-[#A50044]" />
                Staff Directory
            </h1>
            <p className="text-slate-500 font-bold">
                Find instructors and view their office hours/teaching schedules.
            </p>
        </div>
        <div className="hidden md:block">
             <div className="bg-[#A50044] text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg border border-[#EDBB00]">
                TOTAL STAFF: <span className="text-[#EDBB00] font-mono text-lg">{staffList.length}</span>
             </div>
        </div>
      </div>

      {/* The Directory Widget */}
      <StaffDirectory staffList={staffList} />
    </div>
  );
}
