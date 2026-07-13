import { useEffect, useMemo, useState } from "react";
import jsPDF from "jspdf";
import TalhoesDashboard from "./components/TalhoesDashboard.jsx";
import TalhoesForm from "./components/TalhoesForm.jsx";
import TalhoesRelatorio from "./components/TalhoesRelatorio.jsx";
import TalhoesTable from "./components/TalhoesTable.jsx";
import TalhoesEditModal from "./components/TalhoesEditModal.jsx";
import {
  createRegistro,
  createRelatorio,
  deleteRegistro,
  updateRegistro,
  exportarCSV,
  exportarJSON,
  getDados,
  getRelatorios,
  getResumo,
  sincronizarGpsComTalhoes
} from "./services/talhoesService.js";

function num(v, d = 2) {
  return Number(v || 0).toLocaleString("pt-BR", { maximumFractionDigits: d });
}

export default function TalhoesPage() {
  const [dados, setDados] = useState([]);
  const [relatorios, setRelatorios] = useState([]);
  const [selecionado, setSelecionado] = useState(null);
  const [editingTalhao, setEditingTalhao] = useState(null);

  const resumo = useMemo(() => getResumo(), [dados]);

  async function reload() {
    try {
      const lista = await getDados();
      setDados(lista);
      setRelatorios(getRelatorios());
    } catch (err) {
      console.error("Erro ao carregar talhões", err);
    }
  }

  useEffect(() => {
    reload();
  }, []);

  async function handleCreate(payload) {
    try {
      await createRegistro(payload);
      await reload();
    } catch (err) {
      alert(err.message || "Erro ao criar");
    }
  }

  async function handleUpdate(id, payload) {
    try {
      await updateRegistro(id, payload);
      setEditingTalhao(null);
      await reload();
      
      if (selecionado && (selecionado.id === id || selecionado._id === id)) {
        setSelecionado({ ...selecionado, ...payload });
      }
    } catch (err) {
      alert(err.message || "Erro ao atualizar");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Deseja excluir este talhão?")) return;
    try {
      await deleteRegistro(id);
      if (selecionado && (selecionado.id === id || selecionado._id === id)) {
        setSelecionado(null);
      }
      await reload();
    } catch (err) {
      alert(err.message || "Erro ao excluir");
    }
  }

  function handleRelatorio(id, payload) {
    createRelatorio(id, payload);
    reload();
    alert("Relatório técnico salvo com sucesso!");
  }

  function abrirGps(talhao) {
    if (!talhao) return;
    const id = talhao.gpsAreaId || talhao.id || talhao._id;
    window.location.href = `/mapas-gps?id=${encodeURIComponent(id)}`;
  }

  function gerarPdf(talhao) {
    if (!talhao) {
      alert("Selecione um talhão.");
      return;
    }

    const rel = relatorios.find((r) => r.talhaoId === talhao.id || r.talhaoId === talhao._id || r.talhaoId === talhao.gpsAreaId);

    const doc = new jsPDF("p", "mm", "a4");
    const now = new Date().toLocaleString("pt-BR");

    doc.setFontSize(16);
    doc.text("ARROZ DOS FERREIRAS - RELATÓRIO TÉCNICO DO TALHÃO", 14, 18);

    doc.setFontSize(10);
    doc.text(`Gerado em: ${now}`, 14, 27);
    doc.text(`Talhão: ${talhao.nome || "-"}`, 14, 40);
    doc.text(`Fazenda: ${talhao.fazenda || "-"}`, 14, 48);
    doc.text(`Cultura: ${talhao.cultura || "-"}`, 14, 56);
    doc.text(`Safra: ${talhao.safra || "-"}`, 14, 64);
    doc.text(`Área: ${Number(talhao.areaHa || 0).toFixed(2)} ha`, 14, 72);
    doc.text(`Perímetro: ${Number(talhao.perimetroM || 0).toFixed(2)} m`, 14, 80);
    doc.text(`Origem: ${talhao.origem || "-"}`, 14, 88);

    if (talhao.imagemMapa) {
      try {
        doc.addImage(talhao.imagemMapa, "PNG", 14, 96, 182, 98);
      } catch {
        doc.text("Imagem do mapa não pôde ser inserida no PDF.", 14, 102);
      }
    }

    let y = talhao.imagemMapa ? 205 : 102;

    doc.setFontSize(12);
    doc.text("Relatório técnico", 14, y);
    y += 8;

    doc.setFontSize(9);
    const linhas = [
      ["Responsável", rel?.responsavel],
      ["Solo", rel?.solo],
      ["Topografia", rel?.topografia],
      ["Irrigação", rel?.irrigacao],
      ["Manejo", rel?.manejo],
      ["Riscos", rel?.riscos],
      ["Recomendações", rel?.recomendacoes],
      ["Observações", rel?.observacoes || talhao.observacoes]
    ];

    linhas.forEach(([label, value]) => {
      if (y > 276) {
        doc.addPage();
        y = 18;
      }
      const texto = `${label}: ${value || "-"}`;
      const split = doc.splitTextToSize(texto, 180);
      doc.text(split, 14, y);
      y += split.length * 5 + 2;
    });

    if (talhao.coordenadas?.length) {
      doc.addPage();
      doc.setFontSize(12);
      doc.text("Coordenadas", 14, 18);
      doc.setFontSize(8);
      let cy = 28;

      talhao.coordenadas.forEach((p, i) => {
        if (cy > 282) {
          doc.addPage();
          cy = 18;
        }
        doc.text(`P${i + 1}: ${Number(p.lat).toFixed(8)}, ${Number(p.lng).toFixed(8)}`, 14, cy);
        cy += 5;
      });
    }

    doc.save(`relatorio-talhao-${String(talhao.nome || "talhao").replaceAll(" ", "-").toLowerCase()}.pdf`);
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl">
        <p className="text-xs font-black uppercase tracking-[0.35em] text-emerald-300">Módulo integrado com GPS</p>
        <h1 className="mt-2 text-4xl font-black text-white">Talhões</h1>
        <p className="mt-2 text-slate-400">
          Todo talhão salvo no GPS aparece aqui automaticamente com imagem do terreno demarcado, hectares, perímetro, coordenadas e PDF técnico.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <button onClick={() => { sincronizarGpsComTalhoes(); reload(); }} className="rounded-2xl bg-emerald-500 px-5 py-3 font-black text-slate-950">Sincronizar GPS</button>
          <button onClick={exportarCSV} className="rounded-2xl border border-white/10 bg-slate-950 px-5 py-3 font-black text-white">Exportar CSV</button>
          <button onClick={exportarJSON} className="rounded-2xl border border-white/10 bg-slate-950 px-5 py-3 font-black text-white">Exportar JSON</button>
        </div>
      </section>

      <TalhoesDashboard resumo={resumo} />

      {selecionado && (
        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl">
          <div className="grid gap-5 lg:grid-cols-[340px_1fr]">
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950">
              {selecionado.imagemMapa ? (
                <img src={selecionado.imagemMapa} alt={selecionado.nome} className="h-full min-h-72 w-full object-cover" />
              ) : (
                <div className="flex min-h-72 items-center justify-center text-slate-500">Sem imagem</div>
              )}
            </div>

            <div>
              <p className="text-sm uppercase tracking-widest text-slate-400">Talhão selecionado</p>
              <h2 className="mt-2 text-3xl font-black text-white">{selecionado.nome}</h2>
              <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <Info label="Fazenda" value={selecionado.fazenda || "-"} />
                <Info label="Cultura" value={selecionado.cultura || "-"} />
                <Info label="Área" value={`${num(selecionado.areaHa)} ha`} />
                <Info label="Perímetro" value={`${num(selecionado.perimetroM)} m`} />
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button onClick={() => abrirGps(selecionado)} className="rounded-2xl bg-emerald-500 px-5 py-3 font-black text-slate-950">Ver no GPS</button>
                <button onClick={() => gerarPdf(selecionado)} className="rounded-2xl bg-amber-400 px-5 py-3 font-black text-slate-950">Baixar relatório PDF</button>
              </div>
            </div>
          </div>
        </section>
      )}

      <TalhoesTable
        dados={dados}
        onDelete={handleDelete}
        onEdit={setEditingTalhao}
        onSelect={setSelecionado}
        onPdf={gerarPdf}
        onGps={abrirGps}
      />

      <TalhoesRelatorio
        dados={dados}
        relatorios={relatorios}
        selecionado={selecionado}
        onSelect={setSelecionado}
        onSave={handleRelatorio}
        onPdf={gerarPdf}
      />

      <TalhoesForm onCreate={handleCreate} />

      {editingTalhao && (
        <TalhoesEditModal
          talhao={editingTalhao}
          onUpdate={handleUpdate}
          onClose={() => setEditingTalhao(null)}
        />
      )}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
      <p className="text-xs font-black uppercase tracking-widest text-slate-400">{label}</p>
      <p className="mt-2 text-lg font-black text-white">{value}</p>
    </div>
  );
}