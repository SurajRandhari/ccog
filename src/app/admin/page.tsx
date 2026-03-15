import { redirect } from "next/navigation";

export default function AdminPage() {
  // Middleware protects this route — if user reaches here, they're authenticated
  // For now, redirect to login. Dashboard will be built in Phase 2.
  redirect("/admin/login");
}
