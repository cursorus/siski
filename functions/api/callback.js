// functions/api/callback.js
// Cloudflare Pages Function: /api/callback
// Обменивает code на access_token + refresh_token, затем редиректит на главную
// с токенами в URL-фрагменте (#access_token=...&refresh_token=...&email=...)

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return new Response("Missing code", { status: 400 });
  }

  const redirectUri = `${url.origin}/api/callback`;

  // 1. Обмен code -> tokens
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: "authorization_code"
    })
  });

  const tokenData = await tokenRes.json();

  if (!tokenData.access_token) {
    return new Response("OAuth error: " + JSON.stringify(tokenData), { status: 400 });
  }

  // 2. Получаем email пользователя (для отображения в списке аккаунтов)
  let email = "";
  try {
    const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });
    const userInfo = await userInfoRes.json();
    email = userInfo.email || "";
  } catch (e) {
    // ignore
  }

  // 3. Редирект на главную с токенами в hash
  const params = new URLSearchParams({
    access_token: tokenData.access_token,
    refresh_token: tokenData.refresh_token || "",
    email
  });

  return Response.redirect(`${url.origin}/#${params.toString()}`, 302);
}
