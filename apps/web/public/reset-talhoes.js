localStorage.setItem("@arroz:talhoes", JSON.stringify([
  {
    id: 1,
    nome: "Talhão Alfa 01",
    fazenda: "Fazenda Alfa",
    cultura: "Arroz",
    area: "48.32 ha",
    perimetro: "2840 m",
    status: "Mapeado",
    coordenadas: [],
    gastos: [
      {
        id: 101,
        descricao: "Adubo inicial",
        categoria: "Insumo",
        valor: 8500,
        data: "2026-06-08"
      }
    ]
  },
  {
    id: 2,
    nome: "Talhão Alfa 02",
    fazenda: "Fazenda Alfa",
    cultura: "Arroz",
    area: "62.10 ha",
    perimetro: "3180 m",
    status: "Plantado",
    coordenadas: [],
    gastos: []
  }
]));

location.reload();
