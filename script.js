/* =============================================================
   PER VOI — Script principale
   GSAP · ScrollTrigger · Typed.js · Lenis · canvas-confetti
   ============================================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    console.error("GSAP o ScrollTrigger non sono stati caricati correttamente.");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ------------------------------------------------------------
     0. LENIS
     ------------------------------------------------------------ */
  const lenis =
      typeof Lenis !== "undefined"
          ? new Lenis({
            smooth: true,
            lerp: 0.08,
          })
          : null;

  if (lenis) {
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  /* ------------------------------------------------------------
     1. AUDIO
     ------------------------------------------------------------ */
  /* ------------------------------------------------------------
     1. AUDIO / MINI PLAYER
     ------------------------------------------------------------ */
  const audio        = document.getElementById("bgAudio");
  const audioToggle  = document.getElementById("audioToggle");
  const playPauseBtn = document.getElementById("playPauseBtn");
  const prevBtn      = document.getElementById("prevBtn");
  const nextBtn      = document.getElementById("nextBtn");
  const trackTitle   = document.getElementById("trackTitle");
  const playerProgress = document.getElementById("playerProgress");
  const miniPlayer   = document.getElementById("miniPlayer");

  const playlist = [
    { title: "E yo mamma",      src: "assets/audio/e_yo_mamma.mp3"    },
    { title: "Altrove",         src: "assets/audio/altrove.mp3"       },
    { title: "Lungo la strada", src: "assets/audio/lungo_la_strada.mp3" },
  ];

  let currentIndex = 0;
  let isPlaying = false;

  /* --- Toggle pannello: apri/chiudi con click sul bottone ♫ --- */
  if (audioToggle && miniPlayer) {
    audioToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      miniPlayer.classList.toggle("open");
    });

    // Chiudi cliccando fuori dal player
    document.addEventListener("click", (e) => {
      if (miniPlayer.classList.contains("open") && !miniPlayer.contains(e.target)) {
        miniPlayer.classList.remove("open");
      }
    });
  }

  function loadTrack(index, autoplay) {
    currentIndex = (index + playlist.length) % playlist.length;
    const track = playlist[currentIndex];
    audio.src = track.src;
    if (trackTitle) trackTitle.textContent = track.title;
    if (playerProgress) playerProgress.style.width = "0%";
    audio.load();
    if (autoplay) audio.play().catch(() => {});
  }

  function setPlaying(playing) {
    isPlaying = playing;
    if (audioToggle)  audioToggle.classList.toggle("playing", playing);
    if (playPauseBtn) playPauseBtn.classList.toggle("is-playing", playing);
  }

  async function togglePlay() {
    if (!audio.src || audio.src === window.location.href) {
      loadTrack(0, true);
      return;
    }
    try {
      if (audio.paused) await audio.play();
      else              audio.pause();
    } catch (e) {
      console.error("Errore audio:", e);
    }
  }

  if (audio) {
    audio.addEventListener("play",  () => setPlaying(true));
    audio.addEventListener("pause", () => setPlaying(false));
    audio.addEventListener("ended", () => loadTrack(currentIndex + 1, true));
    audio.addEventListener("timeupdate", () => {
      if (audio.duration && playerProgress) {
        playerProgress.style.width = (audio.currentTime / audio.duration * 100) + "%";
      }
    });

    if (playPauseBtn) playPauseBtn.addEventListener("click", togglePlay);
    if (prevBtn) prevBtn.addEventListener("click", () => loadTrack(currentIndex - 1, isPlaying));
    if (nextBtn) nextBtn.addEventListener("click", () => loadTrack(currentIndex + 1, isPlaying));

    loadTrack(0, false);
  }

  /* ------------------------------------------------------------
     2. INTRO
     ------------------------------------------------------------ */
  const introBg = document.querySelector(".intro__bg");
  if (introBg) {
    gsap.to(introBg, {
      scale: 1.1,
      scrollTrigger: {
        trigger: ".section--intro",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }

  const typedTarget = document.getElementById("typed-output");
  if (typedTarget && typeof Typed !== "undefined") {
    new Typed("#typed-output", {
      strings: ["Ciao mamma, ciao papà. Questo è per voi."],
      typeSpeed: 52,
      backSpeed: 0,
      showCursor: true,
      cursorChar: "|",
      onComplete: () => {
        gsap.to(".intro__subtitle", {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          delay: 0.2,
        });

        gsap.to(".intro__tagline", {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          delay: 0.45,
        });

        gsap.to(".intro__scroll-hint", {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          delay: 0.8,
        });
      },
    });
  }

  /* ------------------------------------------------------------
     3. TIMELINE
     ------------------------------------------------------------ */
  const tlSection = document.getElementById("timeline");
  const tlProgress = document.getElementById("tlProgress");
  const tlBridge = document.getElementById("tlBridge");
  const tlTitle = document.querySelector(".js-tl-title");
  const tlSubtitle = document.querySelector(".js-tl-subtitle");
  const tlItems = document.querySelectorAll(".tl-item");

  if (tlSection && tlTitle) {
    gsap.to(tlTitle, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: tlSection,
        start: "top 75%",
        toggleActions: "play none none none",
      },
    });
  }

  if (tlSection && tlSubtitle) {
    gsap.to(tlSubtitle, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      delay: 0.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: tlSection,
        start: "top 75%",
        toggleActions: "play none none none",
      },
    });
  }

  if (tlProgress) {
    gsap.to(tlProgress, {
      scaleY: 1,
      ease: "none",
      scrollTrigger: {
        trigger: "#timelineTrack",
        start: "top 70%",
        end: "bottom 30%",
        scrub: 0.8,
      },
    });
  }

  tlItems.forEach((item) => {
    const isLeft = item.classList.contains("tl-item--left");
    const isDark = item.classList.contains("tl-item--dark");
    const card = item.querySelector(".tl-item__card");
    const node = item.querySelector(".tl-item__node");
    const media = item.querySelector(".tl-item__media");

    const xFrom = isLeft ? -60 : 60;
    const duration = isDark ? 1.3 : 0.9;
    const blurFrom = isDark ? 14 : 8;
    const nodeDelay = isDark ? 0.6 : 0.2;

    if (card) {
      gsap.fromTo(
          card,
          {
            opacity: 0,
            x: xFrom,
            y: 24,
            filter: `blur(${blurFrom}px)`,
          },
          {
            opacity: 1,
            x: 0,
            y: 0,
            filter: "blur(0px)",
            duration,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 82%",
              toggleActions: "play none none none",
            },
          }
      );
    }

    if (node) {
      gsap.fromTo(
        node,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: "back.out(2)",
          delay: nodeDelay,
          scrollTrigger: {
            trigger: item,
            start: "top 82%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    if (item.dataset.chapter === "torino" && media) {
      const mediaImg = media.querySelector("img");
      const parallaxTarget = mediaImg || media;
      // Imposta scale iniziale via GSAP per evitare conflitti con il transform CSS
      gsap.set(parallaxTarget, { scale: 1.2 });
      gsap.to(parallaxTarget, {
        yPercent: -12,
        ease: "none",
        scrollTrigger: {
          trigger: item,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }

    ScrollTrigger.create({
      trigger: item,
      start: "top 60%",
      end: "bottom 40%",
      onEnter: () => item.classList.add("is-active"),
      onLeave: () => item.classList.remove("is-active"),
      onEnterBack: () => item.classList.add("is-active"),
      onLeaveBack: () => item.classList.remove("is-active"),
    });
  });

  if (tlBridge) {
    gsap.to(tlBridge, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: tlBridge,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });
  }

  /* ------------------------------------------------------------
     3b. ANIMAZIONI CAPITOLO DUE
     ─────────────────────────────────────────────────────────────
     Papà  → canvas acqua con ripple concentrici
     Mamma → quaderno CSS animato (ripartenza righe via classe)
     ------------------------------------------------------------ */

  // ── ACQUA / RIPPLE — Papà ──────────────────────────────────
  const waterCanvas = document.getElementById("waterCanvas");

  if (waterCanvas) {
    const wCtx  = waterCanvas.getContext("2d");
    let wW, wH;
    const ripples = [];   // array dei cerchi attivi

    // Ridimensiona il canvas al contenitore
    const resizeWater = () => {
      const rect = waterCanvas.parentElement.getBoundingClientRect();
      wW = waterCanvas.width  = rect.width;
      wH = waterCanvas.height = rect.height;
    };
    resizeWater();
    window.addEventListener("resize", resizeWater);

    // Crea un nuovo ripple al centro o in posizione casuale vicino al centro
    const spawnRipple = (x, y) => {
      ripples.push({
        x: x ?? wW / 2 + (Math.random() - 0.5) * wW * 0.2,
        y: y ?? wH / 2 + (Math.random() - 0.5) * wH * 0.3,
        r: 0,
        maxR: Math.max(wW, wH) * 0.55,
        alpha: 0.55,
        speed: 1.4 + Math.random() * 0.8,
      });
    };

    // Lancio automatico ripple
    let autoRippleTimer;
    const startAutoRipple = () => {
      spawnRipple();
      autoRippleTimer = setInterval(() => spawnRipple(), 2200);
    };
    const stopAutoRipple = () => clearInterval(autoRippleTimer);

    // Hover / click → ripple interattivo
    waterCanvas.parentElement.addEventListener("pointermove", (e) => {
      const rect = waterCanvas.getBoundingClientRect();
      spawnRipple(e.clientX - rect.left, e.clientY - rect.top);
    });
    waterCanvas.parentElement.addEventListener("pointerdown", (e) => {
      const rect = waterCanvas.getBoundingClientRect();
      for (let i = 0; i < 3; i++) {
        setTimeout(() => spawnRipple(e.clientX - rect.left, e.clientY - rect.top), i * 180);
      }
    });

    // Loop animazione
    const drawWater = () => {
      wCtx.clearRect(0, 0, wW, wH);

      // Fondo acqua semi-trasparente
      wCtx.fillStyle = "rgba(14, 165, 233, 0.04)";
      wCtx.fillRect(0, 0, wW, wH);

      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.r     += rp.speed;
        rp.alpha -= rp.alpha / (rp.maxR / rp.speed);

        if (rp.alpha < 0.004 || rp.r > rp.maxR) {
          ripples.splice(i, 1);
          continue;
        }

        wCtx.beginPath();
        wCtx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
        wCtx.strokeStyle = `rgba(125, 211, 252, ${rp.alpha})`;
        wCtx.lineWidth   = 1.5;
        wCtx.stroke();

        // Secondo cerchio leggermente sfasato (doppio effetto)
        wCtx.beginPath();
        wCtx.arc(rp.x, rp.y, rp.r * 0.65, 0, Math.PI * 2);
        wCtx.strokeStyle = `rgba(56, 189, 248, ${rp.alpha * 0.5})`;
        wCtx.lineWidth   = 1;
        wCtx.stroke();
      }

      requestAnimationFrame(drawWater);
    };

    // Parte quando la card entra nel viewport
    ScrollTrigger.create({
      trigger: "#cardPapa",
      start: "top 80%",
      onEnter: () => {
        startAutoRipple();
        drawWater();
      },
      onLeave:     () => stopAutoRipple(),
      onEnterBack: () => startAutoRipple(),
      onLeaveBack: () => stopAutoRipple(),
    });
  }

  // ── QUADERNO / CARTA — Mamma ───────────────────────────────
  const cardMamma = document.getElementById("cardMamma");

  if (cardMamma) {
    // Le righe e la scrittura partono con CSS animation, ma le
    // resettiamo e le riattiviamo ogni volta che la card entra
    // in viewport, così l'effetto si rivede se si torna su.
    const notebookLines   = cardMamma.querySelectorAll(".notebook__line");
    const notebookWriting = cardMamma.querySelector(".notebook__writing");
    const paperBits       = cardMamma.querySelectorAll(".paper-bit");

    const resetNotebook = () => {
      // Rimuove e reimmette animazione CSS forzando reflow
      [...notebookLines, notebookWriting, ...paperBits].forEach((el) => {
        if (!el) return;
        el.style.animation = "none";
        void el.offsetWidth; // reflow
        el.style.animation = "";
      });
    };

    ScrollTrigger.create({
      trigger: "#cardMamma",
      start: "top 80%",
      onEnter:      () => resetNotebook(),
      onEnterBack:  () => resetNotebook(),
    });

    // Piccola oscillazione extra sul quaderno via GSAP (oltre all'animation CSS)
    gsap.to(cardMamma.querySelector(".notebook"), {
      rotateZ: 1.5,
      yoyo: true,
      repeat: -1,
      duration: 4,
      ease: "sine.inOut",
    });
  }

  /* ------------------------------------------------------------
     3c. ANIMAZIONI CAPITOLO QUATTRO — Ripartire
     Cards sequenziali + terminale codice
     ------------------------------------------------------------ */

  // ── MINI-CARD con entrata sequenziale ──────────────────────
  const rebuildCards = document.querySelectorAll("[data-rebuild-card]");

  rebuildCards.forEach((card, i) => {
    gsap.to(card, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      delay: i * 0.18,
      ease: "power3.out",
      scrollTrigger: {
        trigger: "#rebuildGrid",
        start: "top 82%",
        toggleActions: "play none none none",
      },
    });
  });

  // ── BLOCCO CODICE TERMINALE — typing colorato + cursore inline ──
  const codeReveal = document.getElementById("codeReveal");
  const codeOutput = document.getElementById("codeTyped");

  if (codeReveal && codeOutput) {
    // Sequenza token: [classe-colore, testo]
    // classe "" = colore base
    const codeTokens = [
      ["code-tok-cmt",   "// Ciao. Sono Mattia. Questo è quello che faccio."],
      ["",               "\n\n"],
      ["code-tok-kw",    "const"],
      ["",               " "],
      ["code-tok-var",   "passione"],
      ["",               " = "],
      ["code-tok-str",   '"informatica"'],
      ["",               ";\n\n"],
      ["code-tok-kw",    "async function"],
      ["",               " "],
      ["code-tok-fn",    "costruisciIlFuturo"],
      ["",               "() {\n  "],
      ["code-tok-kw",    "const"],
      ["",               " "],
      ["code-tok-var",   "anni"],
      ["",               " = "],
      ["code-tok-num",   "25"],
      ["",               ";\n  "],
      ["code-tok-kw",    "const"],
      ["",               " "],
      ["code-tok-var",   "tecnologie"],
      ["",               " = ["],
      ["code-tok-str",   '"Node.js"'],
      ["",               ", "],
      ["code-tok-str",   '"Java"'],
      ["",               ", "],
      ["code-tok-str",   '"PostgreSQL"'],
      ["",               "];\n\n  "],
      ["code-tok-cmt",   "// Lentamente, ma ci sono arrivato."],
      ["",               "\n  "],
      ["code-tok-kw",    "return"],
      ["",               " {\n    "],
      ["code-tok-var",   "ruolo"],
      ["",               ": "],
      ["code-tok-str",   '"Backend Developer"'],
      ["",               ",\n    "],
      ["code-tok-var",   "grazie"],
      ["",               ": "],
      ["code-tok-str",   '"a mamma e papà"'],
      ["",               ",\n  };\n}\n\n"],
      ["code-tok-fn",    "costruisciIlFuturo"],
      ["",               "();"],
    ];

    // Appiattisce in caratteri con classe
    const chars = [];
    for (const [cls, text] of codeTokens) {
      for (const ch of text) {
        chars.push({ cls, ch });
      }
    }

    // Cursore inline — stesso stile di Typed.js
    const cursor = document.createElement("span");
    cursor.className = "typed-cursor";
    cursor.setAttribute("aria-hidden", "true");
    cursor.textContent = "▋";

    let charIndex  = 0;
    let timer      = null;
    let hasStarted = false;

    const renderChar = () => {
      if (charIndex >= chars.length) return; // finito, cursore resta

      const { cls, ch } = chars[charIndex++];

      // Riusa l'ultimo span se ha la stessa classe
      const last = cursor.previousElementSibling;
      if (last && last.dataset.cls === cls) {
        last.textContent += ch;
      } else {
        const span = document.createElement("span");
        span.dataset.cls = cls;
        if (cls) span.className = cls;
        span.textContent = ch;
        codeOutput.insertBefore(span, cursor); // inserisce PRIMA del cursore
      }

      // Velocità: commenti veloci, newline con pausa breve
      const delay = cls === "code-tok-cmt" ? 20 : ch === "\n" ? 70 : 32;
      timer = setTimeout(renderChar, delay);
    };

    const startTyping = () => {
      if (hasStarted) return;
      hasStarted = true;
      codeOutput.appendChild(cursor); // cursore in fondo, pronto
      gsap.to(codeReveal, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        onComplete: renderChar,
      });
    };

    const resetTyping = () => {
      clearTimeout(timer);
      charIndex  = 0;
      hasStarted = false;
      codeOutput.innerHTML = "";
      gsap.set(codeReveal, { opacity: 0, y: 30 });
    };

    ScrollTrigger.create({
      trigger: codeReveal,
      start: "top 80%",
      onEnter:     () => startTyping(),
      onLeaveBack: () => resetTyping(),
    });
  }

  /* ------------------------------------------------------------
     4. GALLERY
     ------------------------------------------------------------ */
  const galleryItems = document.querySelectorAll(".gallery__item");

  if (galleryItems.length) {
    gsap.from(galleryItems, {
      opacity: 0,
      y: 30,
      duration: 0.7,
      ease: "power3.out",
      stagger: 0.1,
      scrollTrigger: {
        trigger: ".gallery",
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });
  }

  const lightbox = document.getElementById("lightbox");
  const lightboxContent = lightbox ? lightbox.querySelector(".lightbox__content") : null;
  const lightboxClose = lightbox ? lightbox.querySelector(".lightbox__close") : null;

  if (lightbox && lightboxContent && lightboxClose) {
    let currentIndex = -1;
    const galleryArray = Array.from(galleryItems);

    const lightboxPrev = lightbox.querySelector(".lightbox__nav--prev");
    const lightboxNext = lightbox.querySelector(".lightbox__nav--next");

    const renderVideoFallback = (src) => {
      const fallback = document.createElement("div");
      fallback.className = "lightbox__fallback";
      fallback.innerHTML = `
        <p class="lightbox__fallback-title">Video non disponibile qui</p>
        <p class="lightbox__fallback-text">
          Il browser o l'hosting attuale potrebbe non supportare questo file video.
          Succede spesso con file <strong>.MOV</strong> o con deploy statici che usano Git LFS.
        </p>
        <a class="lightbox__fallback-link" href="${src}" target="_blank" rel="noopener noreferrer">
          Prova ad aprire il file direttamente
        </a>
      `;
      lightboxContent.appendChild(fallback);
    };

    const openLightbox = (index) => {
      currentIndex = index;
      const item = galleryArray[index];
      const src = item.dataset.src;
      const isVideo = item.classList.contains("gallery__item--video");

      lightboxContent.innerHTML = "";

      if (isVideo) {
        const video = document.createElement("video");
        video.src = src;
        video.controls = true;
        video.autoplay = true;
        video.playsInline = true;
        video.preload = "metadata";
        video.addEventListener("error", () => {
          lightboxContent.innerHTML = "";
          renderVideoFallback(src);
        }, { once: true });
        lightboxContent.appendChild(video);
      } else {
        const image = document.createElement("img");
        image.src = src;
        image.alt = "Ricordo ingrandito";
        lightboxContent.appendChild(image);
      }

      lightbox.hidden = false;
      requestAnimationFrame(() => lightbox.classList.add("active"));

      if (lenis) lenis.stop();
    };

    const closeLightbox = () => {
      lightbox.classList.remove("active");

      // Ferma eventuali video
      const vid = lightboxContent.querySelector("video");
      if (vid) vid.pause();

      setTimeout(() => {
        lightbox.hidden = true;
        lightboxContent.innerHTML = "";
        currentIndex = -1;
        if (lenis) lenis.start();
      }, 400);
    };

    const navigateLightbox = (direction) => {
      const next = (currentIndex + direction + galleryArray.length) % galleryArray.length;
      openLightbox(next);
    };

    galleryArray.forEach((item, index) => {
      item.addEventListener("click", () => openLightbox(index));
      item.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openLightbox(index);
        }
      });
    });

    lightboxClose.addEventListener("click", closeLightbox);

    if (lightboxPrev) lightboxPrev.addEventListener("click", () => navigateLightbox(-1));
    if (lightboxNext) lightboxNext.addEventListener("click", () => navigateLightbox(1));

    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", (event) => {
      if (!lightbox.classList.contains("active")) return;
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowRight") navigateLightbox(1);
      if (event.key === "ArrowLeft")  navigateLightbox(-1);
    });
  }


  /* ------------------------------------------------------------
     5. BUSTA / LETTERA
     ------------------------------------------------------------ */
  const envelope        = document.getElementById("envelope");
  const envelopeWrapper = document.getElementById("envelopeWrapper");

  if (envelope) {
    // Animazione di entrata della busta allo scroll
    gsap.fromTo(
      envelopeWrapper,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: envelopeWrapper,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );

    // Leggero wobble una tantum dopo l'entrata, per attirare l'attenzione
    ScrollTrigger.create({
      trigger: envelopeWrapper,
      start: "top 75%",
      once: true,
      onEnter: () => {
        if (envelope.classList.contains("is-open")) return;
        gsap.fromTo(
          envelope,
          { rotate: 0 },
          {
            keyframes: [
              { rotate: -3, duration: 0.18 },
              { rotate:  3, duration: 0.18 },
              { rotate: -2, duration: 0.14 },
              { rotate:  2, duration: 0.14 },
              { rotate:  0, duration: 0.12 },
            ],
            ease: "none",
            delay: 0.6,
          }
        );
      },
    });

    // Click / Enter / Space → apre la busta
    function openEnvelope() {
      if (envelope.classList.contains("is-open")) return;

      envelope.classList.add("is-open");
      envelope.setAttribute("aria-label", "Lettera aperta");
      envelope.style.animation = "none";

      // Nasconde l'hint con GSAP
      const hint = document.getElementById("envelopeHint");
      if (hint) gsap.to(hint, { opacity: 0, duration: 0.2 });

      // Piccolo rimbalzo sulla busta all'apertura
      gsap.fromTo(
        envelope,
        { scale: 1 },
        {
          keyframes: [
            { scale: 0.97, duration: 0.1 },
            { scale: 1.02, duration: 0.15 },
            { scale: 1,    duration: 0.2  },
          ],
          ease: "none",
        }
      );

      // Dopo che la lettera è comparsa, scrolla per renderla visibile
      setTimeout(() => {
        const letter = document.getElementById("envelopeLetter");
        if (letter) {
          letter.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 900);
    }

    envelope.addEventListener("click", openEnvelope);
    envelope.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openEnvelope();
      }
    });
  }

  /* ------------------------------------------------------------
     6. FINALE
     ------------------------------------------------------------ */
  gsap.to(".finale__title", {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".section--finale",
      start: "top 70%",
      once: true,
    },
  });

  gsap.to(".finale__btn", {
    opacity: 1,
    y: 0,
    duration: 0.8,
    delay: 0.2,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".section--finale",
      start: "top 70%",
      once: true,
    },
  });

  const confettiBtn = document.getElementById("confettiBtn");
  const finalSignature = document.getElementById("finalSignature");

  if (confettiBtn && finalSignature && typeof confetti !== "undefined") {
    confettiBtn.addEventListener("click", () => {
      const duration = 4000;
      const end = Date.now() + duration;

      const heartShape = confetti.shapeFromPath({
        path: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
      });

      const colors = ["#ff4d6d", "#ff85a1", "#fbb1bd", "#ffffff", "#ffd6e0"];

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          startVelocity: 60,
          origin: { x: 0, y: 0.6 },
          colors,
          shapes: [heartShape, "star"],
          scalar: 1.2,
        });

        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          startVelocity: 60,
          origin: { x: 1, y: 0.6 },
          colors,
          shapes: [heartShape, "star"],
          scalar: 1.2,
        });

        confetti({
          particleCount: 3,
          angle: 90,
          spread: 120,
          startVelocity: 45,
          origin: { x: 0.5, y: 0.5 },
          colors,
          shapes: [heartShape, "star"],
          scalar: 1.4,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();

      setTimeout(() => {
        finalSignature.classList.add("visible");
      }, 1800);
    });
  }

  /* ------------------------------------------------------------
     7. REVEAL GENERICI
     ------------------------------------------------------------ */
  document.querySelectorAll('[data-animate="fade-up"]').forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 36,
      duration: 0.75,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        toggleActions: "play none none none",
      },
    });
  });

  /* ------------------------------------------------------------
     8. FAMILY PHOTO — Capitolo uno
        Appare lentamente con fade, leggero scale e blur in uscita
     ------------------------------------------------------------ */
  const familyPhoto = document.getElementById("familyPhoto");

  if (familyPhoto) {
    // Timeline GSAP per sequenziare i singoli elementi interni
    const fpTl = gsap.timeline({
      scrollTrigger: {
        trigger: familyPhoto,
        start: "top 82%",
        toggleActions: "play none none none",
      },
    });

    // 1. Il frame sale dal basso e sfuma in entrata
    fpTl.to(familyPhoto, {
      opacity: 1,
      y: 0,
      duration: 1.4,
      ease: "power3.out",
    });

    // 2. L'immagine all'interno ha un leggero scale-up che si ferma
    fpTl.fromTo(
      familyPhoto.querySelector(".family-photo__img"),
      { scale: 1.06, filter: "blur(6px) brightness(0.7)" },
      {
        scale: 1,
        filter: "blur(0px) brightness(0.92) saturate(0.85) sepia(0.08)",
        duration: 1.6,
        ease: "power2.out",
      },
      "<"   // parte in parallelo con l'animazione del wrapper
    );

    // 3. La didascalia appare con un leggero ritardo
    fpTl.fromTo(
      familyPhoto.querySelector(".family-photo__caption"),
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
      "-=0.4"
    );
  }

  ScrollTrigger.refresh();
});

