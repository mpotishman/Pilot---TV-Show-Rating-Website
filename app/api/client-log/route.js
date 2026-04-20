// app/api/client-log/route.js
export async function POST(req) {
  try {
    const body = await req.json();
    console.log("[CLIENT-LOG]", new Date().toISOString(), JSON.stringify(body));
    return new Response(null, { status: 204 });
  } catch (err) {
    console.error("[CLIENT-LOG] failed to parse body", err);
    return new Response(null, { status: 400 });
  }
}
