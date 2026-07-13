export default function GpsActions() {
  return (
    <div className="mt-5 grid gap-3 md:grid-cols-3">

      <button className="premium-green-button py-4">
        Centralizar Talhão
      </button>

      <button className="premium-3d-button py-4">
        Recalcular Área
      </button>

      <button className="rounded-2xl bg-red-500/10 py-4 font-black text-red-300">
        Limpar Marcação
      </button>

    </div>
  );
}
