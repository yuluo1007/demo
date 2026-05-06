(function () {
    var ids = ['group-frameworks', 'group-intelligence', 'group-playgrounds', 'group-devtools'];
    var btns = [], targets = [];

    ids.forEach(function (id) {
        var btn = document.querySelector('[data-target="' + id + '"]');
        var el = document.getElementById(id);
        btns.push(btn);
        targets.push(el);
        if (btn && el) {
            btn.addEventListener('click', function (e) {
                if (e.target.closest && e.target.closest('.group-nav-menu')) return;
                var top = el.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({ top: top, behavior: 'smooth' });
            });
        }
    });

    function update() {
        var threshold = 140;
        var active = -1;
        targets.forEach(function (el, i) {
            if (el && el.getBoundingClientRect().top <= threshold) active = i;
        });
        btns.forEach(function (btn, i) {
            if (btn) btn.classList.toggle('active', i === active);
        });
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
})();
