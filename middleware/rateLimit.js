// Tracks how many requests each IP has made in a time window
// If you restart the server, all counts reset

const store = new Map();

// maxRequests: how many requests are allowed
// windowMs: the time window in ms
export function rateLimit({ maxRequests = 5, windowMs = 60000 } = {}) {
  return function (handler) {
    return async (req, ctx) => {
      //gets ip here
      const ip = req.headers.get("x-forwarded-for") || "unknown";

      // Create a unique key for this IP and endpoint along with date
      const key = `${ip}:${req.url}`;
      const now = Date.now();

      const record = store.get(key) || { count: 0, start: now };

      // If the time window has passed, reset the count
      if (now - record.start > windowMs) {
        record.count = 0;
        record.start = now;
      }

      record.count += 1;
      store.set(key, record);

      if (record.count > maxRequests) {
        throw Object.assign(new Error("Too many requests, slow down"), {
          status: 429,
        });
      }

      return handler(req, ctx);
    };
  };
}
