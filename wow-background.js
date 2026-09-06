/* =============================================================
   A LITTLE SOMETHING — WOW BACKGROUND EFFECTS
   ---------------------------------------------------------
   File terpisah, dimuat SETELAH script.js. Tidak menyentuh atau
   menimpa satupun fungsi/ID yang sudah ada — cuma menambah:

   1) Dua layer bintang tambahan (#starsFar, #starsNear) untuk
      parallax kedalaman 3-lapis (far/mid/near).
   2) Stardust — partikel cahaya kecil yang mengambang naik
      perlahan (#stardust).
   3) Penjarangan + penguatan drama pada shooting-star/meteor yang
      sudah ada di script.js, supaya "jarang tapi berkesan".

   Semua otomatis nonaktif kalau prefers-reduced-motion aktif.
   ============================================================= */

(function () {
  "use strict";

  const $ = (sel) => document.querySelector(sel);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* -----------------------------------------------------------
     1) BINTANG JAUH & DEKAT — melengkapi #stars yang sudah ada
     supaya ada 3 lapis kedalaman: far (kecil, redup, lambat),
     mid (yang sudah ada dari script.js), near (besar, terang,
     ikut gerak paling responsif).
     ----------------------------------------------------------- */
  function buildLayer(id, count, sizeMin, sizeMax, opMin, opMax, durMin, durMax) {
    const layer = $(id);
    if (!layer) return;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const s = document.createElement("span");
      s.style.position = "absolute";
      s.style.left = Math.random() * 100 + "%";
      s.style.top = Math.random() * 100 + "%";
      const size = sizeMin + Math.random() * (sizeMax - sizeMin);
      s.style.width = s.style.height = size.toFixed(2) + "px";
      s.style.borderRadius = "50%";
      s.style.background = "rgba(244,234,217,.9)";
      s.style.opacity = (opMin + Math.random() * (opMax - opMin)).toFixed(2);
      if (!reduced) {
        const dur = durMin + Math.random() * (durMax - durMin);
        s.style.animation = `wowTwinkle ${dur.toFixed(2)}s ease-in-out ${(Math.random() * 3).toFixed(2)}s infinite`;
      }
      frag.appendChild(s);
    }
    layer.appendChild(frag);
  }

  try {
    buildLayer("#starsFar", 26, 0.6, 1.4, 0.06, 0.35, 4, 8);
    buildLayer("#starsNear", 8, 2, 3.6, 0.35, 0.85, 2, 4);

    if (!document.getElementById("wowTwinkleKeyframes")) {
      const st = document.createElement("style");
      st.id = "wowTwinkleKeyframes";
      st.textContent = "@keyframes wowTwinkle{50%{opacity:.05;transform:scale(.55)}}";
      document.head.appendChild(st);
    }
  } catch (error) {
    console.warn("[Wow Background] Gagal membuat layer bintang:", error);
  }

  /* -----------------------------------------------------------
     PARALLAX ekstra untuk starsFar & starsNear — versi ringan
     dari sistem parallax yang sudah ada di script.js, tapi
     berdiri sendiri supaya tidak perlu mengubah kode aslinya.
     Far bergerak paling pelan (kesan jauh), near paling cepat
     (kesan dekat) — mid (#stars asli) sudah ditangani script.js.
     ----------------------------------------------------------- */
  (function initExtraParallax() {
    try {
      if (reduced) return;
      const far = $("#starsFar");
      const near = $("#starsNear");
      if (!far && !near) return;

      let tx = 0, ty = 0, cx = 0, cy = 0, looping = false;

      function tick() {
        cx += (tx - cx) * 0.06;
        cy += (ty - cy) * 0.06;
        if (far) far.style.transform = `translate3d(${(cx * 3).toFixed(2)}px, ${(cy * 3).toFixed(2)}px, 0)`;
        if (near) near.style.transform = `translate3d(${(cx * 14).toFixed(2)}px, ${(cy * 14).toFixed(2)}px, 0)`;
        if (Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) {
          requestAnimationFrame(tick);
        } else {
          looping = false;
        }
      }
      function ensureLoop() {
        if (looping) return;
        looping = true;
        requestAnimationFrame(tick);
      }

      if (window.matchMedia("(hover:hover) and (pointer:fine)").matches) {
        window.addEventListener("pointermove", (e) => {
          tx = (e.clientX / window.innerWidth - 0.5) * 2;
          ty = (e.clientY / window.innerHeight - 0.5) * 2;
          ensureLoop();
        });
      } else if (window.DeviceOrientationEvent) {
        window.addEventListener("deviceorientation", (e) => {
          if (e.gamma == null || e.beta == null) return;
          tx = Math.max(-1, Math.min(1, e.gamma / 30));
          ty = Math.max(-1, Math.min(1, (e.beta - 40) / 30));
          ensureLoop();
        });
      }
    } catch (error) {
      console.warn("[Wow Background] Gagal menjalankan parallax tambahan:", error);
    }
  })();

  /* -----------------------------------------------------------
     2) STARDUST — titik cahaya kecil yang perlahan mengambang
     naik dari bawah ke atas layar, sesekali berkelip. Beda dari
     bintang statis: ini yang benar-benar bergerak, kesan "debu
     bintang"/kunang-kunang magical.
     ----------------------------------------------------------- */
  (function buildStardust() {
    try {
      if (reduced) return;
      const field = $("#stardust");
      if (!field) return;

      if (!document.getElementById("wowStardustKeyframes")) {
        const st = document.createElement("style");
        st.id = "wowStardustKeyframes";
        st.textContent =
          "#stardust{position:fixed;inset:0;z-index:1;pointer-events:none;overflow:hidden}" +
          "#stardust i{position:absolute;bottom:-6vh;border-radius:50%;" +
          "background:radial-gradient(circle,rgba(255,247,232,.95) 0%,rgba(238,205,142,.55) 55%,transparent 75%);" +
          "animation-name:wowStardustFloat;animation-timing-function:linear;animation-iteration-count:infinite}" +
          "@keyframes wowStardustFloat{" +
          "0%{transform:translate3d(0,0,0) scale(1);opacity:0}" +
          "8%{opacity:.9}" +
          "92%{opacity:.5}" +
          "100%{transform:translate3d(var(--dx,20px),-115vh,0) scale(.6);opacity:0}}";
        document.head.appendChild(st);
      }

      const frag = document.createDocumentFragment();
      const count = 8;
      for (let i = 0; i < count; i++) {
        const s = document.createElement("i");
        const size = 2 + Math.random() * 2.4;
        s.style.width = s.style.height = size.toFixed(2) + "px";
        s.style.left = Math.random() * 100 + "%";
        const dur = 14 + Math.random() * 12;
        const delay = -Math.random() * dur;
        s.style.animationDuration = dur.toFixed(2) + "s";
        s.style.animationDelay = delay.toFixed(2) + "s";
        s.style.setProperty("--dx", (Math.random() * 60 - 30).toFixed(0) + "px");
        frag.appendChild(s);
      }
      field.appendChild(frag);
    } catch (error) {
      console.warn("[Wow Background] Gagal membuat stardust:", error);
    }
  })();

  /* -----------------------------------------------------------
     3) KOMET LEBIH JARANG, LEBIH DRAMATIS — script.js mendefinisikan
     spawnShootingStar()/spawnMeteor() sebagai fungsi GLOBAL (bukan
     di dalam closure tertutup), jadi kita bisa "membungkusnya" di
     sini dengan aman: versi asli tetap dipanggil apa adanya, cuma
     ditambah jeda minimum supaya kemunculannya jadi jarang & terasa
     istimewa. Ini jauh lebih aman daripada menghapus elemen SETELAH
     dibuat (cara lama sempat bikin percikan bara api nongol sendiri
     tanpa garis komet-nya, karena bara itu dijadwalkan terpisah oleh
     script.js dan tidak ikut terhapus).
     ----------------------------------------------------------- */
  (function throttleCosmicEvents() {
    if (reduced) return;

    const MINOR_GAP = 22000; // shooting-star kecil: minimal 22 detik sekali
    const MAJOR_GAP = 70000; // meteor besar: minimal 70 detik sekali
    let lastMinorAt = 0;
    let lastMajorAt = 0;

    try {
      if (typeof window.spawnShootingStar === "function") {
        const originalMinor = window.spawnShootingStar;
        window.spawnShootingStar = function () {
          const now = performance.now();
          if (now - lastMinorAt < MINOR_GAP) return;
          lastMinorAt = now;
          return originalMinor.apply(this, arguments);
        };
      }

      if (typeof window.spawnMeteor === "function") {
        const originalMajor = window.spawnMeteor;
        window.spawnMeteor = function () {
          const now = performance.now();
          if (now - lastMajorAt < MAJOR_GAP) return;
          lastMajorAt = now;
          // sedikit "flash" tambahan di latar saat meteor besar muncul —
          // momen dramatis singkat, murni CSS class toggle.
          document.body.classList.add("wow-flash");
          window.setTimeout(() => document.body.classList.remove("wow-flash"), 380);
          return originalMajor.apply(this, arguments);
        };
      }
    } catch (error) {
      console.warn("[Wow Background] Gagal menerapkan throttle komet:", error);
    }

    if (!document.getElementById("wowFlashKeyframes")) {
      const st = document.createElement("style");
      st.id = "wowFlashKeyframes";
      st.textContent = "body.wow-flash::before{filter:blur(64px) saturate(108%) brightness(1.35)}";
      document.head.appendChild(st);
    }
  })();
})();
