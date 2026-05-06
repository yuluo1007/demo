(async function renderContributors() {
    const wall = document.getElementById('contributor-wall');
    const meta = document.getElementById('contributor-meta');
    if (!wall) return;
    try {
        const res = await fetch('data/contributors.json', { cache: 'no-store' });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const all = await res.json();

        const arr = all.slice();
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        const sample = arr.slice(0, Math.min(72, arr.length));

        const frag = document.createDocumentFragment();
        for (const p of sample) {
            const a = document.createElement('a');
            a.href = p.html_url;
            a.target = '_blank';
            a.rel = 'noopener';
            a.title = p.login + ' · ' + p.contributions + ' contributions across ' + p.repos.length + ' repo' + (p.repos.length === 1 ? '' : 's');
            const img = document.createElement('img');
            const sep = p.avatar_url.includes('?') ? '&' : '?';
            img.src = p.avatar_url + sep + 's=128';
            img.alt = p.login;
            img.loading = 'lazy';
            img.decoding = 'async';
            a.appendChild(img);
            frag.appendChild(a);
        }
        wall.replaceChildren(frag);
        meta.innerHTML = 'Showing ' + sample.length + ' of <strong>' + all.length + '</strong> contributors across the AgentScope ecosystem. Want to be on this wall? <a href="#contribute">See how to contribute →</a>';
    } catch (err) {
        meta.textContent = 'Could not load contributors (' + err.message + ').';
    }
})();
