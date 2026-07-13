import { useEffect, useMemo, useState } from "react";
import "./fazendas.css";
import { listarFazendasApiFirst, salvarFazendaApiFirst } from "./services/fazendasService.js";

const STORAGE_KEY = "@arroz:fazendas";
const AUDIT_KEY = "@arroz:auditoria";
const USER_KEY = "@arroz:user";

const emptyForm = {
  id: "",
  nome: "",
  codigo: "",
  proprietario: "",
  gerente: "",
  cidade: "",
  estado: "CE",
  endereco: "",
  areaTotal: "",
  areaProdutiva: "",
  areaReserva: "",
  matricula: "",
  car: "",
  inscricaoEstadual: "",
  atividade: "ARROZ",
  status: "ATIVA",
  solo: "ARGILOSO",
  fonteAgua: "RIO",
  observacao: ""
};

const estados = ["CE", "PI", "MA", "RN", "PB", "PE", "BA", "TO", "GO", "MT", "MS", "PA", "RO", "SP", "MG", "PR", "RS", "SC"];
const statusList = ["ATIVA", "INATIVA", "ARRENDADA", "MANUTENCAO"];
const solos = ["ARGILOSO", "ARENOSO", "SILTOSO", "MISTO", "ORGANICO"];
const fontesAgua = ["RIO", "ACUDE", "POCO", "CANAL", "CHUVA", "IRRIGACAO"];

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event("storage"));
}

function currentUserName() {
  const user = readJson(USER_KEY, {});
  return user.name || user.nome || user.username || "Administrador";
}

function audit(acao, descricao, risco = "BAIXO", antes = null, depois = null) {
  const logs = readJson(AUDIT_KEY, []);
  const item = {
    id: `audit_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    modulo: "Fazendas",
    acao,
    risco,
    status: "OK",
    usuario: currentUserName(),
    descricao,
    antes,
    depois,
    data: new Date().toISOString()
  };
  writeJson(AUDIT_KEY, [item, ...(Array.isArray(logs) ? logs : [])].slice(0, 700));
}

function number(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function formatHa(value) {
  return `${number(value).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ha`;
}

function csvCell(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function downloadFile(name, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

function normalize(item) {
  return {
    ...item,
    id: item.id || `faz_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    codigo: item.codigo || `FAZ-${String(Date.now()).slice(-5)}`,
    areaTotal: number(item.areaTotal),
    areaProdutiva: number(item.areaProdutiva),
    areaReserva: number(item.areaReserva),
    status: String(item.status || "ATIVA").toUpperCase()
  };
}

function seedIfEmpty() {
  const atual = readJson(STORAGE_KEY, null);
  if (Array.isArray(atual) && atual.length > 0) return;

  const inicial = [
    normalize({
      id: "faz_001",
      nome: "Fazenda Principal",
      codigo: "FAZ-001",
      proprietario: "Arroz dos Ferreiras",
      gerente: "Administrador Geral",
      cidade: "Jaguaribe",
      estado: "CE",
      endereco: "Zona rural",
      areaTotal: 120,
      areaProdutiva: 92,
      areaReserva: 18,
      matricula: "MAT-001",
      car: "CAR-001",
      inscricaoEstadual: "",
      atividade: "ARROZ",
      status: "ATIVA",
      solo: "ARGILOSO",
      fonteAgua: "RIO",
      observacao: "Fazenda principal cadastrada automaticamente."
    })
  ];

  writeJson(STORAGE_KEY, inicial);
}

function Card({ label, value, sub, tone }) {
  return (
    <div className={`faz-card ${tone || ""}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{sub}</small>
    </div>
  );
}

function Badge({ value }) {
  return <span className={`faz-badge ${String(value || "").toLowerCase()}`}>{value}</span>;
}

function BarChart({ rows }) {
  const max = Math.max(...rows.map((r) => number(r.value)), 1);

  return (
    <div className="faz-chart">
      {rows.map((row) => {
        const pct = Math.max(4, Math.round((number(row.value) / max) * 100));
        return (
          <div className="faz-chart-row" key={row.label}>
            <div>
              <span>{row.label}</span>
              <strong>{row.display || row.value}</strong>
            </div>
            <div className="faz-chart-track">
              <div style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function FazendasPage() {
  const [fazendas, setFazendas] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("TODOS");
  const [view, setView] = useState("lista");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    seedIfEmpty();
    const list = readJson(STORAGE_KEY, []);
    const normalized = Array.isArray(list) ? list.map(normalize) : [];
    setFazendas(normalized);
    writeJson(STORAGE_KEY, normalized);
  }, []);

  function persist(list, acao, descricao, antes = null, depois = null) {
    const normalized = list.map(normalize);
    setFazendas(normalized);
    writeJson(STORAGE_KEY, normalized);
    audit(acao, descricao, "MEDIO", antes, depois);
  }

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  async function submit(e) {
    e.preventDefault();

    if (!form.nome.trim()) return alert("Informe o nome da fazenda.");
    if (!form.cidade.trim()) return alert("Informe a cidade.");
    if (number(form.areaTotal) <= 0) return alert("Informe a area total.");

    if (editingId) {
      const before = fazendas.find((f) => f.id === editingId);
      const updated = fazendas.map((f) => f.id === editingId ? normalize({ ...form, id: editingId, atualizadoEm: new Date().toISOString() }) : f);
      await persist(updated, "EDITAR_FAZENDA", `Editou fazenda ${form.nome}`, before, { ...form, id: editingId });
      resetForm();
      return;
    }

    const novo = normalize({
      ...form,
      id: `faz_${Date.now()}`,
      codigo: form.codigo || `FAZ-${String(Date.now()).slice(-5)}`,
      criadoEm: new Date().toISOString()
    });

    persist([novo, ...fazendas], "CRIAR_FAZENDA", `Criou fazenda ${novo.nome}`, null, novo);
    resetForm();
  }

  function edit(item) {
    setForm({ ...emptyForm, ...item });
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function remove(item) {
    if (!window.confirm(`Remover a fazenda ${item.nome}?`)) return;
    await persist(fazendas.filter((f) => f.id !== item.id), "REMOVER_FAZENDA", `Removeu fazenda ${item.nome}`, item, null);
  }

  async function duplicate(item) {
    const novo = normalize({
      ...item,
      id: `faz_${Date.now()}`,
      nome: `${item.nome} - copia`,
      codigo: `FAZ-${String(Date.now()).slice(-5)}`,
      criadoEm: new Date().toISOString()
    });
    await persist([novo, ...fazendas], "DUPLICAR_FAZENDA", `Duplicou fazenda ${item.nome}`, null, novo);
  }

  function exportCsv() {
    const header = ["id", "codigo", "nome", "proprietario", "gerente", "cidade", "estado", "areaTotal", "areaProdutiva", "areaReserva", "matricula", "car", "atividade", "status", "solo", "fonteAgua"];
    const rows = fazendas.map((item) => header.map((field) => csvCell(item[field])).join(";"));
    downloadFile(`fazendas-arroz-${Date.now()}.csv`, `${header.join(";")}\n${rows.join("\n")}`, "text/csv;charset=utf-8");
    audit("EXPORTAR_CSV", "Exportou fazendas em CSV", "BAIXO");
  }

  function exportJson() {
    downloadFile(`fazendas-backup-${Date.now()}.json`, JSON.stringify(fazendas, null, 2), "application/json");
    audit("EXPORTAR_JSON", "Exportou backup de fazendas", "BAIXO");
  }

  function importJson(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const parsed = JSON.parse(String(reader.result || "[]"));
        if (!Array.isArray(parsed)) throw new Error("JSON invalido");
        await persist(parsed.map(normalize), "IMPORTAR_JSON", "Importou fazendas por JSON", null, parsed[0] || null);
      } catch {
        alert("Arquivo JSON invalido.");
      }
    };
    reader.readAsText(file);
  }

  const filtered = useMemo(() => {
    return fazendas.filter((item) => {
      const text = `${item.nome} ${item.codigo} ${item.proprietario} ${item.gerente} ${item.cidade} ${item.estado} ${item.status} ${item.atividade} ${item.matricula} ${item.car}`.toLowerCase();
      const okSearch = text.includes(search.toLowerCase());
      const okStatus = filterStatus === "TODOS" || item.status === filterStatus;
      return okSearch && okStatus;
    });
  }, [fazendas, search, filterStatus]);

  const resumo = useMemo(() => {
    const total = fazendas.length;
    const ativas = fazendas.filter((f) => f.status === "ATIVA").length;
    const areaTotal = fazendas.reduce((acc, f) => acc + number(f.areaTotal), 0);
    const areaProdutiva = fazendas.reduce((acc, f) => acc + number(f.areaProdutiva), 0);
    const areaReserva = fazendas.reduce((acc, f) => acc + number(f.areaReserva), 0);
    const produtividade = areaTotal > 0 ? Math.round((areaProdutiva / areaTotal) * 100) : 0;
    return { total, ativas, areaTotal, areaProdutiva, areaReserva, produtividade };
  }, [fazendas]);

  const statusChart = useMemo(() => {
    return statusList.map((status) => ({
      label: status,
      value: fazendas.filter((f) => f.status === status).length,
      display: fazendas.filter((f) => f.status === status).length
    }));
  }, [fazendas]);

  const areaChart = useMemo(() => {
    return [
      { label: "Area total", value: resumo.areaTotal, display: formatHa(resumo.areaTotal) },
      { label: "Produtiva", value: resumo.areaProdutiva, display: formatHa(resumo.areaProdutiva) },
      { label: "Reserva", value: resumo.areaReserva, display: formatHa(resumo.areaReserva) }
    ];
  }, [resumo]);

  return (
    <main className="faz-page">
      <header className="faz-hero">
        <div>
          <span>Cadastro rural empresarial</span>
          <h1>Fazendas</h1>
          <p>Controle completo das propriedades, areas, documentacao, producao, recursos hidricos, solo e status operacional.</p>
        </div>

        <div className="faz-hero-actions">
          <button type="button" onClick={exportCsv}>Exportar CSV</button>
          <button type="button" onClick={exportJson}>Backup JSON</button>
          <label>
            Importar JSON
            <input type="file" accept="application/json" onChange={importJson} hidden />
          </label>
        </div>
      </header>

      <section className="faz-kpis">
        <Card label="Fazendas" value={resumo.total} sub="Total cadastrado" tone="blue" />
        <Card label="Ativas" value={resumo.ativas} sub="Operando" tone="green" />
        <Card label="Area total" value={formatHa(resumo.areaTotal)} sub="Soma das propriedades" tone="yellow" />
        <Card label="Area produtiva" value={formatHa(resumo.areaProdutiva)} sub={`${resumo.produtividade}% da area`} tone="green" />
        <Card label="Reserva" value={formatHa(resumo.areaReserva)} sub="Area protegida" tone="purple" />
      </section>

      <section className="faz-tabs">
        <button type="button" className={view === "lista" ? "active" : ""} onClick={() => setView("lista")}>Lista</button>
        <button type="button" className={view === "graficos" ? "active" : ""} onClick={() => setView("graficos")}>Graficos</button>
        <button type="button" className={view === "analise" ? "active" : ""} onClick={() => setView("analise")}>Analise</button>
      </section>

      <section className="faz-layout">
        <form className="faz-form" onSubmit={submit}>
          <div className="faz-title">
            <div>
              <h2>{editingId ? "Editar fazenda" : "Nova fazenda"}</h2>
              <p>Dados fiscais, produtivos e operacionais.</p>
            </div>
            {editingId && <button type="button" onClick={resetForm}>Cancelar</button>}
          </div>

          <div className="faz-duo">
            <label>Nome da fazenda<input value={form.nome} onChange={(e) => updateField("nome", e.target.value)} /></label>
            <label>Codigo<input value={form.codigo} onChange={(e) => updateField("codigo", e.target.value)} placeholder="Automatico se vazio" /></label>
          </div>

          <div className="faz-duo">
            <label>Proprietario<input value={form.proprietario} onChange={(e) => updateField("proprietario", e.target.value)} /></label>
            <label>Gerente<input value={form.gerente} onChange={(e) => updateField("gerente", e.target.value)} /></label>
          </div>

          <div className="faz-duo">
            <label>Cidade<input value={form.cidade} onChange={(e) => updateField("cidade", e.target.value)} /></label>
            <label>Estado
              <select value={form.estado} onChange={(e) => updateField("estado", e.target.value)}>
                {estados.map((e) => <option key={e}>{e}</option>)}
              </select>
            </label>
          </div>

          <label>Endereco<input value={form.endereco} onChange={(e) => updateField("endereco", e.target.value)} /></label>

          <div className="faz-trio">
            <label>Area total ha<input type="number" step="0.01" value={form.areaTotal} onChange={(e) => updateField("areaTotal", e.target.value)} /></label>
            <label>Area produtiva ha<input type="number" step="0.01" value={form.areaProdutiva} onChange={(e) => updateField("areaProdutiva", e.target.value)} /></label>
            <label>Area reserva ha<input type="number" step="0.01" value={form.areaReserva} onChange={(e) => updateField("areaReserva", e.target.value)} /></label>
          </div>

          <div className="faz-duo">
            <label>Matricula<input value={form.matricula} onChange={(e) => updateField("matricula", e.target.value)} /></label>
            <label>CAR<input value={form.car} onChange={(e) => updateField("car", e.target.value)} /></label>
          </div>

          <div className="faz-duo">
            <label>Inscricao estadual<input value={form.inscricaoEstadual} onChange={(e) => updateField("inscricaoEstadual", e.target.value)} /></label>
            <label>Atividade<input value={form.atividade} onChange={(e) => updateField("atividade", e.target.value)} /></label>
          </div>

          <div className="faz-trio">
            <label>Status
              <select value={form.status} onChange={(e) => updateField("status", e.target.value)}>
                {statusList.map((s) => <option key={s}>{s}</option>)}
              </select>
            </label>
            <label>Solo
              <select value={form.solo} onChange={(e) => updateField("solo", e.target.value)}>
                {solos.map((s) => <option key={s}>{s}</option>)}
              </select>
            </label>
            <label>Fonte de agua
              <select value={form.fonteAgua} onChange={(e) => updateField("fonteAgua", e.target.value)}>
                {fontesAgua.map((f) => <option key={f}>{f}</option>)}
              </select>
            </label>
          </div>

          <label>Observacao<textarea value={form.observacao} onChange={(e) => updateField("observacao", e.target.value)} /></label>

          <button className="faz-primary" type="submit">
            {editingId ? "Salvar alteracoes" : "Cadastrar fazenda"}
          </button>
        </form>

        <section className="faz-panel">
          <div className="faz-toolbar">
            <div>
              <h2>Central de fazendas</h2>
              <p>{filtered.length} registros encontrados</p>
            </div>

            <div className="faz-filters">
              <input placeholder="Buscar fazenda..." value={search} onChange={(e) => setSearch(e.target.value)} />
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="TODOS">Todos status</option>
                {statusList.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {view === "lista" && (
            <div className="faz-list">
              {filtered.map((item) => (
                <article className="faz-item" key={item.id}>
                  <div className="faz-avatar">Ã°Å¸ÂÂ¡</div>

                  <div className="faz-info">
                    <div className="faz-line">
                      <strong>{item.nome}</strong>
                      <Badge value={item.status} />
                      <span className="faz-code">{item.codigo}</span>
                    </div>
                    <p>{item.cidade || "Sem cidade"}-{item.estado} | {item.proprietario || "Sem proprietario"} | {item.atividade}</p>
                    <small>Area total: {formatHa(item.areaTotal)} | Produtiva: {formatHa(item.areaProdutiva)} | CAR: {item.car || "Nao informado"}</small>
                  </div>

                  <div className="faz-actions">
                    <button type="button" onClick={() => setSelected(item)}>Ver</button>
                    <button type="button" onClick={() => edit(item)}>Editar</button>
                    <button type="button" onClick={() => duplicate(item)}>Copiar</button>
                    <button type="button" onClick={() => remove(item)} className="danger">Excluir</button>
                  </div>
                </article>
              ))}

              {filtered.length === 0 && <div className="faz-empty">Nenhuma fazenda encontrada.</div>}
            </div>
          )}

          {view === "graficos" && (
            <div className="faz-graphs">
              <div className="faz-graph">
                <h3>Distribuicao de areas</h3>
                <BarChart rows={areaChart} />
              </div>
              <div className="faz-graph">
                <h3>Status das fazendas</h3>
                <BarChart rows={statusChart} />
              </div>
            </div>
          )}

          {view === "analise" && (
            <div className="faz-analysis">
              <div>
                <strong>Diagnostico territorial</strong>
                <p>{resumo.areaTotal > 0 ? `A operacao possui ${formatHa(resumo.areaTotal)} cadastrados, com ${formatHa(resumo.areaProdutiva)} produtivos.` : "Ainda nao ha area cadastrada."}</p>
              </div>
              <div>
                <strong>Producao</strong>
                <p>{resumo.produtividade >= 70 ? "Boa taxa de area produtiva." : "A area produtiva ainda pode ser ampliada ou melhor classificada."}</p>
              </div>
              <div>
                <strong>Documentacao</strong>
                <p>Preencha matricula, CAR e inscricao estadual para deixar a fazenda pronta para relatorios e auditoria.</p>
              </div>
            </div>
          )}
        </section>
      </section>

      {selected && (
        <div className="faz-modal">
          <div className="faz-modal-card">
            <div className="faz-modal-head">
              <h2>{selected.nome}</h2>
              <button type="button" onClick={() => setSelected(null)}>Fechar</button>
            </div>
            <pre>{JSON.stringify(selected, null, 2)}</pre>
          </div>
        </div>
      )}
    </main>
  );
}
