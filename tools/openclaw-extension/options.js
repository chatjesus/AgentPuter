const DEFAULT_PORT = 18792
const DEFAULT_HOST = '127.0.0.1'

function clampPort(value) {
  const n = Number.parseInt(String(value || ''), 10)
  if (!Number.isFinite(n)) return DEFAULT_PORT
  if (n <= 0 || n > 65535) return DEFAULT_PORT
  return n
}

function cleanHost(value) {
  const h = String(value || '').trim()
  return h || DEFAULT_HOST
}

function updateRelayUrl(host, port) {
  const el = document.getElementById('relay-url')
  if (!el) return
  el.textContent = `http://${host}:${port}/`
}

function setStatus(kind, message) {
  const status = document.getElementById('status')
  if (!status) return
  status.dataset.kind = kind || ''
  status.textContent = message || ''
}

async function checkRelayReachable(host, port) {
  const url = `http://${host}:${port}/`
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), 3000)
  try {
    const res = await fetch(url, { method: 'HEAD', signal: ctrl.signal })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    setStatus('ok', `Relay reachable at ${url}`)
  } catch (err) {
    const msg = String(err)
    // Connection reset = server is up (WebSocket-only mode, e.g. TinyClaw remote relay)
    if (msg.includes('reset') || msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
      setStatus('ok', `Relay reachable at ${url} (WebSocket mode)`)
    } else {
      setStatus('error', `Relay not reachable at ${url}. Check host/port and make sure OpenClaw relay is running.`)
    }
  } finally {
    clearTimeout(t)
  }
}

async function load() {
  const stored = await chrome.storage.local.get(['relayPort', 'relayHost'])
  const port = clampPort(stored.relayPort)
  const host = cleanHost(stored.relayHost)
  document.getElementById('port').value = String(port)
  document.getElementById('host').value = host
  updateRelayUrl(host, port)
  await checkRelayReachable(host, port)
}

async function save() {
  const port = clampPort(document.getElementById('port').value)
  const host = cleanHost(document.getElementById('host').value)
  await chrome.storage.local.set({ relayPort: port, relayHost: host })
  document.getElementById('port').value = String(port)
  document.getElementById('host').value = host
  updateRelayUrl(host, port)
  await checkRelayReachable(host, port)
}

document.getElementById('save').addEventListener('click', () => void save())
void load()
