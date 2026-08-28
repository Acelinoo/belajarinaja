# 🎨 BelajarinAja — Design System & Visual UI Token Specification (design.md)
> **Product**: BelajarinAja — Platform Belajar Web Development Terstruktur Dari Nol  
> **Target Platform**: Next.js 16 (App Router) + Tailwind CSS + Radix UI / Shadcn UI + Framer Motion / React Bits  
> **Status**: Production-Ready Design Tokens & Architecture Blueprint  
> **Theme Mode**: Dark-First (Obsidian Dark `#090A0C` default), Full Light Mode Support

---

## 1. Design Philosophy & Visual Principles

BelajarinAja dirancang untuk memberikan pengalaman belajar pemrograman web yang terarah, cepat, fokus, dan nyaman untuk sesi belajar panjang (*long coding sessions*). Desain antarmuka memprioritaskan keterbacaan kode (*syntax legibility*), visual hierarki yang tajam, dan interaksi yang halus tanpa *visual clutter* atau *AI-slop*.

### Core Principles
1. **Focus on Code & Knowledge**: Antarmuka tidak mengalihkan perhatian dari materi pelajaran dan editor kode. Kontras warna dan tipografi dioptimalkan untuk keterbacaan tinggi.
2. **Zero-Slop Agency Quality**: Menolak estetika generator generik seperti neon menyilaukan, teks gradien murahan, icon container warna-warni berlebih, dan pill badge melayang yang tidak fungsional.
3. **Structured & Purposeful**: Setiap warna, border mikro, dan animasi memiliki tujuan fungsional yang jelas (status progress, navigasi roadmap, feedback interaksi).
4. **Fluid Responsiveness**: Pengalaman belajar mulus di desktop, tablet, dan mobile dengan arsitektur App Shell yang adaptif.

---

## 2. Color System & Design Tokens

### 2.1 Dark Mode Surface Hierarchy (Default)

| Token Name | HEX | HSL | Semantic Role / Usage |
| :--- | :--- | :--- | :--- |
| `--color-bg-base` | `#090A0C` | `220° 14% 4%` | Canvas & viewport background utama (Obsidian Dark) |
| `--color-bg-surface` | `#121318` | `228° 14% 8%` | Card background, container roadmap, table body |
| `--color-bg-elevated` | `#181A22` | `227° 17% 11%` | Modal dialog, slide-over panel, popover, dropdown |
| `--color-bg-sidebar` | `#0E0F12` | `225° 13% 6%` | Persistent left sidebar (1 shade darker than base) |
| `--color-bg-sunken` | `#060708` | `210° 14% 3%` | Code block containers, terminal outputs, exercise sandbox |
| `--color-border-subtle` | `#222634` | `226° 21% 17%` | Micro-borders pada cards, separators, inputs |
| `--color-border-strong` | `#32384E` | `227° 21% 25%` | Active states, hover border on interactive cards |
| `--color-border-focus` | `#6366F1` | `239° 84% 67%` | Focus ring outline, active keyboard navigation |

### 2.2 Light Mode Surface Hierarchy

| Token Name | HEX | HSL | Semantic Role / Usage |
| :--- | :--- | :--- | :--- |
| `--color-bg-base` | `#FBFBFA` | `60° 8% 98%` | Canvas & viewport background utama |
| `--color-bg-surface` | `#FFFFFF` | `0° 0% 100%` | Card background, lesson reader canvas, tables |
| `--color-bg-elevated` | `#F4F4F5` | `240° 5% 96%` | Modal dialog, dropdowns, popovers |
| `--color-bg-sidebar` | `#F5F5F4` | `60° 5% 96%` | Left navigation sidebar |
| `--color-bg-sunken` | `#EFEFEF` | `0° 0% 94%` | Code blocks, read-only exercise inputs |
| `--color-border-subtle` | `#E4E4E7` | `240° 6% 90%` | Card boundaries, dividers |
| `--color-border-strong` | `#D4D4D8` | `240° 5% 84%` | Hover borders, active inputs |
| `--color-border-focus` | `#4F46E5` | `244° 75% 59%` | Focus ring outline |

### 2.3 Brand Accents & Semantic Colors

| Token Name | Dark HEX | Light HEX | Role & Description |
| :--- | :--- | :--- | :--- |
| `--color-accent-primary` | `#6366F1` | `#4F46E5` | Indigo accent untuk primary CTA, active navigation bar |
| `--color-accent-hover` | `#4F46E5` | `#4338CA` | Hover state pada primary buttons |
| `--color-accent-muted-bg`| `rgba(99, 102, 241, 0.12)` | `rgba(79, 70, 229, 0.08)` | Active tab/sidebar indicator background |
| `--color-success` | `#10B981` | `#059669` | Quiz passed, module completed, verification badge |
| `--color-success-bg` | `rgba(16, 185, 129, 0.12)` | `rgba(5, 150, 105, 0.10)` | Success pill tag background |
| `--color-warning` | `#F59E0B` | `#D97706` | In-progress tasks, prerequisite warning alerts |
| `--color-warning-bg` | `rgba(245, 158, 11, 0.12)` | `rgba(217, 119, 6, 0.10)` | Warning notification banner |
| `--color-danger` | `#EF4444` | `#DC2626` | Quiz failed, destructive action, error states |
| `--color-danger-bg` | `rgba(239, 68, 68, 0.12)` | `rgba(220, 38, 38, 0.10)` | Error validation box |
| `--color-info` | `#06B6D4` | `#0891B2` | Cyan accent for lesson tips & guest prompt notices |

### 2.4 Typography Color Tokens

| Token Name | Dark Mode | Light Mode | Application |
| :--- | :--- | :--- | :--- |
| `--color-text-primary` | `#F3F4F6` (Gray-100) | `#090A0C` (Obsidian) | Judul H1-H6, teks utama materi, label tombol |
| `--color-text-secondary`| `#9CA3AF` (Gray-400) | `#4B5563` (Gray-600) | Deskripsi modul, breadcrumbs, helper texts |
| `--color-text-tertiary` | `#6B7280` (Gray-500) | `#9CA3AF` (Gray-400) | Meta info, estimasi waktu belajar, footer credits |
| `--color-text-accent` | `#818CF8` (Indigo-400) | `#4F46E5` (Indigo-600) | Link aktif, nomor urut milestone, highlight kata kunci |

---

## 3. Typography Hierarchy & Font Stack

### 3.1 Font Families
* **Font Sans (Primary UI & Prose)**: `Plus Jakarta Sans`, `Inter`, `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
* **Font Mono (Code & Exercise Sandbox)**: `JetBrains Mono`, `Fira Code`, `ui-monospace, SFMono-Regular, monospace`

### 3.2 Typography Scale & Tracking

| Level | Size (rem / px) | Line Height | Weight | Letter Spacing | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `text-display` | `2.5rem / 40px` | `1.15` | `700 (Bold)` | `-0.03em` | Hero landing header, milestone capstone titles |
| `text-h1` | `2.0rem / 32px` | `1.2` | `600 (Semibold)` | `-0.025em` | Page header, Lesson title utama |
| `text-h2` | `1.5rem / 24px` | `1.3` | `600 (Semibold)` | `-0.02em` | Section heading, Stage title pada roadmap |
| `text-h3` | `1.25rem / 20px` | `1.35` | `600 (Semibold)` | `-0.015em` | Card title, Quiz question headers |
| `text-base` | `1.0rem / 16px` | `1.65` | `400 (Regular)` | `0em` | Body text materi lesson, artikel, penjelasan teori |
| `text-sm` | `0.875rem / 14px` | `1.5` | `400 / 500` | `0em` | Table data, form input, helper messages, badges |
| `text-xs` | `0.75rem / 12px` | `1.4` | `500 (Medium)` | `+0.04em` | Category overlines, mono counters (`01 //`), timestamps |
| `text-mono-code` | `0.875rem / 14px` | `1.6` | `400 / 500` | `0em` | Code block snippets, syntax highlighter, sandbox editor |

*Max prose width for lesson readability:* `max-w-[75ch]` (75 karakter per baris agar mata tidak lelah).

---

## 4. Spacing Scale & Density Governance

### 4.1 Spacing Scale (Tailwind / Custom Properties)

```css
/* App UI Density Spacing Scale */
--space-app-1: 4px;   /* gap mikro antar ikon & teks */
--space-app-2: 8px;   /* padding internal pill / status badge */
--space-app-3: 12px;  /* margin antar elemen form, item list */
--space-app-4: 16px;  /* default input padding, table cell padding */
--space-app-5: 20px;  /* card inner spacing pada compact view */
--space-app-6: 24px;  /* default card padding, roadmap item spacing */
--space-app-8: 32px;  /* page gutter, dashboard widget separation */
--space-app-12: 48px; /* lesson section breaks */
--space-app-16: 64px; /* landing page section separation */
```

### 4.2 Spacing Application Rules
* **Table & List Rows**: Menggunakan `--space-app-3` (12px) vertikal dan `--space-app-4` (16px) horizontal.
* **Content Cards**: Menggunakan padding `--space-app-6` (24px).
* **Page Gutters**: `px-4 sm:px-6 lg:px-8` dengan batas `max-w-7xl` (1280px) untuk public view dan `max-w-[1440px]` untuk student app shell.
* **No Spacing AI Slop**: Dilarang meletakkan padding raksasa tak beraturan (>120px) pada internal dashboard.

---

## 5. Border Radius & Surface Elevation

### 5.1 Border Radius Tokens

| Radius Token | Value | Applied Elements | Constraint |
| :--- | :--- | :--- | :--- |
| `--radius-none` | `0px` | Code block editors, terminal window corners | Clean technical feel |
| `--radius-sm` | `4px` | Kbd shortcuts, tags teknis, checkbox, mini progress bar | Precise & sharp |
| `--radius-md` | `8px` | Buttons, form inputs, dropdown menus, table containers | App standard |
| `--radius-lg` | `10px` | Roadmap Stage Cards, Quiz Option Cards, Dashboard Widgets | Standard cards |
| `--radius-xl` | `16px` | Modal dialogs, slide-over drawers, preview sandbox frames | Panels only |
| `--radius-full` | `9999px` | Avatar badges, notification dot status, circular controls | Restricted to pills/dots |

> ⚠️ **Strict Constraint**: Dilarang menggunakan `rounded-2xl` / `rounded-3xl` pada kartu umum. Pertahankan ketajaman sudut 8px–10px agar UI tetap elegan dan berwibawa.

### 5.2 Elevation & Shadow Hierarchy

```css
/* Dark Mode Elevation Shadows */
--shadow-subtle: 0 1px 2px 0 rgba(0, 0, 0, 0.4);
--shadow-card: 0 4px 12px -2px rgba(0, 0, 0, 0.5), 0 2px 6px -1px rgba(0, 0, 0, 0.4);
--shadow-modal: 0 20px 35px -5px rgba(0, 0, 0, 0.7), 0 10px 15px -5px rgba(0, 0, 0, 0.5);
--shadow-spotlight: 0 0 30px -5px rgba(99, 102, 241, 0.15);
```

---

## 6. Motion & Micro-Interactions (React Bits Integration)

### 6.1 Timing & Easing Curves
* **Default Micro-Interaction Duration**: `150ms` – `220ms`
* **Panel Transition & Drawer Duration**: `250ms`
* **Timing Function**: `cubic-bezier(0.16, 1, 0.3, 1)` (*Spring-like Out Expo*)

### 6.2 Curated React Bits Interactions (reactbits.dev)
1. **Spotlight Cards (`SpotlightCard.tsx`)**:
   - Diterapkan pada kartu 20 Tahap Roadmap dan Kartu Mini Project.
   - Efek highlight kursor radial halus (`rgba(99, 102, 241, 0.08)`) dengan batas 300px radius pencahayaan.
2. **Magnet Buttons (`MagnetButton.tsx`)**:
   - Diterapkan pada CTA utama: *"Mulai Belajar Tanpa Login"* dan *"Simpan Progress Belajar"*.
   - Perpindahan magnetik subtil ($\le 4\text{px}$) saat kursor mendekat.
3. **Decrypted / Blur Text Transition**:
   - Diterapkan saat pengguna membuka modul baru atau menyelesaikan quiz dengan skor $\ge 80\%$.
4. **Syntax Copy Visual Feedback**:
   - Transisi ikon copy $\rightarrow$ ikon check hijau dengan tooltip *"Copied!"* dalam durasi `<100ms`, bertahan selama 1.5 detik.

### 6.3 Forbidden Motion Patterns (Zero Slop)
* ❌ Dilarang custom cursor besar / lagging mouse trails.
* ❌ Dilarang animasi marquee tak henti pada teks konten esensial.
* ❌ Dilarang transisi halaman lambat (>350ms) yang menghambat kecepatan navigasi materi.

---

## 7. App Shell & Layout Architecture

```text
┌──────────────────────────────────────────────────────────────────────────┐
│  Topbar (h-14 / 56px) — Breadcrumb | Search (⌘K) | Lang | Theme | User   │
├─────────────────┬────────────────────────────────────────────────────────┤
│                 │                                                        │
│  Sidebar (260px)│  Main Learning Canvas / Roadmap (max-w-7xl mx-auto)   │
│  - Roadmap Nav  │  - Stage Progress Trackers                             │
│  - Active Step  │  - Lesson Markdown Content & Split Code Sandbox        │
│  - Bookmarks    │  - Interactive Quiz & Exercise Validator               │
│  - Profile CTA  │                                                        │
│                 │                                                        │
└─────────────────┴────────────────────────────────────────────────────────┘
```

### 7.1 Sidebar Behavior
* **Desktop ($\ge 1024\text{px}$)**: Lebar 260px expanded (opsi collapse ke 64px icon-only). Posisi `fixed` atau `sticky top-0 h-screen`.
* **Mobile ($< 1024\text{px}$)**: Sidebar tertutup secara default, dapat dibuka sebagai Radix Sheet / Drawer (`transform: translateX(-100%) -> 0`) via hamburger menu di topbar.

### 7.2 Header & Command Palette (`cmdk`)
* Trigger global: `⌘K` / `Ctrl+K`.
* Fitur pencarian instan: Filter judul materi, nama konsep teknologi (*HTML*, *React*, *Next.js*, *Prisma*), dan tingkat kesulitan (*Beginner*, *Advanced*).

---

## 8. Shadcn/ui Primitive Mapping & Component Matrix

Seluruh komponen antarmuka **WAJIB** dibangun di atas fondasi `@/components/ui/*`:

| Component Type | Shadcn/ui Primitive | Customization & Styling Specification |
| :--- | :--- | :--- |
| **Primary Action** | `Button` (`variant="default"`) | Background `#6366F1`, hover `#4F46E5`, radius `8px`, font-medium |
| **Secondary Action**| `Button` (`variant="outline"`) | Border `1px solid #222634`, hover bg `#181A22`, text `#F3F4F6` |
| **Ghost Action** | `Button` (`variant="ghost"`) | Hover bg `rgba(255,255,255,0.05)`, text `#9CA3AF` |
| **Form Inputs** | `Input`, `Textarea` | Border `#222634`, focus ring `#6366F1`, bg `#121318` |
| **Modals & Dialogs**| `Dialog`, `AlertDialog` | Surface `#181A22`, backdrop blur `4px`, radius `16px` |
| **Dropdown Menus** | `DropdownMenu` | Surface `#181A22`, border `#222634`, shadow-modal |
| **Tabs & Filters** | `Tabs`, `TabsList`, `TabsTrigger` | Capsule background `#121318`, active indicator `#181A22` border `#222634` |
| **Progress Track** | `Progress` | Height `6px`, track `#222634`, fill gradient `#6366F1` to `#818CF8` |
| **Badges & Tags** | `Badge` | Radius `4px`, font-mono `0.75rem`, text-uppercase, border `1px solid` |
| **Toast Notice** | `Sonner` / Radix `Toast` | Position bottom-right, border status color bar 3px, auto-dismiss 4s |

---

## 9. Comprehensive Do's and Don'ts

| Category | ✅ DO (Wajib Dilakukan) | ❌ DON'T (Dilarang Keras) |
| :--- | :--- | :--- |
| **Color & Theme** | Gunakan `#090A0C` (Obsidian) dan kontras tajam untuk teks kode. | Dilarang menggunakan Pure Black `#000000` atau Navy `#0F172A`. |
| **Typography** | Gunakan headline tracking rapat (`-0.02em`) dan sans-serif modern. | Dilarang menggunakan gradien teks transparan (`bg-gradient-to-r text-transparent`) pada judul. |
| **Icons & Decor** | Gunakan ikon Lucide fungsional yang kontekstual. | Dilarang menggunakan ikon bintang/sparkle AI (✨/✦) pada setiap tombol. |
| **Card Layouts** | Gunakan border mikro `1px solid #222634` dengan elevasi halus. | Dilarang menumpuk kartu (nested cards) lebih dari 2 tingkat kedalaman. |
| **Border Radius** | Pertahankan radius konsisten 8px–10px untuk kartu dan input. | Dilarang menerapkan `rounded-2xl` / `rounded-3xl` di semua kartu. |
| **Currency & Number** | Format IDR terstandarisasi (`Rp 150 Rb`, `Rp 1,5 Jt`, `Rp 2,5 M`). | Dilarang menulis nominal acak tanpa pemisah ribuan. |
| **Guest Flow** | Berikan akses penuh ke modul materi tanpa paksaan login. | Dilarang memblokir materi dengan pop-up login yang mengunci layar (*hard paywall*). |
| **Code Highlighting** | Sertakan tombol copy, penanda bahasa pemrograman, dan line numbers. | Dilarang menampilkan blok kode polos tanpa penyorotan sintaks (*unstyled raw pre*). |

---

## 10. Verification & Quality Checklist (Definition of Done)

- [x] Token warna Obsidian Dark (`#090A0C`, `#121318`, `#181A22`, `#222634`) terdokumentasi lengkap dalam format HEX dan HSL.
- [x] Alternatif skema warna Light Mode (`#FBFBFA`, `#FFFFFF`, `#E4E4E7`) dipetakan secara simetris.
- [x] Tipografi font stack (`Plus Jakarta Sans`, `JetBrains Mono`) dengan skala dan tracking telah ditentukan.
- [x] Aturan spacing internal app UI (`4px` hingga `32px`) dan gutter halaman didefinisikan secara presisi.
- [x] Spesifikasi mikro-interaksi React Bits (*Spotlight Cards*, *Magnet Buttons*, *Decrypted Text*) terkonfigurasi.
- [x] Mandat komponen Shadcn UI (`@/components/ui/*`) dan panduan Do's & Don'ts telah ditetapkan secara definitif.
