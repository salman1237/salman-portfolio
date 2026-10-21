import { Suspense } from "react";
import { logout } from "@/app/admin/actions/auth";
import AdminNav from "@/components/admin/AdminNav";
import ScrollRestore from "@/components/admin/ScrollRestore";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-paper-dim">
      <Suspense fallback={null}>
        <ScrollRestore />
      </Suspense>
      <div className="flex flex-col md:flex-row">
        <aside className="bg-ink text-paper md:min-h-screen md:w-56 md:flex-none">
          <div className="flex items-center justify-between px-5 py-4">
            <span className="font-display text-lg font-extrabold">Admin</span>
          </div>
          <AdminNav />
          <form action={logout} className="px-5 py-5">
            <button className="min-h-[44px] w-full rounded-full border border-paper/20 font-mono text-xs text-paper/70 hover:border-accent-3 hover:text-accent-3">
              Log out
            </button>
          </form>
        </aside>
        <main className="min-w-0 flex-1 px-5 py-8 md:px-10">
          <div className="mx-auto max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
