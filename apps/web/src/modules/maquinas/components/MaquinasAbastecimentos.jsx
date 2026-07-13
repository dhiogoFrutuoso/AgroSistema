import { useEffect, useState } from "react";
import { Fuel, Plus, Trash2 } from "lucide-react";
import { getMaquinas } from "../services/MaquinasService.js";
import {
  getAbastecimentos,
  createAbastecimento,
  deleteAbastecimento,
  getResumoAbastecimentos
} from "../services/MaquinasAbastecimentosService.js";

const inputClass = "w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-emerald-400/60";

export default function MaquinasAbastecimentos() {
  const [maquinas, setMaquinas] = useState([]);
  const [abastecimentos, setAbastecimentos] = useState([]);
  const [resumo, setResumo] = useState({ total: 0, litros: 0, custoTotal: 0, mediaLitro: 0 });

  const [form, setForm] = useState({
    maquinaId: "",
    data: new Date().toISOString().slice(0, 10),
    combustivel: "Diesel",
    litros: "",
    valorLitro: "",
    posto: "",
    responsavel: "",
    horimetro: "",
    observacoes: ""
  });

  async function carregar() {
    try {
      const listaMaquinas = await getMaquinas();
      setMaquinas(Array.isArray(listaMaquinas) ? listaMaquinas : []);
      setAbastecimentos(getAbastecimentos());
      setResumo(getResumoAbastecimentos());
    } catch (err) {
      console.error("Erro ao carregar abastecimentos:", err);
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

    if (!form.maquinaId || !form.litros) {
      alert("Informe a máquina e os litros abastecidos.");
      return;
    }

    const maquina = maquinas.find((item) => String(item.id || item._id) === String(form.maquinaId));
    const valorTotal = Number(form.litros || 0) * Number(form.valorLitro || 0);

    createAbastecimento({
      ...form,
      maquinaNome: maquina?.nome || "",
      valorTotal
    });

    setForm({
      maquinaId: "",
      data: new Date().toISOString().slice(0, 10),
      combustivel: "Diesel",
      litros: "",
      valorLitro: "",
      posto: "",
      responsavel: "",
      horimetro: "",
      observacoes: ""
    });

    carregar();
  }

  function remover(id) {
    if (!window.confirm("Deseja excluir este abastecimento?")) return;
    deleteAbastecimento(id);
    carregar();
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-xl">
          <p className="text-sm text-slate-400">Total de Registros</p>
          <h3 className="mt-2 text-3xl font-black text-white">{resumo.total}</h3>
        </div>

        <div className="rounded-3xl border border-blue-500/20 bg-blue-500/10 p-5 shadow-2xl backdrop-blur-xl">
          <p className="text-sm font-bold text-blue-300">Volume Total</p>
          <h3 className="mt-2 text-3xl font-black text-blue-400">
            {Number(resumo.litros || 0).toLocaleString("pt-BR")} L
          </h3>
        </div>

        <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-5 shadow-2xl backdrop-blur-xl">
          <p className="text-sm font-bold text-red-300">Custo Total</p>
          <h3 className="mt-2 text-2xl font-black text-red-400">
            R$ {Number(resumo.custoTotal || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </h3>
        </div>

        <div className="rounded-3xl border border-yellow-500/20 bg-yellow-500/10 p-5 shadow-2xl backdrop-blur-xl">
          <p className="text-sm font-bold text-yellow-300">Média por Litro</p>
          <h3 className="mt-2 text-2xl font-black text-yellow-400">
            R$ {Number(resumo.mediaLitro || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </h3>
        </div>
      </div>

      <form onSubmit={salvar} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-2xl bg-blue-500/20 p-3 text-blue-400">
            <Fuel size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Novo Abastecimento</h2>
            <p className="text-sm text-slate-400">Controle de combustível, litros, posto e custos diretos.</p>
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

          <label className="space-y-2"><span className="text-xs font-black uppercase tracking-widest text-slate-400">Data</span><input type="date" required value={form.data} onChange={(e) => alterar("data", e.target.value)} className={inputClass} /></label>
          <label className="space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Combustível</span>
            <select value={form.combustivel} onChange={(e) => alterar("combustivel", e.target.value)} className={inputClass}>
              <option value="Diesel">Diesel</option>
              <option value="Gasolina">Gasolina</option>
              <option value="Etanol">Etanol</option>
              <option value="Arla 32">Arla 32</option>
            </select>
          </label>
          
          <label className="space-y-2"><span className="text-xs font-black uppercase tracking-widest text-slate-400">Litros Abastecidos</span><input required type="number" step="0.1" value={form.litros} onChange={(e) => alterar("litros", e.target.value)} placeholder="0.0" className={inputClass} /></label>
          <label className="space-y-2"><span className="text-xs font-black uppercase tracking-widest text-slate-400">Valor por Litro (R$)</span><input required type="number" step="0.01" value={form.valorLitro} onChange={(e) => alterar("valorLitro", e.target.value)} placeholder="0.00" className={inputClass} /></label>
          <label className="space-y-2"><span className="text-xs font-black uppercase tracking-widest text-slate-400">Posto / Fornecedor</span><input value={form.posto} onChange={(e) => alterar("posto", e.target.value)} placeholder="Nome do posto" className={inputClass} /></label>
          <label className="space-y-2"><span className="text-xs font-black uppercase tracking-widest text-slate-400">Responsável / Motorista</span><input value={form.responsavel} onChange={(e) => alterar("responsavel", e.target.value)} placeholder="Quem abasteceu" className={inputClass} /></label>
          <label className="space-y-2"><span className="text-xs font-black uppercase tracking-widest text-slate-400">Horímetro / KM Atual</span><input type="number" step="0.1" value={form.horimetro} onChange={(e) => alterar("horimetro", e.target.value)} placeholder="Marcação do painel" className={inputClass} /></label>
        </div>

        <div className="mt-4">
          <label className="space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Observações</span>
            <textarea rows={2} value={form.observacoes} onChange={(e) => alterar("observacoes", e.target.value)} placeholder="Detalhes da viagem ou serviço..." className={inputClass} />
          </label>
        </div>

        <button type="submit" className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-4 font-black text-white hover:bg-blue-500 transition-colors md:w-auto">
          <Plus size={20} /> Registrar Abastecimento
        </button>
      </form>

      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl">
        <h2 className="mb-5 text-xl font-black text-white">Histórico de Abastecimentos</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-widest text-slate-400">
                <th className="pb-4 px-2">Data</th>
                <th className="pb-4 px-2">Máquina</th>
                <th className="pb-4 px-2">Combustível</th>
                <th className="pb-4 px-2 text-center">Litros</th>
                <th className="pb-4 px-2 text-right">Valor/L</th>
                <th className="pb-4 px-2 text-right">Total</th>
                <th className="pb-4 px-2">Posto / Responsável</th>
                <th className="pb-4 px-2 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {abastecimentos.map((item) => {
                const dateObj = new Date(item.data || item.criadoEm);
                return (
                  <tr key={item.id} className="hover:bg-white/[0.02] text-slate-200">
                    <td className="py-4 px-2">{dateObj.toLocaleDateString("pt-BR")}</td>
                    <td className="py-4 px-2 font-bold text-white">{item.maquinaNome}</td>
                    <td className="py-4 px-2 text-blue-300 font-bold">{item.combustivel}</td>
                    <td className="py-4 px-2 text-center font-mono">{item.litros} L</td>
                    <td className="py-4 px-2 text-right text-slate-300">R$ {Number(item.valorLitro || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                    <td className="py-4 px-2 text-right font-black text-red-400">R$ {Number(item.valorTotal || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                    <td className="py-4 px-2">
                      <p className="text-sm">{item.posto || "-"}</p>
                      <p className="text-xs text-slate-400">{item.responsavel}</p>
                    </td>
                    <td className="py-4 px-2 text-right">
                      <button onClick={() => remover(item.id)} className="rounded-xl bg-red-500/10 p-2 text-red-400 hover:bg-red-500/20 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {abastecimentos.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400">Nenhum abastecimento registrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}