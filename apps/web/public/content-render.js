(function () {
  const DEFAULT_TAG_COLOR = '#f7931a';

  function normalizeHexColor(value, fallback = DEFAULT_TAG_COLOR) {
    const raw = String(value || '').trim();
    const short = raw.match(/^#([0-9a-f]{3})$/i);
    if (short) {
      return `#${short[1].split('').map((char) => char + char).join('')}`;
    }
    if (/^#[0-9a-f]{6}$/i.test(raw)) return raw;
    return fallback;
  }

  function colorWithAlpha(value, alpha) {
    return `${normalizeHexColor(value)}${alpha}`;
  }

  function safeClassName(value, fallback = '') {
    const className = String(value || fallback)
      .split(/\s+/)
      .filter((part) => /^[a-z0-9_-]+$/i.test(part))
      .join(' ')
      .trim();
    return className || fallback;
  }

  function safeToken(value, fallback = 'item') {
    return String(value || fallback).replace(/[^a-z0-9_-]/gi, '') || fallback;
  }

  function safeUrl(value, fallback = '#') {
    const raw = String(value || '').trim();
    if (!raw) return fallback;
    if (raw.startsWith('/') && !raw.startsWith('//')) return raw;

    try {
      const url = new URL(raw, window.location.origin);
      if (url.protocol === 'http:' || url.protocol === 'https:') return url.href;
    } catch (_) {}

    return fallback;
  }

  function clearElement(element) {
    while (element.firstChild) element.removeChild(element.firstChild);
  }

  function appendText(parent, tagName, text, className) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    element.textContent = text || '';
    parent.appendChild(element);
    return element;
  }

  function createIcon(className, fallback) {
    const icon = document.createElement('i');
    icon.className = safeClassName(className, fallback);
    return icon;
  }

  function appendMessage(container, text, className = 'coin-loading') {
    clearElement(container);
    const message = document.createElement('div');
    message.className = className;
    message.textContent = text;
    container.appendChild(message);
  }

  function createCardThumb(image, title) {
    const thumb = document.createElement('div');
    thumb.className = 'card-thumb';

    if (image) {
      const img = document.createElement('img');
      img.src = safeUrl(image, '/og-default.png');
      img.alt = title || '';
      img.loading = 'lazy';
      thumb.appendChild(img);
      return thumb;
    }

    const placeholder = document.createElement('div');
    placeholder.className = 'card-thumb-placeholder';
    placeholder.appendChild(createIcon('fas fa-newspaper', 'fas fa-newspaper'));
    thumb.appendChild(placeholder);
    return thumb;
  }

  function createTagChip({ label, icon, color, forceSolid = false }) {
    const safeColor = normalizeHexColor(color);
    const tag = document.createElement('span');
    tag.className = 'card-tag';

    if (forceSolid) {
      tag.style.background = safeColor;
      tag.style.color = '#fff';
    } else {
      tag.style.color = safeColor;
      tag.style.borderColor = colorWithAlpha(safeColor, '33');
      tag.style.background = colorWithAlpha(safeColor, '1a');
    }

    tag.appendChild(createIcon(icon, 'fas fa-newspaper'));
    tag.appendChild(document.createTextNode(` ${label || 'Bài viết'}`));
    return tag;
  }

  function createPostCard(post, options = {}) {
    const card = document.createElement('a');
    card.href = safeUrl(post?.url);
    card.className = `bento-item col-4${options.fade ? ' fade-in' : ''}`;

    card.appendChild(createCardThumb(post?.image, post?.title));

    const meta = document.createElement('div');
    meta.className = 'card-meta';
    meta.appendChild(createTagChip({
      label: post?.tag,
      icon: post?.tagIcon,
      color: post?.tagColor,
      forceSolid: post?.tag === 'AI',
    }));
    appendText(meta, 'span', post?.date || '', 'card-date');
    card.appendChild(meta);

    appendText(card, 'h3', post?.title || 'Không có tiêu đề', 'card-title');
    appendText(card, 'p', post?.excerpt || '', 'card-excerpt');

    const footer = document.createElement('div');
    footer.className = 'card-footer';
    const readTime = document.createElement('span');
    readTime.className = 'read-time';
    readTime.appendChild(createIcon('far fa-clock', 'far fa-clock'));
    readTime.appendChild(document.createTextNode(` ${post?.readTime || ''}`));
    footer.appendChild(readTime);

    if (options.showArrow) {
      const arrow = document.createElement('span');
      arrow.style.marginLeft = 'auto';
      arrow.style.color = 'var(--text)';
      arrow.appendChild(createIcon('fas fa-arrow-right', 'fas fa-arrow-right'));
      footer.appendChild(arrow);
    }

    card.appendChild(footer);
    return card;
  }

  function createBentoVideoCard(video, options = {}) {
    const card = document.createElement('a');
    card.href = safeUrl(video?.url);
    card.target = '_blank';
    card.rel = 'noopener noreferrer';
    card.className = `bento-item col-4${options.fade ? ' fade-in' : ''}`;

    const thumb = document.createElement('div');
    thumb.style.aspectRatio = '16/9';
    thumb.style.overflow = 'hidden';
    thumb.style.borderRadius = '12px';
    thumb.style.marginBottom = '1rem';
    thumb.style.background = '#111';
    thumb.style.border = '1px solid var(--border)';

    const img = document.createElement('img');
    img.src = safeUrl(video?.thumb, '/og-default.png');
    img.alt = video?.title || '';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    img.style.display = 'block';
    thumb.appendChild(img);
    card.appendChild(thumb);

    const meta = document.createElement('div');
    meta.className = 'card-meta';
    const tag = document.createElement('span');
    tag.className = 'card-tag';
    tag.style.background = 'rgba(239, 68, 68, 0.12)';
    tag.style.color = '#ef4444';
    tag.style.borderColor = 'rgba(239, 68, 68, 0.24)';
    tag.appendChild(createIcon('fab fa-youtube', 'fab fa-youtube'));
    tag.appendChild(document.createTextNode(' YouTube'));
    meta.appendChild(tag);
    appendText(meta, 'span', video?.published || '', 'card-date');
    card.appendChild(meta);

    appendText(card, 'h3', video?.title || 'Video Escbase', 'card-title');
    appendText(card, 'p', 'Video mới nhất từ kênh Escbase trên YouTube.', 'card-excerpt');
    return card;
  }

  function createVideoLinkCard(video) {
    const card = document.createElement('a');
    card.className = 'video-link-card';
    card.href = safeUrl(video?.url);
    card.target = '_blank';
    card.rel = 'noopener noreferrer';

    const thumb = document.createElement('div');
    thumb.className = 'video-thumb';
    const img = document.createElement('img');
    img.src = safeUrl(video?.thumb, '/og-default.png');
    img.alt = video?.title || '';
    thumb.appendChild(img);
    card.appendChild(thumb);

    const info = document.createElement('div');
    info.className = 'video-info';
    appendText(info, 'h3', video?.title || 'Video Escbase');

    const meta = document.createElement('div');
    meta.className = 'meta';
    appendText(meta, 'span', 'Escbase');
    appendText(meta, 'span', video?.published || '');
    info.appendChild(meta);
    card.appendChild(info);
    return card;
  }

  function createCoinCard(coin) {
    const symbol = safeToken(coin?.symbol, 'coin');
    const card = document.createElement('article');
    card.className = `coin-card coin-${symbol.toLowerCase()}`;

    const icon = appendText(card, 'span', coin?.icon || '•', 'coin-icon');
    icon.style.setProperty('--coin-color', normalizeHexColor(coin?.color, '#fafafa'));

    const main = document.createElement('div');
    main.className = 'coin-main';
    appendText(main, 'span', symbol.toUpperCase(), 'coin-symbol');
    appendText(main, 'span', coin?.priceFormatted || 'N/A', 'coin-price');
    card.appendChild(main);

    const change = appendText(card, 'span', coin?.change24hFormatted || '0.00%', 'coin-change');
    change.classList.add((coin?.change24h || 0) >= 0 ? 'is-up' : 'is-down');
    return card;
  }

  function renderCoins(grid, coins) {
    clearElement(grid);
    if (!Array.isArray(coins) || !coins.length) {
      appendMessage(grid, 'Không thể tải giá coin lúc này.');
      return;
    }

    const track = document.createElement('div');
    track.className = 'coin-track';
    for (let i = 0; i < 2; i += 1) {
      coins.forEach((coin) => track.appendChild(createCoinCard(coin)));
    }
    grid.appendChild(track);
  }

  window.EscbaseRender = {
    appendMessage,
    clearElement,
    createPostCard,
    createBentoVideoCard,
    createVideoLinkCard,
    renderCoins,
  };
})();
