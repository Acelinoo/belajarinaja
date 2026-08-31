import Link from "next/link";
import { Compass, ArrowLeft, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-black bg-[#FFD84D] text-[#121212] font-mono text-2xl font-black shadow-[4px_4px_0px_#121212] dark:border dark:border-cyan-500/40 dark:bg-cyan-500/10 dark:text-cyan-300 dark:shadow-[0_0_20px_rgba(34,211,238,0.2)]">
            404
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black tracking-tight text-foreground">Halaman Tidak Ditemukan</h1>
            <p className="text-xs font-medium text-[#555555] dark:font-normal dark:text-[#8292A6]">
              Modul materi atau rute yang Anda tuju belum tersedia atau telah dipindahkan ke jalur kurikulum lain.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/roadmap" className="w-full sm:w-auto">
              <Button className="w-full gap-2 text-xs font-black shadow-[3px_3px_0px_#121212] dark:border dark:border-cyan-500/40 dark:bg-cyan-500/15 dark:text-cyan-300 dark:hover:bg-cyan-400 dark:hover:text-[#05070A] dark:shadow-none">
                <Compass className="h-4 w-4" />
                Buka Roadmap Kurikulum
              </Button>
            </Link>
            <Link href="/" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full gap-2 text-xs font-bold shadow-[2px_2px_0px_#121212] dark:border dark:border-[#1C242D] dark:bg-[#0F141A] dark:text-[#CBD5E1] dark:hover:text-cyan-300">
                <ArrowLeft className="h-4 w-4" />
                Kembali ke Beranda
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
