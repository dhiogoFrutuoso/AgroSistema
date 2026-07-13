import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";

export default function MainLayout({ title, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-premium-dark text-white">
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed left-4 top-4 z-[80] flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/90 text-white shadow-xl lg:hidden"
        >
          <Menu size={28} />
        </button>
      )}

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-[55] bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-72">
        <Topbar title={title} />

        <main
          onClick={() => sidebarOpen && setSidebarOpen(false)}
          className="p-4 lg:p-8"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
