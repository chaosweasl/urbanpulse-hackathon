import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6">
      <div className="relative z-10 flex w-full max-w-xl flex-col items-center text-center">
        <div className="mb-6 inline-flex size-12 items-center justify-center rounded-lg bg-primary text-xl font-bold text-primary-foreground">
          U
        </div>
        <p className="mb-2 text-xs uppercase tracking-widest text-zinc-500">404</p>
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          This pulse doesn&apos;t exist
        </h1>
        <p className="max-w-lg text-base md:text-lg font-medium leading-relaxed text-muted-foreground mb-8">
          The page you&apos;re looking for has expired or was never posted.
        </p>
        <Link href="/feed">
          <Button className="h-12 rounded-lg bg-primary px-8 font-bold text-primary-foreground hover:bg-primary/90">
            Back to feed
          </Button>
        </Link>
      </div>
    </main>
  );
}
