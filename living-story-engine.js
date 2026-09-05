/* =========================================================
   LITTLE SOMETHING — LIVING STORY ENGINE
   ---------------------------------------------------------
   Mesin ini membaca config/living-story.config.js.

   Cara pakai di index.html:
   <script src="config/living-story.config.js" defer></script>
   <script src="living-story-engine.js" defer></script>

   Engine ini kompatibel dengan project yang sudah punya:
   - CONFIG.name
   - getEffectiveNow()
   - playSfx()
   - #livingNoteBackdrop
   - #livingNote
   - #livingNoteKicker
   - #livingNoteDay
   - #livingNoteTitle
   - #livingNoteCopy
   - #livingNoteClose
   ========================================================= */

(function () {
  "use strict";

  const CONFIG_STORY = window.LIVING_STORY_CONFIG;
  if (!CONFIG_STORY) {
    console.warn("[Living Story] Config belum dimuat.");
    return;
  }

  const STORE_KEY = "littleSomethingLivingStoryV2";
  const TZ = CONFIG_STORY.timezone || "Asia/Jakarta";
  const DAY_MS = 86400000;

  const $ = (id) => document.getElementById(id);
  const pad = (n) => String(n).padStart(2, "0");

  function getNow() {
    // Pakai dateOverride dari project utama kalau tersedia.
    if (typeof window.getEffectiveNow === "function") {
      return window.getEffectiveNow();
    }
    return new Date();
  }

  function getWibParts(date) {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: TZ,
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).formatToParts(date);

    const out = {};
    parts.forEach((part) => {
      if (part.type !== "literal") out[part.type] = part.value;
    });

    return {
      year: Number(out.year),
      month: Number(out.month),
      day: Number(out.day)
    };
  }

  function dateKey(parts) {
    return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}`;
  }

  function makeWibDate(year, month, day, hour = 12) {
    return new Date(
      `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:00:00+07:00`
    );
  }

  function getCycleInfo(now = getNow()) {
    const p = getWibParts(now);

    // Sep 1 adalah Day 1.
    const cycleYear =
      p.month >= CONFIG_STORY.birthday.month
        ? p.year
        : p.year - 1;

    const start = makeWibDate(
      cycleYear,
      CONFIG_STORY.birthday.month,
      CONFIG_STORY.birthday.day
    );

    const current = makeWibDate(p.year, p.month, p.day);
    const day = Math.max(1, Math.floor((current - start) / DAY_MS) + 1);

    return {
      year: p.year,
      month: p.month,
      dayOfMonth: p.day,
      key: dateKey(p),
      cycleYear,
      cycleDay: Math.min(365, day),
      birthday:
        p.month === CONFIG_STORY.birthday.month &&
        p.day === CONFIG_STORY.birthday.day
    };
  }

  function loadState() {
    try {
      return JSON.parse(localStorage.getItem(STORE_KEY) || "{}") || {};
    } catch (error) {
      return {};
    }
  }

  function saveState(state) {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn("[Living Story] localStorage tidak tersedia.", error);
    }
  }

  function getName() {
    try {
      return (window.CONFIG && window.CONFIG.name) || "kamu";
    } catch (error) {
      return "kamu";
    }
  }

  function fillName(text) {
    return String(text || "").replace(/\{name\}/g, getName());
  }

  function daysBetweenKeys(a, b) {
    if (!a || !b) return null;

    const pa = a.split("-").map(Number);
    const pb = b.split("-").map(Number);

    if (pa.length !== 3 || pb.length !== 3) return null;

    const da = makeWibDate(pa[0], pa[1], pa[2]);
    const db = makeWibDate(pb[0], pb[1], pb[2]);

    return Math.round((db - da) / DAY_MS);
  }

  function getReturnMessage(state, info) {
    if (!state.lastShownDate) {
      return CONFIG_STORY.returnMessages?.firstVisit || null;
    }

    const gap = daysBetweenKeys(state.lastShownDate, info.key);

    if (gap >= 7) {
      return CONFIG_STORY.returnMessages?.gapLong || null;
    }

    if (gap >= 3) {
      return CONFIG_STORY.returnMessages?.gap7 || null;
    }

    return null;
  }

  function getSpecialDay(info) {
    return CONFIG_STORY.specialDays?.[info.cycleDay] || null;
  }

  function getDailyMessage(info) {
    const pool = CONFIG_STORY.dailyMessages || [];
    if (!pool.length) {
      return {
        title: "Pelan-pelan, ya.",
        text: "Nggak perlu buru-buru. Kamu punya waktu."
      };
    }

    // Deterministik: tanggal yang sama selalu menghasilkan pesan yang sama.
    const index = Math.max(0, (info.cycleDay - 2) % pool.length);
    return pool[index];
  }

  function getMessage(info, state) {
    if (info.birthday) {
      const b = CONFIG_STORY.birthday;
      return {
        kicker: b.kicker,
        day: b.day,
        title: fillName(b.title),
        text: fillName(b.copy),
        button: b.button,
        birthday: true
      };
    }

    const special = getSpecialDay(info);

    // Special day punya prioritas lebih tinggi daripada daily note.
    if (special) {
      return {
        kicker: special.kicker || "A LITTLE SOMETHING",
        day:
          special.day ||
          `day ${info.cycleDay} · something a little different`,
        title: fillName(special.title),
        text: fillName(special.text),
        button: special.button || "aku simpan ✦",
        birthday: false,
        special: true,
        specialType: special.type || "default"
      };
    }

    const returning = getReturnMessage(state, info);
    const daily = getDailyMessage(info);
    const monthWords =
      CONFIG_STORY.monthThemes?.[info.month] || "a little day";

    // Welcome back hanya muncul jika gap cukup panjang.
    if (returning) {
      return {
        kicker: returning.kicker,
        day: `day ${info.cycleDay} · ${monthWords}`,
        title: fillName(returning.title),
        text: fillName(returning.text),
        button: "aku di sini ✦",
        birthday: false,
        returning: true
      };
    }

    const closings = CONFIG_STORY.closings || [];
    const closing =
      closings.length
        ? closings[(info.cycleDay - 1) % closings.length]
        : "";

    return {
      kicker: "A LITTLE NOTE FOR TODAY",
      day: `day ${info.cycleDay} · ${monthWords}`,
      title: fillName(daily.title),
      text: `${fillName(daily.text)} <strong>${fillName(closing)}</strong>`,
      button: "oke, aku simpan ✦",
      birthday: false
    };
  }

  function shouldShow(info, state) {
    // Birthday selalu kembali setiap cycle baru.
    if (
      info.birthday &&
      state.lastBirthdayCycle !== info.cycleYear
    ) {
      return true;
    }

    // Hari biasa: satu kali per tanggal.
    return state.lastShownDate !== info.key;
  }

  function markShown(info, state) {
    state.lastShownDate = info.key;
    state.lastVisitAt = Date.now();
    state.cycleYear = info.cycleYear;
    state.cycleDay = info.cycleDay;
    state.returnCount = Number(state.returnCount || 0) + 1;

    if (info.birthday) {
      state.lastBirthdayCycle = info.cycleYear;
    }

    saveState(state);
  }

  function openModal(message) {
    const backdrop = $("livingNoteBackdrop");
    const card = $("livingNote");
    const kicker = $("livingNoteKicker");
    const day = $("livingNoteDay");
    const title = $("livingNoteTitle");
    const copy = $("livingNoteCopy");
    const close = $("livingNoteClose");

    if (!backdrop || !card || !kicker || !day || !title || !copy || !close) {
      console.warn(
        "[Living Story] Elemen modal belum ada di index.html."
      );
      return false;
    }

    card.classList.toggle(
      "living-note-birthday",
      !!message.birthday
    );

    card.classList.toggle(
      "living-note-special",
      !!message.special
    );

    card.dataset.specialType = message.specialType || "";

    kicker.innerHTML = message.kicker;
    day.textContent = message.day;
    title.innerHTML = message.title;
    copy.innerHTML = message.text;
    close.textContent = message.button;

    backdrop.classList.add("show");
    backdrop.setAttribute("aria-hidden", "false");
    document.body.classList.add("living-note-open");

    if (typeof window.playSfx === "function") {
      try {
        window.playSfx("chime");
      } catch (_) {}
    }

    return true;
  }

  function dismissModal() {
    const backdrop = $("livingNoteBackdrop");
    if (!backdrop) return;

    backdrop.classList.remove("show");
    backdrop.setAttribute("aria-hidden", "true");
    document.body.classList.remove("living-note-open");
  }

  function setupModal() {
    const backdrop = $("livingNoteBackdrop");
    const close = $("livingNoteClose");

    if (!backdrop || !close) return;

    close.addEventListener("click", () => {
      if (typeof window.playSfx === "function") {
        try {
          window.playSfx("tap");
        } catch (_) {}
      }
      dismissModal();
    });

    backdrop.addEventListener("click", (event) => {
      if (event.target === backdrop) dismissModal();
    });

    document.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape" &&
        backdrop.classList.contains("show")
      ) {
        dismissModal();
      }
    });
  }

  function init() {
    setupModal();

    // API publik untuk dipanggil dari flow PIN.
    window.openLivingStoryNote = function () {
      const info = getCycleInfo(getNow());
      const state = loadState();

      if (!shouldShow(info, state)) return false;

      // Tandai sebelum modal dibuka agar refresh tidak membuat popup berulang.
      markShown(info, state);

      window.setTimeout(() => {
        openModal(getMessage(info, state));
      }, 650);

      return true;
    };

    // API untuk testing / debug.
    window.getLivingStoryState = function () {
      const info = getCycleInfo(getNow());
      const state = loadState();

      return {
        ...info,
        ...state,
        message: getMessage(info, state),
        shouldShow: shouldShow(info, state)
      };
    };

    window.resetLivingStory = function () {
      localStorage.removeItem(STORE_KEY);
      console.info("[Living Story] State berhasil di-reset.");
    };

    window.dismissLivingStoryNote = dismissModal;
  }

  // defer memastikan DOM sudah tersedia.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
