export function haversineDistanceMeters(a, b) {
  const earth = 6371000;
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);

  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);

  return earth * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

export function calculatePerimeter(points) {
  if (!points || points.length < 2) return 0;

  let total = 0;

  for (let i = 0; i < points.length; i++) {
    const current = points[i];
    const next = points[(i + 1) % points.length];
    total += haversineDistanceMeters(current, next);
  }

  return total;
}

export function calculateAreaHa(points) {
  if (!points || points.length < 3) return 0;

  const earth = 6378137;
  let area = 0;

  for (let i = 0; i < points.length; i++) {
    const p1 = points[i];
    const p2 = points[(i + 1) % points.length];

    area += toRad(p2.lng - p1.lng) *
      (2 + Math.sin(toRad(p1.lat)) + Math.sin(toRad(p2.lat)));
  }

  area = Math.abs(area * earth * earth / 2);
  return area / 10000;
}

export function calculateCenter(points) {
  if (!points || points.length === 0) {
    return { lat: -6.401, lng: -38.862 };
  }

  const total = points.reduce(
    (acc, point) => ({
      lat: acc.lat + Number(point.lat),
      lng: acc.lng + Number(point.lng)
    }),
    { lat: 0, lng: 0 }
  );

  return {
    lat: total.lat / points.length,
    lng: total.lng / points.length
  };
}

export function formatCoord(value) {
  return Number(value || 0).toFixed(6);
}

function toRad(value) {
  return Number(value) * Math.PI / 180;
}
