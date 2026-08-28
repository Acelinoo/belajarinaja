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
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary border border-border text-primary font-mono text-xl font-bold">
            404
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">Halaman Tidak Ditemukan</h1>
            <p className="text-sm text-muted-foreground">
              Modul materi atau rute yang Anda tuju belum tersedia atau telah dipindahkan ke jalur kurikulum lain.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/roadmap" className="w-full sm:w-auto">
              <Button className="w-full gap-2">
                <Compass className="h-4 w-4" />
                Buka Roadmap Kurikulum
              </Button>
            </Link>
            <Link href="/" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full gap-2">
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
