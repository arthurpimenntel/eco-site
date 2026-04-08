/* ============================================
   NAVEGAÇÃO ENTRE PÁGINAS
============================================ */
function showPage(pageId) {
  const lightbox = document.getElementById("lightbox");
  if (lightbox.classList.contains("open")) {
    lightbox.classList.remove("open");
  }
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");
  document.body.classList.toggle("no-scroll", pageId === "home");
}

// trava o scroll já na abertura, pois a home começa ativa
document.body.classList.add("no-scroll");

/* ============================================
   MENU MOBILE
============================================ */
const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");

menuToggle.onclick = () => mobileMenu.classList.toggle("open");

function closeMobileMenu() {
  mobileMenu.classList.remove("open");
}

/* ============================================
   CONTAGEM REGRESSIVA
============================================ */
const eventDate = new Date("April 18, 2026 18:00:00").getTime();

setInterval(() => {
  const now  = new Date().getTime();
  const diff = eventDate - now;

  if (diff <= 0) {
    document.getElementById("countdown").innerHTML =
      "<span style='color:var(--green);font-family:Orbitron,sans-serif;font-size:1.2rem;letter-spacing:0.1em'>O FESTIVAL COMEÇA HOJE! 🌿</span>";
    return;
  }

  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById("cd-days").textContent  = String(d).padStart(2, "0");
  document.getElementById("cd-hours").textContent = String(h).padStart(2, "0");
  document.getElementById("cd-mins").textContent  = String(m).padStart(2, "0");
  document.getElementById("cd-secs").textContent  = String(s).padStart(2, "0");
}, 1000);

/* ============================================
   FUNDO DE VÍDEO — início aleatório
============================================ */
document.addEventListener("DOMContentLoaded", () => {

  const video1 = document.getElementById("bg-video-1");
  const video2 = document.getElementById("bg-video-2");

  if (!video1 || !video2) return;

  const isMobile = window.innerWidth <= 680;

  const videosMobile = [
    { url: "https://res.cloudinary.com/dxnxytrkc/video/upload/v1774578883/celular1_n0kcp3.mp4", start: 6,  end: 14 },
    { url: "https://res.cloudinary.com/dxnxytrkc/video/upload/v1774578891/celular2_xg4rhq.mp4", start: 22, end: 30 },
    { url: "https://res.cloudinary.com/dxnxytrkc/video/upload/v1774578895/celular3_w4hcez.mp4", start: 28, end: 36 },
    { url: "https://res.cloudinary.com/dxnxytrkc/video/upload/v1774578919/celular4_br5dtm.mp4", start: 10, end: 18 }
  ];

  const videosDesktop = [
    { url: "https://res.cloudinary.com/dxnxytrkc/video/upload/v1774578949/computador1_romcac.mp4", start: 0,  end: 8  },
    { url: "https://res.cloudinary.com/dxnxytrkc/video/upload/v1774578963/computador2_hf6j30.mp4", start: 5,  end: 13 },
    { url: "https://res.cloudinary.com/dxnxytrkc/video/upload/v1774578966/computador3_jgintj.mp4", start: 6,  end: 14 },
    { url: "https://res.cloudinary.com/dxnxytrkc/video/upload/v1774578975/computador4_xq731e.mp4", start: 8,  end: 16 },
    { url: "https://res.cloudinary.com/dxnxytrkc/video/upload/v1774578991/computador5_fkbjks.mp4", start: 7,  end: 15 },
    { url: "https://res.cloudinary.com/dxnxytrkc/video/upload/v1774578984/computador6_dievem.mp4", start: 12, end: 20 }
  ];

  const videoPlaylist = isMobile ? videosMobile : videosDesktop;

  // ✅ CORREÇÃO: início aleatório
  let videoIndex = Math.floor(Math.random() * videoPlaylist.length);
  let active = video1;
  let next   = video2;
  let timer  = null;

  function playVideo(index) {
    const { url, start, end } = videoPlaylist[index];

    next.src = url;
    next.load();

    next.onloadedmetadata = () => {
      next.currentTime  = start;
      next.playbackRate = 0.7;
      next.play().catch(() => {});
      next.classList.add("visible");
      active.classList.remove("visible");

      [active, next] = [next, active];

      if (timer) clearInterval(timer);

      timer = setInterval(() => {
        if (active.currentTime >= end) {
          videoIndex = (videoIndex + 1) % videoPlaylist.length;
          playVideo(videoIndex);
        }
      }, 200);
    };

    // fallback para Android que às vezes não dispara onloadedmetadata
    setTimeout(() => {
      if (active.classList.contains("visible") && active.src !== url) {
        next.currentTime  = start;
        next.playbackRate = 0.7;
        next.play().catch(() => {});
        next.classList.add("visible");
        active.classList.remove("visible");
        [active, next] = [next, active];
      }
    }, 3000);
  }

  playVideo(videoIndex);
});

/* ============================================
   PARTÍCULAS
   ✅ CORREÇÃO: usa sempre window.innerWidth/Height
   (evita bug com scrollHeight dentro de iframe
   ou após navegação entre páginas internas)
============================================ */
const canvas = document.getElementById("particles");
const ctx    = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  // Reposiciona partículas que ficaram fora dos novos limites
  particles.forEach(p => {
    if (p.x > canvas.width)  p.x = Math.random() * canvas.width;
    if (p.y > canvas.height) p.y = Math.random() * canvas.height;
  });
}

const particles = Array.from({ length: 80 }, () => ({
  x:      Math.random() * window.innerWidth,
  y:      Math.random() * window.innerHeight,
  size:   Math.random() * 2.2 + 0.4,
  speedX: (Math.random() - 0.5) * 0.45,
  speedY: (Math.random() - 0.5) * 0.45,
  alpha:  Math.random() * 0.55 + 0.15
}));

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.x += p.speedX;
    p.y += p.speedY;
    if (p.x < 0 || p.x > canvas.width)  p.speedX *= -1;
    if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
    ctx.fillStyle = `rgba(184, 255, 0, ${p.alpha})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ============================================
   PLAYER DE MÚSICA
   ✅ CORREÇÕES:
   - updateButton movida para escopo global
   - botões anterior/próximo adicionados
   - nome da track exibido na tela
============================================ */

// ✅ Nomes das tracks — edite conforme suas músicas
// Formato: "Artista - Nome da faixa"
const trackNames = [
  "Electric Universe - Psychedelic Traveller",
  "Faders & Electric Universe - Calling For Peace",
  "Electric Universe - Mantra",
  "Electric Universe & Ace Ventura - Ancient Aum",
  "Electric Universe - Bansuri",
  "Avalon & Electric Universe - Plant Medicine ",
  "Electric Universe & Greg Hilight - Om Namah Shivaya",
  "Electric Universe - Lakshmi",
  "Alpha Portal & Burn In Noise - Omnia",
  "Raul Seixas - Como Vovó Já Dizia (Vegas & Burn in Noise RMX)"
];

const musicPlaylist = [
  "https://res.cloudinary.com/dxnxytrkc/video/upload/v1774485545/track1_tyro94.mp3",
  "https://res.cloudinary.com/dxnxytrkc/video/upload/v1774485547/track2_qhbksp.mp3",
  "https://res.cloudinary.com/dxnxytrkc/video/upload/v1774485552/track4_xskryp.mp3",
  "https://res.cloudinary.com/dxnxytrkc/video/upload/v1774485549/track6_db06dq.mp3",
  "https://res.cloudinary.com/dxnxytrkc/video/upload/v1774485552/track5_xbfxmv.mp3",
  "https://res.cloudinary.com/dxnxytrkc/video/upload/v1774485554/track7_dnhirt.mp3",
  "https://res.cloudinary.com/dxnxytrkc/video/upload/v1774485553/track3_hqs7rn.mp3",
  "https://res.cloudinary.com/dxnxytrkc/video/upload/v1774485555/track8_gmrwri.mp3",
  "https://res.cloudinary.com/dxnxytrkc/video/upload/v1774485587/track9_zkwson.mp3",
  "https://res.cloudinary.com/dxnxytrkc/video/upload/v1774485589/track10_afdfub.mp3"
];

const audio      = document.getElementById("audio-player");
const btn        = document.getElementById("playButton");
const btnPrev    = document.getElementById("btn-prev");
const btnNext    = document.getElementById("btn-next");
const trackLabel = document.getElementById("track-label");

let trackIndex = Math.floor(Math.random() * musicPlaylist.length);

// ✅ updateButton agora está no escopo global — funciona em todos os contextos
function updateButton(isPlaying) {
  btn.textContent = isPlaying ? "⏸" : "▶";
}

function updateTrackLabel() {
  if (trackLabel) {
    trackLabel.innerHTML = `<span>${trackNames[trackIndex] || ""}</span>`;
  }
}

function loadTrack(index) {
  audio.src = musicPlaylist[index];
  audio.play().catch(() => {});
  updateButton(true);
  updateTrackLabel();
}

// Quando termina, toca aleatória diferente
audio.addEventListener("ended", () => {
  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * musicPlaylist.length);
  } while (newIndex === trackIndex && musicPlaylist.length > 1);
  trackIndex = newIndex;
  loadTrack(trackIndex);
});

// Play / Pause
btn.onclick = () => {
  if (audio.paused) {
    if (audio.src) {
      audio.play().catch(() => {});
    } else {
      loadTrack(trackIndex);
    }
    updateButton(true);
  } else {
    audio.pause();
    updateButton(false);
  }
};

// ✅ Botão próximo
if (btnNext) {
  btnNext.onclick = () => {
    trackIndex = (trackIndex + 1) % musicPlaylist.length;
    loadTrack(trackIndex);
  };
}

// ✅ Botão anterior
if (btnPrev) {
  btnPrev.onclick = () => {
    trackIndex = (trackIndex - 1 + musicPlaylist.length) % musicPlaylist.length;
    loadTrack(trackIndex);
  };
}

/* ============================================
   LIGHTBOX DA GALERIA
============================================ */
const images      = document.querySelectorAll(".gallery-item img");
let   currentIndex = 0;
const lightbox     = document.getElementById("lightbox");
const lightboxImg  = document.getElementById("lightbox-img");

images.forEach((img, index) => {
  img.addEventListener("click", () => {
    currentIndex   = index;
    lightboxImg.src = img.src;
    lightbox.classList.add("open");
  });
});

function closeLightbox() {
  lightbox.classList.remove("open");
}

lightbox.addEventListener("click", function(e) {
  if (e.target === this) closeLightbox();
});

document.querySelector(".next").onclick = () => {
  currentIndex    = (currentIndex + 1) % images.length;
  lightboxImg.src = images[currentIndex].src;
};

document.querySelector(".prev").onclick = () => {
  currentIndex    = (currentIndex - 1 + images.length) % images.length;
  lightboxImg.src = images[currentIndex].src;
};

document.addEventListener("keydown", e => {
  if (!lightbox.classList.contains("open")) return;
  if (e.key === "ArrowRight") document.querySelector(".next").click();
  if (e.key === "ArrowLeft")  document.querySelector(".prev").click();
  if (e.key === "Escape")     closeLightbox();
});


let startY = 0;
let startX = 0;

document.addEventListener("touchstart", e => {
  startY = e.touches[0].clientY;
  startX = e.touches[0].clientX;
});

document.addEventListener("touchend", e => {
  const endY = e.changedTouches[0].clientY;
  const endX = e.changedTouches[0].clientX;
  const diffY = endY - startY;
  const diffX = endX - startX;

  // Reload ao puxar pra baixo na home (mantém o comportamento original)
  if (diffY > 120 && Math.abs(diffX) < 40 && window.scrollY === 0) {
    location.reload();
  }

  // Swipe no lightbox: só age se o lightbox estiver aberto
  if (lightbox.classList.contains("open")) {
    // Swipe horizontal maior que 50px e mais horizontal que vertical
    if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX < 0) {
        // deslizou para a esquerda = próxima foto
        currentIndex = (currentIndex + 1) % images.length;
      } else {
        // deslizou para a direita = foto anterior
        currentIndex = (currentIndex - 1 + images.length) % images.length;
      }
      lightboxImg.src = images[currentIndex].src;
    }
  }
});
