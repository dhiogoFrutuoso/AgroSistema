import { Archive, FileImage, FileSpreadsheet, FileText, FolderCheck, Heart, ShieldCheck } from "lucide-react";
import { formatBytes } from "../utils/documentosUtils.js";

function Card({ label, value, icon: Icon, tone }) {
  return (
    <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-slate-950/50 p-6 shadow-xl">
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-slate-400">{label}</p>
        <p className="mt-2 text-3xl font-black text-white">{value}</p>
      </div>
      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${tone}`}>
        <Icon size={26} />
      </div>
    </div>
  );
}

export default function DashboardDocumentos({ resumo, documentos }) {
  const porCategoria = Object.entries(
    documentos.reduce((acc, doc) => {
      acc[doc.categoria || "Outros"] = (acc[doc.categoria || "Outros"] || 0) + 1;
      return acc;
    }, {})
  ).slice(0, 8);

  const max = Math.max(...porCategoria.map(([, v]) => v), 1);

  return (
    <div className="space-y-6">
      <div className="relative flex flex-col justify-between gap-6 overflow-hidden rounded-3xl border border-white/10 bg-slate-950 p-8 shadow-2xl md:flex-row md:items-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.15),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.1),transparent_40%)]" />
        <div className="relative">
          <p className="text-xs font-black uppercase tracking-widest text-blue-400">Central Documental</p>
          <h1 className="mt-2 text-4xl font-black text-white lg:text-5xl">Documentos</h1>
          <p className="mt-2 max-w-xl text-slate-400">Arquivos, contratos, imagens, PDFs e planilhas de forma segura e organizada.</p>
        </div>
        <div className="relative flex min-w-[200px] flex-col items-center justify-center rounded-3xl border border-white/10 bg-slate-900/80 p-6 text-center shadow-inner">
          <ShieldCheck size={32} className="text-emerald-400 mb-2" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Armazenamento</span>
          <strong className="mt-1 text-2xl font-black text-white">{formatBytes(resumo.tamanhoTotal)}</strong>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Card label="Total Arquivos" value={resumo.total} icon={FolderCheck} tone="bg-blue-500/10 text-blue-400" />
        <Card label="PDFs" value={resumo.pdfs} icon={FileText} tone="bg-red-500/10 text-red-400" />
        <Card label="Imagens" value={resumo.imagens} icon={FileImage} tone="bg-emerald-500/10 text-emerald-400" />
        <Card label="Planilhas" value={resumo.planilhas} icon={FileSpreadsheet} tone="bg-green-500/10 text-green-400" />
        <Card label="Contratos" value={resumo.contratos} icon={ShieldCheck} tone="bg-amber-500/10 text-amber-400" />
        <Card label="Favoritos" value={resumo.favoritos} icon={Heart} tone="bg-rose-500/10 text-rose-400" />
        <Card label="Arquivados" value={resumo.arquivados} icon={Archive} tone="bg-slate-500/10 text-slate-400" />
      </div>

      {porCategoria.length > 0 && (
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl">
          <h2 className="text-xl font-black text-white">Documentos por Categoria</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {porCategoria.map(([cat, value]) => (
              <div key={cat}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-bold text-slate-300">{cat}</span>
                  <strong className="text-white">{value}</strong>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-900">
                  <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" style={{ width: `${(value / max) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}