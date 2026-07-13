import { FileText, Save } from "lucide-react";
import { useEffect, useState } from "react";

const initial = {
  responsavel: "",
  solo: "",
  topografia: "",
  irrigacao: "",
  manejo: "",
  riscos: "",
  recomendacoes: "",
  observacoes: ""
};

const inputClass = "w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-emerald-400/60 disabled:opacity-50 disabled:cursor-not-allowed";

function Field({ label, children }) {
  return (
    <label className="space-y-2 flex flex-col">
      <span className="text-xs font-black uppercase tracking-widest text-slate-400">{label}</span>
      {children}
    </label>
  );
}

export default function TalhoesRelatorio({ dados = [], relatorios = [], selecionado, onSelect, onSave, onPdf }) {
  const [form, setForm] = useState(initial);

  // Se o talhão for selecionado, busca se já existe um relatório salvo para ele e preenche
  useEffect(() => {
    if (selecionado) {
      const idBusca = selecionado.id || selecionado._id || selecionado.gpsAreaId;
      const rel = relatorios.find(r => r.talhaoId === idBusca);
      
      if (rel) {
        setForm(rel);
      } else {
        setForm(initial);
      }
    } else {
      setForm(initial);
    }
  }, [selecionado, relatorios]);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function submit(e) {
    e.preventDefault();
    if (!selecionado) {
      alert("Selecione um talhão primeiro.");
      return;
    }
    onSave(selecionado.id || selecionado._id, form);
  }

  return (
    <form onSubmit={submit} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1">
          <h2 className="text-2xl font-black text-white">Relatório técnico</h2>
          
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
            <span className="text-sm font-bold text-slate-400">Vincular relatório ao talhão:</span>
            <select
              className="w-full max-w-sm rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm font-bold text-white outline-none focus:border-emerald-500"
              value={selecionado?.id || selecionado?._id || ""}
              onChange={(e) => {
                const talhao = dados.find(d => String(d.id || d._id) === String(e.target.value));
                onSelect(talhao || null);
              }}
            >
              <option value="">-- Selecione um talhão na lista --</option>
              {dados.map(d => (
                <option key={d.id || d._id} value={d.id || d._id}>
                  {d.nome} {d.fazenda ? `| ${d.fazenda}` : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button type="button" onClick={() => onPdf(selecionado)} disabled={!selecionado} className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-amber-400 px-5 py-3 font-black text-slate-950 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed">
          <FileText size={18} /> Baixar PDF
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Responsável"><input className={inputClass} value={form.responsavel} onChange={(e) => update("responsavel", e.target.value)} disabled={!selecionado} placeholder={!selecionado ? "Selecione o talhão acima" : ""} /></Field>
        <Field label="Solo"><input className={inputClass} value={form.solo} onChange={(e) => update("solo", e.target.value)} disabled={!selecionado} /></Field>
        <Field label="Topografia"><input className={inputClass} value={form.topografia} onChange={(e) => update("topografia", e.target.value)} disabled={!selecionado} /></Field>
        <Field label="Irrigação"><input className={inputClass} value={form.irrigacao} onChange={(e) => update("irrigacao", e.target.value)} disabled={!selecionado} /></Field>
        <Field label="Manejo"><textarea className={`${inputClass} min-h-24`} value={form.manejo} onChange={(e) => update("manejo", e.target.value)} disabled={!selecionado} /></Field>
        <Field label="Riscos"><textarea className={`${inputClass} min-h-24`} value={form.riscos} onChange={(e) => update("riscos", e.target.value)} disabled={!selecionado} /></Field>
        <Field label="Recomendações"><textarea className={`${inputClass} min-h-24`} value={form.recomendacoes} onChange={(e) => update("recomendacoes", e.target.value)} disabled={!selecionado} /></Field>
        <Field label="Observações"><textarea className={`${inputClass} min-h-24`} value={form.observacoes} onChange={(e) => update("observacoes", e.target.value)} disabled={!selecionado} /></Field>
      </div>

      <button disabled={!selecionado} className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-6 py-4 font-black text-slate-950 transition-opacity hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed">
        <Save size={20} /> Salvar Relatório Técnico
      </button>
    </form>
  );
}