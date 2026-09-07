/* =========================================================
   LITTLE SOMETHING — LIVING STORY CONFIG
   ---------------------------------------------------------
   File ini berisi ISI cerita + aturan tahunan.
   Mesin/programnya ada di: living-story-engine.js

   Tahun cerita:
   - 01 September = birthday reset / Day 1
   - 02 September s/d 31 August = Day 2–365
   - Engine memakai WIB (Asia/Jakarta)

   DAFTAR ISI FILE INI (scroll ke bagian yang mau diedit):
   1. birthday        → pesan spesial pas 1 September
   2. dailyMessages    → pesan yang gonta-ganti tiap hari biasa
   3. closings         → kalimat penutup pendek di bawah pesan harian
   4. monthThemes      → satu baris "tema bulan ini" (dekoratif saja)
   5. specialDays      → pesan spesial di hari ke-N dalam siklus (14, 30, dst)
   6. returnMessages   → pesan pas dia balik lagi setelah beberapa hari absen

   CATATAN PENTING soal penamaan field:
   - Jangan pakai nama field yang SAMA dua kali dalam satu objek
     (mis. dua-duanya dinamai "day") — JavaScript akan diam-diam
     memakai yang paling akhir dan menimpa yang pertama, tanpa
     ada error/peringatan sama sekali. Ini pernah kejadian di
     `birthday` (field tanggal ketiban field teks subLabel) dan
     bikin deteksi ulang tahun gagal diam-diam.
   ========================================================= */

window.LIVING_STORY_CONFIG = {
  version: 1,

  timezone: "Asia/Jakarta",

  birthday: {
    month: 9,
    day: 1, // tanggal ulang tahun (angka) — dipakai engine buat cek "apakah hari ini ultah?"

    kicker: "01 SEPTEMBER · YOUR DAY",
    subLabel: "the birthday mode is back ♡", // teks kecil di bawah kicker (BUKAN tanggal — dulu sempat salah nama "day" juga, ketiban sama baris di atas)
    title: "Happy <em>Birthday.</em>",
    copy:
      'Hari ini kita kembali ke awal lagi. Semoga tahun yang baru ini membawa banyak hal baik, banyak alasan untuk tersenyum, dan cukup ruang untuk kamu tumbuh dengan caramu sendiri. <strong>Selamat ulang tahun, {name}.</strong> ♡',
    button: "mulai cerita ulang tahun ✦"
  },

  /* PESAN HARIAN (dailyMessages)
     -----------------------------------------------------------
     - Diputar bergantian sepanjang tahun, urutannya TETAP (deterministik):
       tanggal yang sama akan selalu dapat pesan yang sama.
     - Sebelumnya cuma 30 pesan → berulang tiap ~30 hari (kerasa "itu-itu
       lagi" tiap bulan). Sekarang dijadikan 75 pesan → baru berulang
       setelah ~2.5 bulan, jauh lebih jarang kerasa mengulang.
     - Bebas tambah/hapus/ubah isinya kapan saja, urutan taruh bebas. */
  dailyMessages: [
    {
      title: "Hey, kamu.",
      text: "Nggak perlu menyelesaikan semuanya hari ini. Satu hal kecil dulu juga sudah cukup."
    },
    {
      title: "Pelan-pelan, ya.",
      text: "Kamu nggak sedang berlomba dengan siapa-siapa. Ambil waktumu."
    },
    {
      title: "Just a little reminder.",
      text: "Kamu sudah melewati banyak hari yang dulu kamu kira nggak akan sanggup lewati."
    },
    {
      title: "For the tired days.",
      text: "Kalau hari ini terasa berat, istirahat sebentar bukan berarti kamu menyerah."
    },
    {
      title: "I hope you remember this.",
      text: "Ada banyak hal baik tentang dirimu yang mungkin nggak selalu bisa kamu lihat sendiri."
    },
    {
      title: "One thing at a time.",
      text: "Nggak apa-apa kalau hari ini cuma berhasil melakukan yang paling penting."
    },
    {
      title: "You are doing okay.",
      text: "Mungkin belum sempurna. Tapi tetap berjalan. Itu juga kemajuan."
    },
    {
      title: "Take a breath.",
      text: "Tarik napas dulu. Dunia nggak akan runtuh hanya karena kamu berhenti sebentar."
    },
    {
      title: "For whatever today brings.",
      text: "Semoga ada satu hal kecil hari ini yang bikin kamu tersenyum tanpa sengaja."
    },
    {
      title: "Keep your little light.",
      text: "Jangan terlalu keras sama diri sendiri. Kamu juga pantas mendapat kelembutan itu."
    },
    {
      title: "A quiet reminder.",
      text: "Kamu nggak harus selalu terlihat kuat untuk tetap menjadi seseorang yang hebat."
    },
    {
      title: "Tomorrow can wait.",
      text: "Kalau hari ini belum sesuai harapan, nggak apa-apa. Besok masih punya cerita sendiri."
    },
    {
      title: "You're allowed to pause.",
      text: "Berhenti sebentar bukan berarti mundur. Kadang kamu hanya sedang mengisi tenaga."
    },
    {
      title: "Small progress counts.",
      text: "Hal kecil yang kamu lakukan hari ini tetap berarti, meskipun tidak ada yang melihatnya."
    },
    {
      title: "Don't forget yourself.",
      text: "Di tengah semua hal yang harus kamu urus, sisakan sedikit ruang untuk dirimu sendiri."
    },
    {
      title: "You don't have to know yet.",
      text: "Beberapa jawaban memang baru datang setelah kita menjalani jalannya."
    },
    {
      title: "Be gentle today.",
      text: "Kalau kamu membuat kesalahan, jangan jadikan satu kesalahan alasan untuk membenci dirimu sendiri."
    },
    {
      title: "A little courage.",
      text: "Berani bukan berarti tidak takut. Berani berarti tetap mencoba meski ada takutnya."
    },
    {
      title: "Look how far you've come.",
      text: "Mungkin jalannya belum selesai, tapi kamu sudah jauh dari titik awal."
    },
    {
      title: "For your future self.",
      text: "Apa pun yang kamu lakukan hari ini, semoga sedikit membantu dirimu yang akan datang."
    },
    {
      title: "You deserve soft days.",
      text: "Semoga hari ini tidak terlalu berat. Dan kalau berat, semoga kamu tidak menjalaninya sendirian."
    },
    {
      title: "It's okay to feel tired.",
      text: "Kamu manusia. Kamu boleh lelah tanpa harus merasa bersalah karena itu."
    },
    {
      title: "Keep going, softly.",
      text: "Tidak harus cepat. Yang penting kamu tetap memilih untuk melangkah."
    },
    {
      title: "A tiny bit of hope.",
      text: "Kadang satu alasan kecil untuk bertahan sudah cukup untuk melewati satu hari."
    },
    {
      title: "You matter.",
      text: "Bahkan pada hari ketika kamu merasa biasa saja, keberadaanmu tetap berarti."
    },
    {
      title: "No pressure.",
      text: "Hari ini tidak harus menjadi hari paling produktif dalam hidupmu."
    },
    {
      title: "Let yourself breathe.",
      text: "Tarik napas. Lepaskan bahu. Kamu sudah berusaha sejauh yang kamu bisa."
    },
    {
      title: "One more little step.",
      text: "Kalau semuanya terasa terlalu besar, pecah menjadi satu langkah kecil."
    },
    {
      title: "I hope today is kind.",
      text: "Semoga ada sesuatu yang sederhana hari ini yang membuat hatimu terasa sedikit lebih hangat."
    },
    {
      title: "You can begin again.",
      text: "Tidak ada aturan bahwa kamu hanya boleh mencoba sekali."
    },

    /* --- 45 pesan tambahan, biar siklusnya lebih jarang berulang --- */
    {
      title: "This counts too.",
      text: "Bertahan di hari yang biasa-biasa saja juga sebuah pencapaian."
    },
    {
      title: "Slow is still moving.",
      text: "Selama kamu belum berhenti, kamu tetap sedang berjalan."
    },
    {
      title: "For the quiet wins.",
      text: "Tidak semua kemenangan perlu tepuk tangan untuk terasa berarti."
    },
    {
      title: "A soft check-in.",
      text: "Sudah minum air belum? Sudah istirahat sebentar? Kamu penting untuk dijaga juga."
    },
    {
      title: "You're not behind.",
      text: "Tidak ada jadwal baku buat hidup. Kamu jalan di waktumu sendiri, dan itu cukup."
    },
    {
      title: "Let it be messy.",
      text: "Nggak semua hal harus rapi dari awal. Yang penting kamu mulai."
    },
    {
      title: "Today is enough.",
      text: "Kamu nggak perlu jadi versi terbaikmu setiap hari. Versi hari ini juga sah."
    },
    {
      title: "Little reminder.",
      text: "Kamu sudah bertahan di setiap hari sulit sejauh ini. Itu bukan kebetulan."
    },
    {
      title: "For the overthinking nights.",
      text: "Kalau pikiranmu ramai malam ini, coba taruh dulu satu per satu. Nggak harus selesai sekarang."
    },
    {
      title: "You're growing quietly.",
      text: "Beberapa perubahan baik nggak kelihatan langsung. Tapi tetap sedang terjadi."
    },
    {
      title: "Rest is productive too.",
      text: "Kadang hal paling produktif yang bisa kamu lakukan hari ini adalah berhenti sebentar."
    },
    {
      title: "You don't owe perfection.",
      text: "Berusaha itu cukup. Kamu nggak wajib sempurna buat pantas dihargai."
    },
    {
      title: "A gentle nudge.",
      text: "Kalau ada satu hal kecil yang kamu tunda karena takut, mungkin ini saatnya coba pelan-pelan."
    },
    {
      title: "For today's version of you.",
      text: "Apapun kondisimu hari ini, itu tetap versi kamu yang berharga."
    },
    {
      title: "Not every day needs meaning.",
      text: "Boleh kok kalau hari ini cuma dilewati biasa aja, tanpa harus jadi pelajaran besar."
    },
    {
      title: "You're allowed to ask for help.",
      text: "Minta tolong bukan tanda lemah. Itu tanda kamu tahu batasmu."
    },
    {
      title: "Small joys count.",
      text: "Secangkir minuman favorit, lagu yang pas, langit sore — hal kecil itu boleh jadi alasan senyum."
    },
    {
      title: "You're still worth it.",
      text: "Bahkan di hari kamu merasa kurang, nilai dirimu nggak berkurang sedikit pun."
    },
    {
      title: "For the days you compare yourself.",
      text: "Perjalanan orang lain nggak menentukan seberapa jauh langkahmu sendiri berarti."
    },
    {
      title: "It's fine to not be fine.",
      text: "Nggak semua hari harus baik-baik saja, dan itu nggak masalah."
    },
    {
      title: "You made it to today.",
      text: "Kadang cuma itu yang perlu dirayakan: kamu masih di sini, mencoba lagi."
    },
    {
      title: "Give yourself credit.",
      text: "Hal yang terasa berat buatmu sekarang, itu tetap usaha yang nyata — bukan hal remeh."
    },
    {
      title: "One kind thought.",
      text: "Coba kasih satu kalimat baik ke diri sendiri hari ini, sekecil apapun itu."
    },
    {
      title: "You're not too much.",
      text: "Perasaanmu valid, sebesar apapun itu. Kamu nggak perlu mengecilkannya."
    },
    {
      title: "For a softer tomorrow.",
      text: "Kalau hari ini terasa berantakan, besok tetap dapat kesempatan baru untuk dimulai."
    },
    {
      title: "You're doing more than you think.",
      text: "Hal-hal kecil yang kamu tahan sendirian itu sebenarnya nggak kecil sama sekali."
    },
    {
      title: "Permission to rest.",
      text: "Kamu diizinkan berhenti sebelum benar-benar habis tenaga, bukan cuma sesudahnya."
    },
    {
      title: "This is just a chapter.",
      text: "Apapun yang lagi kamu jalani sekarang, ini bukan seluruh cerita hidupmu."
    },
    {
      title: "You're safe to slow down.",
      text: "Nggak ada yang mengejarmu. Kamu boleh melambat kapan pun butuh."
    },
    {
      title: "For your effort today.",
      text: "Usaha yang nggak kelihatan orang lain tetap usaha yang nyata."
    },
    {
      title: "A little hope note.",
      text: "Hal baik nggak selalu datang besar-besaran. Kadang datang diam-diam, pelan-pelan."
    },
    {
      title: "You're allowed to change your mind.",
      text: "Berubah pikiran bukan berarti nggak konsisten. Itu tanda kamu terus belajar."
    },
    {
      title: "Look after yourself too.",
      text: "Di antara semua yang kamu urus buat orang lain, jangan lupa urus diri sendiri juga."
    },
    {
      title: "It's okay to move on your own timeline.",
      text: "Nggak ada yang telat kalau itu memang jalanmu sendiri."
    },
    {
      title: "You're more resilient than you know.",
      text: "Kamu udah lewatin hal-hal yang dulu kamu pikir bakal menghancurkanmu. Tapi ternyata nggak."
    },
    {
      title: "For the days that feel long.",
      text: "Kalau harinya kerasa panjang, coba fokus ke satu jam ke depan aja dulu."
    },
    {
      title: "A reminder to breathe out.",
      text: "Kadang kita lupa menghembuskan napas selega yang kita tarik. Coba sekarang."
    },
    {
      title: "You're not alone in this.",
      text: "Meski kerasa sendirian, ada yang peduli sama gimana kabarmu — termasuk lewat halaman kecil ini."
    },
    {
      title: "Progress isn't always visible.",
      text: "Nggak semua kemajuan bisa difoto atau dipamerkan. Beberapa cuma kamu yang tahu."
    },
    {
      title: "You get to define enough.",
      text: "Standar 'cukup' itu punyamu sendiri, bukan punya orang lain."
    },
    {
      title: "For your quiet strength.",
      text: "Kekuatan nggak selalu berisik. Kadang dia cuma terus bertahan, diam-diam."
    },
    {
      title: "You're not starting from zero.",
      text: "Semua yang udah kamu pelajari dan lewati tetap ikut sama kamu sampai sekarang."
    },
    {
      title: "One softer moment.",
      text: "Coba cari satu momen hari ini buat pelan-pelan aja, tanpa terburu-buru."
    },
    {
      title: "You're welcome here, always.",
      text: "Kapan pun kamu butuh singgah sebentar, halaman kecil ini nggak akan berubah."
    }
  ],

  /* PENUTUP (closings)
     -----------------------------------------------------------
     - Kalimat singkat, muncul di bawah pesan harian.
     - Siklusnya BEDA panjang dari dailyMessages (8 vs 75), jadi
       kombinasi "pesan harian + penutup" yang muncul bareng jarang
       sama persis dua kali — variasinya jauh lebih banyak daripada
       kelihatannya dari jumlah listnya. */
  closings: [
    "Aku cuma mau kamu baik-baik saja. ♡",
    "Semoga harimu sedikit lebih ringan setelah ini. ✦",
    "Keep going, at your own pace. 🌙",
    "Nggak perlu buru-buru. Kamu punya waktu. ♡",
    "Dan kalau hari ini berat, semoga besok sedikit lebih lembut.",
    "You’ve got this. Bahkan kalau pelan. ✦",
    "Jaga dirimu baik-baik, ya. ♡",
    "Small steps are still steps. ✦"
  ],

  /* Perubahan suasana berdasarkan bulan. Ini bukan hadiah/login reward;
     hanya membuat cerita terasa hidup sepanjang tahun. */
  monthThemes: {
    1: "bulan untuk mencoba lagi",
    2: "bulan untuk percaya lagi",
    3: "bulan untuk bertumbuh",
    4: "bulan untuk bernapas",
    5: "bulan untuk menikmati hal kecil",
    6: "bulan untuk tetap bertahan",
    7: "bulan untuk memberi ruang pada diri sendiri",
    8: "bulan untuk melihat seberapa jauh kamu sudah sampai",
    9: "bulan untuk memulai lagi",
    10: "bulan untuk berjalan pelan-pelan",
    11: "bulan untuk menjaga diri",
    12: "bulan untuk menghangatkan hati"
  },

  /* Special days memakai DAY DALAM SIKLUS.
     Contoh: 14 berarti 14 September. */
  specialDays: {
    14: {
      type: "shooting-star",
      kicker: "A LITTLE WISH",
      title: "Make a little wish ✦",
      text: "Berhenti sebentar malam ini. Pilih satu hal kecil yang benar-benar kamu inginkan, lalu simpan baik-baik."
    },

    30: {
      type: "memory",
      kicker: "ONE LITTLE MEMORY",
      title: "Something worth keeping.",
      text: "Coba ingat satu momen kecil dari bulan ini yang membuatmu merasa senang. Tidak harus besar."
    },

    60: {
      type: "moon",
      kicker: "A QUIET NIGHT",
      title: "You made it this far.",
      text: "Dua bulan sudah lewat. Pelan-pelan saja. Kamu masih di sini, dan itu layak dihargai."
    },

    90: {
      type: "letter",
      kicker: "A NOTE FOR YOU",
      title: "Dear future you…",
      text: "Semoga ketika kamu membaca ini nanti, kamu sudah lebih dekat dengan hal-hal yang sedang kamu perjuangkan."
    },

    120: {
      type: "star",
      kicker: "LOOK UP ✦",
      title: "There is still light.",
      text: "Kalau semuanya terasa gelap sebentar, jangan buru-buru menganggap cerita ini selesai."
    },

    150: {
      type: "flower",
      kicker: "A LITTLE BLOOM",
      title: "You are growing.",
      text: "Tidak semua pertumbuhan terlihat dari luar. Beberapa terjadi diam-diam di dalam diri."
    },

    180: {
      type: "halfway",
      kicker: "HALFWAY HOME",
      title: "Half a year already.",
      text: "Setengah perjalanan. Tidak perlu menghitung apa yang kurang. Lihat juga semua yang sudah kamu lewati."
    },

    210: {
      type: "moon",
      kicker: "FOR TONIGHT",
      title: "Rest is part of the story.",
      text: "Kamu tidak harus terus bergerak agar perjalananmu tetap berarti."
    },

    240: {
      type: "memory",
      kicker: "LOOK BACK",
      title: "Remember your little wins.",
      text: "Ada hal-hal yang dulu terasa sulit dan sekarang sudah biasa kamu jalani."
    },

    270: {
      type: "star",
      kicker: "A LITTLE LIGHT",
      title: "Keep your light.",
      text: "Jangan biarkan satu hari yang buruk membuatmu lupa pada banyak hari baik yang sudah kamu punya."
    },

    300: {
      type: "letter",
      kicker: "ALMOST THERE",
      title: "Look how far you've come.",
      text: "Tinggal sedikit lagi menuju satu tahun penuh. Terima kasih sudah terus berjalan."
    },

    330: {
      type: "shooting-star",
      kicker: "ONE LAST WISH",
      title: "Before we begin again…",
      text: "Simpan satu harapan kecil untuk tahun berikutnya. Tidak perlu sempurna. Cukup jujur."
    },

    365: {
      type: "ending",
      kicker: "DAY 365",
      title: "And somehow, you made it.",
      text: "Satu tahun penuh. Besok kita kembali ke awal lagi — bukan untuk mengulang semuanya, tapi untuk memulai bab baru."
    }
  },

  /* Pesan ketika dia kembali setelah beberapa hari.
     Dipakai sebagai variasi, bukan sistem streak. */
  returnMessages: {
    firstVisit: {
      kicker: "WELCOME BACK",
      title: "A little corner is still here. ♡",
      text: "Nggak perlu sering-sering datang. Kalau suatu hari kamu butuh tempat kecil untuk bernapas, cerita ini masih ada."
    },

    gap3: {
      kicker: "OH, YOU'RE BACK.",
      title: "I hope the days were kind.",
      text: "Apa pun yang terjadi beberapa hari terakhir, semoga sekarang kamu bisa memberi dirimu sedikit waktu untuk tenang."
    },

    gap7: {
      kicker: "IT'S BEEN A LITTLE WHILE",
      title: "Take your time.",
      text: "Tidak ada yang perlu dikejar di sini. Kamu datang kapan pun kamu mau."
    },

    gapLong: {
      kicker: "WELCOME BACK ♡",
      title: "No explanation needed.",
      text: "Sudah lama atau baru sebentar, nggak masalah. Yang penting sekarang kamu ada di sini."
    }
  }
};
