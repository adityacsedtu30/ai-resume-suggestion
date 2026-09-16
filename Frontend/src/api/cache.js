// Tiny in-memory cache so moving between pages does not re-download
// data we already have. It lives only for the current browser session.
//
//   const data = await cached("reports", () => getReports())
//   clearCache("reports")   // call after creating something new
//   clearCache()            // wipe everything (e.g. on logout)

const store = new Map()

export async function cached(key, fetcher) {
    if (store.has(key)) {
        return store.get(key)
    }
    const value = await fetcher()
    store.set(key, value)
    return value
}

export function clearCache(key) {
    if (key === undefined) {
        store.clear()
    } else {
        store.delete(key)
    }
}
