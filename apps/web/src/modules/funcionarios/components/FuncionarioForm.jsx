import { Save, Upload, Shield } from "lucide-react";
import { useState } from "react";
import { DEFAULT_PERMISSOES, FULL_PERMISSOES } from "../services/funcionariosService.js";
import PermissoesPanel from "./PermissoesPanel.jsx";

const initial = {
  nome: "",
  cpf: "",
  rg: "",
  dataNascimento: "",
  telefone: "",
  email: "",
  endereco: "",
  cidade: "",
  estado: "CE",
  cargo: "",
  salario: "",
  dataAdmissao: new Date().toISOString().slice(0, 10),
  usuario: "",
  senha: "",
  foto: "",
  perfil: "OPERADOR",
  status: "ATIVO",
  permissoes: DEFAULT_PERMISSOES
};

const input = "w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-emerald-400/60";

function Field({ label, required, children }) {
  return (
    <label className="space-y-2">
      <span className="text-xs font-black uppercase tracking-widest text-slate-400">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      {children}
    </label>
  );
}

export default function FuncionarioForm({ onCreate }) {
  const [form, setForm] = useState(initial);

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleAdmin(isAdmin) {
    if (isAdmin) {
      setForm((prev) => ({ ...prev, perfil: "ADMIN", permissoes: { ...FULL_PERMISSOES } }));
    } else {
      setForm((prev) => ({ ...prev, perfil: "OPERADOR", permissoes: { ...DEFAULT_PERMISSOES } }));
    }
  }

  function uploadFoto(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update("foto", reader.result);
    reader.readAsDataURL(file);
  }

  function submit(e) {
    e.preventDefault();
    onCreate(form);
    setForm(initial);
  }

  const isAdmin = form.perfil === "ADMIN";

  return (
    <form onSubmit={submit} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl">
      <div className="mb-5">
        <h2 className="text-2xl font-black text-white">Cadastrar funcionário</h2>
        <p className="text-sm text-slate-400">Cadastro, acesso ao login principal e permissões.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Field label="Nome Completo" required><input required className={input} value={form.nome} onChange={(e) => update("nome", e.target.value)} /></Field>
        <Field label="CPF" required><input required className={input} value={form.cpf} onChange={(e) => update("cpf", e.target.value)} /></Field>
        <Field label="Usuário" required><input required className={input} value={form.usuario} onChange={(e) => update("usuario", e.target.value)} /></Field>
        <Field label="Senha" required><input required className={input} value={form.senha} onChange={(e) => update("senha", e.target.value)} /></Field>
        <Field label="Status" required>
          <select className={input} value={form.status} onChange={(e) => update("status", e.target.value)}>
            <option value="ATIVO">ATIVO</option>
            <option value="BLOQUEADO">BLOQUEADO</option>
          </select>
        </Field>
        <Field label="Cargo"><input className={input} value={form.cargo} onChange={(e) => update("cargo", e.target.value)} /></Field>
        <Field label="Salário"><input className={input} type="number" step="0.01" value={form.salario} onChange={(e) => update("salario", e.target.value)} /></Field>
        <Field label="RG"><input className={input} value={form.rg} onChange={(e) => update("rg", e.target.value)} /></Field>
        <Field label="Data Nascimento"><input className={input} type="date" value={form.dataNascimento} onChange={(e) => update("dataNascimento", e.target.value)} /></Field>
        <Field label="Telefone"><input className={input} value={form.telefone} onChange={(e) => update("telefone", e.target.value)} /></Field>
        <Field label="Email"><input className={input} value={form.email} onChange={(e) => update("email", e.target.value)} /></Field>
        <Field label="Endereço"><input className={input} value={form.endereco} onChange={(e) => update("endereco", e.target.value)} /></Field>
        <Field label="Cidade"><input className={input} value={form.cidade} onChange={(e) => update("cidade", e.target.value)} /></Field>
        <Field label="Estado"><input className={input} value={form.estado} onChange={(e) => update("estado", e.target.value)} /></Field>
        <Field label="Data Admissão"><input className={input} type="date" value={form.dataAdmissao} onChange={(e) => update("dataAdmissao", e.target.value)} /></Field>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="flex cursor-pointer items-center gap-4 rounded-2xl border border-white/10 bg-slate-950/40 p-4 transition-colors hover:border-yellow-500/30">
          <div className="relative flex h-6 w-6 items-center justify-center">
            <input
              type="checkbox"
              checked={isAdmin}
              onChange={(e) => toggleAdmin(e.target.checked)}
              className="peer h-6 w-6 cursor-pointer appearance-none rounded-md border border-slate-600 bg-slate-800 checked:border-yellow-500 checked:bg-yellow-500 focus:outline-none"
            />
            <Shield className="pointer-events-none absolute h-4 w-4 text-black opacity-0 peer-checked:opacity-100" strokeWidth={3} />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Perfil Administrador</p>
            <p className="text-xs text-slate-400">Garante acesso total aos módulos do sistema.</p>
          </div>
        </label>

        <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-950/40 p-4 md:flex-row md:items-center">
          <div className="h-16 w-16 overflow-hidden rounded-2xl border border-white/10 bg-slate-900">
            {form.foto ? <img src={form.foto} alt="foto" className="h-full w-full object-cover" /> : null}
          </div>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-amber-400 px-5 py-3 font-black text-slate-950">
            <Upload size={18} /> Upload de foto
            <input type="file" accept="image/*" className="hidden" onChange={(e) => uploadFoto(e.target.files?.[0])} />
          </label>
        </div>
      </div>

      <div className="mt-5">
        <PermissoesPanel value={form.permissoes} onChange={(permissoes) => update("permissoes", permissoes)} />
      </div>

      <button className="mt-5 inline-flex w-full justify-center items-center gap-2 rounded-2xl bg-emerald-500 px-6 py-4 font-black text-slate-950 hover:bg-emerald-400">
        <Save size={20} /> Criar funcionário
      </button>
    </form>
  );
}