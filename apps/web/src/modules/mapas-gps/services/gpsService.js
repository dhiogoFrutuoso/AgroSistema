import { api } from "../../../services/api.js";

const GPS_KEY = "@arroz:gps:areas";
const TALHOES_KEY = "@arroz:talhoes";
const AUDIT_KEY = "@arroz:auditoria";

export const CONJUNTO_ALFA = [-6.4019, -38.8629];

export function parseStorage(key, fallback = []) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value || []));
    window.dispatchEvent(new Event("storage"));
  } catch (error) {
    console.warn("Aviso: Limite de armazenamento local excedido. O cache offline não foi atualizado.");
  }
}

function extractArray(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.plots)) return data.plots;
  if (Array.isArray(data?.mapas)) return data.mapas;
  if (Array.isArray(data?.areas)) return data.areas;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.results)) return data.results;
  return [];
}

export function uid(prefix = "gps") {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function getAreasLocal() {
  return parseStorage(GPS_KEY, []);
}

export async function getAreas() {
  const response = await api.get("/plots");

  if (response.ok) {
    const areas = extractArray(response.data)
      .map(item => ({ ...item, id: item._id || item.id }))
      .filter(item => item.origem === "GPS");
      
    saveAreas(areas);
    return areas;
  }

  return getAreasLocal();
}

export function saveAreas(data) {
  const safeData = (data || []).map(item => ({ ...item, imagemMapa: "" }));
  writeStorage(GPS_KEY, safeData);
}

export function getTalhoes() {
  return parseStorage(TALHOES_KEY, []);
}

export function saveTalhoes(data) {
  const safeData = (data || []).map(item => ({ ...item, imagemMapa: "" }));
  writeStorage(TALHOES_KEY, safeData);
}

export function audit(acao, descricao, nivel = "INFO") {
  const user = parseStorage("@arroz:user", {});
  const lista = parseStorage(AUDIT_KEY, []);

  lista.unshift({
    id: uid("audit"),
    usuario: user.nome || user.name || user.usuario || user.username || "Sistema",
    modulo: "Mapas/GPS",
    acao,
    descricao,
    nivel,
    dataHora: new Date().toISOString()
  });

  writeStorage(AUDIT_KEY, lista.slice(0, 800));
}

export function toRad(value) {
  return (Number(value) * Math.PI) / 180;
}

export function distanceM(a, b) {
  const R = 6371008.8;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(h));
}

export function perimeterM(points) {
  if (!Array.isArray(points) || points.length < 2) return 0;

  let total = 0;
  for (let i = 0; i < points.length; i++) {
    total += distanceM(points[i], points[(i + 1) % points.length]);
  }

  return total;
}

export function segmentDistances(points) {
  if (!Array.isArray(points) || points.length < 2) return [];

  const segments = [];

  for (let i = 0; i < points.length; i++) {
    const current = points[i];
    const next = points[(i + 1) % points.length];

    if (points.length < 3 && i === points.length - 1) break;

    segments.push({
      id: `seg_${i + 1}`,
      from: i + 1,
      to: i === points.length - 1 ? 1 : i + 2,
      distanceM: distanceM(current, next),
      middle: {
        lat: (current.lat + next.lat) / 2,
        lng: (current.lng + next.lng) / 2
      }
    });
  }

  return segments;
}

export function centerPoint(points) {
  if (!Array.isArray(points) || points.length === 0) {
    return { lat: CONJUNTO_ALFA[0], lng: CONJUNTO_ALFA[1] };
  }

  const total = points.reduce(
    (acc, p) => ({
      lat: acc.lat + Number(p.lat),
      lng: acc.lng + Number(p.lng)
    }),
    { lat: 0, lng: 0 }
  );

  return {
    lat: total.lat / points.length,
    lng: total.lng / points.length
  };
}

export function areaHa(points) {
  if (!Array.isArray(points) || points.length < 3) return 0;

  const R = 6378137;
  const c = centerPoint(points);
  const lat0 = toRad(c.lat);

  const flat = points.map((p) => ({
    x: R * toRad(p.lng) * Math.cos(lat0),
    y: R * toRad(p.lat)
  }));

  let area = 0;
  for (let i = 0; i < flat.length; i++) {
    const j = (i + 1) % flat.length;
    area += flat[i].x * flat[j].y - flat[j].x * flat[i].y;
  }

  return Math.abs(area / 2) / 10000;
}

export function getBounds(points) {
  if (!Array.isArray(points) || points.length === 0) {
    return {
      minLat: CONJUNTO_ALFA[0],
      maxLat: CONJUNTO_ALFA[0],
      minLng: CONJUNTO_ALFA[1],
      maxLng: CONJUNTO_ALFA[1]
    };
  }

  return points.reduce(
    (acc, p) => ({
      minLat: Math.min(acc.minLat, Number(p.lat)),
      maxLat: Math.max(acc.maxLat, Number(p.lat)),
      minLng: Math.min(acc.minLng, Number(p.lng)),
      maxLng: Math.max(acc.maxLng, Number(p.lng))
    }),
    {
      minLat: Number(points[0].lat),
      maxLat: Number(points[0].lat),
      minLng: Number(points[0].lng),
      maxLng: Number(points[0].lng)
    }
  );
}

export function createTechnicalImage(area) {
  const points = area.coordenadas || [];
  const width = 1100;
  const height = 650;
  const pad = 90;

  if (points.length < 3) return "";

  const b = getBounds(points);
  const latRange = Math.max(0.000001, b.maxLat - b.minLat);
  const lngRange = Math.max(0.000001, b.maxLng - b.minLng);

  const svgPoints = points
    .map((p) => {
      const x = pad + ((p.lng - b.minLng) / lngRange) * (width - pad * 2);
      const y = height - pad - ((p.lat - b.minLat) / latRange) * (height - pad * 2);
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  const vertex = points
    .map((p, index) => {
      const x = pad + ((p.lng - b.minLng) / lngRange) * (width - pad * 2);
      const y = height - pad - ((p.lat - b.minLat) / latRange) * (height - pad * 2);
      return `
        <circle cx="${x}" cy="${y}" r="14" fill="#111827" stroke="#ffffff" stroke-width="4"/>
        <text x="${x}" y="${y + 6}" text-anchor="middle" font-size="18" font-weight="800" fill="#ffffff" font-family="Arial">${index + 1}</text>
      `;
    })
    .join("");

  const grid = Array.from({ length: 9 })
    .map((_, index) => {
      const x = pad + index * ((width - pad * 2) / 8);
      const y = pad + index * ((height - pad * 2) / 8);
      return `
        <line x1="${x}" y1="${pad}" x2="${x}" y2="${height - pad}" stroke="rgba(255,255,255,.08)"/>
        <line x1="${pad}" y1="${y}" x2="${width - pad}" y2="${y}" stroke="rgba(255,255,255,.08)"/>
      `;
    })
    .join("");

  const segments = segmentDistances(points)
    .map((seg) => {
      const x = pad + ((seg.middle.lng - b.minLng) / lngRange) * (width - pad * 2);
      const y = height - pad - ((seg.middle.lat - b.minLat) / latRange) * (height - pad * 2);
      return `
        <rect x="${x - 54}" y="${y - 16}" width="108" height="30" rx="15" fill="rgba(2,6,23,.85)"/>
        <text x="${x}" y="${y + 5}" text-anchor="middle" fill="#ffffff" font-size="15" font-weight="800" font-family="Arial">${seg.distanceM.toFixed(1)} m</text>
      `;
    })
    .join("");

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <defs>
      <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="#10251a"/>
        <stop offset="45%" stop-color="#25442a"/>
        <stop offset="100%" stop-color="#08111f"/>
      </linearGradient>
      <filter id="shadow">
        <feDropShadow dx="0" dy="16" stdDeviation="12" flood-color="#000000" flood-opacity=".55"/>
      </filter>
    </defs>
    <rect width="100%" height="100%" fill="url(#bg)"/>
    <rect x="45" y="45" width="${width - 90}" height="${height - 90}" rx="34" fill="rgba(2,6,23,.40)" stroke="rgba(255,255,255,.18)"/>
    ${grid}
    <polygon points="${svgPoints}" fill="rgba(34,197,94,.42)" stroke="#22c55e" stroke-width="9" filter="url(#shadow)"/>
    ${segments}
    ${vertex}
    <rect x="70" y="70" width="500" height="92" rx="24" fill="rgba(2,6,23,.80)"/>
    <text x="96" y="112" fill="#ffffff" font-size="30" font-weight="900" font-family="Arial">ARROZ DOS FERREIRAS</text>
    <text x="96" y="142" fill="#cbd5e1" font-size="18" font-family="Arial">Imagem tecnica do talhao demarcado</text>
    <rect x="70" y="${height - 138}" width="690" height="78" rx="22" fill="rgba(2,6,23,.80)"/>
    <text x="96" y="${height - 104}" fill="#ffffff" font-size="22" font-weight="800" font-family="Arial">${area.nome || "Talhao GPS"} - ${area.fazenda || "Fazenda"}</text>
    <text x="96" y="${height - 76}" fill="#4ade80" font-size="20" font-weight="800" font-family="Arial">${Number(area.areaHa || 0).toFixed(2)} ha | ${Number(area.perimetroM || 0).toFixed(2)} m | ${points.length} pontos</text>
  </svg>`;

  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
}

export async function saveTalhaoFromGps(payload) {
  const points = payload.coordenadas || [];

  const item = {
    nome: payload.nome || "Talhao GPS",
    fazenda: payload.fazenda || "",
    cultura: payload.cultura || "Arroz",
    safra: payload.safra || "",
    status: "ATIVO",
    areaHa: areaHa(points),
    perimetroM: perimeterM(points),
    coordenadas: points,
    segmentos: segmentDistances(points),
    centro: centerPoint(points),
    origem: "GPS",
    observacoes: payload.observacoes || ""
  };

  item.imagemMapa = payload.imagemMapa || createTechnicalImage(item);

  const response = await api.post("/plots", item);
  
  if (!response.ok) {
    throw new Error(response.error || "Erro ao salvar no banco de dados.");
  }

  const finalItem = { ...response.data, id: response.data._id || response.data.id };
  audit("CADASTRO", `Talhao salvo pelo GPS: ${finalItem.nome} - ${Number(finalItem.areaHa || 0).toFixed(2)} ha`);
  return finalItem;
}

export async function updateTalhaoFromGps(id, payload) {
  const points = payload.coordenadas || [];

  const item = {
    ...payload,
    areaHa: areaHa(points),
    perimetroM: perimeterM(points),
    coordenadas: points,
    segmentos: segmentDistances(points),
    centro: centerPoint(points),
    origem: "GPS",
    atualizadoEm: new Date().toISOString()
  };

  if (payload.imagemMapa) {
    item.imagemMapa = payload.imagemMapa;
  }

  const response = await api.put(`/plots/${id}`, item);
  
  if (!response.ok) {
    throw new Error(response.error || "Erro ao atualizar no banco de dados.");
  }

  const finalItem = { ...response.data, id: response.data._id || response.data.id };
  audit("EDIÇÃO", `Talhão GPS atualizado: ${finalItem.nome}`);
  return finalItem;
}

export async function deleteArea(id) {
  const response = await api.delete(`/plots/${id}`);
  
  if (!response.ok) {
    throw new Error(response.error || "Erro ao excluir no banco de dados.");
  }

  audit("EXCLUSÃO", `Talhão excluído via GPS: ${id}`, "ALERTA");
  return true;
}

export async function exportBackup() {
  const payload = {
    modulo: "Mapas/GPS",
    data: new Date().toISOString(),
    areas: await getAreas()
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "backup-gps-talhoes.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);

  audit("EXPORTACAO", "Backup GPS exportado");
}