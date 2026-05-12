// Mobile nav toggle is defined in shared-layout.js

// Text cycling animation
const words = ["Crypto Reports", "Blockchain Tech", "Web3 Trends", "Market Insights"];
let i = 0, j = 0, currentWord = "", isDeleting = false;
const textElement = document.querySelector(".animate-text");

function type() {
  currentWord = words[i];
  if (isDeleting) {
    textElement.textContent = currentWord.substring(0, j - 1);
    j--;
    if (j === 0) { isDeleting = false; i = (i + 1) % words.length; }
  } else {
    textElement.textContent = currentWord.substring(0, j + 1);
    j++;
    if (j === currentWord.length) { isDeleting = true; setTimeout(type, 2000); return; }
  }
  setTimeout(type, isDeleting ? 100 : 200);
}

document.addEventListener("DOMContentLoaded", () => { type(); });

// Scroll animation
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: 0.1 });

document.querySelectorAll('.hero, .coin-strip').forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

// Auto-load posts from blog.json
fetch('/blog.json')
  .then(r => r.json())
  .then(posts => {
    const grid = document.getElementById('postsGrid');
    const shown = posts.slice(0, 3);

    shown.forEach((p) => {
      grid.appendChild(EscbaseRender.createPostCard(p, { fade: true, showArrow: true }));
    });

    grid.querySelectorAll('.bento-item').forEach(el => observer.observe(el));
  })
  .catch(() => {
    EscbaseRender.appendMessage(document.getElementById('postsGrid'), 'Không thể tải bài viết.');
  });

const dedupeVideos = (videos) => {
  const seen = new Set();
  return videos.filter((video) => {
    const normalized = (video.title || '')
      .replace(/\s*-\s*full\s*$/i, '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();

    if (seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
};

let coinTickerPaused = false;

const syncCoinTickerState = () => {
  const grid = document.getElementById('coinGrid');
  if (!grid) return;
  grid.classList.toggle('is-paused', coinTickerPaused);
};

const pauseCoinTicker = () => {
  coinTickerPaused = true;
  syncCoinTickerState();
};

const resumeCoinTicker = () => {
  coinTickerPaused = false;
  syncCoinTickerState();
};

const handleCoinTickerInteraction = (event) => {
  if (coinTickerPaused) {
    resumeCoinTicker();
    return;
  }

  pauseCoinTicker();
  event.stopPropagation();
};

const handleDocumentInteraction = (event) => {
  if (!coinTickerPaused) return;

  const grid = document.getElementById('coinGrid');
  if (!grid) return;
  if (grid.contains(event.target)) return;

  resumeCoinTicker();
};

const bindCoinTickerToggle = () => {
  const grid = document.getElementById('coinGrid');
  if (!grid || grid.dataset.toggleBound === 'true') return;

  grid.dataset.toggleBound = 'true';
  grid.addEventListener('click', handleCoinTickerInteraction);
  grid.addEventListener('touchstart', () => {}, { passive: true });
  document.addEventListener('click', handleDocumentInteraction);
  syncCoinTickerState();
};

const renderCoins = (payload) => {
  const grid = document.getElementById('coinGrid');
  const coins = payload?.coins || [];

  EscbaseRender.renderCoins(grid, coins);
  bindCoinTickerToggle();
  syncCoinTickerState();
};

bindCoinTickerToggle();

const loadCoins = () => {
  fetch('/api/top-coins')
    .then(r => r.json())
    .then(renderCoins)
    .catch(() => {
      EscbaseRender.appendMessage(document.getElementById('coinGrid'), 'Không thể tải giá coin lúc này.');
    });
};

loadCoins();
setInterval(loadCoins, 300000);

async function loadHomepageVideos() {
  const grid = document.getElementById('videosGrid');

  function renderVideos(videos) {
    const shown = dedupeVideos(videos).slice(0, 3);
    EscbaseRender.clearElement(grid);
    shown.forEach((video) => {
      grid.appendChild(EscbaseRender.createBentoVideoCard(video, { fade: true }));
    });
    grid.querySelectorAll('.bento-item').forEach(el => observer.observe(el));
  }

  try {
    const response = await fetch(`/api/youtube-feed?t=${Date.now()}`, { cache: 'no-store' });
    const data = await response.json();
    if (!data.videos || !data.videos.length) throw new Error('No feed items');
    renderVideos(data.videos);
  } catch (err) {
    fetch('/videos-feed.json')
      .then(r => r.json())
      .then(renderVideos)
      .catch(() => {
        EscbaseRender.appendMessage(grid, 'Không thể tải video.');
      });
  }
}

loadHomepageVideos();

const onlineBadge = document.getElementById('liveReadersBadge');
const onlineCount = document.getElementById('liveReadersCount');
const ONLINE_VISITOR_KEY = 'escbase_live_visitor_id';
const ONLINE_HEARTBEAT_MS = 15000;
let onlineHeartbeatTimer = null;
let onlineVisibilityTimer = null;

function getOnlineVisitorId() {
  try {
    let visitorId = localStorage.getItem(ONLINE_VISITOR_KEY);
    if (!visitorId) {
      visitorId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem(ONLINE_VISITOR_KEY, visitorId);
    }
    return visitorId;
  } catch (_) {
    return `anon-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }
}

async function sendOnlinePresence(action = 'ping', useBeacon = false) {
  const url = `/api/online-now?visitorId=${encodeURIComponent(getOnlineVisitorId())}&path=${encodeURIComponent(location.pathname)}&action=${encodeURIComponent(action)}`;

  if (useBeacon && navigator.sendBeacon) {
    navigator.sendBeacon(url);
    return null;
  }

  const response = await fetch(url, {
    cache: 'no-store',
    keepalive: action === 'leave'
  });
  return response.json();
}

async function updateOnlineReaders() {
  if (!onlineBadge || !onlineCount) return;

  try {
    const data = await sendOnlinePresence('ping');
    const count = Number.isFinite(data?.onlineNow) ? data.onlineNow : null;

    if (count == null) throw new Error('invalid_online_count');

    onlineCount.textContent = new Intl.NumberFormat('vi-VN').format(count);
    onlineBadge.title = `Đang hoạt động trong khoảng ${data?.windowSeconds || 120} giây gần đây`;
  } catch (_) {
    onlineCount.textContent = '--';
    onlineBadge.title = 'Chưa lấy được dữ liệu online lúc này';
  }
}

function clearOnlineTimers() {
  if (onlineHeartbeatTimer) clearInterval(onlineHeartbeatTimer);
  if (onlineVisibilityTimer) clearTimeout(onlineVisibilityTimer);
}

function startOnlineHeartbeat() {
  clearOnlineTimers();
  updateOnlineReaders();
  onlineHeartbeatTimer = setInterval(updateOnlineReaders, ONLINE_HEARTBEAT_MS);
}

async function handlePageLeave() {
  clearOnlineTimers();
  try {
    await sendOnlinePresence('leave', true);
  } catch (_) {}
}

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    handlePageLeave();
  } else {
    startOnlineHeartbeat();
  }
});

window.addEventListener('pagehide', handlePageLeave);
window.addEventListener('beforeunload', handlePageLeave);

startOnlineHeartbeat();
