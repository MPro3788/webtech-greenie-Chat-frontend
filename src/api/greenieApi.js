import { http } from "./http";

export async function getHello() {
  const res = await http.get("https://webtech-greenie-chat-backend.onrender.com");
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

