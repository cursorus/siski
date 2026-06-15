// functions/api/media.js
// Cloudflare Pages Function: /api/media?token=ACCESS_TOKEN&album=ALBUM_ID
// Возвращает список фото/видео из альбома

export async function onRequestGet(context) {
  const { request } = context;
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const albumId = url.searchParams.get("album");

  if (!token || !albumId) {
    return new Response("Missing token or album", { status: 400 });
  }

  const res = await fetch("https://photoslibrary.googleapis.com/v1/mediaItems:search", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ albumId, pageSize: 100 })
  });

  const data = await res.json();

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" }
  });
}
