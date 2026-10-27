/* Marlyt_nails — Le Nuancier
   GSAP + ScrollTrigger + Lenis. Tout reste visible sans JS ; le mouvement est une couche ajoutée. */
(() => {
  "use strict";

  const root = document.documentElement;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduce = root.classList.contains("reduce");
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (!window.gsap || !window.ScrollTrigger) {
    root.classList.remove("js");
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

  const SHADES = {
    neige: "#FFF9FB", dragee: "#FFD9E5", cerise: "#C8123F",
    fuchsia: "#C9187C", griotte: "#3B0716", givre: "#E9E7EE",
  };
  const DESKTOP_MOTION = "(min-width: 901px) and (prefers-reduced-motion: no-preference)";
  const pinned = {}; // id de section -> ScrollTrigger épinglé (pour les ancres)

  /* ------------------------------------------------------------------ */
  /* Utilitaires de découpe du texte                                    */
  /* ------------------------------------------------------------------ */
  function splitChars(el) {
    const chars = [];
    let i = 0;
    const walk = (node) => {
      Array.from(node.childNodes).forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          Array.from(n.textContent).forEach((c) => {
            if (c === " ") { frag.appendChild(document.createTextNode(" ")); return; }
            const mask = document.createElement("span");
            mask.className = "ch";
            mask.style.setProperty("--i", i++);
            const inner = document.createElement("span");
            inner.className = "ci";
            inner.textContent = c;
            mask.appendChild(inner);
            frag.appendChild(mask);
            chars.push(inner);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) walk(n);
      });
    };
    walk(el);
    return chars;
  }

  function splitWords(el) {
    const text = el.textContent.trim();
    const visual = document.createElement("span");
    visual.setAttribute("aria-hidden", "true");
    const words = [];
    text.split(/\s+/).forEach((w, i, arr) => {
      const mask = document.createElement("span");
      mask.className = "w";
      const inner = document.createElement("span");
      inner.className = "wi";
      inner.textContent = w;
      mask.appendChild(inner);
      visual.appendChild(mask);
      if (i < arr.length - 1) visual.appendChild(document.createTextNode(" "));
      words.push(inner);
    });
    const sr = document.createElement("span");
    sr.className = "sr";
    sr.textContent = text;
    el.textContent = "";
    el.append(sr, visual);
    return words;
  }

  /* ------------------------------------------------------------------ */
  /* Défilement fluide (Lenis)                                          */
  /* ------------------------------------------------------------------ */
  let lenis = null;
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.scrollTo(0, 0);

  if (!reduce && window.Lenis) {
    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop(); // rendu au scroll quand le préchargeur a fini
  }

  const scrollCallbacks = [];
  if (lenis) {
    lenis.on("scroll", (e) => scrollCallbacks.forEach((cb) => cb(e.velocity, e.direction, e.scroll)));
  } else {
    let last = window.scrollY;
    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      scrollCallbacks.forEach((cb) => cb(y - last, y > last ? 1 : -1, y));
      last = y;
    }, { passive: true });
  }
  const onScroll = (cb) => scrollCallbacks.push(cb);

  /* ------------------------------------------------------------------ */
  /* Navigation : teinte, masquage au scroll, menu mobile, ancres       */
  /* ------------------------------------------------------------------ */
  const nav = $("#nav");
  const hero = $("#accueil");
  let currentSection = hero;
  let menuOpen = false;

  if (!reduce) {
    onScroll((v, dir, y) => {
      nav.classList.toggle("is-stuck", y > 60);
      if (menuOpen || Math.abs(v) < 0.4) return;
      nav.classList.toggle("is-hidden", dir === 1 && y > 260);
    });
  } else {
    onScroll((v, dir, y) => nav.classList.toggle("is-stuck", y > 60));
  }

  function syncNavShade() {
    if (!menuOpen) nav.dataset.shade = currentSection.dataset.shade;
  }

  const burger = $("#burger");
  const menu = $("#menu");
  const menuPanels = $$(".menu__panels i", menu);
  const menuLinks = $$(".menu__nav a", menu);
  menuLinks.forEach((a) => {
    const span = document.createElement("span");
    span.textContent = a.textContent;
    a.textContent = "";
    a.appendChild(span);
  });
  let menuTl = null;

  function setMenu(open) {
    if (open === menuOpen) return;
    menuOpen = open;
    burger.setAttribute("aria-expanded", String(open));
    menu.setAttribute("aria-hidden", String(!open));
    if (menuTl) menuTl.kill();
    if (open) {
      menu.classList.add("is-open");
      nav.dataset.shade = "cerise";
      nav.classList.remove("is-hidden");
      if (lenis) lenis.stop(); else document.body.style.overflow = "hidden";
      const spans = $$("span", menu).filter((s) => menuLinks.some((a) => a.contains(s)));
      if (reduce) {
        gsap.set(menuPanels, { scaleY: 1 });
        gsap.set(spans, { yPercent: 0 });
      } else {
        gsap.set(spans, { yPercent: 115 });
        menuTl = gsap.timeline()
          .fromTo(menuPanels, { scaleY: 0 }, { scaleY: 1, duration: 0.7, ease: "expo.inOut", stagger: 0.07 })
          .to(spans, { yPercent: 0, duration: 0.9, ease: "expo.out", stagger: 0.06 }, 0.35)
          .fromTo(".menu__call", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "expo.out" }, 0.7);
      }
      setTimeout(() => menuLinks[0] && menuLinks[0].focus({ preventScroll: true }), 420);
    } else {
      const done = () => {
        menu.classList.remove("is-open");
        syncNavShade();
        if (lenis) lenis.start(); else document.body.style.overflow = "";
      };
      if (reduce) { gsap.set(menuPanels, { scaleY: 0 }); done(); }
      else {
        menuTl = gsap.timeline({ onComplete: done })
          .to(".menu__nav a span, .menu__call", { opacity: 0, duration: 0.2 })
          .to(menuPanels, { scaleY: 0, transformOrigin: "50% 100%", duration: 0.55, ease: "expo.inOut", stagger: { each: 0.05, from: "end" } }, 0.05)
          .set(menuPanels, { transformOrigin: "50% 0%" })
          .set(".menu__nav a span, .menu__call", { opacity: 1 });
      }
      burger.focus({ preventScroll: true });
    }
  }
  burger.addEventListener("click", () => setMenu(!menuOpen));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && menuOpen) setMenu(false); });

  // Ancres : ScrollTrigger épingle certaines sections, on vise leur vrai début
  const anchorY = (id) => {
    const el = document.getElementById(id);
    if (!el) return null;
    if (id === "accueil") return 0;
    if (pinned[id]) return pinned[id].start;
    return el.getBoundingClientRect().top + (lenis ? lenis.scroll : window.scrollY);
  };
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute("href").slice(1);
    const y = id ? anchorY(id) : null;
    if (y === null) return;
    e.preventDefault();
    if (menuOpen) setMenu(false);
    if (lenis) lenis.scrollTo(y, { duration: 1.7, easing: (t) => 1 - Math.pow(1 - t, 4), force: true });
    else window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
    history.replaceState(null, "", "#" + id);
  });

  /* ------------------------------------------------------------------ */
  /* Préchargeur                                                        */
  /* ------------------------------------------------------------------ */
  const loader = $("#loader");
  let heroIntro = () => {};

  function runLoader(done) {
    if (!loader) { done(); return; }
    if (reduce) { loader.remove(); done(); return; }

    // le préchargeur se joue une fois par session ; ensuite on entre directement
    let seen = false;
    try {
      seen = sessionStorage.getItem("marlyt-intro") === "1";
      sessionStorage.setItem("marlyt-intro", "1");
    } catch (e) { /* stockage indisponible : on rejoue l'intro */ }
    if (seen) { loader.remove(); done(); heroIntro(); return; }

    const outline = $(".loader__outline", loader);
    const paint = $(".loader__paint", loader);
    const gloss = $(".loader__gloss", loader);
    const word = $(".loader__word", loader);
    const fill = $(".loader__fill", loader);
    const chars = splitChars(word);
    const len = outline.getTotalLength();

    gsap.set(outline, { strokeDasharray: len, strokeDashoffset: len });
    gsap.set(paint, { y: 220 });
    gsap.set(gloss, { opacity: 0 });
    gsap.set(chars, { yPercent: 115 });

    gsap.timeline({
      onComplete: () => { loader.remove(); done(); },
    })
      .to(outline, { strokeDashoffset: 0, duration: 0.75, ease: "power2.inOut" }, 0)
      .to(chars, { yPercent: 0, duration: 0.8, ease: "expo.out", stagger: 0.035 }, 0.15)
      .to(paint, { y: 0, duration: 0.95, ease: "power3.inOut" }, 0.6)
      .to(gloss, { opacity: 0.75, duration: 0.35, ease: "power2.out" }, 1.35)
      .to(fill, { clipPath: "circle(150% at 50% 42%)", duration: 0.95, ease: "expo.inOut" }, 1.75)
      .to(loader, { yPercent: -100, duration: 1, ease: "expo.inOut" }, 2.55)
      .add(() => heroIntro(), 2.75);
  }

  /* ------------------------------------------------------------------ */
  /* Hero : titre, présentoir, repeindre la page                        */
  /* ------------------------------------------------------------------ */
  (function setupHero() {
    const titleLines = $$(".hero__line", hero);
    const chips = $$(".chip__in", hero);
    const copy = $$(".hero__lead-in, .hero__actions > *, .hero__addr", hero);
    const hint = $(".rack__hint", hero);
    const pools = $$(".pool", hero);

    if (!reduce) {
      const chars = titleLines.flatMap((l) => splitChars(l));
      gsap.set(chars, { yPercent: 118 });
      gsap.set(chips, { yPercent: 70, opacity: 0, rotation: 7 });
      gsap.set(copy, { y: 30, opacity: 0 });
      gsap.set(hint, { opacity: 0 });
      gsap.set(pools, { scale: 0.82 });

      heroIntro = () => {
        gsap.timeline({ defaults: { ease: "expo.out" } })
          .to(chars, { yPercent: 0, duration: 1.3, stagger: 0.045 }, 0)
          .to(pools, { scale: 1, duration: 1.8, stagger: 0.12 }, 0)
          .to(chips, { yPercent: 0, opacity: 1, rotation: 0, duration: 1.3, stagger: { each: 0.07, from: "center" } }, 0.2)
          .to(copy, { y: 0, opacity: 1, duration: 1, stagger: 0.08 }, 0.5)
          .to(hint, { opacity: 1, duration: 0.7 }, 1.2);
      };
    }

    // Repeindre l'accueil dans la teinte choisie
    const paint = $(".hero__paint", hero);
    const picks = $$("[data-pick]", hero);
    let painting = null;

    function pickShade(shade, btn) {
      picks.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      if (hero.dataset.shade === shade) return;
      if (painting) painting.kill();

      const commit = () => {
        hero.dataset.shade = shade;
        if (currentSection === hero) syncNavShade();
      };
      if (reduce) { commit(); return; }

      const r = hero.getBoundingClientRect();
      const b = btn.getBoundingClientRect();
      const cx = b.left + b.width / 2 - r.left;
      const cy = b.top + b.height * 0.35 - r.top;
      const rad = Math.hypot(Math.max(cx, r.width - cx), Math.max(cy, r.height - cy));
      Object.assign(paint.style, {
        display: "block", left: cx - rad + "px", top: cy - rad + "px",
        width: rad * 2 + "px", height: rad * 2 + "px", background: SHADES[shade],
      });
      painting = gsap.timeline({ onComplete: () => { paint.style.display = "none"; } })
        .fromTo(paint, { scale: 0.03 }, { scale: 1, duration: 1, ease: "power3.inOut" }, 0)
        .add(commit, 0.5);
    }
    picks.forEach((btn) => btn.addEventListener("click", () => pickShade(btn.dataset.pick, btn)));

    if (reduce) return;

    // Parallaxe à la souris
    if (finePointer) {
      const layers = $$("[data-depth]", hero).map((el) => ({
        d: parseFloat(el.dataset.depth),
        x: gsap.quickTo(el, "x", { duration: 1, ease: "power3" }),
        y: gsap.quickTo(el, "y", { duration: 1, ease: "power3" }),
      }));
      const rack = $(".rack", hero);
      layers.push({ d: -0.25, x: gsap.quickTo(rack, "x", { duration: 1, ease: "power3" }), y: gsap.quickTo(rack, "y", { duration: 1, ease: "power3" }) });
      hero.addEventListener("pointermove", (e) => {
        const r = hero.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        layers.forEach((l) => { l.x(nx * l.d * -90); l.y(ny * l.d * -60); });
      });
    }

    // Parallaxe multicouche au scroll
    const st = { trigger: hero, start: "top top", end: "bottom top", scrub: true };
    gsap.to(".hero__title", { yPercent: 22, ease: "none", scrollTrigger: st });
    gsap.to(".pool--a", { yPercent: 38, ease: "none", scrollTrigger: st });
    gsap.to(".pool--b", { yPercent: -45, ease: "none", scrollTrigger: st });
    gsap.to(".hero__badge", { yPercent: -60, ease: "none", scrollTrigger: st });
    gsap.to(".rack", { yPercent: -7, ease: "none", scrollTrigger: st });
    gsap.to(".hero__copy", { yPercent: -16, opacity: 0.2, ease: "none", scrollTrigger: st });
  })();

  /* ------------------------------------------------------------------ */
  /* Marquee réactif au scroll                                          */
  /* ------------------------------------------------------------------ */
  (function setupMarquee() {
    if (reduce) return;
    const rows = $$(".marquee__row");
    const tweens = rows.map((row) => {
      const track = $(".marquee__track", row);
      const dir = parseFloat(row.dataset.dir);
      const clone = track.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      clone.removeAttribute("style");
      row.appendChild(clone);
      const both = [track, clone];
      return gsap.fromTo(both, { xPercent: dir < 0 ? 0 : -100 }, { xPercent: dir < 0 ? -100 : 0, ease: "none", duration: 34, repeat: -1 });
    });
    // la vitesse suit l'élan du scroll, puis retombe ; le sens suit la direction du scroll
    let sign = 1, boost = 1, speed = 1;
    onScroll((v, dir) => {
      if (Math.abs(v) < 0.2) return;
      sign = dir;
      boost = dir * (1 + Math.min(Math.abs(v) * 0.22, 6));
    });
    gsap.ticker.add(() => {
      boost += (sign - boost) * 0.04;
      speed += (boost - speed) * 0.15;
      tweens.forEach((tw) => tw.timeScale(speed));
    });
  })();

  /* ------------------------------------------------------------------ */
  /* Savoir-faire : un ongle se peint au fil du scroll (section pinnée) */
  /* ------------------------------------------------------------------ */
  const mm = gsap.matchMedia();
  mm.add(DESKTOP_MOTION, () => {
    const story = $("#savoir-faire");
    story.classList.add("is-pinned");
    const steps = $$(".step", story);
    const color = $(".bn-color", story);
    const brush = $(".bn-brush", story);
    const cuticle = $(".bn-cuticle", story);
    const base = $(".bn-base", story);
    const g1 = $(".bn-gloss", story);
    const g2 = $(".bn-gloss2", story);
    const clen = cuticle.getTotalLength();

    gsap.set(cuticle, { strokeDasharray: clen, strokeDashoffset: clen });
    gsap.set(color, { y: 330 });
    gsap.set([g1, g2], { opacity: 0 });
    gsap.set(brush, { opacity: 0, y: 430, x: 0 });
    gsap.set(steps, { autoAlpha: 0, y: 36 });
    gsap.set(steps[0], { autoAlpha: 1, y: 0 });

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: story, start: "top top", end: "+=320%", pin: true, scrub: 0.7, anticipatePin: 1, invalidateOnRefresh: true },
    });
    // textes
    [[0.85, 1], [1.85, 2], [2.85, 3]].forEach(([t, i]) => {
      tl.to(steps[i - 1], { autoAlpha: 0, y: -30, duration: 0.25, ease: "power2.in" }, t)
        .to(steps[i], { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out" }, t + 0.2);
    });
    // ongle : préparer, poser, finir
    tl.to(cuticle, { strokeDashoffset: 0, duration: 0.7 }, 1.0)
      .to(base, { opacity: 0.55, duration: 0.7 }, 1.0)
      .to(brush, { opacity: 1, duration: 0.1 }, 2.0)
      .to(color, { y: 40, duration: 0.9 }, 2.0)
      .to(brush, { y: 140, duration: 0.9 }, 2.0)
      .to(brush, { keyframes: { x: [0, -16, 16, -16, 16, 0] }, duration: 0.9 }, 2.0)
      .to(brush, { opacity: 0, duration: 0.12 }, 2.92)
      .fromTo(g1, { opacity: 0, x: -50 }, { opacity: 0.85, x: 0, duration: 0.5 }, 3.1)
      .fromTo(g2, { opacity: 0, y: 40 }, { opacity: 0.85, y: 0, duration: 0.4 }, 3.35)
      .to({}, { duration: 0.15 }, 3.85); // petit temps mort avant de relâcher

    pinned["savoir-faire"] = tl.scrollTrigger;
    return () => { story.classList.remove("is-pinned"); delete pinned["savoir-faire"]; };
  });

  /* ------------------------------------------------------------------ */
  /* Prestations : défilement horizontal piloté par le scroll vertical  */
  /* ------------------------------------------------------------------ */
  mm.add(DESKTOP_MOTION, () => {
    const pin = $("#prestations");
    const track = $(".services__track");
    const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);

    const tween = gsap.to(track, {
      x: () => -dist(), ease: "none",
      scrollTrigger: { trigger: pin, start: "top top", end: () => "+=" + dist(), pin: true, scrub: 0.8, anticipatePin: 1, invalidateOnRefresh: true },
    });
    pinned["prestations"] = tween.scrollTrigger;
    gsap.from(".card", {
      y: 90, opacity: 0, rotation: 2.5, duration: 1.1, ease: "expo.out", stagger: 0.08,
      scrollTrigger: { trigger: pin, start: "top 75%", once: true },
    });
    return () => { delete pinned["prestations"]; };
  });

  /* ------------------------------------------------------------------ */
  /* Titres, apparitions, chiffres                                      */
  /* ------------------------------------------------------------------ */
  (function setupReveals() {
    if (reduce) return;
    $$('[data-reveal="words"]').forEach((el) => {
      const words = splitWords(el);
      gsap.set(words, { yPercent: 118 });
      ScrollTrigger.create({
        trigger: el, start: "top 88%", once: true, refreshPriority: -1,
        onEnter: () => gsap.to(words, { yPercent: 0, duration: 1.15, ease: "expo.out", stagger: 0.05 }),
      });
    });
    $$('[data-reveal="fade"]').forEach((el) => {
      gsap.set(el, { y: 26, opacity: 0 });
      ScrollTrigger.create({
        trigger: el, start: "top 90%", once: true, refreshPriority: -1,
        onEnter: () => gsap.to(el, { y: 0, opacity: 1, duration: 1, ease: "expo.out" }),
      });
    });
  })();

  (function setupFigures() {
    const tickets = $$(".ticket");
    const nums = $$("[data-count]");
    if (reduce) return;

    nums.forEach((el) => {
      const target = parseFloat(el.dataset.count);
      const o = { v: 0 };
      el.textContent = "0";
      ScrollTrigger.create({
        trigger: el, start: "top 88%", once: true, refreshPriority: -1,
        onEnter: () => gsap.to(o, { v: target, duration: 2.2, ease: "power3.out", onUpdate: () => { el.textContent = Math.round(o.v); } }),
      });
    });

    const bases = tickets.map((t) => parseFloat(getComputedStyle(t).getPropertyValue("--tr")) || 0);
    tickets.forEach((t, i) => {
      gsap.from(t, {
        yPercent: -35, rotation: bases[i] + (i % 2 ? 10 : -10), duration: 1.8, ease: "elastic.out(1, 0.45)",
        scrollTrigger: { trigger: t, start: "top 90%", once: true, refreshPriority: -1 },
      });
    });
    // Les étiquettes se balancent avec l'élan du scroll
    let swing = 0, target = 0, active = false;
    ScrollTrigger.create({
      trigger: ".figures", start: "top bottom", end: "bottom top", refreshPriority: -1,
      onToggle: (s) => { active = s.isActive; },
    });
    onScroll((v) => { target = gsap.utils.clamp(-9, 9, v * 0.45); });
    gsap.ticker.add(() => {
      if (!active && Math.abs(swing) < 0.01) return;
      target *= 0.94;
      swing += (target - swing) * 0.08;
      tickets.forEach((t, i) => gsap.set(t, { rotation: bases[i] + swing * (i % 2 ? -1 : 1) }));
    });
  })();

  /* ------------------------------------------------------------------ */
  /* Galerie                                                            */
  /* ------------------------------------------------------------------ */
  (function setupGallery() {
    if (reduce) return;
    const wall = $(".gallery__wall");
    $$(".shot").forEach((shot) => {
      const speed = parseFloat(shot.dataset.speed) || 1;
      const frame = $(".shot__frame", shot);
      const img = $("img", shot);
      if (matchMedia("(min-width: 641px)").matches) {
        gsap.fromTo(shot, { y: (speed - 1) * 300 }, {
          y: -(speed - 1) * 300, ease: "none",
          scrollTrigger: { trigger: wall, start: "top bottom", end: "bottom top", scrub: true, refreshPriority: -1 },
        });
      }
      gsap.fromTo(img, { yPercent: -4, scale: 1.02 }, {
        yPercent: 4, scale: 1.12, ease: "none",
        scrollTrigger: { trigger: shot, start: "top bottom", end: "bottom top", scrub: true, refreshPriority: -1 },
      });
      gsap.from(frame, {
        clipPath: "inset(100% 0% 0% 0%)", duration: 1.4, ease: "expo.out",
        scrollTrigger: { trigger: shot, start: "top 88%", once: true, refreshPriority: -1 },
      });
    });
  })();

  /* ------------------------------------------------------------------ */
  /* Avis : un éventail de nuancier                                     */
  /* ------------------------------------------------------------------ */
  (function setupFan() {
    const region = $("#fan");
    const stack = $("#fanStack");
    const blades = $$(".blade", stack);
    const dotsEl = $("#fanDots");
    const prev = $("#fanPrev");
    const next = $("#fanNext");
    const play = $("#fanPlay");
    const live = $("#fanLive");
    const n = blades.length;
    let idx = 0, timer = null, auto = !reduce, hovering = false, inView = false;

    const dots = blades.map((b, i) => {
      const li = document.createElement("li");
      const bt = document.createElement("button");
      bt.type = "button";
      bt.setAttribute("aria-label", "Avis " + (i + 1) + " sur " + n + " : " + $("h3", b).textContent);
      bt.addEventListener("click", () => go(i, true));
      li.appendChild(bt);
      dotsEl.appendChild(li);
      return bt;
    });

    // toutes les cartes prennent la hauteur de la plus haute : les contrôles ne bougent jamais
    function fit() {
      stack.style.setProperty("--h", "0px");
      const tallest = Math.max.apply(null, blades.map((b) => b.offsetHeight));
      stack.style.setProperty("--h", tallest + "px");
    }
    function render(announce) {
      blades.forEach((b, i) => {
        let o = i - idx;
        if (o > n / 2) o -= n;
        if (o < -n / 2) o += n;
        b.style.setProperty("--o", o);
        b.style.setProperty("--ao", Math.abs(o));
        b.setAttribute("aria-hidden", String(o !== 0));
        if (o !== 0) b.setAttribute("inert", ""); else b.removeAttribute("inert");
      });
      dots.forEach((d, i) => (i === idx ? d.setAttribute("aria-current", "true") : d.removeAttribute("aria-current")));
      fit();
      if (announce) live.textContent = "Avis " + (idx + 1) + " sur " + n + ", " + $("h3", blades[idx]).textContent;
    }
    function go(i, user) {
      idx = (i + n) % n;
      render(user);
      if (user) schedule();
    }
    function schedule() {
      clearInterval(timer);
      if (auto && inView && !hovering) timer = setInterval(() => go(idx + 1, false), 8000);
    }

    prev.addEventListener("click", () => go(idx - 1, true));
    next.addEventListener("click", () => go(idx + 1, true));
    region.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") { go(idx + 1, true); e.preventDefault(); }
      if (e.key === "ArrowLeft") { go(idx - 1, true); e.preventDefault(); }
    });
    region.addEventListener("pointerenter", () => { hovering = true; schedule(); });
    region.addEventListener("pointerleave", () => { hovering = false; schedule(); });
    region.addEventListener("focusin", () => { hovering = true; schedule(); });
    region.addEventListener("focusout", () => { hovering = false; schedule(); });

    // glisser pour changer d'avis
    let sx = null;
    stack.style.touchAction = "pan-y";
    stack.addEventListener("pointerdown", (e) => { sx = e.clientX; });
    stack.addEventListener("pointerup", (e) => {
      if (sx === null) return;
      const dx = e.clientX - sx;
      sx = null;
      if (Math.abs(dx) > 50) go(idx + (dx < 0 ? 1 : -1), true);
    });
    stack.addEventListener("pointercancel", () => { sx = null; });

    if (reduce) {
      play.hidden = true;
    } else {
      play.addEventListener("click", () => {
        auto = !auto;
        play.setAttribute("aria-pressed", String(!auto));
        play.textContent = auto ? "Mettre en pause" : "Reprendre le défilement";
        schedule();
      });
    }
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([e]) => { inView = e.isIntersecting; schedule(); }, { threshold: 0.35 }).observe(region);
    }
    window.addEventListener("resize", fit);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    render(false);
  })();

  /* ------------------------------------------------------------------ */
  /* Appel à l'action, pied de page                                     */
  /* ------------------------------------------------------------------ */
  (function setupCta() {
    const digits = $(".cta__digits");
    const digitChars = splitChars(digits);
    const foot = $(".footer__giant");
    const footChars = splitChars(foot);
    if (reduce) return;

    gsap.set(digitChars, { yPercent: 115 });
    ScrollTrigger.create({
      trigger: ".cta__phone", start: "top 88%", once: true, refreshPriority: -1,
      onEnter: () => gsap.to(digitChars, { yPercent: 0, duration: 1.2, ease: "expo.out", stagger: 0.035 }),
    });
    gsap.set(footChars, { yPercent: 118 });
    ScrollTrigger.create({
      trigger: ".footer", start: "top 78%", once: true, refreshPriority: -1,
      onEnter: () => gsap.to(footChars, { yPercent: 0, duration: 1.4, ease: "expo.out", stagger: 0.045 }),
    });

    $$(".cta__chips i").forEach((chip) => {
      const s = parseFloat(getComputedStyle(chip).getPropertyValue("--s")) || -60;
      gsap.fromTo(chip, { y: -s * 0.9 }, {
        y: s * 0.9, rotation: "+=18", ease: "none",
        scrollTrigger: { trigger: ".cta", start: "top bottom", end: "bottom top", scrub: true, refreshPriority: -1 },
      });
    });
  })();

  /* ------------------------------------------------------------------ */
  /* Horaires : jour courant et statut « ouvert / fermé »               */
  /* ------------------------------------------------------------------ */
  (function setupHours() {
    const A = [["09:00", "12:00"], ["13:30", "17:00"]];
    const HOURS = { 0: [], 1: A, 2: A, 3: [["09:00", "12:00"], ["15:00", "17:00"]], 4: A, 5: A, 6: [] };
    const DAYS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
    const toMin = (s) => { const [h, m] = s.split(":").map(Number); return h * 60 + m; };
    const fmt = (s) => s.replace(":", "h");
    const out = $("[data-status]");
    const label = $("[data-status-text]");

    function parisNow() {
      const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Paris", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date());
      const m = {};
      parts.forEach((p) => { m[p.type] = p.value; });
      const day = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[m.weekday];
      return { day, min: (parseInt(m.hour, 10) % 24) * 60 + parseInt(m.minute, 10) };
    }

    function update() {
      const { day, min } = parisNow();
      $$(".hours tr").forEach((tr) => tr.classList.toggle("is-today", Number(tr.dataset.day) === day));

      const slot = HOURS[day].find(([a, b]) => min >= toMin(a) && min < toMin(b));
      if (slot) {
        label.textContent = "Ouvert maintenant, jusqu’à " + fmt(slot[1]);
        out.dataset.open = "true";
        return;
      }
      out.dataset.open = "false";
      for (let off = 0; off < 8; off++) {
        const d = (day + off) % 7;
        const next = HOURS[d].find(([a]) => off > 0 || toMin(a) > min);
        if (next) {
          const when = off === 0 ? "" : off === 1 ? " demain" : " " + DAYS[d];
          label.textContent = "Fermé pour l’instant, réouverture" + when + " à " + fmt(next[0]);
          return;
        }
      }
    }
    update();
    setInterval(update, 60000);
  })();

  /* ------------------------------------------------------------------ */
  /* Micro-interactions : inclinaison, aimant, curseur                  */
  /* ------------------------------------------------------------------ */
  if (finePointer && !reduce) {
    $$(".tilt").forEach((el) => {
      const target = el.classList.contains("shot") ? $(".shot__frame", el) : el;
      gsap.set(target, { transformPerspective: 900 });
      const rx = gsap.quickTo(target, "rotationX", { duration: 0.6, ease: "power3" });
      const ry = gsap.quickTo(target, "rotationY", { duration: 0.6, ease: "power3" });
      el.addEventListener("pointermove", (e) => {
        const r = target.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        ry((px - 0.5) * 14);
        rx((0.5 - py) * 14);
        target.style.setProperty("--gx", px * 100 + "%");
        target.style.setProperty("--gy", py * 100 + "%");
      });
      el.addEventListener("pointerleave", () => { rx(0); ry(0); });
    });

    $$(".magnetic").forEach((el) => {
      const inner = $(".btn__label", el) || null;
      const qx = gsap.quickTo(el, "x", { duration: 0.7, ease: "power3" });
      const qy = gsap.quickTo(el, "y", { duration: 0.7, ease: "power3" });
      const ix = inner ? gsap.quickTo(inner, "x", { duration: 0.7, ease: "power3" }) : () => {};
      const iy = inner ? gsap.quickTo(inner, "y", { duration: 0.7, ease: "power3" }) : () => {};
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        qx(dx * 0.26); qy(dy * 0.34); ix(dx * 0.16); iy(dy * 0.2);
      });
      el.addEventListener("pointerleave", () => { qx(0); qy(0); ix(0); iy(0); });
    });

    const cursor = $("#cursor");
    const cx = gsap.quickTo(cursor, "x", { duration: 0.4, ease: "power3" });
    const cy = gsap.quickTo(cursor, "y", { duration: 0.4, ease: "power3" });
    window.addEventListener("pointermove", (e) => {
      cursor.classList.add("is-on");
      cx(e.clientX); cy(e.clientY);
      cursor.classList.toggle("is-link", !!e.target.closest("a, button, .tilt"));
    }, { passive: true });
    document.addEventListener("pointerleave", () => cursor.classList.remove("is-on"));
  }

  /* ------------------------------------------------------------------ */
  /* Barre de progression, teinte de la navigation, bords de vernis     */
  /* ------------------------------------------------------------------ */
  gsap.to(".progress span", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3, refreshPriority: -2 } });

  $$("main > section[data-shade], footer[data-shade]").forEach((sec) => {
    ScrollTrigger.create({
      trigger: sec, start: "top 64px", end: "bottom 64px", refreshPriority: -2,
      onToggle: (self) => { if (self.isActive) { currentSection = sec; syncNavShade(); } },
    });
  });

  if (!reduce) {
    $$(".drip svg").forEach((svg) => {
      gsap.from(svg, {
        scaleY: 0.15, duration: 1.4, ease: "elastic.out(1, 0.5)",
        scrollTrigger: { trigger: svg.parentElement, start: "top 92%", once: true, refreshPriority: -1 },
      });
    });
  }

  /* Bouton d'appel flottant : discret dans le hero et là où l'appel est déjà central */
  (function setupFab() {
    const fab = $(".fab");
    if (!fab) return;
    let pastHero = false;
    const inCall = new Set();
    const apply = () => fab.classList.toggle("is-on", pastHero && inCall.size === 0);
    ScrollTrigger.create({
      trigger: hero, start: "bottom 70%", refreshPriority: -2,
      onEnter: () => { pastHero = true; apply(); },
      onLeaveBack: () => { pastHero = false; apply(); },
    });
    ["#rendez-vous", "#contact", ".footer"].forEach((sel) => {
      ScrollTrigger.create({
        trigger: sel, start: "top 75%", end: "bottom top", refreshPriority: -2,
        onToggle: (s) => { if (s.isActive) inCall.add(sel); else inCall.delete(sel); apply(); },
      });
    });
  })();

  /* ------------------------------------------------------------------ */
  /* Démarrage                                                          */
  /* ------------------------------------------------------------------ */
  runLoader(() => {
    if (lenis) lenis.start();
    ScrollTrigger.refresh();
  });
  const refresh = () => ScrollTrigger.refresh();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
  window.addEventListener("load", refresh);
})();
