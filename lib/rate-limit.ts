const attemptStore = new Map<string, number[]>();

interface RateLimitOptions {
    maxAttempts: number;
    windowMs: number;
}

export function checkRateLimit(ip: string, options: RateLimitOptions): { blocked: boolean } {
    // Only applies the rate limiting on production
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

    // Record the attempt
    recent.push(now);
    attemptStore.set(ip, recent);

    return { blocked: false };
}
