import connectDB from "@/lib/mongodb";
import CustomOrder from "@/models/CustomOrder";

// post a new configuration or draft attachment sketch file path
export async function createCustomOrder(req, ctx, user) {
  await connectDB();
  const { orderType, description, sketchUrl } = await req.json();

  if (!orderType || !description) {
    throw Object.assign(new Error("Order type and description are required"), {
      status: 400,
    });
  }

  const order = await CustomOrder.create({
    user: user.id,
    orderType,
    description,
    sketchUrl: sketchUrl || "",
    messages: [
      {
        sender: user.id,
        message: `Order submission established. Note: ${description}`,
      },
    ],
  });

  return Response.json({ success: true, order }, { status: 201 });
}

// get list of specific orders for an active profile
export async function getMyCustomOrders(req, ctx, user) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 20;

  const [orders, total] = await Promise.all([
    CustomOrder.find({ user: user.id })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    CustomOrder.countDocuments({ user: user.id }),
  ]);

  return Response.json({
    success: true,
    orders,
    total,
    page,
    pages: Math.ceil(total / limit),
  });
}

// view full conversation or update channels
export async function addOrderMessage(req, { params }, user) {
  await connectDB();
  const { message } = await req.json();

  if (!message) {
    throw Object.assign(new Error("Message body is blank"), { status: 400 });
  }

  const order = await CustomOrder.findById(params.id);
  if (!order)
    throw Object.assign(new Error("Order file not found"), { status: 404 });

  // Safety checks for unauthorized views
  if (order.user.toString() !== user.id && user.role !== "admin") {
    throw Object.assign(new Error("Forbidden access profile"), { status: 403 });
  }

  order.messages.push({ sender: user.id, message });
  if (order.status === "submitted" && user.role === "admin") {
    order.status = "in_discussion";
  }

  await order.save();
  return Response.json({ success: true, messages: order.messages });
}

// submit a commercial bulk production request
export async function createBulkOrder(req, ctx, user) {
  await connectDB();
  const body = await req.json();

  const { description, expectedUnits, filamentType, deliveryDeadline } = body;

  if (!description || !expectedUnits) {
    throw Object.assign(
      new Error("Description and total expected units are required"),
      { status: 400 },
    );
  }

  const pricingTierMultiplier = user.role === "partner" ? 0.85 : 1.0;

  const newBulkRequest = await CustomOrder.create({
    user: user.id,
    orderType: "bulk_order",
    description: `[BULK VOLUME: ${expectedUnits} units | Material Preference: ${filamentType || "Standard PLA"}] - ${description}`,
    status: "submitted",
    discountMultiplier: pricingTierMultiplier,
    messages: [
      {
        sender: user.id,
        message: `System: Bulk order request logged for ${expectedUnits} units. Target deadline: ${deliveryDeadline || "Flexible"}. Wholesale discount modifier applied: ${pricingTierMultiplier === 0.85 ? "Active (15%)" : "None"}.`,
      },
    ],
  });

  return Response.json(
    {
      success: true,
      message: "Bulk manufacturing request successfully queued for review.",
      order: newBulkRequest,
    },
    { status: 201 },
  );
}
