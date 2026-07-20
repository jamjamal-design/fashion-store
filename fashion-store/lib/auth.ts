export type AdminRole = "owner" | "manager" | "editor";

export type AdminSession = {
  adminId: string;
  email: string;
  role: AdminRole;
  token?: string;
  expiresAt?: string;
};

export const ADMIN_LOGIN_PATH = "/admin/login";
export const ADMIN_DASHBOARD_PATH = "/admin";

export const ADMIN_PERMISSIONS = {
  canManageProducts: ["owner", "manager", "editor"] as AdminRole[],
  canManageOrders: ["owner", "manager"] as AdminRole[],
  canManageAdmins: ["owner"] as AdminRole[],
} as const;

export function canAccessAdminDashboard(role?: AdminRole) {
  return Boolean(role);
}

export function canManageProducts(role?: AdminRole) {
  return role ? ADMIN_PERMISSIONS.canManageProducts.includes(role) : false;
}

export function canManageOrders(role?: AdminRole) {
  return role ? ADMIN_PERMISSIONS.canManageOrders.includes(role) : false;
}

export function canManageAdmins(role?: AdminRole) {
  return role ? ADMIN_PERMISSIONS.canManageAdmins.includes(role) : false;
}

export function getAdminSessionCookieName() {
  return process.env.ADMIN_SESSION_COOKIE_NAME ?? "fashion-store-admin-session";
}

export function getAdminSessionDurationInDays() {
  return Number(process.env.ADMIN_SESSION_DURATION_DAYS ?? 7);
}

const ADMIN_SESSION_STORAGE_KEY = "fashion-store-admin-session";

export function saveAdminSession(session: AdminSession) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ADMIN_SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function loadAdminSession() {
  if (typeof window === "undefined") {
    return null;
  }

  const value = window.localStorage.getItem(ADMIN_SESSION_STORAGE_KEY);

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as AdminSession;
  } catch {
    return null;
  }
}

export function clearAdminSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
}

export function getAdminToken() {
  return loadAdminSession()?.token ?? null;
}