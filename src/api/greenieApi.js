import { http } from "./http";

export async function getHello() {
  // Use relative path so Vite proxy (/api -> Render) can avoid CORS in browser
  const res = await http.get("/");
  return res.data;
}

export async function getData() {
  const res = await http.get("/data");
  return res.data;
}

export async function postData(data) {
  const res = await http.post("/data", data, {
    headers: { "Content-Type": "application/json" }
  });
  return res.data;
}

