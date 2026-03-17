// ─── In-Memory Sliding Window Rate Limiter ──────────────
//
// Lightweight rate limiter for API routes. Tracks request timestamps
// per key (typically IP address) in memory. Not suitable for
// multi-instance deployments, but perfectly fine for a hackathon demo.

interface RateLimitEntry {
  timestamps: number[];
}

export class RateLimiter {
  private store = new Map<string, RateLimitEntry>();
  private windowMs: number;
  private maxRequests: number;

  constructor(windowMs: number, maxRequests: number) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  check(key: string): { allowed: boolean; remaining: number } {
    const now = Date.now();
    const entry = this.store.get(key);

    if (!entry) {
      this.store.set(key, { timestamps: [now] });
      return { allowed: true, remaining: this.maxRequests - 1 };
    }

    // Remove timestamps outside the window
    entry.timestamps = entry.timestamps.filter(
      (ts) => now - ts < this.windowMs
    );

    if (entry.timestamps.length >= this.maxRequests) {
      return { allowed: false, remaining: 0 };
    }

    entry.timestamps.push(now);
    return { allowed: true, remaining: this.maxRequests - entry.timestamps.length };
  }

  /** Periodic cleanup of stale entries to prevent memory leaks */
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      entry.timestamps = entry.timestamps.filter(
        (ts) => now - ts < this.windowMs
      );
      if (entry.timestamps.length === 0) {
        this.store.delete(key);
      }
    }
  }
}

// Default auth rate limiter: 10 requests per 60 seconds
export const authRateLimiter = new RateLimiter(60_000, 10);

// Cleanup stale entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => authRateLimiter.cleanup(), 5 * 60_000);
}
