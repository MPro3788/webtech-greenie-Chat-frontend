import { http } from "./http";

export async function login(username, password) {
  const res = await http.post("/auth/login", { username, password });
  return res.data;
}

export async function logout() {
  await http.post("/auth/logout");
}
