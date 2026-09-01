import { SandboxExercise } from "@/lib/sandbox/sandboxTypes";

export const LESSON_EXERCISES: Record<string, SandboxExercise> = {
  // ==========================================
  // STAGE 1: WEB FUNDAMENTALS
  // ==========================================
  "lesson-1-1": {
    id: "ex-1-1",
    lessonId: "lesson-1-1",
    lessonSlug: "pengenalan-web-dan-sejarah-singkat",
    title: "Mencetak Log Tiga Pilar Web",
    titleEn: "Logging the Three Pillars of Web",
    type: "javascript",
    instructions: "Gunakan `console.log()` untuk mencetak string 'HTML, CSS, JavaScript' ke console.",
    instructionsEn: "Use `console.log()` to print the string 'HTML, CSS, JavaScript' to the console.",
    taskGoal: "Cetak daftar 3 teknologi web utama ke konsol.",
    taskGoalEn: "Print the 3 core web technologies to the console.",
    hints: [
      "Gunakan fungsi bawaan `console.log('...')`.",
      "Pastikan ejaan dan koma sesuai: 'HTML, CSS, JavaScript'."
    ],
    hintsEn: [
      "Use the built-in `console.log('...')` function.",
      "Ensure exact capitalization: 'HTML, CSS, JavaScript'."
    ],
    starterCode: `// Tulis kode JavaScript Anda di bawah ini:\nconsole.log("...");`,
    solutionCode: `console.log("HTML, CSS, JavaScript");`,
    expectedOutput: "HTML, CSS, JavaScript",
  },
  "lesson-1-2": {
    id: "ex-1-2",
    lessonId: "lesson-1-2",
    lessonSlug: "bagaimana-internet-bekerja-klien-dan-server",
    title: "Simulasi Request-Response HTTP",
    titleEn: "HTTP Request-Response Simulation",
    type: "javascript",
    instructions: "Buat fungsi `fetchStatus(code)` yang mengembalikan string '200 OK' jika code bernilai 200, atau '404 Not Found' untuk lainnya. Kemudian jalankan `console.log(fetchStatus(200))`.",
    instructionsEn: "Write a function `fetchStatus(code)` that returns '200 OK' when code is 200, otherwise '404 Not Found'. Then call `console.log(fetchStatus(200))`.",
    taskGoal: "Memahami status code HTTP melalui logika kondisional sederhana.",
    taskGoalEn: "Understand HTTP status codes through conditional logic.",
    hints: [
      "Gunakan pernyataan `if (code === 200)`.",
      "Kembalikan string '200 OK' dan cetak hasilnya dengan `console.log()`."
    ],
    hintsEn: [
      "Use `if (code === 200)` statement.",
      "Return '200 OK' string and log it with `console.log()`."
    ],
    starterCode: `function fetchStatus(code) {\n  // Lengkapi fungsi di sini\n}\n\nconsole.log(fetchStatus(200));`,
    solutionCode: `function fetchStatus(code) {\n  if (code === 200) return "200 OK";\n  return "404 Not Found";\n}\n\nconsole.log(fetchStatus(200));`,
    expectedOutput: "200 OK",
  },

  // ==========================================
  // STAGE 2: HTML5 SEMANTIC & STRUCTURE
  // ==========================================
  "lesson-2-1": {
    id: "ex-2-1",
    lessonId: "lesson-2-1",
    lessonSlug: "anatomi-dokumen-html-dan-tag-dasar",
    title: "Menyusun Judul & Paragraf HTML",
    titleEn: "Composing HTML Heading & Paragraph",
    type: "html-css",
    instructions: "Buat tag `<h1>` dengan teks 'BelajarinAja' dan sebuah tag `<p>` dengan teks 'Belajar Web Development Modern'.",
    instructionsEn: "Create an `<h1>` tag with text 'BelajarinAja' and a `<p>` tag with text 'Belajar Web Development Modern'.",
    taskGoal: "Merender struktur judul dan paragraf di dalam browser.",
    taskGoalEn: "Render heading and paragraph structure inside the browser.",
    hints: [
      "Gunakan `<h1>BelajarinAja</h1>`.",
      "Gunakan `<p>Belajar Web Development Modern</p>`."
    ],
    hintsEn: [
      "Use `<h1>BelajarinAja</h1>`.",
      "Use `<p>Belajar Web Development Modern</p>`."
    ],
    starterCode: `<!-- Tulis struktur HTML Anda di sini -->\n<h1>...</h1>\n<p>...</p>`,
    solutionCode: `<h1>BelajarinAja</h1>\n<p>Belajar Web Development Modern</p>`,
    initialHtml: `<h1>BelajarinAja</h1>\n<p>Belajar Web Development Modern</p>`,
  },
  "lesson-2-2": {
    id: "ex-2-2",
    lessonId: "lesson-2-2",
    lessonSlug: "elemen-semantik-html5-header-nav-main-footer",
    title: "Struktur Semantik Header & Navigation",
    titleEn: "Semantic Header & Navigation Structure",
    type: "html-css",
    instructions: "Buat elemen `<header>` yang membungkus sebuah tag `<nav>` berisi link `<a href=\"#\">Home</a>`.",
    instructionsEn: "Create a `<header>` element wrapping a `<nav>` containing a link `<a href=\"#\">Home</a>`.",
    taskGoal: "Menerapkan hierarki semantik HTML5 yang ramah SEO dan aksesibilitas.",
    taskGoalEn: "Apply HTML5 semantic hierarchy for SEO and accessibility.",
    hints: [
      "Struktur yang benar: `<header><nav><a href=\"#\">Home</a></nav></header>`."
    ],
    hintsEn: [
      "Proper structure: `<header><nav><a href=\"#\">Home</a></nav></header>`."
    ],
    starterCode: `<header>\n  <nav>\n    <!-- Tambahkan link di sini -->\n  </nav>\n</header>`,
    solutionCode: `<header>\n  <nav>\n    <a href="#">Home</a>\n  </nav>\n</header>`,
  },

  // ==========================================
  // STAGE 3: MODERN CSS FUNDAMENTALS
  // ==========================================
  "lesson-3-1": {
    id: "ex-3-1",
    lessonId: "lesson-3-1",
    lessonSlug: "sintaks-css-selector-dan-spesifisitas",
    title: "Styling Heading dengan CSS Selector",
    titleEn: "Styling Heading with CSS Selectors",
    type: "html-css",
    instructions: "Tulis CSS di dalam tag `<style>` untuk mengubah warna teks `h1` menjadi `#D97706` dan `font-size` menjadi `24px`.",
    instructionsEn: "Write CSS inside `<style>` to set `h1` color to `#D97706` and `font-size` to `24px`.",
    taskGoal: "Menerapkan aturan styling CSS pada elemen HTML spesifik.",
    taskGoalEn: "Apply CSS styling rules to a specific HTML element.",
    hints: [
      "Gunakan selector `h1 { color: #D97706; font-size: 24px; }`."
    ],
    hintsEn: [
      "Use selector `h1 { color: #D97706; font-size: 24px; }`."
    ],
    starterCode: `<style>\n  h1 {\n    /* Tulis CSS di sini */\n  }\n</style>\n\n<h1>Halo Web Developer!</h1>`,
    solutionCode: `<style>\n  h1 {\n    color: #D97706;\n    font-size: 24px;\n  }\n</style>\n\n<h1>Halo Web Developer!</h1>`,
  },
  "lesson-3-2": {
    id: "ex-3-2",
    lessonId: "lesson-3-2",
    lessonSlug: "css-box-model-margin-border-padding",
    title: "Eksplorasi Visual CSS Box Model",
    titleEn: "Visual Exploration of CSS Box Model",
    type: "box-model",
    instructions: "Atur properti `.card` dengan `padding: 20px;`, `border: 2px solid black;`, dan `margin: 16px;`.",
    instructionsEn: "Set `.card` properties with `padding: 20px;`, `border: 2px solid black;`, and `margin: 16px;`.",
    taskGoal: "Memahami batas Content, Padding, Border, dan Margin secara visual.",
    taskGoalEn: "Understand Content, Padding, Border, and Margin boundaries visually.",
    hints: [
      "Tambahkan `padding: 20px; border: 2px solid black; margin: 16px;` ke class `.card`."
    ],
    hintsEn: [
      "Add `padding: 20px; border: 2px solid black; margin: 16px;` to `.card` class."
    ],
    starterCode: `<style>\n  .card {\n    background: #FFD84D;\n    /* Tambahkan padding, border, dan margin */\n  }\n</style>\n\n<div class="card">\n  <strong>Box Model Card</strong>\n</div>`,
    solutionCode: `<style>\n  .card {\n    background: #FFD84D;\n    padding: 20px;\n    border: 2px solid black;\n    margin: 16px;\n  }\n</style>\n\n<div class="card">\n  <strong>Box Model Card</strong>\n</div>`,
  },

  // ==========================================
  // STAGE 4: ADVANCED LAYOUT (FLEXBOX & GRID)
  // ==========================================
  "lesson-4-1": {
    id: "ex-4-1",
    lessonId: "lesson-4-1",
    lessonSlug: "css-flexbox-tata-letak-1-dimensi",
    title: "Pusatkan Elemen dengan Flexbox",
    titleEn: "Center Elements with Flexbox",
    type: "flexbox",
    instructions: "Ubah container `.flex-container` agar menggunakan `display: flex;`, `justify-content: center;`, dan `align-items: center;`.",
    instructionsEn: "Update `.flex-container` with `display: flex;`, `justify-content: center;`, and `align-items: center;`.",
    taskGoal: "Membuat tata letak responsif 1-dimensi dengan perataan sempurna.",
    taskGoalEn: "Create a 1-dimensional responsive layout with perfect alignment.",
    hints: [
      "Gunakan `display: flex; justify-content: center; align-items: center;`."
    ],
    hintsEn: [
      "Use `display: flex; justify-content: center; align-items: center;`."
    ],
    starterCode: `<style>\n  .flex-container {\n    height: 140px;\n    background: #FFF8E7;\n    border: 2px dashed #FED7AA;\n    /* Aktifkan Flexbox di sini */\n  }\n  .badge {\n    background: #5CC8FF;\n    padding: 8px 16px;\n    border-radius: 99px;\n    font-weight: bold;\n  }\n</style>\n\n<div class="flex-container">\n  <div class="badge">Centered Badge</div>\n</div>`,
    solutionCode: `<style>\n  .flex-container {\n    height: 140px;\n    background: #FFF8E7;\n    border: 2px dashed #FED7AA;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n  }\n  .badge {\n    background: #5CC8FF;\n    padding: 8px 16px;\n    border-radius: 99px;\n    font-weight: bold;\n  }\n</style>\n\n<div class="flex-container">\n  <div class="badge">Centered Badge</div>\n</div>`,
  },
  "lesson-4-2": {
    id: "ex-4-2",
    lessonId: "lesson-4-2",
    lessonSlug: "css-grid-tata-letak-2-dimensi",
    title: "Menyusun Galeri 3 Kolom dengan CSS Grid",
    titleEn: "Building a 3-Column Grid Gallery",
    type: "grid",
    instructions: "Gunakan `display: grid;` dan `grid-template-columns: repeat(3, 1fr); gap: 12px;` pada `.grid-container`.",
    instructionsEn: "Use `display: grid;` and `grid-template-columns: repeat(3, 1fr); gap: 12px;` on `.grid-container`.",
    taskGoal: "Membangun sistem tata letak 2 dimensi modern.",
    taskGoalEn: "Build a modern 2-dimensional grid layout system.",
    hints: [
      "Kombinasikan `display: grid;` dengan `grid-template-columns: repeat(3, 1fr);` dan `gap: 12px;`."
    ],
    hintsEn: [
      "Combine `display: grid;` with `grid-template-columns: repeat(3, 1fr);` and `gap: 12px;`."
    ],
    starterCode: `<style>\n  .grid-container {\n    /* Tulis CSS Grid di sini */\n  }\n  .item {\n    background: #45E0C0;\n    padding: 12px;\n    text-align: center;\n    font-weight: bold;\n    border-radius: 8px;\n  }\n</style>\n\n<div class="grid-container">\n  <div class="item">Item 1</div>\n  <div class="item">Item 2</div>\n  <div class="item">Item 3</div>\n</div>`,
    solutionCode: `<style>\n  .grid-container {\n    display: grid;\n    grid-template-columns: repeat(3, 1fr);\n    gap: 12px;\n  }\n  .item {\n    background: #45E0C0;\n    padding: 12px;\n    text-align: center;\n    font-weight: bold;\n    border-radius: 8px;\n  }\n</style>\n\n<div class="grid-container">\n  <div class="item">Item 1</div>\n  <div class="item">Item 2</div>\n  <div class="item">Item 3</div>\n</div>`,
  },

  // ==========================================
  // STAGE 5: JAVASCRIPT FUNDAMENTALS
  // ==========================================
  "lesson-5-1": {
    id: "ex-5-1",
    lessonId: "lesson-5-1",
    lessonSlug: "variabel-tipe-data-dan-operator",
    title: "Deklarasi Variabel & String Interpolation",
    titleEn: "Variable Declaration & String Interpolation",
    type: "javascript",
    instructions: "Deklarasikan `const name = 'Acelino';` dan `const role = 'Web Developer';`. Kemudian cetak string template `${name} is a ${role}` ke console.",
    instructionsEn: "Declare `const name = 'Acelino';` and `const role = 'Web Developer';`. Then log `${name} is a ${role}` to the console.",
    taskGoal: "Memahami variabel konstanta dan template literals di JavaScript.",
    taskGoalEn: "Understand constant variables and template literals in JavaScript.",
    hints: [
      "Gunakan backtick (`) untuk template literal: `${name} is a ${role}`.",
      "Cetak dengan `console.log(...)`."
    ],
    hintsEn: [
      "Use backticks (`) for template literals: `${name} is a ${role}`.",
      "Print with `console.log(...)`."
    ],
    starterCode: `const name = "Acelino";\nconst role = "Web Developer";\n\n// Cetak template literal di sini:\nconsole.log(...);`,
    solutionCode: `const name = "Acelino";\nconst role = "Web Developer";\n\nconsole.log(\`\${name} is a \${role}\`);`,
    expectedOutput: "Acelino is a Web Developer",
  },
  "lesson-5-2": {
    id: "ex-5-2",
    lessonId: "lesson-5-2",
    lessonSlug: "fungsi-scope-dan-arrow-functions",
    title: "Membuat Arrow Function Kalkulator Luas",
    titleEn: "Building Area Calculator Arrow Function",
    type: "javascript",
    instructions: "Buat arrow function `const calculateArea = (width, height) => width * height;`. Cetak hasil pemanggilan `calculateArea(10, 5)` ke console.",
    instructionsEn: "Create arrow function `const calculateArea = (width, height) => width * height;`. Log the result of `calculateArea(10, 5)` to the console.",
    taskGoal: "Menguasai sintaks arrow function dan parameter input.",
    taskGoalEn: "Master arrow function syntax and input parameters.",
    hints: [
      "Gunakan `const calculateArea = (w, h) => w * h;`.",
      "Cetak dengan `console.log(calculateArea(10, 5))`."
    ],
    hintsEn: [
      "Use `const calculateArea = (w, h) => w * h;`.",
      "Print with `console.log(calculateArea(10, 5))`."
    ],
    starterCode: `// Buat fungsi calculateArea di sini:\nconst calculateArea = ...\n\nconsole.log(calculateArea(10, 5));`,
    solutionCode: `const calculateArea = (width, height) => width * height;\n\nconsole.log(calculateArea(10, 5));`,
    expectedOutput: "50",
  },

  // ==========================================
  // STAGE 6: DOM MANIPULATION & EVENTS
  // ==========================================
  "lesson-6-1": {
    id: "ex-6-1",
    lessonId: "lesson-6-1",
    lessonSlug: "memahami-dom-dan-query-selector",
    title: "Mengubah Konten Teks Elemen DOM",
    titleEn: "Modifying DOM Element Text Content",
    type: "dom-interactive",
    instructions: "Gunakan `document.getElementById('target-heading').textContent = 'Selamat Datang di BelajarinAja';` untuk memperbarui teks heading.",
    instructionsEn: "Use `document.getElementById('target-heading').textContent = 'Selamat Datang di BelajarinAja';` to update heading text.",
    taskGoal: "Berinteraksi langsung dengan node Document Object Model.",
    taskGoalEn: "Interact directly with Document Object Model nodes.",
    hints: [
      "Ambil elemen dengan `document.getElementById('target-heading')`.",
      "Ubah properti `textContent` atau `innerText`."
    ],
    hintsEn: [
      "Select element with `document.getElementById('target-heading')`.",
      "Update `textContent` or `innerText` property."
    ],
    starterCode: `<h2 id="target-heading">Teks Lama</h2>\n\n<script>\n  // Update teks heading di sini:\n  const heading = document.getElementById("target-heading");\n  heading.textContent = "Selamat Datang di BelajarinAja";\n</script>`,
    solutionCode: `<h2 id="target-heading">Teks Lama</h2>\n\n<script>\n  const heading = document.getElementById("target-heading");\n  heading.textContent = "Selamat Datang di BelajarinAja";\n</script>`,
  },
  "lesson-6-2": {
    id: "ex-6-2",
    lessonId: "lesson-6-2",
    lessonSlug: "event-handling-click-input-submit",
    title: "Memasang Interactive Click Event Listener",
    titleEn: "Attaching Interactive Click Event Listener",
    type: "dom-interactive",
    instructions: "Pasang event listener click pada tombol `#btn-action` yang ketika diklik akan mengubah teks `#status-msg` menjadi 'Tombol Berhasil Diklik!'.",
    instructionsEn: "Attach a click event listener on button `#btn-action` to change `#status-msg` text to 'Tombol Berhasil Diklik!'.",
    taskGoal: "Merespons aksi pengguna secara dinamis melalui Event Listener.",
    taskGoalEn: "Respond to user actions dynamically via Event Listeners.",
    hints: [
      "Gunakan `button.addEventListener('click', () => { ... })`."
    ],
    hintsEn: [
      "Use `button.addEventListener('click', () => { ... })`."
    ],
    starterCode: `<button id="btn-action" style="padding: 8px 16px; background: #FFD84D; border: 2px solid black; border-radius: 8px; font-weight: bold; cursor: pointer;">\n  Klik Saya!\n</button>\n<p id="status-msg" style="margin-top: 10px; font-weight: bold;">Menunggu klik...</p>\n\n<script>\n  const btn = document.getElementById("btn-action");\n  const status = document.getElementById("status-msg");\n\n  btn.addEventListener("click", () => {\n    status.textContent = "Tombol Berhasil Diklik!";\n  });\n</script>`,
    solutionCode: `<button id="btn-action" style="padding: 8px 16px; background: #FFD84D; border: 2px solid black; border-radius: 8px; font-weight: bold; cursor: pointer;">\n  Klik Saya!\n</button>\n<p id="status-msg" style="margin-top: 10px; font-weight: bold;">Menunggu klik...</p>\n\n<script>\n  const btn = document.getElementById("btn-action");\n  const status = document.getElementById("status-msg");\n\n  btn.addEventListener("click", () => {\n    status.textContent = "Tombol Berhasil Diklik!";\n  });\n</script>`,
  },

  // ==========================================
  // STAGE 7: ASYNCHRONOUS JAVASCRIPT
  // ==========================================
  "lesson-7-1": {
    id: "ex-7-1",
    lessonId: "lesson-7-1",
    lessonSlug: "asynchronous-javascript-promise-dan-async-await",
    title: "Mengambil Data Asinkron dengan Async/Await",
    titleEn: "Fetching Asynchronous Data with Async/Await",
    type: "javascript",
    instructions: "Buat fungsi async `fetchUser()` yang me-resolve Promise dengan string 'User Data Loaded'. Cetak hasilnya ke console.",
    instructionsEn: "Create an async function `fetchUser()` that resolves a Promise with 'User Data Loaded'. Log result to console.",
    taskGoal: "Menguasai penanganan operasi asinkron non-blocking.",
    taskGoalEn: "Master non-blocking asynchronous operations handling.",
    hints: [
      "Gunakan `async function fetchUser() { return 'User Data Loaded'; }`.",
      "Panggil `fetchUser().then(res => console.log(res))`."
    ],
    hintsEn: [
      "Use `async function fetchUser() { return 'User Data Loaded'; }`.",
      "Call `fetchUser().then(res => console.log(res))`."
    ],
    starterCode: `async function fetchUser() {\n  return "User Data Loaded";\n}\n\nfetchUser().then((res) => console.log(res));`,
    solutionCode: `async function fetchUser() {\n  return "User Data Loaded";\n}\n\nfetchUser().then((res) => console.log(res));`,
    expectedOutput: "User Data Loaded",
  },
};

export function getExerciseForLesson(lessonId: string, lessonSlug: string, lessonTitle: string): SandboxExercise {
  if (LESSON_EXERCISES[lessonId]) {
    return LESSON_EXERCISES[lessonId];
  }

  // Fallback dynamic generator based on lesson domain
  return {
    id: `ex-gen-${lessonId}`,
    lessonId,
    lessonSlug,
    title: `Latihan Kode: ${lessonTitle}`,
    titleEn: `Coding Challenge: ${lessonTitle}`,
    type: "javascript",
    instructions: `Tulis kode JavaScript untuk menguji dan memvalidasi pemahaman materi ${lessonTitle}. Cetak 'Verified: ${lessonTitle}' ke konsol.`,
    instructionsEn: `Write JavaScript code to test and validate your comprehension of ${lessonTitle}. Log 'Verified: ${lessonTitle}' to the console.`,
    taskGoal: `Mempraktikkan konsep pemrograman yang dipelajari pada modul ${lessonTitle}.`,
    taskGoalEn: `Practice programming concepts taught in the ${lessonTitle} module.`,
    hints: [
      `Gunakan console.log("Verified: ${lessonTitle}")`,
      "Pastikan sintaks JavaScript valid dan tidak ada error sintaks."
    ],
    hintsEn: [
      `Use console.log("Verified: ${lessonTitle}")`,
      "Ensure valid JavaScript syntax without syntax errors."
    ],
    starterCode: `// Latihan Praktik: ${lessonTitle}\nconsole.log("Verified: ${lessonTitle}");`,
    solutionCode: `console.log("Verified: ${lessonTitle}");`,
    expectedOutput: `Verified: ${lessonTitle}`,
  };
}
