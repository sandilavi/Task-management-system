const attemptStore = new Map<string, number[]>();

interface RateLimitOptions {
    maxAttempts: number;
    windowMs: number;
}

export function checkRateLimit(ip: string, options: RateLimitOptions): { blocked: boolean } {
    // Only enforce in production — local dev is never blocked
    if (process.env.NODE_ENV !== 'production') {
        return { blocked: false };
    }

    const now = Date.now();
    const { maxAttempts, windowMs } = options;

    const timestamps = attemptStore.get(ip) ?? [];

    // Remove timestamps outside the current time window
    const recent = timestamps.filter((t) => now - t < windowMs);

    if (recent.length >= maxAttempts) {
        return { blocked: true };
    }

    // Record this attempt
    recent.push(now);
    attemptStore.set(ip, recent);

    return { blocked: false };
}
