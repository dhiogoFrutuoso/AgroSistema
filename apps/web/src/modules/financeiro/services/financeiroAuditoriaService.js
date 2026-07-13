const STORAGE_KEY = "@arroz:auditoria";

function getAuditoria() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function registrarFinanceiro({
  usuario = "Sistema",
  acao = "",
  descricao = "",
  nivel = "INFO"
}) {
  const auditoria = getAuditoria();

  const registro = {
    id: crypto.randomUUID?.() || String(Date.now()),
    usuario,
    modulo: "Financeiro",
    acao,
    descricao,
    nivel,
    dataHora: new Date().toISOString()
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify([registro, ...auditoria]));

  return registro;
}