export interface GlossaryItem {
  term: string;
  category: "Web Basics" | "Frontend" | "Backend" | "Database & DevOps";
  definitionId: string;
  definitionEn: string;
  exampleId?: string;
  exampleEn?: string;
}

export const GLOSSARY_TERMS: GlossaryItem[] = [
  {
    term: "HTML (HyperText Markup Language)",
    category: "Web Basics",
    definitionId: "Bahasa markah standar untuk menyusun kerangka dan struktur dasar halaman web, seperti paragraf, judul, gambar, dan formulir.",
    definitionEn: "Standard markup language used to structure web pages, including paragraphs, headings, images, and forms.",
    exampleId: "<h1>Judul Website</h1> atau <p>Paragraf teks.</p>",
    exampleEn: "<h1>Website Title</h1> or <p>Text paragraph.</p>",
  },
  {
    term: "CSS (Cascading Style Sheets)",
    category: "Web Basics",
    definitionId: "Bahasa aturan gaya yang digunakan untuk mengatur tampilan visual elemen HTML, seperti warna, ukuran teks, jarak antar elemen, dan tata letak responsif.",
    definitionEn: "Style sheet language used to describe the presentation and visual styling of HTML elements.",
    exampleId: "color: #38BDF8; font-size: 16px; display: flex;",
    exampleEn: "color: #38BDF8; font-size: 16px; display: flex;",
  },
  {
    term: "JavaScript",
    category: "Web Basics",
    definitionId: "Bahasa pemrograman dinamis yang memberikan kemampuan interaktivitas pada halaman web, seperti validasi input, kalkulasi data, dan pembaruan konten tanpa reload.",
    definitionEn: "Dynamic programming language that enables interactive features and dynamic behavior on web pages.",
    exampleId: "button.addEventListener('click', () => alert('Halo!'));",
    exampleEn: "button.addEventListener('click', () => alert('Hello!'));",
  },
  {
    term: "DOM (Document Object Model)",
    category: "Frontend",
    definitionId: "Representasi pohon data dari struktur dokumen HTML yang dibuat oleh browser saat memuat halaman, memungkinkan JavaScript membaca dan memodifikasi konten visual secara langsung.",
    definitionEn: "Tree-structured programming interface representing HTML documents in memory for JavaScript manipulation.",
    exampleId: "document.getElementById('header-title').innerText = 'Selamat Datang';",
    exampleEn: "document.getElementById('header-title').innerText = 'Welcome';",
  },
  {
    term: "Browser",
    category: "Web Basics",
    definitionId: "Aplikasi perangkat lunak (seperti Google Chrome atau Firefox) yang bertugas meminta file website dari server, menerjemahkan kode HTML/CSS/JS, dan menampilkannya kepada pengguna.",
    definitionEn: "Software application used to fetch, parse, and render web pages from internet servers.",
  },
  {
    term: "HTTP / HTTPS",
    category: "Web Basics",
    definitionId: "Protokol standar pertukaran data antara browser (client) dan server web. Versi HTTPS dilengkapi enkripsi SSL/TLS agar transmisi data aman dari penyadapan.",
    definitionEn: "Hypertext Transfer Protocol for communication between web clients and servers. HTTPS adds SSL/TLS encryption.",
  },
  {
    term: "DNS (Domain Name System)",
    category: "Web Basics",
    definitionId: "Sistem buku alamat internet yang bertugas menerjemahkan nama domain yang mudah dibaca manusia (seperti belajarinaja.com) menjadi alamat IP angka komputer server.",
    definitionEn: "Internet phonebook that translates human-readable domain names into numerical IP addresses.",
  },
  {
    term: "URL (Uniform Resource Locator)",
    category: "Web Basics",
    definitionId: "Alamat lengkap yang menunjuk lokasi spesifik suatu berkas atau halaman di jaringan internet.",
    definitionEn: "Unique address that specifies the location of a resource on the web.",
    exampleId: "https://belajarinaja.com/roadmap",
    exampleEn: "https://belajarinaja.com/roadmap",
  },
  {
    term: "Frontend",
    category: "Frontend",
    definitionId: "Bagian dari aplikasi web yang berjalan langsung di browser pengguna dan dapat dilihat serta diinteraksikan secara visual.",
    definitionEn: "The client-side part of a web application rendered directly inside the user's browser.",
  },
  {
    term: "Backend",
    category: "Backend",
    definitionId: "Bagian dari aplikasi web yang berjalan di server, bertugas memproses logika bisnis, menjaga keamanan data, dan berkomunikasi dengan database.",
    definitionEn: "The server-side part of an application responsible for business logic, data persistence, and security.",
  },
  {
    term: "API (Application Programming Interface)",
    category: "Backend",
    definitionId: "Kumpulan aturan dan titik komunikasi (endpoint) yang memungkinkan dua sistem perangkat lunak saling bertukar data secara terstruktur.",
    definitionEn: "Set of protocols and endpoints enabling different software systems to communicate and exchange data.",
  },
  {
    term: "REST (Representational State Transfer)",
    category: "Backend",
    definitionId: "Arsitektur standar perancangan API web yang memanfaatkan metode HTTP baku (GET, POST, PUT, DELETE) untuk mengelola data.",
    definitionEn: "Architectural style for web APIs using standard HTTP methods for data operations.",
  },
  {
    term: "JSON (JavaScript Object Notation)",
    category: "Web Basics",
    definitionId: "Format teks pertukaran data ringan yang mudah dibaca manusia dan mudah diproses oleh komputer.",
    definitionEn: "Lightweight text-based data interchange format widely used in web APIs.",
    exampleId: '{"name": "Marchelino", "role": "Student"}',
    exampleEn: '{"name": "Marchelino", "role": "Student"}',
  },
  {
    term: "Git & Repository",
    category: "Database & DevOps",
    definitionId: "Git adalah sistem pelacak riwayat perubahan kode (Version Control). Repository adalah direktori penyimpanan proyek yang dikelola oleh Git.",
    definitionEn: "Git is a distributed version control system. A repository is the storage directory tracking project history.",
  },
  {
    term: "TypeScript",
    category: "Frontend",
    definitionId: "Superset bahasa dari JavaScript yang menambahkan sistem tipe data statis untuk mencegah kesalahan ketik dan bug sebelum program dijalankan.",
    definitionEn: "Typed superset of JavaScript that compiles to plain JavaScript, preventing type errors during development.",
  },
  {
    term: "React & Component",
    category: "Frontend",
    definitionId: "React adalah library UI deklaratif. Component adalah blok pembangun UI modular yang dapat digunakan kembali berkali-kali.",
    definitionEn: "React is a UI library. A component is an isolated, reusable block of user interface code.",
  },
  {
    term: "State & Props",
    category: "Frontend",
    definitionId: "State adalah data internal komponen yang dapat berubah dan memicu render ulang. Props adalah argumen data yang dikirimkan dari komponen induk ke komponen anak.",
    definitionEn: "State is mutable component data. Props are read-only properties passed down from parent components.",
  },
  {
    term: "Next.js & App Router",
    category: "Frontend",
    definitionId: "Framework React untuk membangun aplikasi web produksi dengan fitur rendering server, routing berbasis folder (App Router), dan optimasi otomatis.",
    definitionEn: "Production React framework offering server-side rendering, folder-based App Router, and built-in optimization.",
  },
  {
    term: "Database & PostgreSQL",
    category: "Database & DevOps",
    definitionId: "Database adalah tempat penyimpanan data terstruktur. PostgreSQL adalah sistem manajemen database relasional SQL sumber terbuka yang tangguh dan terpercaya.",
    definitionEn: "A database stores persistent application data. PostgreSQL is a robust, open-source relational SQL database.",
  },
  {
    term: "ORM (Object-Relational Mapping) & Prisma",
    category: "Database & DevOps",
    definitionId: "Alat bantu yang memungkinkan developer mengakses dan memanipulasi database menggunakan kode objek pemrograman tanpa harus menulis raw SQL secara manual.",
    definitionEn: "Technology bridging database tables with programming objects. Prisma is a type-safe TypeScript ORM.",
  },
  {
    term: "Authentication & Authorization",
    category: "Backend",
    definitionId: "Authentication adalah proses verifikasi 'Siapa Anda' (login/password). Authorization adalah proses verifikasi 'Hak apa yang Anda miliki' (akses peran).",
    definitionEn: "Authentication verifies user identity. Authorization determines user permissions and access rights.",
  },
  {
    term: "Deployment & CI/CD",
    category: "Database & DevOps",
    definitionId: "Deployment adalah proses merilis aplikasi ke server cloud publik agar dapat diakses oleh pengguna umum. CI/CD adalah otomatisasi pengujian dan perilisannya.",
    definitionEn: "Deployment publishes code to production cloud servers. CI/CD automates testing and deployment workflows.",
  },
  {
    term: "Core Web Vitals & SEO",
    category: "Frontend",
    definitionId: "Metrik standar performa kecepatan dan stabilitas visual halaman web (LCP, CLS, FID) yang dinilai oleh Google untuk menentukan kualitas pengalaman pengguna dan peringkat pencarian.",
    definitionEn: "Standardized performance metrics measuring loading speed, visual stability, and search engine readiness.",
  },
];
