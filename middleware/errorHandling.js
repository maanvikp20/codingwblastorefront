export function withErrorHandling(handler) {
  return async (req, ctx) => {
    try {
      return await handler(req, ctx);
    } catch (err) {
      console.error(err);
      const status = err.status || 500;
      return Response.json(
        { success: false, error: err.message || "Server error" }, 
        { status }
      );
    }
  };
}