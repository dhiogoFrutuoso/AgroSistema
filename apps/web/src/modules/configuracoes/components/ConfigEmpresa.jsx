const inputClass = "w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-indigo-400/60";

function Field({ label, children }) {
  return (
    <label className="space-y-2">
      <span className="text-xs font-black uppercase tracking-widest text-slate-400">{label}</span>
      {children}
    </label>
  );
}

export default function ConfigEmpresa({ config, updateGrupo }) {
  const e = config.empresa;

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-xl">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-white">Dados da Empresa</h2>
        <p className="text-sm text-slate-400">Informações principais que aparecerão nos relatórios e PDFs.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Field label="Nome Fantasia"><input className={inputClass} value={e.nome} onChange={(ev) => updateGrupo("empresa", "nome", ev.target.value)} /></Field>
        <Field label="Razão Social"><input className={inputClass} value={e.razaoSocial} onChange={(ev) => updateGrupo("empresa", "razaoSocial", ev.target.value)} /></Field>
        <Field label="CNPJ"><input className={inputClass} value={e.cnpj} onChange={(ev) => updateGrupo("empresa", "cnpj", ev.target.value)} /></Field>
        <Field label="Telefone"><input className={inputClass} value={e.telefone} onChange={(ev) => updateGrupo("empresa", "telefone", ev.target.value)} /></Field>
        <Field label="E-mail"><input className={inputClass} value={e.email} onChange={(ev) => updateGrupo("empresa", "email", ev.target.value)} /></Field>
        <Field label="Gestor Responsável"><input className={inputClass} value={e.responsavel} onChange={(ev) => updateGrupo("empresa", "responsavel", ev.target.value)} /></Field>
        <Field label="Cidade"><input className={inputClass} value={e.cidade} onChange={(ev) => updateGrupo("empresa", "cidade", ev.target.value)} /></Field>
        <Field label="Estado"><input className={inputClass} value={e.estado} onChange={(ev) => updateGrupo("empresa", "estado", ev.target.value)} /></Field>
        <div className="md:col-span-2 lg:col-span-1"><Field label="Endereço Completo"><input className={inputClass} value={e.endereco} onChange={(ev) => updateGrupo("empresa", "endereco", ev.target.value)} /></Field></div>
      </div>
    </div>
  );
}