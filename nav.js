/* Pathway — shared client behaviors
   ------------------------------------------------------------------
   1. Mobile nav drawer open/close (supports the .nav-drawer pattern
      OR the older .mobile-nav pattern, so it works on every page).
   2. Scroll-reveal: any element with .reveal fades in once it enters
      the viewport.
   3. Number counter: any .counter[data-count="N"] animates from 0 → N
      the first time it scrolls into view.
   ------------------------------------------------------------------ */

(function () {
  // ---------- Mobile nav ----------
  const toggle = document.getElementById('navToggle');
  const drawer = document.getElementById('navDrawer');
  const backdrop = document.getElementById('navBackdrop');
  const closeBtn = document.getElementById('navClose');
  const olderMobileNav = document.getElementById('mobileNav');

  function openDrawer() {
    if (drawer) {
      drawer.classList.add('open');
      document.body.style.overflow = 'hidden';
    } else if (olderMobileNav) {
      olderMobileNav.classList.add('open');
      toggle && toggle.classList.add('open');
    }
  }
  function closeDrawer() {
    if (drawer) {
      drawer.classList.remove('open');
      document.body.style.overflow = '';
    } else if (olderMobileNav) {
      olderMobileNav.classList.remove('open');
      toggle && toggle.classList.remove('open');
    }
  }

  if (toggle) {
    toggle.addEventListener('click', () => {
      const isOpen = (drawer && drawer.classList.contains('open')) ||
                     (olderMobileNav && olderMobileNav.classList.contains('open'));
      isOpen ? closeDrawer() : openDrawer();
    });
  }
  closeBtn && closeBtn.addEventListener('click', closeDrawer);
  backdrop && backdrop.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDrawer(); });

  // ---------- Scroll reveal ----------
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in-view'));
  }

  // ---------- Number counter ----------
  const counterEls = document.querySelectorAll('.counter[data-count]');
  if (counterEls.length && 'IntersectionObserver' in window) {
    const co = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const decimals = parseInt(el.dataset.decimals || '0', 10);
        const duration = parseInt(el.dataset.duration || '1400', 10);
        const startTime = performance.now();

        function tick(now) {
          const elapsed = now - startTime;
          const t = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
          const value = target * eased;
          el.textContent = formatNumber(value, decimals) + suffix;
          if (t < 1) requestAnimationFrame(tick);
          else el.textContent = formatNumber(target, decimals) + suffix;
        }
        requestAnimationFrame(tick);
        co.unobserve(el);
      });
    }, { threshold: 0.4 });
    counterEls.forEach((el) => co.observe(el));
  }

  function formatNumber(n, decimals) {
    if (decimals > 0) return n.toFixed(decimals);
    // Add thousands separators for ints
    return Math.round(n).toLocaleString('en-US');
  }
})();
