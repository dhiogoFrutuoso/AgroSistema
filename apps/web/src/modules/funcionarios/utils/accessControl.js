export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("@arroz:user") || "null");
  } catch {
    return null;
  }
}

export function isAdmin(user = getCurrentUser()) {
  const usuario = String(user?.usuario || user?.username || "").toLowerCase();
  const tipo = String(user?.tipo || user?.role || user?.perfil || "").toUpperCase();
  return usuario === "admin" || tipo === "ADMIN" || tipo === "ADMINISTRADOR";
}

export function canAccess(moduleName, user = getCurrentUser()) {
  if (isAdmin(user)) return true;
  return Boolean(user?.permissoes?.[moduleName]);
}
