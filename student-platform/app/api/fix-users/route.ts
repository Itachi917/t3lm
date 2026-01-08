import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    // --- 1. Fix Admin User ---
    // Password: password123
    const adminPassword = "password123";
    const adminHash = await bcrypt.hash(adminPassword, 10);
    
    await prisma.user.upsert({
      where: { email: "admin@university.edu" },
      update: { 
        password: adminHash, 
        role: 'ADMIN' 
      },
      create: {
        email: "admin@university.edu",
        name: "Admin User",
        password: adminHash,
        role: "ADMIN",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
      }
    });

    // --- 2. Fix Arthur (Student) ---
    // Password: Aisha17
    const arthurPassword = "Aisha17";
    const arthurHash = await bcrypt.hash(arthurPassword, 10);

    await prisma.user.upsert({
      where: { email: "arthur@student.edu" },
      update: { 
        password: arthurHash, 
        role: 'STUDENT' 
      },
      create: {
        email: "arthur@student.edu",
        name: "Arthur",
        password: arthurHash,
        role: "STUDENT",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arthur"
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Users have been repaired successfully.",
      users: [
        { email: "admin@university.edu", password: adminPassword },
        { email: "arthur@student.edu", password: arthurPassword }
      ]
    });

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: String(error) 
    }, { status: 500 });
  }
}
