import { useEffect, useState } from "react";
import { FileText, Plus, Trash2 } from "lucide-react";
import { getMaquinas } from "../services/MaquinasService.js";

const STORAGE_KEY = "@arroz:maquinas:documentos";
const inputClass = "w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-emerald-400/60";

function read() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function write(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export default function MaquinasDocumentos() {
  const [maquinas, setMaquinas] = useState([]);
  const [documentos, setDocumentos] = useState([]);
  const [form, setForm] = useState({
    maquinaId: "",
    tipo: "CRLV",
    descricao: "",
    validade: "",
    responsavel: "",
    observacoes: ""
  });

  async function carregar() {
    try {
      const listaMaquinas = await getMaquinas();
      setMaquinas(Array.isArray(listaMaquinas) ? listaMaquinas : []);
      setDocumentos(read());
    } catch (err) {
      console.error("Erro ao carregar documentos:", err);
      setMaquinas([]);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  function alterar(campo, valor) {
    setForm({ ...form, [campo]: valor });
  }

  function salvar(e) {
    e.preventDefault();

    if (!form.maquinaId || !form.descricao) {
      alert("Informe a máquina e a descrição do documento.");
      return;
    }

    const maquina = maquinas.find((item) => String(item.id || item._id) === String(form.maquinaId));

    const novo = {
      id: crypto.randomUUID?.() || String(Date.now()),
      ...form,
      maquinaNome: maquina?.nome || "",
      criadoEm: new Date().toISOString()
    };

    write([novo, ...documentos]);

    setForm({
      maquinaId: "",
      tipo: "CRLV",
      descricao: "",
      validade: "",
      responsavel: "",
      observacoes: ""
    });

    carregar();
  }

  function remover(id) {
    if (!window.confirm("Deseja excluir este documento?")) return;
    const atualizado = documentos.filter((item) => item.id !== id);
    write(atualizado);
    carregar();
  }

  return (
    <div className="space-y-6">
      <form onSubmit={salvar} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-2xl bg-indigo-500/20 p-3 text-indigo-400">
            <FileText size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Documentos das Máquinas</h2>
            <p className="text-sm text-slate-400">Registre CRLV, seguros, licenciamentos, notas e contratos.</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Máquina</span>
            <select required value={form.maquinaId} onChange={(e) => alterar("maquinaId", e.target.value)} className={inputClass}>
              <option value="">Selecione a máquina</option>
              {Array.isArray(maquinas) && maquinas.map((item) => (
                <option key={item.id || item._id} value={item.id || item._id}>
                  {item.nome} {item.marca || item.modelo ? `- ${item.marca || ''} ${item.modelo || ''}` : ''} {item.placa ? `(${item.placa})` : item.codigo ? `(${item.codigo})` : ''}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Tipo Documento</span>
            <select value={form.tipo} onChange={(e) => alterar("tipo", e.target.value)} className={inputClass}>
              <option value="CRLV">CRLV (Documento Veículo)</option>
              <option value="SEGURO">Apólice de Seguro</option>
              <option value="LICENCIAMENTO">Taxa de Licenciamento</option>
              <option value="NOTA_FISCAL">Nota Fiscal de Compra</option>
              <option value="CONTRATO">Contrato de Arrendamento/Locação</option>
              <option value="OUTRO">Outros</option>
            </select>
          </label>

          <label className="space-y-2"><span className="text-xs font-black uppercase tracking-widest text-slate-400">Descrição / Nº Doc</span><input required value={form.descricao} onChange={(e) => alterar("descricao", e.target.value)} placeholder="Identificador do doc" className={inputClass} /></label>
          <label className="space-y-2"><span className="text-xs font-black uppercase tracking-widest text-slate-400">Data Validade</span><input type="date" value={form.validade} onChange={(e) => alterar("validade", e.target.value)} className={inputClass} /></label>
          <label className="space-y-2"><span className="text-xs font-black uppercase tracking-widest text-slate-400">Responsável Guarda</span><input value={form.responsavel} onChange={(e) => alterar("responsavel", e.target.value)} placeholder="Com quem está o documento" className={inputClass} /></label>
          <label className="space-y-2 md:col-span-3"><span className="text-xs font-black uppercase tracking-widest text-slate-400">Observações</span><input value={form.observacoes} onChange={(e) => alterar("observacoes", e.target.value)} placeholder="Detalhes extras..." className={inputClass} /></label>
        </div>

        <button type="submit" className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-4 font-black text-white hover:bg-indigo-500 transition-colors md:w-auto">
          <Plus size={20} /> Salvar Documento
        </button>
      </form>

      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl">
        <h2 className="mb-5 text-xl font-black text-white">Documentos Registrados</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-widest text-slate-400">
                <th className="pb-4 px-2">Máquina</th>
                <th className="pb-4 px-2">Tipo / Categoria</th>
                <th className="pb-4 px-2">Descrição</th>
                <th className="pb-4 px-2 text-center">Vencimento</th>
                <th className="pb-4 px-2">Responsável</th>
                <th className="pb-4 px-2 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {documentos.map((item) => {
                const isVencido = item.validade && new Date(item.validade) < new Date();
                return (
                  <tr key={item.id} className="hover:bg-white/[0.02] text-slate-200">
                    <td className="py-4 px-2 font-bold text-white">{item.maquinaNome}</td>
                    <td className="py-4 px-2">
                      <span className="inline-block rounded-lg bg-indigo-500/10 px-2 py-1 text-[10px] font-black uppercase text-indigo-400">
                        {item.tipo}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-slate-300">{item.descricao}</td>
                    <td className="py-4 px-2 text-center">
                      <span className={`font-bold ${isVencido ? 'text-red-400' : 'text-emerald-400'}`}>
                        {item.validade ? new Date(item.validade).toLocaleDateString("pt-BR") : "Sem validade"}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-slate-400">{item.responsavel || "-"}</td>
                    <td className="py-4 px-2 text-right">
                      <button onClick={() => remover(item.id)} className="rounded-xl bg-red-500/10 p-2 text-red-400 hover:bg-red-500/20 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {documentos.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400">Nenhum documento registrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}