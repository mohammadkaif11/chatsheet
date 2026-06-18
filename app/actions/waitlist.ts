"use server";

import { prisma } from "@/lib/prisma";

export async function joinWaitlist(contact: string) {
  const trimmed = contact.trim();
  if (!trimmed) {
    return { success: false, error: "Contact is required" };
  }

  try {
    await prisma.waitlistUser.create({
      data: { contact: trimmed },
    });
    return { success: true };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { success: false, error: "You are already on the waitlist!" };
    }
    console.error("Waitlist error:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
