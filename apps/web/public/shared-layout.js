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

  function navHref(item) {
    if (page === 'home' && item.key === 'blog') return '#latest-posts';
    if (page === 'home' && item.key === 'videos') return '#latest-videos';
    return item.href;
  }

  function highlightActiveNav() {
    document.querySelectorAll('.nav-item').forEach((el) => {
      const href = el.getAttribute('href');
      if (!href) return;
      const item = navItems.find((n) => navHref(n) === href);
      if (item && isActive(item)) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });
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

  window.toggleMobileNav = function toggleMobileNav() {
    const mobileNav = document.getElementById('mobileNav');
    const hamburger = document.querySelector('.hamburger');
    if (mobileNav) mobileNav.classList.toggle('open');
    if (hamburger) hamburger.classList.toggle('active');
    document.body.style.overflow = (mobileNav && mobileNav.classList.contains('open')) ? 'hidden' : '';
  };

  document.addEventListener('DOMContentLoaded', () => {
    highlightActiveNav();
    secureBlankTargets();
    watchBlankTargets();
  });
})();
