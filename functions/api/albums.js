// functions/api/albums.js
// Cloudflare Pages Function: /api/albums?token=ACCESS_TOKEN
// Возвращает список альбомов аккаунта

export async function onRequestGet(context) {
  const { request } = context;
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return new Response("Missing token", { status: 400 });
  }

  const res = await fetch("https://photoslibrary.googleapis.com/v1/albums?pageSize=50", {
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await res.json();

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" }
  });
}
