/**
 * Simple browser-side image cache to track loaded/failed images
 * Reduces repeated requests to Minecraft Wiki
 */

interface CacheEntry {
	url: string;
	status: 'loading' | 'loaded' | 'failed';
	timestamp: number;
}

class ImageCache {
	private cache: Map<string, CacheEntry> = new Map();
	private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
	private readonly FAILED_RETRY_DELAY = 30 * 1000; // 30 seconds for failed images

	/**
	 * Check if an image URL is known to work
	 */
	isLoaded(url: string): boolean {
		const entry = this.cache.get(url);
		if (!entry) return false;
		if (this.isExpired(entry)) {
			this.cache.delete(url);
			return false;
		}
		return entry.status === 'loaded';
	}

	/**
	 * Check if an image URL is known to fail
	 */
	isFailed(url: string): boolean {
		const entry = this.cache.get(url);
		if (!entry) return false;

		// Allow retry after delay
		if (entry.status === 'failed') {
			const age = Date.now() - entry.timestamp;
			if (age > this.FAILED_RETRY_DELAY) {
				this.cache.delete(url);
				return false;
			}
			return true;
		}
		return false;
	}

	/**
	 * Mark URL as loading
	 */
	markLoading(url: string): void {
		this.cache.set(url, {
			url,
			status: 'loading',
			timestamp: Date.now()
		});
	}

	/**
	 * Mark URL as successfully loaded
	 */
	markLoaded(url: string): void {
		this.cache.set(url, {
			url,
			status: 'loaded',
			timestamp: Date.now()
		});
	}

	/**
	 * Mark URL as failed
	 */
	markFailed(url: string): void {
		this.cache.set(url, {
			url,
			status: 'failed',
			timestamp: Date.now()
		});
	}

	/**
	 * Get first working URL from a list of sources
	 */
	getFirstWorkingUrl(sources: string[]): string | null {
		for (const url of sources) {
			if (this.isLoaded(url)) {
				return url;
			}
		}
		return null;
	}

	/**
	 * Get first URL that should be tried (not known to fail)
	 */
	getFirstTryableUrl(sources: string[]): { url: string; index: number } | null {
		for (let i = 0; i < sources.length; i++) {
			const url = sources[i];
			if (!this.isFailed(url)) {
				return { url, index: i };
			}
		}
		return null;
	}

	private isExpired(entry: CacheEntry): boolean {
		return Date.now() - entry.timestamp > this.CACHE_DURATION;
	}

	/**
	 * Clear old entries
	 */
	cleanup(): void {
		const now = Date.now();
		for (const [url, entry] of this.cache.entries()) {
			if (now - entry.timestamp > this.CACHE_DURATION) {
				this.cache.delete(url);
			}
		}
	}
}

// Singleton instance
export const imageCache = new ImageCache();

// Cleanup every minute
if (typeof window !== 'undefined') {
	setInterval(() => imageCache.cleanup(), 60 * 1000);
}
