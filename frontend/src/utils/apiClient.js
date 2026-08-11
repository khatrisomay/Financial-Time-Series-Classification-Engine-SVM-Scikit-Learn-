// API Client utility with localStorage caching and retry resilience

const CACHE_PREFIX = 'svm_quant_cache_';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export async function fetchWithCache(url, options = {}) {
  const cacheKey = `${CACHE_PREFIX}${url}_${JSON.stringify(options.body || {})}`;

  try {
    const res = await fetch(url, options);
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem(cacheKey, JSON.stringify({
        timestamp: Date.now(),
        data: data
      }));
      return data;
    }
  } catch (e) {
    console.warn(`Fetch failed for ${url}, attempting cache fallback`, e);
  }

  // Fallback to cache if network request fails
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    const parsed = JSON.parse(cached);
    if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
      console.log(`Serving cached response for ${url}`);
      return parsed.data;
    }
  }

  throw new Error(`Network request failed and no valid cache available for ${url}`);
}
