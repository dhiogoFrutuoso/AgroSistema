import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import PageHeader from "../../components/layout/PageHeader.jsx";
import GlassCard from "../../components/cards/GlassCard.jsx";
import PremiumInput from "../../components/forms/PremiumInput.jsx";
import PremiumSelect from "../../components/forms/PremiumSelect.jsx";
import PremiumButton from "../../components/buttons/PremiumButton.jsx";
import { getStorage, setStorage } from "../../services/storageService.js";

const TALHOES_KEY = "@arroz:talhoes";

export default function GastosTalhaoPage() {
  const [talhoes, setTalhoes] = useState([]);
  const [talhaoId, setTalhaoId] = useState("");
  const [form, setForm] = useState({
    descricao: "",
    categoria: "Insumo",
    valor: "",
    data: new Date().toISOString().slice(0, 10)
  });

  useEffect(() => {
    const saved = getStorage(TALHOES_KEY, []);
    setTalhoes(saved);
    setTalhaoId(saved[0]?.id ? String(saved[0].id) : "");
  }, []);

  const talhaoSelecionado = useMemo(() => {
    return talhoes.find((talhao) => String(talhao.id) === String(talhaoId));
  }, [talhoes, talhaoId]);

  const gastos = talhaoSelecionado?.gastos || [];

  const total = gastos.reduce((sum, gasto) => {
    return sum + Number(String(gasto.valor).replace(",", ".") || 0);
  }, 0);

  const areaHa = Number(String(talhaoSelecionado?.area || "0").replace("ha", "").replace(",", "."));
  const custoPorHa = areaHa > 0 ? total / areaHa : 0;

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function salvarGasto(event) {
    event.preventDefault();

    if (!talhaoSelecionado || !form.descricao.trim()) return;

    const novoGasto = {
      id: Date.now(),
      descricao: form.descricao,
      categoria: form.categoria,
      valor: Number(String(form.valor).replace(",", ".") || 0),
      data: form.data
    };

    const listaAtualizada = talhoes.map((talhao) => {
      if (String(talhao.id) !== String(talhaoId)) return talhao;

      return {
        ...talhao,
        gastos: [novoGasto, ...(talhao.gastos || [])]
      };
    });

    setTalhoes(listaAtualizada);
    setStorage(TALHOES_KEY, listaAtualizada);

    setForm({
      descricao: "",
      categoria: "Insumo",
      valor: "",
      data: new Date().toISOString().slice(0, 10)
    });
  }

  function excluirGasto(gastoId) {
    const listaAtualizada = talhoes.map((talhao) => {
      if (String(talhao.id) !== String(talhaoId)) return talhao;

      return {
        ...talhao,
        gastos: (talhao.gastos || []).filter((gasto) => gasto.id !== gastoId)
      };
    });

    setTalhoes(listaAtualizada);
    setStorage(TALHOES_KEY, listaAtualizada);
  }

  return (
    <>
      <PageHeader
        title="Gastos por Talhão"
        description="Lance custos de insumos, diesel, mão de obra e manutenção vinculados diretamente ao talhão."
      />

      <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
        <GlassCard className="p-6">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-yellow-500">
            Lançamento
          </p>

          <h2 className="mt-2 text-2xl font-black">Novo Gasto</h2>

          <form onSubmit={salvarGasto} className="mt-6 space-y-4">
            <PremiumSelect
              label="Talhão"
              name="talhaoId"
              value={talhaoId}
              onChange={(event) => setTalhaoId(event.target.value)}
              options={[
                { value: "", label: "Selecione um talhão" },
                ...talhoes.map((talhao) => ({
                  value: String(talhao.id),
                  label: `${talhao.nome} - ${talhao.area || "sem área"}`
                }))
              ]}
            />

            <PremiumInput
              label="Descrição"
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              placeholder="Ex: Compra de adubo"
            />

            <PremiumSelect
              label="Categoria"
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
              options={[
                { value: "Insumo", label: "Insumo" },
                { value: "Diesel", label: "Diesel" },
                { value: "Mão de obra", label: "Mão de obra" },
                { value: "Máquinas", label: "Máquinas" },
                { value: "Irrigação", label: "Irrigação" },
                { value: "Outro", label: "Outro" }
              ]}
            />

            <PremiumInput
              label="Valor"
              name="valor"
              value={form.valor}
              onChange={handleChange}
              placeholder="Ex: 8500"
            />

            <PremiumInput
              label="Data"
              name="data"
              type="date"
              value={form.data}
              onChange={handleChange}
            />

            <PremiumButton type="submit">
              <span className="inline-flex items-center justify-center gap-2">
                <Plus size={18} />
                SALVAR GASTO
              </span>
            </PremiumButton>
          </form>
        </GlassCard>

        <div className="space-y-5">
          <div className="grid gap-5 md:grid-cols-3">
            <GlassCard className="p-5">
              <p className="text-sm text-slate-400">Talhão</p>
              <h3 className="mt-2 text-2xl font-black">
                {talhaoSelecionado?.nome || "-"}
              </h3>
            </GlassCard>

            <GlassCard className="p-5">
              <p className="text-sm text-slate-400">Total gasto</p>
              <h3 className="mt-2 text-2xl font-black text-yellow-400">
                R$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </h3>
            </GlassCard>

            <GlassCard className="p-5">
              <p className="text-sm text-slate-400">Custo por hectare</p>
              <h3 className="mt-2 text-2xl font-black text-emerald-400">
                R$ {custoPorHa.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </h3>
            </GlassCard>
          </div>

          <GlassCard className="p-6">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-yellow-500">
              Histórico
            </p>

            <div className="mt-5 space-y-3">
              {gastos.map((gasto) => (
                <div
                  key={gasto.id}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                >
                  <div>
                    <h3 className="font-black">{gasto.descricao}</h3>
                    <p className="text-sm text-slate-400">
                      {gasto.categoria} • {gasto.data}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <strong className="text-yellow-400">
                      R$ {Number(gasto.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </strong>

                    <button
                      onClick={() => excluirGasto(gasto.id)}
                      className="rounded-xl bg-red-500/10 p-2 text-red-300 hover:bg-red-500/20"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}

              {gastos.length === 0 && (
                <p className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-slate-400">
                  Nenhum gasto lançado para este talhão.
                </p>
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </>
  );
}
