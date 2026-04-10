import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(49,130,206,0.18),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.12),transparent_30%)]" />
      <div className="absolute left-10 top-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-10 right-10 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative z-10 flex w-full max-w-xl flex-col items-center text-center">
        <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-black text-xl mb-6 shadow-lg shadow-primary/20">
          U
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-muted-foreground mb-4">404</p>
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-foreground mb-4">
          This pulse doesn&apos;t exist
        </h1>
        <p className="max-w-lg text-base md:text-lg font-medium leading-relaxed text-muted-foreground mb-8">
          The page you&apos;re looking for has expired or was never posted.
        </p>
        <Link href="/feed">
          <Button className="h-12 rounded-xl bg-primary px-8 font-bold text-primary-foreground hover:bg-primary/90">
            Back to feed
          </Button>
        </Link>
      </div>
    </main>
  );
}
