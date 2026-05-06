(function() {
    const nav = document.getElementById('nav');
    if (!nav) return;
    const hasHero = !!document.querySelector('.hero-overlay');
    const update = () => {
        if (!hasHero || window.scrollY > 40) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
    };
    window.addEventListener('scroll', update, { passive: true });
    update();

    const toggle = nav.querySelector('.nav-toggle');
    if (toggle) {
        const setOpen = (open) => {
            nav.classList.toggle('open', open);
            toggle.setAttribute('aria-expanded', String(open));
        };
        toggle.addEventListener('click', () => setOpen(!nav.classList.contains('open')));
        nav.addEventListener('click', (e) => {
            if (e.target.closest('.nav-links a, .nav-links .nav-icon')) setOpen(false);
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && nav.classList.contains('open')) setOpen(false);
        });
    }
})();

(function() {
    const content = document.querySelector('.content');
    const hint = document.getElementById('scroll-hint');
    if (!content) return;

    let listening = false;

    function scrollToContent() {
        detach();
        content.scrollIntoView({ behavior: 'smooth' });
        if (hint) hint.style.opacity = '0';
    }

    function onKey(e) {
        if (['Shift', 'Control', 'Alt', 'Meta', 'Tab', 'CapsLock'].includes(e.key)) return;
        scrollToContent();
    }

    // Only trigger on downward wheel — avoids re-firing when scrolling back up
    function onWheel(e) {
        if (e.deltaY > 0) scrollToContent();
    }

    function attach() {
        if (listening) return;
        listening = true;
        if (hint) hint.style.opacity = '';
        document.addEventListener('keydown', onKey);
        document.addEventListener('mousedown', scrollToContent);
        document.addEventListener('wheel', onWheel, { passive: true });
        document.addEventListener('touchstart', scrollToContent, { passive: true });
    }

    function detach() {
        if (!listening) return;
        listening = false;
        document.removeEventListener('keydown', onKey);
        document.removeEventListener('mousedown', scrollToContent);
        document.removeEventListener('wheel', onWheel);
        document.removeEventListener('touchstart', scrollToContent);
    }

    // Attach when at top, detach when in content
    window.addEventListener('scroll', () => {
        if (window.scrollY < 10) attach();
        else detach();
    }, { passive: true });

    if (window.scrollY < 10) attach();
})();
