
import { NextResponse } from 'next/server';

const E2E = process.env.E2E_MODE === '1';

async function createConversation() {
  const apiKey = process.env.TAVUS_API_KEY;
  const personaId = process.env.TAVUS_PERSONA_ID;
  const replicaId = process.env.TAVUS_REPLICA_ID;
  if (!apiKey || !personaId || !replicaId) {
    return NextResponse.json({ error: 'Missing Tavus env' }, { status: 500 });
  }
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 8000);

  try {
    const resp = await fetch('https://tavusapi.com/v2/conversations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
      body: JSON.stringify({ persona_id: personaId, replica_id: replicaId }),
      cache: 'no-store',
      signal: controller.signal
    });
    clearTimeout(t);
    if (!resp.ok) {
      const text = await resp.text();
      return NextResponse.json({ error: `Tavus error: ${text}` }, { status: resp.status });
    }
    const data = await resp.json();
    if (!data?.conversation_url) {
      return NextResponse.json({ error: 'No conversation_url from Tavus' }, { status: 500 });
    }
    return NextResponse.json({ url: data.conversation_url, id: data.conversation_id });
  } catch (e:any) {
    clearTimeout(t);
    return NextResponse.json({ error: e?.name === 'AbortError' ? 'Tavus timeout' : (e?.message || 'Unknown error') }, { status: 504 });
  }
}

export async function POST() {
  if (E2E) {
    return NextResponse.json({ url: 'https://example.com/fake-tavus-demo', id: 'test-conversation-id' });
  }
  let last;
  for (let i=0;i<3;i++) {
    last = await createConversation();
    const s = (last as any)?.status ?? 200;
    if (s >= 200 && s < 300) return last;
    await new Promise(r => setTimeout(r, 400 * (i+1)));
  }
  return last as any;
}
