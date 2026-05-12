(function () {
  const page = document.body.dataset.page || (location.pathname.startsWith('/blog') ? 'blog' : location.pathname.startsWith('/videos') ? 'videos' : 'home');
  const path = location.pathname.replace(/\/$/, '') || '/';

  const navItems = [
    { href: '/', label: 'Trang chủ', icon: 'fas fa-home', key: 'home' },
    { href: '/blog', label: 'Bài viết', icon: 'fas fa-newspaper', key: 'blog' },
    { href: '/videos', label: 'Video', icon: 'fas fa-play-circle', key: 'videos' },
    { href: 'https://shop.escbase.xyz/', label: 'Shop', icon: 'fas fa-bag-shopping', key: 'shop', external: true },
  ];

  const socials = [
    { href: 'https://www.youtube.com/@ESCBase', label: 'YouTube', icon: 'fab fa-youtube' },
    { href: 'https://discord.gg/SMhy8RjDCf', label: 'Discord', icon: 'fab fa-discord' },
    { href: 'https://x.com/escbasexyz', label: 'X (Twitter)', icon: 'fa-brands fa-x-twitter' },
    { href: 'https://t.me/escbase', label: 'Telegram', icon: 'fab fa-telegram' },
  ];

  function isActive(item) {
    if (item.external) return false;
    if (item.key === 'home') return path === '' || path === '/';
    return path === item.href || path.startsWith(item.href + '/');
  }

  function navLink(item, mobile) {
    const cls = mobile ? 'nav-item' : 'nav-item';
    const targetHref = page === 'home' && item.key === 'blog'
      ? '#latest-posts'
      : page === 'home' && item.key === 'videos'
        ? '#latest-videos'
        : item.href;
    const active = isActive(item) ? ' active' : '';
    const click = mobile ? ' onclick="toggleMobileNav()"' : '';
    const extra = item.external ? ' target="_blank" rel="noopener noreferrer"' : '';
    return `<a href="${targetHref}" class="${cls}${active}"${click}${extra}><i class="${item.icon}"></i> ${item.label}</a>`;
  }

  function socialLink(item) {
    return `<a href="${item.href}" target="_blank" rel="noopener noreferrer" class="social-btn" title="${item.label}" aria-label="${item.label}"><i class="${item.icon}"></i></a>`;
  }

  function secureBlankTargets(root = document) {
    root.querySelectorAll('a[target="_blank"]').forEach((anchor) => {
      const rel = new Set((anchor.getAttribute('rel') || '').split(/\s+/).filter(Boolean));
      rel.add('noopener');
      rel.add('noreferrer');
      anchor.setAttribute('rel', [...rel].join(' '));
    });
  }

  function watchBlankTargets() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType !== Node.ELEMENT_NODE) return;
          if (node.matches?.('a[target="_blank"]')) secureBlankTargets(node.parentElement || document);
          secureBlankTargets(node);
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  function renderMobileHeader() {
    const el = document.querySelector('.mobile-header');
    if (!el) return;
    el.innerHTML = `
      <a href="/" class="mobile-logo">
        <img src="/esclogo.png" alt="Escbase - Trang phân tích Crypto hàng ngày">
        <span>Escbase</span>
      </a>
      <button class="hamburger" onclick="toggleMobileNav()" aria-label="Mở menu điều hướng">
        <span></span>
        <span></span>
        <span></span>
      </button>
    `;
  }

  function renderMobileNav() {
    const el = document.getElementById('mobileNav');
    if (!el) return;
    el.className = 'mobile-nav';
    el.innerHTML = `
      ${navItems.map((item) => navLink(item, true)).join('')}
      <div class="social-links">
        ${socials.map(socialLink).join('')}
      </div>
    `;
  }

  function renderSidebar() {
    const el = document.querySelector('.sidebar');
    if (!el) return;
    el.innerHTML = `
      <a href="/" class="brand">
        <img src="/esclogo.png" alt="Escbase - Trang phân tích Crypto và Blockchain hàng ngày">
        <div class="brand-info">
          <h1>Escbase</h1>
          <p>Crypto Intelligence</p>
        </div>
      </a>

      <p class="bio">
        Báo cáo thị trường crypto hằng ngày, phân tích blockchain, AI và những chuyển động đáng chú ý của thị trường.
      </p>

      <nav class="nav-menu">
        ${navItems.map((item) => `<div>${navLink(item, false)}</div>`).join('')}
      </nav>

      <div class="social-links">
        ${socials.map(socialLink).join('')}
      </div>
    `;
  }

  function renderFooter() {
    let footer = document.querySelector('.site-footer');
    const main = document.querySelector('.main-content');
    if (!main) return;
    if (!footer) {
      footer = document.createElement('footer');
      footer.className = 'site-footer';
      main.appendChild(footer);
    }
    footer.innerHTML = `
      <div class="footer-copy">
        <p>© 2026 Escbase. Phân tích crypto, blockchain và AI theo kiểu ngắn gọn, dễ đọc.</p>
        <span class="footer-note">Theo dõi Escbase trên YouTube, Discord, X và Telegram.</span>
      </div>
      <div class="social-links footer-socials">
        ${socials.map(socialLink).join('')}
      </div>
    `;
  }

  window.toggleMobileNav = function toggleMobileNav() {
    const mobileNav = document.getElementById('mobileNav');
    const hamburger = document.querySelector('.hamburger');
    if (mobileNav) mobileNav.classList.toggle('open');
    if (hamburger) hamburger.classList.toggle('active');
  };

  document.addEventListener('DOMContentLoaded', () => {
    renderMobileHeader();
    renderMobileNav();
    renderSidebar();
    renderFooter();
    secureBlankTargets();
    watchBlankTargets();
  });
})();
