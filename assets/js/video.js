(function() {
    const videos = [
        'videos/scene_01_aerial_city.mp4',
        'videos/scene_02_hub_center.mp4',
        'videos/scene_03_agents_activities.mp4',
        'videos/scene_04_arts_music.mp4',
        'videos/scene_05_friendship_bonds.mp4',
    ];
    let currentIdx = 0;
    let activePlayer = 0; // 0 → #bgvid1, 1 → #bgvid2

    const v1 = document.getElementById('bgvid1');
    const v2 = document.getElementById('bgvid2');

    function playNext() {
        const nextSrc = videos[currentIdx % videos.length];
        const player = activePlayer === 0 ? v1 : v2;
        const other = activePlayer === 0 ? v2 : v1;

        player.src = nextSrc;
        player.currentTime = 0;
        player.classList.remove('active', 'fade-out');
        other.classList.remove('active');
        other.classList.add('fade-out');

        player.play().catch(() => {});

        void player.offsetWidth;
        player.classList.add('active');

        player.onended = function() {
            currentIdx++;
            activePlayer = activePlayer === 0 ? 1 : 0;
            playNext();
        };

        currentIdx++;
    }

    v1.src = videos[0];
    v1.currentTime = 0;
    v1.classList.add('active');
    v1.play().catch(() => {});

    v1.onended = function() {
        currentIdx = 1;
        activePlayer = 1;
        playNext();
    };
})();
