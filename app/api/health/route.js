import connectDB from "@/lib/MongoDB";

export async function GET() {
  try {
    await connectDB();

    return Response.json({
      status: "ok",
      db: "connected",
      time: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Health check failed:", error);

    return Response.json(
      {
        status: "error",
        db: "disconnected",
        error: error.message,
      },
      { status: 503 }
    );
  }
}