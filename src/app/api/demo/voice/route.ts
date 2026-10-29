// The recorded-question flow was replaced by /api/demo/realtime.
// Keep a non-billable response for older tabs; never leave a second paid entry point.
export async function GET() {
  return Response.json({ available: false }, { headers: { "Cache-Control": "no-store" } });
}
export async function POST() {
  return Response.json({ error: "Demo głosowe zostało zaktualizowane. Odśwież stronę, aby porozmawiać na żywo." }, { status: 410, headers: { "Cache-Control": "no-store" } });
}
