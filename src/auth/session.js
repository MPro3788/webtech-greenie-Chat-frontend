const STORAGE_KEY = "greenie-auth";

function readStoredAuth() {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    sessionStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function getStoredToken() {
  return readStoredAuth()?.token ?? null;
}

export function getStoredUser() {
  return readStoredAuth()?.user ?? null;
}

export function saveAuth(session) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearAuth() {
  sessionStorage.removeItem(STORAGE_KEY);
}
