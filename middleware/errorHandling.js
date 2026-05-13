export class ApiError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
  }
}

function formatLog(req, status, message) {
  const method = req?.method || "UNKNOWN";
  const url = req?.url || "UNKNOWN";

  console.log(`[${status}] ${method} ${url} → ${message}`);
}

export function withErrorHandling(handler) {
  return async (req, ctx) => {
    try {
      return await handler(req, ctx);
    } catch (err) {
      const status = err.statusCode || 500;

      formatLog(req, status, err.message);

      if (process.env.DEBUG === "true") {
        console.error(err.stack);
      }

      return Response.json(
        {
          success: false,
          error: err.message || "Server error",
        },
        { status }
      );
    }
  };
}