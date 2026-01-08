"use server"

import { z } from "zod"
import prisma from "@/lib/db"
import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"

const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export async function registerUser(prevState: any, formData: FormData) {
  const validatedFields = RegisterSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!validatedFields.success) {
    return { error: "Invalid fields. Please check your inputs." }
  }

  const { name, email, password } = validatedFields.data

  try {
    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return { error: "Email is already in use!" }
    }

    // 2. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10)

    // 3. Create User (Default role is STUDENT)
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "STUDENT",
        image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`, // Auto-generate avatar
      },
    })

  } catch (error) {
    return { error: "Something went wrong. Please try again." }
  }

  // 4. Redirect to Login on success
  redirect("/login")
}
