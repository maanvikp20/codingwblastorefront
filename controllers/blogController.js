import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";

// gets list of blogs with pagination, search, and categories filters
export async function getBlogs(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const page     = Number(searchParams.get("page"))  || 1;
  const limit    = Number(searchParams.get("limit")) || 20;
  const search   = searchParams.get("search");
  const category = searchParams.get("category");

  const query = { status: "published" };
  if (search)   query.$text    = { $search: search };
  if (category) query.category = category;

  const [blogs, total] = await Promise.all([
    Blog.find(query).populate("author", "name avatar").sort({ publishedAt: -1 }).skip((page - 1) * limit).limit(limit),
    Blog.countDocuments(query),
  ]);

  const pages = Math.ceil(total / limit);

  return Response.json({
    success: true,
    blogs,
    total,
    page,
    pages,
    hasNextPage: page < pages,
    hasPrevPage: page > 1,
  });
}

// get single blog by ID and increment views
export async function getBlog(req, { params }) {
  await connectDB();
  // We use findByIdAndUpdate to increment views
  const blog = await Blog.findByIdAndUpdate(
    params.id, 
    { $inc: { views: 1 } }, 
    { new: true }
  ).populate("author", "name avatar");

  if (!blog) throw Object.assign(new Error("Blog not found"), { status: 404 });
  return Response.json({ success: true, blog });
}

// create new blog post (admin only)
export async function createBlog(req, ctx, user) {
  if (user.role !== "admin") throw Object.assign(new Error("Admin access required"), { status: 403 });
  
  await connectDB();
  const body = await req.json();

  if (body.status === "published") body.publishedAt = new Date();

  const blog = await Blog.create({ ...body, author: user.id });
  return Response.json({ success: true, blog }, { status: 201 });
}

// update blog (admin only)
export async function updateBlog(req, { params }, user) {
  if (user.role !== "admin") throw Object.assign(new Error("Admin access required"), { status: 403 });

  await connectDB();
  const blog = await Blog.findById(params.id);
  if (!blog) throw Object.assign(new Error("Blog not found"), { status: 404 });

  const body = await req.json();

  if (body.status === "published" && blog.status !== "published") {
    body.publishedAt = new Date();
  }

  Object.assign(blog, body);
  await blog.save();
  return Response.json({ success: true, blog });
}

// delete blog (admin only)
export async function deleteBlog(req, { params }, user) {
  if (user.role !== "admin") throw Object.assign(new Error("Admin access required"), { status: 403 });

  await connectDB();
  const blog = await Blog.findById(params.id);
  if (!blog) throw Object.assign(new Error("Blog not found"), { status: 404 });

  await blog.deleteOne();
  return Response.json({ success: true });
}

// like or unlike a blog post
export async function likeBlog(req, { params }, user) {
  await connectDB();
  const blog = await Blog.findById(params.id);
  if (!blog) throw Object.assign(new Error("Blog not found"), { status: 404 });

  // If user already liked it, pull from the array, otra vez push
  const update = blog.likes.includes(user.id) 
    ? { $pull: { likes: user.id } } 
    : { $addToSet: { likes: user.id } };

  const updatedBlog = await Blog.findByIdAndUpdate(params.id, update, { new: true });
  return Response.json({ success: true, likes: updatedBlog.likes.length });
}