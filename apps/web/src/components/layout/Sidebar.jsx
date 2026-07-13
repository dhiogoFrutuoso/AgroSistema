import {
  BarChart3,
  Building2,
  ClipboardList,
  FileText,
  Home,
  Landmark,
  LogOut,
  Map,
  Settings,
  ShieldCheck,
  Sprout,
  Tractor,
  Users,
  Warehouse,
  Droplets,
  Wheat,
  HardHat,
  X
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { logout, getLoggedUser } from "../../services/authService.js";

const menuItems = [
  { label: "Painel", path: "/painel", key: "painel", icon: Home },
  { label: "Funcionários", path: "/funcionarios", key: "funcionarios", icon: Users },
  { label: "Fazendas", path: "/fazendas", key: "fazendas", icon: Building2 },
  { label: "Talhões", path: "/talhoes", key: "talhoes", icon: Sprout },
  { label: "Mapas/GPS", path: "/mapas-gps", key: "mapas", icon: Map },
  { label: "Financeiro", path: "/financeiro", key: "financeiro", icon: Landmark },
  { label: "Estoque", path: "/estoque", key: "estoque", icon: Warehouse },
  { label: "Máquinas", path: "/maquinas", key: "maquinas", icon: Tractor },
  { label: "Operador", path: "/operador", key: "operador", icon: HardHat },
  { label: "Plantio", path: "/plantio", key: "plantio", icon: Wheat },
  { label: "Colheita", path: "/colheita", key: "colheita", icon: ClipboardList },
  { label: "Irrigação", path: "/irrigacao", key: "irrigacao", icon: Droplets },
  { label: "Documentos", path: "/documentos", key: "documentos", icon: FileText },
  { label: "Relatórios", path: "/relatorios", key: "relatorios", icon: BarChart3 },
  { label: "Auditoria", path: "/auditoria", key: "auditoria", icon: ShieldCheck },
  { label: "Configurações", path: "/configuracoes", key: "configuracoes", icon: Settings }
];

export default function Sidebar({ mobileOpen = false, onClose }) {
  const navigate = useNavigate();
  const user = getLoggedUser();

  const role = String(user?.perfil || user?.tipo || user?.role || "").toUpperCase();
  const isAdmin = role === "ADMIN" || role === "ADMINISTRADOR";
  const permissoes = user?.permissoes || {};

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <aside
      className={`
        fixed left-0 top-0 z-[60] flex h-screen w-72 flex-col
        border-r border-white/10 bg-[#020817] px-5 py-5 text-white shadow-2xl
        transition-transform duration-300
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
      `}
    >
      <button
        onClick={onClose}
        className="mb-3 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white lg:hidden"
      >
        <X size={24} />
      </button>

      <div className="shrink-0 pb-5 pt-1">
        <img
          src="/images/sistema/logosistema.png"
          alt="ARROZ DOS FERREIRAS"
          className="mx-auto h-[155px] w-[220px] object-contain"
        />
      </div>

      <nav className="sidebar-scroll-final min-h-0 flex-1 space-y-2 overflow-y-auto pr-2">
        {menuItems
          .filter((item) => {
            if (item.key === "painel" || item.key === "operador") return true;
            if (isAdmin) return true;
            return permissoes[item.key] === true;
          })
          .map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `
                  flex items-center gap-4 rounded-[22px] px-5 py-4 text-base font-black transition-all
                  ${
                    isActive
                      ? "bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow-[0_18px_45px_rgba(22,163,74,0.30)]"
                      : "text-slate-200 hover:bg-white/[0.06] hover:text-white"
                  }
                  `
                }
              >
                <Icon size={22} strokeWidth={2.25} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
      </nav>

      <button
        onClick={handleLogout}
        className="mt-4 flex w-full shrink-0 items-center justify-center gap-2 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-black text-red-300 transition-colors hover:bg-red-500/20"
      >
        <LogOut size={18} />
        Sair
      </button>
    </aside>
  );
}