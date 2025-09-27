/**
 * App Enhancements:
 * - IntersectionObserver reveal
 * - Active navigation highlighting on scroll
 * - requestIdleCallback usage for non-critical tasks
 */

(function () {
    const revealEls = document.querySelectorAll('.reveal');
    const navLinks = document.querySelectorAll('[data-nav]');
    const sections = document.querySelectorAll('section[id]');
    let scrollTicking = false;

    /* =========================
       Intersection Observer
    ============================ */
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -80px 0px' });

        revealEls.forEach(el => io.observe(el));
    } else {
        // Fallback (no IO support)
        revealEls.forEach(el => el.classList.add('visible'));
    }

    /* =========================
       Nav Active Link on Scroll
    ============================ */
    function updateNav() {
        let current = '';
        const scrollPos = window.pageYOffset;
        sections.forEach(section => {
            const offset = section.offsetTop - 140;
            const height = section.offsetHeight;
            if (scrollPos >= offset && scrollPos < offset + height) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            const match = link.getAttribute('href').substring(1) === current;
            link.classList.toggle('is-active', match);
            if (match) {
                link.setAttribute('aria-current', 'true');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    }

    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            window.requestAnimationFrame(() => {
                updateNav();
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }, { passive: true });

    updateNav();

    /* =========================
       Deferred / Idle Tasks
    ============================ */
    function runIdle() {
        // Example: future analytics hook or resource prefetch
        // console.log('Idle tasks executed.');
    }
    if ('requestIdleCallback' in window) {
        requestIdleCallback(runIdle, { timeout: 2000 });
    } else {
        setTimeout(runIdle, 1200);
    }
})();

(function () {
    const cards = document.querySelectorAll('.media-card');
    const lb = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightboxImg');
    const lbCaption = document.getElementById('lightboxCaption');
    const closeBtn = lb.querySelector('[data-close]');

    function openLightbox(imgEl, captionEl) {
        lbImg.src = imgEl.getAttribute('src');
        lbImg.alt = imgEl.getAttribute('alt') || 'Screenshot';
        lbCaption.textContent = captionEl ? captionEl.textContent : '';
        lb.classList.add('is-open');
        lb.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        closeBtn.focus();
    }

    function closeLightbox() {
        lb.classList.remove('is-open');
        lb.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        // Odak geri dönsün
        if (lastTrigger) lastTrigger.focus();
    }

    let lastTrigger = null;

    cards.forEach(card => {
        card.addEventListener('click', e => {
            // sadece kendi içinde tetiklensin
            const img = card.querySelector('img');
            const cap = card.querySelector('.media-card__caption');
            lastTrigger = card;
            openLightbox(img, cap);
        });
        // Klavye ile erişilebilirlik
        card.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const img = card.querySelector('img');
                const cap = card.querySelector('.media-card__caption');
                lastTrigger = card;
                openLightbox(img, cap);
            }
        });
    });

    closeBtn.addEventListener('click', closeLightbox);
    lb.addEventListener('click', e => {
        if (e.target === lb) {
            closeLightbox();
        }
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && lb.classList.contains('is-open')) {
            closeLightbox();
        }
    });
})();