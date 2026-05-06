(function () {
    const navLinks = document.getElementById('nav-links');
    if (!navLinks) return;

    fetch('./assets/html/nav.inc', { cache: 'no-store' })
        .then(function (r) { return r.text(); })
        .then(function (html) { navLinks.innerHTML = html; })
        .catch(function () {});
})();
