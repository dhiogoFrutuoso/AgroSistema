import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import {
  CircleMarker,
  MapContainer,
  Marker,
  Polygon,
  Polyline,
  Popup,
  TileLayer,
  Tooltip,
  useMap,
  useMapEvents
} from "react-leaflet";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "leaflet/dist/leaflet.css";
import "./MapasGpsPage.css";
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  ClipboardList,
  CloudSun,
  Crosshair,
  Download,
  Edit3,
  Eye,
  FileText,
  Home,
  Layers,
  LocateFixed,
  MapPinned,
  MoreHorizontal,
  Navigation,
  RotateCcw,
  Ruler,
  Save,
  Search,
  ShieldCheck,
  Trash2,
  X
} from "lucide-react";
import {
  audit,
  areaHa,
  centerPoint,
  CONJUNTO_ALFA,
  createTechnicalImage,
  exportBackup,
  getAreas,
  perimeterM,
  saveTalhaoFromGps,
  updateTalhaoFromGps,
  deleteArea,
  segmentDistances
} from "./services/gpsService.js";

function formatNumber(value, digits = 2) {
  return Number(value || 0).toLocaleString("pt-BR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  });
}

function formatDate(value) {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleString("pt-BR");
  } catch {
    return "-";
  }
}

const createPointIcon = (index) => L.divIcon({
  className: 'custom-gps-marker',
  html: `<div style="background-color: #111827; border: 3px solid #ffffff; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; color: #fff; box-shadow: 0 4px 6px rgba(0,0,0,0.3); cursor: grab;">${index + 1}</div>`,
  iconSize: [26, 26],
  iconAnchor: [13, 13]
});

function MapClickHandler({ drawEnabled, onAddPoint }) {
  useMapEvents({
    click(event) {
      if (!drawEnabled) return;
      onAddPoint({
        lat: event.latlng.lat,
        lng: event.latlng.lng
      });
    }
  });

  return null;
}

function MapTools({ focus, points }) {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 350);
  }, [map]);

  useEffect(() => {
    if (focus?.lat && focus?.lng) {
      map.setView([focus.lat, focus.lng], focus.zoom || 16);
      setTimeout(() => map.invalidateSize(), 250);
    }
  }, [focus, map]);

  useEffect(() => {
    if (points.length >= 2) {
      map.fitBounds(points.map((p) => [p.lat, p.lng]), {
        padding: [35, 35],
        maxZoom: 17
      });
    }
  }, [points, map]);

  return null;
}

function KpiCard({ icon: Icon, title, value, subtitle, tone }) {
  return (
    <div className="gps-kpi-card">
      <div className={`gps-kpi-icon ${tone}`}>
        <Icon size={24} />
      </div>
      <div>
        <span>{title}</span>
        <strong>{value}</strong>
        {subtitle && <small>{subtitle}</small>}
      </div>
    </div>
  );
}

function ActivityLine({ icon: Icon, title, desc, tone }) {
  return (
    <div className="gps-activity-line">
      <div className={`gps-activity-icon ${tone}`}>
        <Icon size={18} />
      </div>
      <div>
        <strong>{title}</strong>
        <span>{desc}</span>
      </div>
    </div>
  );
}

function InfoLine({ label, value }) {
  return (
    <div className="gps-info-line">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function AlertLine({ tone, title, desc }) {
  return (
    <div className={`gps-alert-line ${tone}`}>
      <AlertTriangle size={20} />
      <div>
        <strong>{title}</strong>
        <span>{desc}</span>
      </div>
    </div>
  );
}

export default function MapasGpsPage() {
  const [points, setPoints] = useState([]);
  const [savedAreas, setSavedAreas] = useState([]);
  const [drawEnabled, setDrawEnabled] = useState(true);
  const [layer, setLayer] = useState("SATELITE");
  const [focus, setFocus] = useState({
    lat: CONJUNTO_ALFA[0],
    lng: CONJUNTO_ALFA[1],
    zoom: 15
  });
  const [searchText, setSearchText] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [weatherPlace, setWeatherPlace] = useState("Conjunto Alfa, Icó CE");
  const [weatherLoading, setWeatherLoading] = useState(false);
  
  const [selectedArea, setSelectedArea] = useState(null);
  const [editingAreaId, setEditingAreaId] = useState(null); // NOVO: Controle de Edição
  
  const [saveModal, setSaveModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    fazenda: "",
    cultura: "Arroz",
    safra: "",
    variedade: "",
    observacoes: ""
  });

  const mapCaptureRef = useRef(null);

  const currentAreaHa = useMemo(() => areaHa(points), [points]);
  const currentPerimeterM = useMemo(() => perimeterM(points), [points]);
  const currentCenter = useMemo(() => centerPoint(points), [points]);
  const currentSegments = useMemo(() => segmentDistances(points), [points]);

  const totalAreaSaved = useMemo(
    () => savedAreas.reduce((sum, item) => sum + Number(item.areaHa || 0), 0),
    [savedAreas]
  );

  const tileConfig =
    layer === "SATELITE"
      ? {
          url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          attribution: "Leaflet | Esri"
        }
      : {
          url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          attribution: "Leaflet | OpenStreetMap"
        };

  useEffect(() => {
    async function loadInitialData() {
      const areas = await getAreas();
      setSavedAreas(areas);
      loadWeatherByCoords(CONJUNTO_ALFA[0], CONJUNTO_ALFA[1], "Conjunto Alfa, Icó CE");
    }

    loadInitialData();
  }, []);

  function addPoint(point) {
    setPoints((prev) => [...prev, point]);
  }

  function undoPoint() {
    setPoints((prev) => prev.slice(0, -1));
  }

  function clearPoints() {
    setPoints([]);
    setSelectedArea(null);
    setEditingAreaId(null);
    setForm({
      nome: "", fazenda: "", cultura: "Arroz", safra: "", variedade: "", observacoes: ""
    });
  }

  function clearAll() {
    if (points.length === 0 && !editingAreaId) return;
    if (!window.confirm("Deseja limpar o desenho e cancelar a edição atual?")) return;
    clearPoints();
  }

  function centerOnConjuntoAlfa() {
    setFocus({
      lat: CONJUNTO_ALFA[0],
      lng: CONJUNTO_ALFA[1],
      zoom: 15
    });
  }

  function myLocation() {
    if (!navigator.geolocation) {
      alert("Geolocalização não disponível neste navegador.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFocus({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          zoom: 17
        });
      },
      () => {
        alert("Não foi possível acessar a sua localização.");
      }
    );
  }

  function openSaveModal() {
    if (points.length < 3) {
      alert("Marque pelo menos 3 pontos para formar o talhão.");
      return;
    }

    setSaveModal(true);
  }

  async function captureMapImage() {
    const element = mapCaptureRef.current;
    if (!element) return null;

    try {
      await new Promise((resolve) => setTimeout(resolve, 200));

      const canvas = await html2canvas(element, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#020617",
        scale: 1,
        logging: false,
        ignoreElements: (node) => node?.classList?.contains("leaflet-control-attribution")
      });

      return canvas.toDataURL("image/jpeg", 0.6);
    } catch (error) {
      console.warn("Não foi possível capturar o mapa real.", error);
      return null;
    }
  }

  async function saveField() {
    if (!form.nome.trim()) {
      alert("Digite o nome do talhão.");
      return;
    }

    try {
      setSaving(true);

      const realMapImage = await captureMapImage();
      const technicalPreview = createTechnicalImage({
        nome: form.nome,
        fazenda: form.fazenda,
        cultura: form.cultura,
        safra: form.safra,
        areaHa: currentAreaHa,
        perimetroM: currentPerimeterM,
        coordenadas: points
      });

      const payload = {
        ...form,
        coordenadas: points,
        imagemMapa: realMapImage || technicalPreview
      };

      let saved;

      if (editingAreaId) {
        // Se estiver no modo edição, ele ATUALIZA no banco de dados
        saved = await updateTalhaoFromGps(editingAreaId, payload);
        alert("Talhão atualizado com sucesso!");
      } else {
        // Se for novo, ele CRIA no banco de dados
        saved = await saveTalhaoFromGps(payload);
        alert("Talhão salvo com sucesso e integrado aos Talhões!");
      }

      setSelectedArea(saved);
      setSavedAreas(await getAreas());
      setSaveModal(false);
      setSaving(false);
      clearPoints();
    } catch (error) {
      console.error("Erro ao salvar talhao GPS:", error);
      setSaving(false);
      alert(error.message || "Erro ao salvar talhão. Verifique a sua conexão.");
    }
  }

  function openSavedArea(area) {
    setSelectedArea(area);
    setPoints(area.coordenadas || []);
    setEditingAreaId(null);
    setFocus({
      lat: area.centro?.lat || CONJUNTO_ALFA[0],
      lng: area.centro?.lng || CONJUNTO_ALFA[1],
      zoom: 16
    });
  }

  // Função para carregar os dados de um talhão para Edição Completa
  function loadForEdit(area) {
    setSelectedArea(area);
    setEditingAreaId(area.id || area._id);
    setPoints(area.coordenadas || []);
    setForm({
      nome: area.nome || "",
      fazenda: area.fazenda || "",
      cultura: area.cultura || "Arroz",
      safra: area.safra || "",
      variedade: area.variedade || "",
      observacoes: area.observacoes || ""
    });
    setDrawEnabled(true);
    setFocus({
      lat: area.centro?.lat || CONJUNTO_ALFA[0],
      lng: area.centro?.lng || CONJUNTO_ALFA[1],
      zoom: 16
    });
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Rola a página para cima (mapa)
  }

  // Função para deletar a área selecionada
  async function handleDelete(area) {
    if (!window.confirm(`Deseja realmente excluir o talhão "${area.nome}" permanentemente?`)) return;
    
    try {
      await deleteArea(area.id || area._id);
      setSavedAreas(await getAreas());
      
      // Limpa a tela caso o talhão apagado fosse o que estava no mapa
      if (selectedArea && (selectedArea.id === area.id || selectedArea._id === area._id)) {
        clearPoints();
      }
      
      alert("Talhão excluído com sucesso.");
    } catch (err) {
      alert(err.message || "Erro ao excluir o talhão.");
    }
  }

  function generatePdf(area = null) {
    const target =
      area ||
      selectedArea || {
        nome: form.nome || "Talhao GPS",
        fazenda: form.fazenda || "",
        cultura: form.cultura || "",
        safra: form.safra || "",
        areaHa: currentAreaHa,
        perimetroM: currentPerimeterM,
        coordenadas: points,
        segmentos: currentSegments,
        centro: currentCenter,
        imagemMapa: null
      };

    const doc = new jsPDF("p", "mm", "a4");
    const now = new Date().toLocaleString("pt-BR");

    doc.setFontSize(16);
    doc.text("ARROZ DOS FERREIRAS - RELATÓRIO GPS DO TALHÃO", 14, 18);

    doc.setFontSize(10);
    doc.text(`Gerado em: ${now}`, 14, 27);
    doc.text(`Talhão: ${target.nome || "-"}`, 14, 39);
    doc.text(`Fazenda: ${target.fazenda || "-"}`, 14, 47);
    doc.text(`Cultura: ${target.cultura || "-"}`, 14, 55);
    doc.text(`Safra: ${target.safra || "-"}`, 14, 63);
    doc.text(`Área: ${Number(target.areaHa || 0).toFixed(2)} ha`, 14, 71);
    doc.text(`Perímetro: ${Number(target.perimetroM || 0).toFixed(2)} m`, 14, 79);
    doc.text(`Centroide: ${Number(target.centro?.lat || 0).toFixed(6)}, ${Number(target.centro?.lng || 0).toFixed(6)}`, 14, 87);

    if (target.imagemMapa) {
      try {
        doc.addImage(target.imagemMapa, "PNG", 14, 96, 182, 98);
      } catch {
        doc.text("Imagem do mapa não pôde ser inserida neste PDF.", 14, 102);
      }
    }

    let y = target.imagemMapa ? 205 : 102;

    doc.setFontSize(12);
    doc.text("Coordenadas do polígono", 14, y);
    y += 8;

    doc.setFontSize(8);
    (target.coordenadas || []).forEach((point, index) => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }

      doc.text(`P${index + 1}: Latitude ${Number(point.lat).toFixed(8)} | Longitude ${Number(point.lng).toFixed(8)}`, 14, y);
      y += 5;
    });

    y += 4;
    doc.setFontSize(12);
    if (y > 265) {
      doc.addPage();
      y = 20;
    }
    doc.text("Distâncias por trecho", 14, y);
    y += 8;

    doc.setFontSize(8);
    (target.segmentos || segmentDistances(target.coordenadas || [])).forEach((segment) => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }

      doc.text(`P${segment.from} até P${segment.to}: ${Number(segment.distanceM || 0).toFixed(2)} m`, 14, y);
      y += 5;
    });

    doc.save(`relatorio-gps-${String(target.nome || "talhao").replaceAll(" ", "-").toLowerCase()}.pdf`);
    audit("EXPORTAÇÃO", `PDF GPS gerado: ${target.nome || "Talhao"}`);
  }

  function weatherText(code) {
    const map = {
      0: "Céu limpo",
      1: "Principalmente limpo",
      2: "Parcialmente nublado",
      3: "Nublado",
      45: "Neblina",
      48: "Neblina intensa",
      51: "Garoa leve",
      53: "Garoa",
      55: "Garoa forte",
      61: "Chuva leve",
      63: "Chuva",
      65: "Chuva forte",
      80: "Pancadas leves",
      81: "Pancadas",
      82: "Pancadas fortes",
      95: "Trovoada"
    };

    return map[code] || "Clima atualizado";
  }

  async function loadWeatherByCoords(lat, lng, placeName = "Local atual") {
    try {
      setWeatherLoading(true);

      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code&timezone=auto`;
      const response = await fetch(url);
      const data = await response.json();

      setWeatherData(data.current || null);
      setWeatherPlace(placeName);
    } catch (error) {
      console.warn("Erro ao carregar clima", error);
    } finally {
      setWeatherLoading(false);
    }
  }

  async function searchLocal() {
    const termo = String(searchText || "").trim();

    if (!termo) {
      alert("Digite uma cidade, bairro, distrito, comunidade, fazenda ou localidade.");
      return;
    }

    try {
      const consultas = [termo, `${termo}, Brasil`, `${termo}, Ceara, Brasil`];
      let resultado = null;

      for (const consulta of consultas) {
        const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&addressdetails=1&q=${encodeURIComponent(consulta)}`;
        const response = await fetch(url, { headers: { Accept: "application/json" } });
        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          resultado = data[0];
          break;
        }
      }

      if (!resultado) {
        alert("Local não encontrado. Tente colocar a cidade e o estado. Ex: Icó CE, Lima Campos CE, Fortaleza CE.");
        return;
      }

      const lat = Number(resultado.lat);
      const lng = Number(resultado.lon);

      setFocus({ lat, lng, zoom: 15 });
      await loadWeatherByCoords(lat, lng, resultado.display_name);
    } catch (error) {
      alert("Erro ao pesquisar local. Verifique a sua internet.");
    }
  }

  const temperature = weatherData?.temperature_2m;
  const weatherCode = weatherData?.weather_code;

  const lastActivities = [
    { title: editingAreaId ? "Modo Edição Ativo" : "Desenho GPS ativo", desc: `${points.length} pontos marcados`, icon: Crosshair, tone: "green" },
    { title: "Área calculada", desc: `${formatNumber(currentAreaHa)} ha`, icon: MapPinned, tone: "blue" },
    { title: "Perímetro calculado", desc: `${formatNumber(currentPerimeterM)} m`, icon: Ruler, tone: "yellow" },
    { title: "Talhões salvos", desc: `${savedAreas.length} registros em GPS`, icon: ClipboardList, tone: "purple" }
  ];

  return (
    <div className="gps-pro-page">
      <main className="gps-pro-main">
        <header className="gps-pro-header">
          <div className="gps-title-area">
            <span>ARROZ DOS FERREIRAS</span>
            <h1>Mapas/GPS <Crosshair size={36} /></h1>
            <p>Conjunto Alfa, Icó-CE</p>
          </div>

          <div className="gps-search-top">
            <Search size={18} />
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") searchLocal();
              }}
              placeholder="Pesquisar cidade, bairro, distrito, fazenda ou localidade..."
            />
            <button onClick={searchLocal}>Buscar</button>
          </div>

          <div className="gps-user-box">
            <CloudSun size={28} className="sun" />
            <div>
              <strong>{weatherLoading ? "Carregando..." : temperature != null ? `${Math.round(temperature)} C` : "Clima"}</strong>
              <span>{weatherData ? weatherText(weatherCode) : weatherPlace}</span>
            </div>
            <button onClick={myLocation}><Bell size={20} /></button>
          </div>
        </header>

        <section className="gps-status-row">
          <KpiCard icon={MapPinned} title="Área Total" value={`${formatNumber(currentAreaHa)} ha`} subtitle={`${formatNumber(currentAreaHa * 10000, 0)} m2`} tone="green" />
          <KpiCard icon={Ruler} title="Perímetro" value={`${formatNumber(currentPerimeterM)} m`} subtitle="Distância total" tone="yellow" />
          <KpiCard icon={Crosshair} title="Pontos Marcados" value={points.length} subtitle="Vértices do polígono" tone="blue" />
          <KpiCard icon={ShieldCheck} title="Precisão GPS" value="3 m" subtitle="Estimativa visual" tone="purple" />
        </section>

        <section className="gps-workspace">
          <div className="gps-map-panel" style={{ border: editingAreaId ? "2px solid #22c55e" : "1px solid rgba(255,255,255,.10)" }}>
            <div className="gps-panel-head">
              <div>
                {editingAreaId ? (
                   <h2 className="text-emerald-400">Editando Talhão: {form.nome}</h2>
                ) : (
                   <h2>Mapa ao vivo - desenho do talhão</h2>
                )}
                <p>Clique no mapa para marcar pontos. Segure e arraste um número para corrigir a sua posição livremente.</p>
              </div>

              <div className="gps-draw-status">
                <span className={drawEnabled ? "on" : "off"} />
                <strong>{drawEnabled ? "Desenho ligado" : "Desenho pausado"}</strong>
              </div>
            </div>

            <div className="gps-map-frame" ref={mapCaptureRef}>
              <MapContainer center={CONJUNTO_ALFA} zoom={15} scrollWheelZoom className="gps-leaflet-live">
                <TileLayer attribution={tileConfig.attribution} crossOrigin="anonymous" url={tileConfig.url} />

                <MapClickHandler drawEnabled={drawEnabled} onAddPoint={addPoint} />
                <MapTools focus={focus} points={points} />

                {points.map((point, index) => (
                  <Marker
                    key={`point-${index}`}
                    position={[point.lat, point.lng]}
                    draggable={drawEnabled}
                    icon={createPointIcon(index)}
                    eventHandlers={{
                      dragend: (e) => {
                        const marker = e.target;
                        const position = marker.getLatLng();
                        setPoints((prev) => {
                          const newPoints = [...prev];
                          newPoints[index] = { lat: position.lat, lng: position.lng };
                          return newPoints;
                        });
                      }
                    }}
                  >
                    <Popup>
                      Ponto {index + 1} (Arraste para mover)<br />
                      {point.lat.toFixed(7)}, {point.lng.toFixed(7)}
                    </Popup>
                  </Marker>
                ))}

                {points.length >= 2 && (
                  <Polyline positions={points.map((p) => [p.lat, p.lng])} pathOptions={{ color: "#facc15", weight: 3, dashArray: "8 8" }} />
                )}

                {points.length >= 3 && (
                  <Polygon
                    positions={points.map((p) => [p.lat, p.lng])}
                    pathOptions={{
                      color: "#22c55e",
                      fillColor: "#22c55e",
                      fillOpacity: 0.35,
                      weight: 5
                    }}
                  />
                )}

                {currentSegments.map((segment) => (
                  <CircleMarker
                    key={segment.id}
                    center={[segment.middle.lat, segment.middle.lng]}
                    radius={1}
                    pathOptions={{ opacity: 0, fillOpacity: 0 }}
                  >
                    <Tooltip permanent direction="top" className="gps-distance-label">
                      {formatNumber(segment.distanceM)} m
                    </Tooltip>
                  </CircleMarker>
                ))}
              </MapContainer>

              {points.length >= 3 && <div className="gps-center-badge">{formatNumber(currentAreaHa)} ha</div>}

              <div className="gps-left-map-tools">
                <button onClick={clearAll}><Trash2 size={17} /> Limpar</button>
                <button onClick={undoPoint}><RotateCcw size={17} /> Desfazer</button>
              </div>

              <div className="gps-right-map-tools">
                <button onClick={centerOnConjuntoAlfa}><Navigation size={18} /><span>Centralizar</span></button>
                <button onClick={() => setLayer(layer === "SATELITE" ? "MAPA" : "SATELITE")}><Layers size={18} /><span>Camadas</span></button>
                <button onClick={() => setDrawEnabled((prev) => !prev)}><Crosshair size={18} /><span>Medir</span></button>
              </div>

              <select className="gps-layer-select" value={layer} onChange={(e) => setLayer(e.target.value)}>
                <option value="SATELITE">Satelite (Esri)</option>
                <option value="MAPA">Mapa gratuito</option>
              </select>
            </div>

            <div className="gps-command-row">
              <button className="primary" onClick={openSaveModal}>
                 <Save size={22} /> {editingAreaId ? "Atualizar Talhão" : "Salvar Talhão"}
              </button>
              <button className="secondary" onClick={() => generatePdf()}><FileText size={22} /> Gerar PDF Atual</button>
              <button className="danger" onClick={clearAll}><Trash2 size={22} /> {editingAreaId ? "Cancelar Edição" : "Limpar Tudo"}</button>
            </div>
          </div>

          <aside className="gps-details-panel">
            <div className="gps-detail-status">
              <span><CheckCircle2 size={18} /> {points.length >= 3 ? (editingAreaId ? "Edição em andamento" : "Desenho em andamento") : "Aguardando pontos"}</span>
            </div>

            <InfoLine label="Área" value={`${formatNumber(currentAreaHa)} ha`} />
            <InfoLine label="Perímetro" value={`${formatNumber(currentPerimeterM)} m`} />
            <InfoLine label="Pontos" value={points.length} />
            <InfoLine label="Centroide" value={`${currentCenter.lat.toFixed(6)}, ${currentCenter.lng.toFixed(6)}`} />
            <InfoLine label="Áreas salvas" value={savedAreas.length} />
            <InfoLine label="Total salvo" value={`${formatNumber(totalAreaSaved)} ha`} />

            <div className="gps-coords-list">
              <h3>Coordenadas (pontos)</h3>
              <div>
                {points.map((point, index) => (
                  <p key={`${point.lat}-${point.lng}`}>
                    <span>{index + 1}</span>
                    <strong>{point.lat.toFixed(6)}, {point.lng.toFixed(6)}</strong>
                  </p>
                ))}
                {points.length === 0 && <em>Nenhum ponto marcado.</em>}
              </div>
            </div>
          </aside>
        </section>

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-black text-white">Talhões salvos (GPS)</h2>
              <p className="mt-1 text-sm text-slate-400">Gerencie as áreas demarcadas e integradas ao sistema.</p>
            </div>
            <button 
              onClick={exportBackup} 
              className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-white/10 px-5 py-3 font-black text-white transition-colors hover:bg-white/20"
            >
              <Download size={18} /> Backup de Áreas
            </button>
          </div>

          {savedAreas.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-white/10 py-16 text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-800/50 text-slate-500">
                <MapPinned size={40} />
              </div>
              <strong className="text-xl font-black text-white">Nenhum talhão salvo</strong>
              <span className="mt-2 text-slate-400">Marque pontos no mapa e clique em Salvar Talhão.</span>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {savedAreas.slice(0, 8).map((area) => (
                <article 
                  key={area.id || area._id} 
                  className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-900/50 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/10"
                >
                  {/* Imagem do Mapa */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                    {area.imagemMapa ? (
                      <img 
                        src={area.imagemMapa} 
                        alt={area.nome} 
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-800">
                        <MapPinned size={48} strokeWidth={1.5} />
                      </div>
                    )}
                    
                    {/* Badge Flutuante */}
                    <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 backdrop-blur-md">
                      <CheckCircle2 size={14} /> Ativo
                    </div>
                  </div>

                  {/* Informações do Talhão */}
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="truncate text-xl font-black text-white" title={area.nome}>{area.nome}</h3>
                    {area.fazenda && <p className="truncate text-sm font-medium text-slate-400" title={area.fazenda}>{area.fazenda}</p>}

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-white/5 p-3">
                        <span className="block text-[10px] font-black uppercase tracking-widest text-slate-500">Área</span>
                        <strong className="text-sm text-emerald-400">{formatNumber(area.areaHa)} ha</strong>
                      </div>
                      <div className="rounded-2xl bg-white/5 p-3">
                        <span className="block text-[10px] font-black uppercase tracking-widest text-slate-500">Perímetro</span>
                        <strong className="text-sm text-amber-400">{formatNumber(area.perimetroM)} m</strong>
                      </div>
                    </div>

                    <div className="mt-4 text-[11px] font-medium uppercase tracking-wider text-slate-500">
                      Modificado em {formatDate(area.atualizadoEm || area.criadoEm)}
                    </div>
                  </div>

                  {/* Botões de Ação */}
                  <div className="grid grid-cols-4 border-t border-white/5 bg-black/20 p-2">
                    <button 
                      onClick={() => openSavedArea(area)} 
                      title="Visualizar no Mapa" 
                      className="flex items-center justify-center rounded-xl p-3 text-blue-400 transition-colors hover:bg-blue-500/20 hover:text-blue-300"
                    >
                      <Eye size={20} />
                    </button>
                    <button 
                      onClick={() => loadForEdit(area)} 
                      title="Editar Talhão" 
                      className="flex items-center justify-center rounded-xl p-3 text-amber-400 transition-colors hover:bg-amber-500/20 hover:text-amber-300"
                    >
                      <Edit3 size={20} />
                    </button>
                    <button 
                      onClick={() => generatePdf(area)} 
                      title="Baixar PDF" 
                      className="flex items-center justify-center rounded-xl p-3 text-emerald-400 transition-colors hover:bg-emerald-500/20 hover:text-emerald-300"
                    >
                      <FileText size={20} />
                    </button>
                    <button 
                      onClick={() => handleDelete(area)} 
                      title="Excluir Permanentemente" 
                      className="flex items-center justify-center rounded-xl p-3 text-red-400 transition-colors hover:bg-red-500/20 hover:text-red-300"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="gps-bottom-grid">
          <div className="gps-widget">
            <h3>Atividades recentes</h3>
            {lastActivities.map((item) => (
              <ActivityLine key={item.title} {...item} />
            ))}
          </div>

          <div className="gps-widget gps-weather-widget">
            <h3>Clima atual</h3>
            <div className="gps-weather-main">
              <CloudSun size={50} />
              <div>
                <strong>{temperature != null ? `${Math.round(temperature)} C` : "--"}</strong>
                <span>{weatherData ? weatherText(weatherCode) : weatherPlace}</span>
              </div>
            </div>
            <div className="gps-weather-mini">
              <span>Humidade <b>{weatherData ? `${weatherData.relative_humidity_2m}%` : "--"}</b></span>
              <span>Vento <b>{weatherData ? `${Math.round(weatherData.wind_speed_10m)} km/h` : "--"}</b></span>
              <span>Chuva <b>{weatherData ? `${weatherData.precipitation} mm` : "--"}</b></span>
            </div>
          </div>

          <div className="gps-widget">
            <h3>Alertas e notificações</h3>
            <AlertLine tone="blue" title="Mapa ativo" desc="GPS gratuito carregado" />
            <AlertLine tone="yellow" title="Salve com 3 pontos" desc="Necessário fechar o polígono" />
            <AlertLine tone="green" title="Talhões integrados" desc="O GPS envia automaticamente para Talhões" />
          </div>
        </section>

        <nav className="gps-mobile-nav">
          <a><Home size={24} /> Painel</a>
          <a><MapPinned size={24} /> Talhões</a>
          <a className="active"><Crosshair size={28} /> GPS</a>
          <a><MoreHorizontal size={24} /> Mais</a>
        </nav>
      </main>

      {saveModal && (
        <div className="gps-modal">
          <div className="gps-modal-card">
            <div className="gps-modal-head">
              <div>
                <h2>{editingAreaId ? "Atualizar Talhão GPS" : "Salvar Talhão GPS"}</h2>
                <p>As atualizações feitas aqui são refletidas imediatamente na aba de Talhões.</p>
              </div>
              <button onClick={() => setSaveModal(false)}><X size={22} /></button>
            </div>

            <div className="gps-form-grid">
              <label>
                Nome do talhão
                <input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Talhão 06" />
              </label>
              <label>
                Fazenda
                <input value={form.fazenda} onChange={(e) => setForm({ ...form, fazenda: e.target.value })} placeholder="Fazenda Sede" />
              </label>
              <label>
                Cultura
                <input value={form.cultura} onChange={(e) => setForm({ ...form, cultura: e.target.value })} placeholder="Arroz" />
              </label>
              <label>
                Safra
                <input value={form.safra} onChange={(e) => setForm({ ...form, safra: e.target.value })} placeholder="2025/2026" />
              </label>
              <label>
                Variedade
                <input value={form.variedade} onChange={(e) => setForm({ ...form, variedade: e.target.value })} placeholder="BRS Pampa" />
              </label>
              <label>
                Observações
                <input value={form.observacoes} onChange={(e) => setForm({ ...form, observacoes: e.target.value })} placeholder="Entrada, solo, marco, etc." />
              </label>
            </div>

            <div className="gps-modal-metrics">
              <span>Área <b>{formatNumber(currentAreaHa)} ha</b></span>
              <span>Perímetro <b>{formatNumber(currentPerimeterM)} m</b></span>
              <span>Pontos <b>{points.length}</b></span>
            </div>

            <button className="gps-modal-save" onClick={saveField} disabled={saving}>
              {saving ? "Salvando informações..." : (editingAreaId ? "Confirmar Atualização" : "Salvar em GPS e Talhões")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}