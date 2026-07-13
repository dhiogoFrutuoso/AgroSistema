import { useEffect, useState } from "react";
import { Plus, Trash2, Wrench, Edit3, X, Save, Upload, Eye, ReceiptText } from "lucide-react";
import { getMaquinas } from "../services/MaquinasService.js";
import {
  getManutencoes,
  createManutencao,
  updateManutencao,
  deleteManutencao,
  getResumoManutencoes
} from "../services/MaquinasManutencoesService.js";

const inputClass = "w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-emerald-400/60";

export default function MaquinasManutencoes() {
  const [maquinas, setMaquinas] = useState([]);
  const [manutencoes, setManutencoes] = useState([]);
  const [resumo, setResumo] = useState({ total: 0, abertas: 0, concluidas: 0, custoTotal: 0 });
  const [editingItem, setEditingItem] = useState(null); // Estado do Modal de Edição

  const [form, setForm] = useState({
    maquinaId: "",
    tipo: "PREVENTIVA",
    descricao: "",
    oficina: "",
    responsavel: "",
    data: new Date().toISOString().slice(0, 10),
    horimetro: "",
    pecas: "",
    custoPecas: "",
    custoMaoObra: "",
    status: "ABERTA",
    observacoes: "",
    comprovante: ""
  });

  async function carregar() {
    try {
      const listaMaquinas = await getMaquinas();
      setMaquinas(Array.isArray(listaMaquinas) ? listaMaquinas : []);
      setManutencoes(getManutencoes());
      setResumo(getResumoManutencoes());
    } catch (err) {
      console.error("Erro ao carregar manutenções:", err);
      setMaquinas([]);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  function alterar(campo, valor) {
    setForm({ ...form, [campo]: valor });
  }

  function handleFileUpload(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => alterar("comprovante", reader.result);
    reader.readAsDataURL(file);
  }

  function handleEditFileUpload(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setEditingItem(prev => ({ ...prev, comprovante: reader.result }));
    reader.readAsDataURL(file);
  }

  function salvar(e) {
    e.preventDefault();

    if (!form.maquinaId || !form.descricao) {
      alert("Informe a máquina e a descrição.");
      return;
    }

    const maquina = maquinas.find(item => String(item.id || item._id) === String(form.maquinaId));
    const custoTotal = Number(form.custoPecas || 0) + Number(form.custoMaoObra || 0);

    createManutencao({
      ...form,
      maquinaNome: maquina?.nome || "",
      custoTotal
    });

    setForm({
      maquinaId: "",
      tipo: "PREVENTIVA",
      descricao: "",
      oficina: "",
      responsavel: "",
      data: new Date().toISOString().slice(0, 10),
      horimetro: "",
      pecas: "",
      custoPecas: "",
      custoMaoObra: "",
      status: "ABERTA",
      observacoes: "",
      comprovante: ""
    });

    carregar();
  }

  function handleUpdate(e) {
    e.preventDefault();
    const maquina = maquinas.find(item => String(item.id || item._id) === String(editingItem.maquinaId));
    const custoTotal = Number(editingItem.custoPecas || 0) + Number(editingItem.custoMaoObra || 0);

    updateManutencao(editingItem.id, {
      ...editingItem,
      maquinaNome: maquina?.nome || editingItem.maquinaNome,
      custoTotal
    });

    setEditingItem(null);
    carregar();
  }

  function remover(id) {
    if (!window.confirm("Deseja excluir esta manutenção?")) return;
    deleteManutencao(id);
    carregar();
  }

  function viewImage(base64) {
    if (!base64 || base64.length < 50) return;
    const newTab = window.open();
    if (newTab) {
      newTab.document.write(`<iframe src="${base64}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
    } else {
      alert("Permita pop-ups no seu navegador para ver a imagem do comprovante.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-xl">
          <p className="text-sm text-slate-400">Total Manutenções</p>
          <h3 className="mt-2 text-3xl font-black text-white">{resumo.total}</h3>
        </div>

        <div className="rounded-3xl border border-yellow-500/20 bg-yellow-500/10 p-5 shadow-2xl backdrop-blur-xl">
          <p className="text-sm font-bold text-yellow-300">Abertas</p>
          <h3 className="mt-2 text-3xl font-black text-yellow-400">{resumo.abertas}</h3>
        </div>

        <div className="rounded-3xl border border-green-500/20 bg-green-500/10 p-5 shadow-2xl backdrop-blur-xl">
          <p className="text-sm font-bold text-green-300">Concluídas</p>
          <h3 className="mt-2 text-3xl font-black text-green-400">{resumo.concluidas}</h3>
        </div>

        <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-5 shadow-2xl backdrop-blur-xl">
          <p className="text-sm font-bold text-red-300">Custo Total</p>
          <h3 className="mt-2 text-2xl font-black text-red-400">
            R$ {Number(resumo.custoTotal || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </h3>
        </div>
      </div>

      <form onSubmit={salvar} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-2xl bg-yellow-500/20 p-3 text-yellow-400">
            <Wrench size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Nova Manutenção</h2>
            <p className="text-sm text-slate-400">Registre ordens de serviço, custos e anexe a nota/OS.</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Máquina *</span>
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
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Tipo de Manutenção</span>
            <select value={form.tipo} onChange={(e) => alterar("tipo", e.target.value)} className={inputClass}>
              <option value="PREVENTIVA">Preventiva</option>
              <option value="CORRETIVA">Corretiva</option>
              <option value="TROCA_OLEO">Troca de Óleo</option>
              <option value="PNEUS">Pneus / Borracharia</option>
              <option value="FILTROS">Troca de Filtros</option>
            </select>
          </label>

          <label className="space-y-2"><span className="text-xs font-black uppercase tracking-widest text-slate-400">Descrição do Serviço *</span><input required value={form.descricao} onChange={(e) => alterar("descricao", e.target.value)} placeholder="O que foi feito?" className={inputClass} /></label>
          <label className="space-y-2"><span className="text-xs font-black uppercase tracking-widest text-slate-400">Oficina / Fornecedor</span><input value={form.oficina} onChange={(e) => alterar("oficina", e.target.value)} placeholder="Nome da oficina" className={inputClass} /></label>
          <label className="space-y-2"><span className="text-xs font-black uppercase tracking-widest text-slate-400">Responsável</span><input value={form.responsavel} onChange={(e) => alterar("responsavel", e.target.value)} placeholder="Quem autorizou" className={inputClass} /></label>
          <label className="space-y-2"><span className="text-xs font-black uppercase tracking-widest text-slate-400">Data</span><input type="date" value={form.data} onChange={(e) => alterar("data", e.target.value)} className={inputClass} /></label>
          <label className="space-y-2"><span className="text-xs font-black uppercase tracking-widest text-slate-400">Horímetro</span><input type="number" step="0.1" value={form.horimetro} onChange={(e) => alterar("horimetro", e.target.value)} placeholder="KM ou Horas" className={inputClass} /></label>
          <label className="space-y-2"><span className="text-xs font-black uppercase tracking-widest text-slate-400">Peças Utilizadas</span><input value={form.pecas} onChange={(e) => alterar("pecas", e.target.value)} placeholder="Lista de peças" className={inputClass} /></label>
          <label className="space-y-2"><span className="text-xs font-black uppercase tracking-widest text-slate-400">Custo Peças (R$)</span><input type="number" step="0.01" value={form.custoPecas} onChange={(e) => alterar("custoPecas", e.target.value)} placeholder="0.00" className={inputClass} /></label>
          <label className="space-y-2"><span className="text-xs font-black uppercase tracking-widest text-slate-400">Mão de Obra (R$)</span><input type="number" step="0.01" value={form.custoMaoObra} onChange={(e) => alterar("custoMaoObra", e.target.value)} placeholder="0.00" className={inputClass} /></label>

          <label className="space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Status</span>
            <select value={form.status} onChange={(e) => alterar("status", e.target.value)} className={inputClass}>
              <option value="ABERTA">Aberto / Em Andamento</option>
              <option value="CONCLUIDA">Concluído</option>
              <option value="CANCELADA">Cancelado</option>
            </select>
          </label>
        </div>

        <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center">
          <div className="h-16 w-16 overflow-hidden rounded-2xl border border-dashed border-slate-500 bg-slate-900/50 flex items-center justify-center">
            {form.comprovante ? <img src={form.comprovante} alt="Nota" className="h-full w-full object-cover" /> : <Upload size={20} className="text-slate-600" />}
          </div>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-white/10 bg-slate-950 px-5 py-3 font-black text-white hover:bg-slate-900 transition-colors">
            <Upload size={18} /> Anexar Foto da O.S / Recibo
            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e.target.files?.[0])} />
          </label>
          {form.comprovante && <button type="button" onClick={() => alterar("comprovante", "")} className="text-red-400 text-sm font-bold ml-2">Remover Anexo</button>}
        </div>

        <div className="mt-4">
          <label className="space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Observações</span>
            <textarea rows={2} value={form.observacoes} onChange={(e) => alterar("observacoes", e.target.value)} placeholder="Detalhes adicionais..." className={inputClass} />
          </label>
        </div>

        <button type="submit" className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-yellow-500 px-6 py-4 font-black text-slate-950 hover:bg-yellow-400 transition-colors md:w-auto">
          <Plus size={20} /> Registrar Manutenção
        </button>
      </form>

      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl">
        <h2 className="mb-5 text-xl font-black text-white">Histórico de Manutenções</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-widest text-slate-400">
                <th className="pb-4 px-2">Data</th>
                <th className="pb-4 px-2">Máquina</th>
                <th className="pb-4 px-2">Serviço / Tipo</th>
                <th className="pb-4 px-2">Oficina</th>
                <th className="pb-4 px-2 text-center">Status</th>
                <th className="pb-4 px-2 text-right">Custo Total</th>
                <th className="pb-4 px-2 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {manutencoes.map((item) => {
                const dateObj = new Date(item.data || item.criadoEm);
                return (
                  <tr key={item.id} className="hover:bg-white/[0.02] text-slate-200">
                    <td className="py-4 px-2">{dateObj.toLocaleDateString("pt-BR")}</td>
                    <td className="py-4 px-2 font-bold text-white">{item.maquinaNome}</td>
                    <td className="py-4 px-2">
                      <p className="font-bold">{item.descricao}</p>
                      <p className="text-xs text-slate-400">{item.tipo}</p>
                    </td>
                    <td className="py-4 px-2 text-slate-300">{item.oficina || "-"}</td>
                    <td className="py-4 px-2 text-center">
                      <span className={`inline-block rounded-lg px-2 py-1 text-[10px] font-black uppercase tracking-wider ${item.status === 'CONCLUIDA' ? 'bg-emerald-500/20 text-emerald-300' : item.status === 'ABERTA' ? 'bg-amber-500/20 text-amber-300' : 'bg-red-500/20 text-red-300'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-right font-black text-red-400">
                      R$ {Number(item.custoTotal || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-4 px-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {item.comprovante && item.comprovante.length > 50 && (
                          <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); viewImage(item.comprovante); }} title="Ver Comprovante / Recibo" className="rounded-xl bg-blue-500/10 p-2 text-blue-400 hover:bg-blue-500/20 transition-colors">
                            <ReceiptText size={16} />
                          </button>
                        )}
                        <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setEditingItem(item); }} title="Editar Transação" className="rounded-xl bg-amber-500/10 p-2 text-amber-400 hover:bg-amber-500/20 transition-colors">
                          <Edit3 size={16} />
                        </button>
                        <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); remover(item.id); }} title="Excluir Permanentemente" className="rounded-xl bg-red-500/10 p-2 text-red-400 hover:bg-red-500/20 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {manutencoes.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">Nenhuma manutenção registrada.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE EDIÇÃO DE MANUTENÇÃO */}
      {editingItem && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative my-8 w-full max-w-5xl rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-white">Editar Manutenção</h2>
                <p className="text-sm text-slate-400">Altere status, custos e anexos da Ordem de Serviço.</p>
              </div>
              <button type="button" onClick={() => setEditingItem(null)} className="rounded-2xl bg-white/10 p-3 text-white hover:bg-white/20">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Máquina *</span>
                <select required value={editingItem.maquinaId} onChange={(e) => setEditingItem({ ...editingItem, maquinaId: e.target.value })} className={inputClass}>
                  <option value="">Selecione a máquina</option>
                  {Array.isArray(maquinas) && maquinas.map((item) => (
                    <option key={item.id || item._id} value={item.id || item._id}>
                      {item.nome} {item.marca || item.modelo ? `- ${item.marca || ''} ${item.modelo || ''}` : ''} {item.placa ? `(${item.placa})` : item.codigo ? `(${item.codigo})` : ''}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Tipo de Manutenção</span>
                <select value={editingItem.tipo} onChange={(e) => setEditingItem({ ...editingItem, tipo: e.target.value })} className={inputClass}>
                  <option value="PREVENTIVA">Preventiva</option>
                  <option value="CORRETIVA">Corretiva</option>
                  <option value="TROCA_OLEO">Troca de Óleo</option>
                  <option value="PNEUS">Pneus / Borracharia</option>
                  <option value="FILTROS">Troca de Filtros</option>
                </select>
              </label>

              <label className="space-y-2"><span className="text-xs font-black uppercase tracking-widest text-slate-400">Descrição do Serviço *</span><input required value={editingItem.descricao} onChange={(e) => setEditingItem({ ...editingItem, descricao: e.target.value })} className={inputClass} /></label>
              <label className="space-y-2"><span className="text-xs font-black uppercase tracking-widest text-slate-400">Oficina / Fornecedor</span><input value={editingItem.oficina || ""} onChange={(e) => setEditingItem({ ...editingItem, oficina: e.target.value })} className={inputClass} /></label>
              <label className="space-y-2"><span className="text-xs font-black uppercase tracking-widest text-slate-400">Responsável</span><input value={editingItem.responsavel || ""} onChange={(e) => setEditingItem({ ...editingItem, responsavel: e.target.value })} className={inputClass} /></label>
              <label className="space-y-2"><span className="text-xs font-black uppercase tracking-widest text-slate-400">Data</span><input type="date" value={editingItem.data} onChange={(e) => setEditingItem({ ...editingItem, data: e.target.value })} className={inputClass} /></label>
              <label className="space-y-2"><span className="text-xs font-black uppercase tracking-widest text-slate-400">Horímetro</span><input type="number" step="0.1" value={editingItem.horimetro} onChange={(e) => setEditingItem({ ...editingItem, horimetro: e.target.value })} className={inputClass} /></label>
              <label className="space-y-2"><span className="text-xs font-black uppercase tracking-widest text-slate-400">Peças Utilizadas</span><input value={editingItem.pecas || ""} onChange={(e) => setEditingItem({ ...editingItem, pecas: e.target.value })} className={inputClass} /></label>
              <label className="space-y-2"><span className="text-xs font-black uppercase tracking-widest text-slate-400">Custo Peças (R$)</span><input type="number" step="0.01" value={editingItem.custoPecas} onChange={(e) => setEditingItem({ ...editingItem, custoPecas: e.target.value })} className={inputClass} /></label>
              <label className="space-y-2"><span className="text-xs font-black uppercase tracking-widest text-slate-400">Mão de Obra (R$)</span><input type="number" step="0.01" value={editingItem.custoMaoObra} onChange={(e) => setEditingItem({ ...editingItem, custoMaoObra: e.target.value })} className={inputClass} /></label>

              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Status</span>
                <select value={editingItem.status} onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })} className={inputClass}>
                  <option value="ABERTA">Aberto / Em Andamento</option>
                  <option value="CONCLUIDA">Concluído</option>
                  <option value="CANCELADA">Cancelado</option>
                </select>
              </label>

              <div className="col-span-1 md:col-span-2 xl:col-span-4 mt-2">
                 <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    <div className="h-16 w-16 overflow-hidden rounded-2xl border border-dashed border-slate-500 bg-slate-900/50 flex items-center justify-center">
                      {editingItem.comprovante ? <img src={editingItem.comprovante} alt="Nota" className="h-full w-full object-cover" /> : <Upload size={20} className="text-slate-600" />}
                    </div>
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-white/10 bg-slate-950 px-5 py-3 font-black text-white hover:bg-slate-900 transition-colors">
                      <Upload size={18} /> Atualizar Foto / Recibo
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleEditFileUpload(e.target.files?.[0])} />
                    </label>
                    {editingItem.comprovante && <button type="button" onClick={() => setEditingItem(prev => ({ ...prev, comprovante: "" }))} className="text-red-400 text-sm font-bold ml-2">Remover Anexo</button>}
                  </div>
              </div>

              <label className="space-y-2 col-span-1 md:col-span-2 xl:col-span-4 mt-2">
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Observações</span>
                <textarea rows={2} value={editingItem.observacoes || ""} onChange={(e) => setEditingItem({ ...editingItem, observacoes: e.target.value })} className={inputClass} />
              </label>

              <button type="submit" className="col-span-1 md:col-span-2 xl:col-span-4 mt-4 flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-6 py-4 font-black text-slate-950 hover:bg-emerald-400 transition-colors">
                <Save size={20} /> Salvar Correção
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}