import { http } from "./http";

export async function getHello() {
  const res = await http.get("/");
  return res.data;
}

export async function getData() {
  const res = await http.get("/data");
  return res.data;
}

export async function postData(id, entity) {
  const res = await http.post(
    `/data/${id}`,
    {
      name: entity.name,
      beruf: entity.beruf,
      alter: entity.alter
    },
    {
      headers: { "Content-Type": "application/json" }
    }
  );
  return res.data;
}
