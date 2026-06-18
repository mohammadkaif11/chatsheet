
"use server";

import { prisma } from "@/lib/prisma";

export async function requestDemo(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const company = (formData.get("company") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim();
  const message = (formData.get("message") as string)?.trim() || null;

  if (!name || !company || !email || !phone) {
    return { success: false, error: "All fields except message are required" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, error: "Please enter a valid email address" };
  }

  try {
    await prisma.demoRequest.create({
      data: { name, company, email, phone, message },
    });
    return { success: true };
  } catch (error: any) {
    console.error("Demo request error:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
