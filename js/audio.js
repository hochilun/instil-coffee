const TRACKS = [
  { title: 'Café Ambiance I',   src: 'audio/cafe-01.mp3' },
  { title: 'Café Ambiance II',  src: 'audio/cafe-02.mp3' },
  { title: 'Café Ambiance III', src: 'audio/cafe-03.mp3' },
];

(function () {
  const audio     = document.getElementById('bgAudio');
  const player    = document.getElementById('musicPlayer');
  const toggleBtn = document.getElementById('musicToggle');
  const playBtn   = document.getElementById('musicPlayBtn');
  const prevBtn   = document.getElementById('musicPrev');
  const nextBtn   = document.getElementById('musicNext');
  const volSlider = document.getElementById('musicVol');
  const trackName = document.getElementById('musicTrackName');

  if (!audio || !player) return;

  let currentIdx = 0;
  let isPlaying  = false;

  const savedVol = parseFloat(localStorage.getItem('instil-music-vol') ?? '0.4');
  audio.volume   = savedVol;
  volSlider.value = savedVol;

  const ICON_PLAY  = `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>`;
  const ICON_PAUSE = `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`;

  function setPlaying(state) {
    isPlaying = state;
    playBtn.innerHTML = state ? ICON_PAUSE : ICON_PLAY;
    toggleBtn.classList.toggle('playing', state);
  }

  function loadTrack(idx) {
    currentIdx = (idx + TRACKS.length) % TRACKS.length;
    audio.src = TRACKS[currentIdx].src;
    trackName.textContent = TRACKS[currentIdx].title;
    if (isPlaying) audio.play().catch(() => {});
  }

  function togglePlay() {
    if (isPlaying) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  }

  loadTrack(0);

  toggleBtn.addEventListener('click', () => {
    const opened = player.classList.toggle('open');
    if (opened && !isPlaying) {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  });

  playBtn.addEventListener('click', togglePlay);

  prevBtn.addEventListener('click', () => {
    loadTrack(currentIdx - 1);
    if (!isPlaying) { audio.play().then(() => setPlaying(true)).catch(() => {}); }
  });

  nextBtn.addEventListener('click', () => {
    loadTrack(currentIdx + 1);
    if (!isPlaying) { audio.play().then(() => setPlaying(true)).catch(() => {}); }
  });

  audio.addEventListener('ended', () => {
    loadTrack(currentIdx + 1);
    audio.play().catch(() => {});
  });

  volSlider.addEventListener('input', () => {
    audio.volume = parseFloat(volSlider.value);
    localStorage.setItem('instil-music-vol', volSlider.value);
  });
})();
