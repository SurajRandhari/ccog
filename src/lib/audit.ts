import ActivityLog from "@/models/ActivityLog";
import { headers } from "next/headers";

/**
 * Logs an admin activity to the database.
 */
export async function logActivity({
  userId,
  userEmail,
  action,
  entityType,
  entityId,
  details,
}: {
  userId: string;
  userEmail: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: string;
}) {
  try {
    await ActivityLog.create({
      userId,
      userEmail,
      action,
      entityType,
      entityId,
      details,
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
}
