import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import LoginPage from "../modules/login/LoginPage.jsx";
import PainelPage from "../modules/painel/PainelPage.jsx";
import FuncionariosPage from "../modules/funcionarios/FuncionariosPage.jsx";
import FazendasPage from "../modules/fazendas/FazendasPage.jsx";
import TalhoesPage from "../modules/talhoes/TalhoesPage.jsx";
import FinanceiroPage from "../modules/financeiro/FinanceiroPage.jsx";
import GastosTalhaoPage from "../modules/financeiro/GastosTalhaoPage.jsx";
import EstoquePage from "../modules/estoque/EstoquePage.jsx";
import MaquinasPage from "../modules/maquinas/MaquinasPage.jsx";
import MapasGpsPage from "../modules/mapas-gps/MapasGpsPage.jsx";
import RelatoriosPage from "../modules/relatorios/RelatoriosPage.jsx";
import DocumentosPage from "../modules/documentos/DocumentosPage.jsx";
import PlantioPage from "../modules/plantio/PlantioPage.jsx";
import IrrigacaoPage from "../modules/irrigacao/IrrigacaoPage.jsx";
import ColheitaPage from "../modules/colheita/ColheitaPage.jsx";
import AuditoriaPage from "../modules/auditoria/AuditoriaPage.jsx";
import ConfiguracoesPage from "../modules/configuracoes/ConfiguracoesPage.jsx";
import OperadorPage from "../modules/operador/OperadorPage.jsx";
import MainLayout from "../components/layout/MainLayout.jsx";
import { getLoggedUser } from "../services/authService.js";

function GlobalAccessError() {
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    if (location.state?.accessError) {
      setError(location.state.accessError);
      navigate(location.pathname, { replace: true, state: {} });
      setTimeout(() => setError(""), 6000);
    }
  }, [location, navigate]);

  if (!error) return null;

  return (
    <div className="fixed left-1/2 top-6 z-[100] flex -translate-x-1/2 animate-bounce items-center gap-3 rounded-2xl border border-red-400/30 bg-red-600 px-6 py-4 font-bold text-white shadow-[0_10px_40px_rgba(220,38,38,0.4)]">
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      {error}
    </div>
  );
}

function HomeRedirect({ user }) {
  if (!user) return <Navigate to="/login" replace />;
  const role = String(user.perfil || user.tipo || user.role || "").toUpperCase();
  if (role === "OPERADOR" || role === "EMPLOYEE") return <Navigate to="/operador" replace />;
  return <Navigate to="/painel" replace />;
}

function PermissionRoute({ user, moduleKey, title, children }) {
  if (!user) return <Navigate to="/login" replace />;

  const role = String(user.perfil || user.tipo || user.role || "").toUpperCase();
  const isOperador = role === "OPERADOR" || role === "EMPLOYEE";
  
  if (isOperador && moduleKey !== "operador") {
    return <Navigate to="/operador" replace />;
  }

  const isAdmin = role === "ADMIN" || role === "ADMINISTRADOR";
  const hasPermission = isAdmin || (user.permissoes && user.permissoes[moduleKey] === true);

  if (!hasPermission && moduleKey !== "painel" && moduleKey !== "operador") {
    return <Navigate to="/painel" state={{ accessError: `Acesso Negado: Seu usuário não tem permissão para acessar o módulo de ${title}.` }} replace />;
  }

  return <MainLayout title={title}>{children}</MainLayout>;
}

export default function AppRoutes() {
  const [user, setUser] = useState(getLoggedUser());

  function handleUserLogin(loggedUser) {
    setUser(loggedUser);
  }

  return (
    <BrowserRouter>
      <GlobalAccessError />
      <Routes>
        <Route path="/" element={<HomeRedirect user={user} />} />
        <Route path="/login" element={<LoginPage onUserLogin={handleUserLogin} />} />

        <Route path="/painel" element={<PermissionRoute user={user} moduleKey="painel" title="Painel"><PainelPage /></PermissionRoute>} />
        <Route path="/operador" element={<PermissionRoute user={user} moduleKey="operador" title="Operador"><OperadorPage /></PermissionRoute>} />
        
        <Route path="/funcionarios" element={<PermissionRoute user={user} moduleKey="funcionarios" title="Funcionários"><FuncionariosPage /></PermissionRoute>} />
        <Route path="/fazendas" element={<PermissionRoute user={user} moduleKey="fazendas" title="Fazendas"><FazendasPage /></PermissionRoute>} />
        <Route path="/talhoes" element={<PermissionRoute user={user} moduleKey="talhoes" title="Talhões"><TalhoesPage /></PermissionRoute>} />
        <Route path="/financeiro" element={<PermissionRoute user={user} moduleKey="financeiro" title="Financeiro"><FinanceiroPage /></PermissionRoute>} />
        <Route path="/financeiro/gastos-talhao" element={<PermissionRoute user={user} moduleKey="financeiro" title="Gastos por Talhão"><GastosTalhaoPage /></PermissionRoute>} />
        <Route path="/estoque" element={<PermissionRoute user={user} moduleKey="estoque" title="Estoque"><EstoquePage /></PermissionRoute>} />
        <Route path="/maquinas" element={<PermissionRoute user={user} moduleKey="maquinas" title="Máquinas"><MaquinasPage /></PermissionRoute>} />
        <Route path="/mapas-gps" element={<PermissionRoute user={user} moduleKey="mapas" title="Mapas/GPS"><MapasGpsPage /></PermissionRoute>} />
        <Route path="/relatorios" element={<PermissionRoute user={user} moduleKey="relatorios" title="Relatórios"><RelatoriosPage /></PermissionRoute>} />
        <Route path="/documentos" element={<PermissionRoute user={user} moduleKey="documentos" title="Documentos"><DocumentosPage /></PermissionRoute>} />
        <Route path="/plantio" element={<PermissionRoute user={user} moduleKey="plantio" title="Plantio"><PlantioPage /></PermissionRoute>} />
        <Route path="/colheita" element={<PermissionRoute user={user} moduleKey="colheita" title="Colheita"><ColheitaPage /></PermissionRoute>} />
        <Route path="/irrigacao" element={<PermissionRoute user={user} moduleKey="irrigacao" title="Irrigação"><IrrigacaoPage /></PermissionRoute>} />
        <Route path="/auditoria" element={<PermissionRoute user={user} moduleKey="auditoria" title="Auditoria"><AuditoriaPage /></PermissionRoute>} />
        <Route path="/configuracoes" element={<PermissionRoute user={user} moduleKey="configuracoes" title="Configurações"><ConfiguracoesPage /></PermissionRoute>} />

        <Route path="*" element={<HomeRedirect user={user} />} />
      </Routes>
    </BrowserRouter>
  );
}