import { Bell, Search, UserCircle, X, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getLoggedUser } from "../../services/authService.js";

// Mapeamento de todos os módulos para a Busca Rápida (Spotlight)
const systemModules = [
  { label: "Painel Principal", path: "/painel", keywords: "dashboard inicio home" },
  { label: "Funcionários", path: "/funcionarios", keywords: "equipe rh pessoas usuarios" },
  { label: "Fazendas", path: "/fazendas", keywords: "propriedades locais sedes" },
  { label: "Talhões", path: "/talhoes", keywords: "areas campos terra" },
  { label: "Mapas e GPS", path: "/mapas-gps", keywords: "geolocalizacao satelite mapa" },
  { label: "Financeiro", path: "/financeiro", keywords: "dinheiro contas pagar receber notas" },
  { label: "Estoque", path: "/estoque", keywords: "inventario produtos insumos sementes veneno" },
  { label: "Máquinas", path: "/maquinas", keywords: "frota tratores colheitadeiras" },
  { label: "Operador", path: "/operador", keywords: "servicos horas trabalhadas motorista" },
  { label: "Plantio", path: "/plantio", keywords: "semeadura safra sementes" },
  { label: "Colheita", path: "/colheita", keywords: "producao peso balança" },
  { label: "Irrigação", path: "/irrigacao", keywords: "agua faturas hidrometro" },
  { label: "Documentos", path: "/documentos", keywords: "arquivos pdf imagens contratos" },
  { label: "Relatórios", path: "/relatorios", keywords: "exportacao pdf resumo emissao" },
  { label: "Auditoria", path: "/auditoria", keywords: "logs seguranca historico acesso" },
  { label: "Configurações", path: "/configuracoes", keywords: "ajustes sistema perfil tema empresa" }
];

export default function Topbar({ title = "Painel" }) {
  const navigate = useNavigate();
  const user = getLoggedUser() || {};
  
  // Estados da Busca Rápida
  const [busca, setBusca] = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  // Fecha a caixa de busca ao clicar fora dela
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lógica de Filtro da Busca
  const resultados = systemModules.filter(mod => {
    const term = busca.toLowerCase();
    return mod.label.toLowerCase().includes(term) || mod.keywords.includes(term);
  });

  function handleSelect(path) {
    navigate(path);
    setBusca("");
    setShowResults(false);
  }

  // Tratamento Inteligente dos Dados do Usuário
  const userName = user?.nome || user?.name || user?.usuario || "Usuário Convidado";
  const userRole = String(user?.perfil || user?.role || user?.tipo || "Colaborador").toUpperCase();
  const userPhoto = user?.foto || user?.avatar || null;

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/70 px-4 py-4 text-white backdrop-blur-2xl lg:px-8">
      <div className="flex items-center justify-between gap-4">
        
        {/* Lado Esquerdo - Título (O botão do menu mobile fica no MainLayout) */}
        <div className="flex items-center gap-3 lg:pl-0 pl-16">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-400">
              ARROZ DOS FERREIRAS
            </p>
            <h2 className="text-xl font-black md:text-2xl">{title}</h2>
          </div>
        </div>

        {/* Centro - Busca Global (Spotlight) */}
        <div ref={searchRef} className="relative hidden max-w-md flex-1 md:block">
          <div className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 focus-within:border-emerald-500/50 focus-within:bg-white/[0.08] transition-colors">
            <Search size={18} className="text-slate-400" />
            <input
              value={busca}
              onChange={(e) => {
                setBusca(e.target.value);
                setShowResults(e.target.value.length > 0);
              }}
              onFocus={() => setShowResults(busca.length > 0)}
              placeholder="Navegar rapidamente para..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
            />
            {busca && (
              <button onClick={() => { setBusca(""); setShowResults(false); }} className="text-slate-400 hover:text-white transition-colors">
                <X size={16} />
              </button>
            )}
          </div>

          {/* Dropdown Flutuante de Resultados */}
          {showResults && (
            <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-white/10 bg-[#0B0F19] shadow-2xl overflow-hidden py-2 z-50">
              <p className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500">Módulos Sugeridos</p>
              
              {resultados.length > 0 ? (
                resultados.map((res) => (
                  <button
                    key={res.path}
                    onClick={() => handleSelect(res.path)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-white/[0.04] transition-colors"
                  >
                    <span className="text-sm font-bold text-white">{res.label}</span>
                    <ChevronRight size={16} className="text-slate-500" />
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-slate-400">Nenhum módulo encontrado.</div>
              )}
            </div>
          )}
        </div>

        {/* Lado Direito - Notificações e Identificação do Usuário */}
        <div className="flex items-center gap-3 shrink-0">
          <button className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-slate-300 hover:bg-white/[0.08] hover:text-white transition-colors">
            <Bell size={20} />
          </button>

          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2 hover:bg-white/[0.06] transition-colors cursor-pointer">
            
            {/* Foto Real ou Ícone Genérico */}
            {userPhoto ? (
              <img 
                src={userPhoto} 
                alt="Perfil do Usuário" 
                className="h-10 w-10 rounded-xl object-cover border border-emerald-500/50 shadow-sm" 
              />
            ) : (
              <UserCircle className="text-emerald-400" size={32} />
            )}
            
            {/* Textos dinâmicos do perfil */}
            <div className="hidden md:block text-left">
              <p className="text-sm font-black text-white leading-tight">{userName}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{userRole}</p>
            </div>

          </div>
        </div>

      </div>
    </header>
  );
}