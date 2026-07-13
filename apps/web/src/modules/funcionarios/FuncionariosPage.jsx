import { useState, useEffect } from "react";
import { FileJson, FileText, Sheet } from "lucide-react";

import "./styles/funcionarios.css";
import AccessDenied from "./components/AccessDenied.jsx";
import FuncionarioForm from "./components/FuncionarioForm.jsx";
import FuncionarioModal from "./components/FuncionarioModal.jsx";
import FuncionarioEditModal from "./components/FuncionarioEditModal.jsx";
import FuncionariosDashboard from "./components/FuncionariosDashboard.jsx";
import FuncionariosGraficos from "./components/FuncionariosGraficos.jsx";
import FuncionariosTable from "./components/FuncionariosTable.jsx";
import useFuncionarios from "./hooks/useFuncionarios.js";

import { exportCSV, exportJSON, exportPDF, checkIsAdmin } from "./services/funcionariosService.js";

export default function FuncionariosPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  
  const { funcionarios, resumo, loadingData, criar, editar, excluir, bloquear, liberar, resetar } = useFuncionarios();
  
  const [selectedForEdit, setSelectedForEdit] = useState(null);
  const [view, setView] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function verifyAuth() {
      setLoadingAuth(true);
      const authorized = await checkIsAdmin();
      if (mounted) {
        setIsAdmin(authorized);
        setLoadingAuth(false);
      }
    }
    verifyAuth();
    
    return () => { mounted = false; };
  }, []);

  async function safeAction(fn) {
    try {
      await fn();
    } catch (error) {
      alert(error.message || "Erro ao executar ação.");
    }
  }

  if (loadingAuth || loadingData) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-white">
        <span className="text-lg font-bold tracking-widest text-emerald-400">CARREGANDO DADOS...</span>
      </div>
    );
  }

  if (!isAdmin) return <AccessDenied />;

  return (
    <div className="funcionarios-page space-y-6 relative">
      <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl">
        <p className="text-xs font-black uppercase tracking-[0.35em] text-amber-300">ARROZ DOS FERREIRAS</p>
        <h1 className="mt-2 text-4xl font-black text-white">Funcionarios</h1>
        <p className="mt-2 text-slate-400">
          Controle completo de funcionarios, login, bloqueio, permissoes, auditoria e exportacoes.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <button onClick={exportCSV} className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 font-black text-slate-950"><Sheet size={18} /> CSV</button>
          <button onClick={exportJSON} className="inline-flex items-center gap-2 rounded-2xl bg-blue-500 px-5 py-3 font-black text-white"><FileJson size={18} /> JSON</button>
          <button onClick={exportPDF} className="inline-flex items-center gap-2 rounded-2xl bg-amber-400 px-5 py-3 font-black text-slate-950"><FileText size={18} /> PDF</button>
        </div>
      </section>

      <FuncionariosDashboard resumo={resumo} />
      <FuncionariosGraficos funcionarios={funcionarios} resumo={resumo} />

      <FuncionarioForm onCreate={(payload) => safeAction(() => criar(payload))} />

      <FuncionariosTable
        funcionarios={funcionarios}
        onView={setView}
        onEdit={setSelectedForEdit}
        onDelete={(id) => safeAction(() => { if (window.confirm("Excluir funcionario?")) excluir(id); })}
        onBlock={(id) => safeAction(() => bloquear(id))}
        onRelease={(id) => safeAction(() => liberar(id))}
        onReset={(id) => safeAction(() => { resetar(id); alert("Senha resetada para 123456."); })}
      />

      {selectedForEdit && (
        <FuncionarioEditModal 
          funcionario={selectedForEdit} 
          onUpdate={(id, payload) => safeAction(async () => {
            await editar(id, payload);
            setSelectedForEdit(null);
          })} 
          onClose={() => setSelectedForEdit(null)} 
        />
      )}

      <FuncionarioModal funcionario={view} onClose={() => setView(null)} />
    </div>
  );
}