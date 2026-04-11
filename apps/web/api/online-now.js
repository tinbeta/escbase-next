const WINDOW_SECONDS = 45;
const HEARTBEAT_PREFIX = 'escbase:presence:';

function json(res, status, payload) {
  res.status(status).json(payload);
}

function sanitizeVisitorId(value) {
  return String(value || '')
    .replace(/[^a-zA-Z0-9_-]/g, '')
    .slice(0, 80);
}

function sanitizePath(value) {
  return String(value || '/')
    .replace(/[^a-zA-Z0-9/_-]/g, '')
    .slice(0, 120) || '/';
}

function getMemoryStore() {
  if (!globalThis.__escbasePresenceStore) {
    globalThis.__escbasePresenceStore = new Map();
  }
  return globalThis.__escbasePresenceStore;
}

function pruneMemoryStore(store, cutoffMs) {
  for (const [key, value] of store.entries()) {
    if (!value || value.lastSeen < cutoffMs) store.delete(key);
  }
}

async function updateWithUpstash(visitorId, path, nowMs, action = 'ping') {
  const baseUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!baseUrl || !token) return null;

  const headers = { Authorization: `Bearer ${token}` };
  const key = `${HEARTBEAT_PREFIX}${visitorId}`;

  if (action === 'leave') {
    const delResponse = await fetch(`${baseUrl}/del/${encodeURIComponent(key)}`, {
      method: 'POST',
      headers,
    });

    if (!delResponse.ok) {
      throw new Error(`presence_del_failed:${delResponse.status}`);
    }
  } else {
    const payload = JSON.stringify({ lastSeen: nowMs, path });
    const setResponse = await fetch(`${baseUrl}/set/${encodeURIComponent(key)}/${encodeURIComponent(payload)}?EX=${WINDOW_SECONDS}`, {
      method: 'POST',
      headers,
    });

    if (!setResponse.ok) {
      throw new Error(`presence_set_failed:${setResponse.status}`);
    }
  }

  const keysResponse = await fetch(`${baseUrl}/keys/${encodeURIComponent(`${HEARTBEAT_PREFIX}*`)}`, {
    headers,
  });

  if (!keysResponse.ok) {
    throw new Error(`presence_keys_failed:${keysResponse.status}`);
  }

  const keysData = await keysResponse.json();
  const result = Array.isArray(keysData?.result) ? keysData.result.length : 0;
  return { onlineNow: result, storage: 'upstash-rest' };
}

async function updateWithMemory(visitorId, path, nowMs, action = 'ping') {
  const store = getMemoryStore();
  const cutoffMs = nowMs - WINDOW_SECONDS * 1000;

  if (action === 'leave') {
    store.delete(visitorId);
  } else {
    store.set(visitorId, { path, lastSeen: nowMs });
  }

  pruneMemoryStore(store, cutoffMs);
  return { onlineNow: store.size, storage: 'memory-fallback' };
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  try {
    const visitorId = sanitizeVisitorId(req.query?.visitorId);
    const path = sanitizePath(req.query?.path);
    const action = req.query?.action === 'leave' ? 'leave' : 'ping';

    if (!visitorId) {
      return json(res, 400, { error: 'missing_visitor_id' });
    }

    const nowMs = Date.now();
    let result = null;

    try {
      result = await updateWithUpstash(visitorId, path, nowMs, action);
    } catch (error) {
      console.error('[online-now] upstash error:', error);
    }

    if (!result) {
      result = await updateWithMemory(visitorId, path, nowMs, action);
    }

    return json(res, 200, {
      onlineNow: result.onlineNow,
      storage: result.storage,
      windowSeconds: WINDOW_SECONDS,
      path,
      action,
      updatedAt: new Date(nowMs).toISOString(),
    });
  } catch (error) {
    return json(res, 200, {
      onlineNow: null,
      error: 'presence_unavailable',
      detail: error instanceof Error ? error.message : 'unknown_error',
      windowSeconds: WINDOW_SECONDS,
      updatedAt: new Date().toISOString(),
    });
  }
}
