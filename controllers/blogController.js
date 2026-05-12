import connectDB from "@/lib/MongoDB";
import Blog       from "@/models/Blog";
import { ApiError } from "@/middleware/errorHandling";

// Create Post 
export async function createBlogPost(data, authorId) {
  await connectDB();
  const post = await Blog.create({ ...data, author: authorId });
  return post;
}

// List Published Posts 
export async function listBlogPosts({ page = 1, limit = 12, category, search } = {}) {
  await connectDB();

  const query = { status: "published" };
  if (category) query.category = category;
  if (search)   query.$text    = { $search: search };

  const [posts, total] = await Promise.all([
    Blog.find(query)
      .populate("author", "username avatar")
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select("-content"),   // omit heavy content
    Blog.countDocuments(query),
  ]);

  return { posts, total, page: Number(page), pages: Math.ceil(total / limit) };
}

// Get Single Post
export async function getBlogPost(slug) {
  await connectDB();

  const post = await Blog.findOne({ slug, status: "published" })
    .populate("author", "username avatar bio")
    .populate("relatedProducts", "title thumbnail")
    .populate("comments.author", "username avatar");

  if (!post) throw new ApiError("Post not found", 404);

  await Blog.findByIdAndUpdate(post._id, { $inc: { views: 1 } });
  return post;
}

// Update Post 
export async function updateBlogPost(postId, authorId, role, data) {
  await connectDB();

  const post = await Blog.findById(postId);
  if (!post) throw new ApiError("Post not found", 404);

  if (post.author.toString() !== authorId && role !== "admin") {
    throw new ApiError("Not authorised", 403);
  }

  // Auto-set publishedAt when first publishing
  if (data.status === "published" && !post.publishedAt) {
    data.publishedAt = new Date();
  }

  Object.assign(post, data);
  await post.save();
  return post;
}

// Delete Post 
export async function deleteBlogPost(postId, authorId, role) {
  await connectDB();

  const post = await Blog.findById(postId);
  if (!post) throw new ApiError("Post not found", 404);

  if (post.author.toString() !== authorId && role !== "admin") {
    throw new ApiError("Not authorised", 403);
  }

  await post.deleteOne();
  return { message: "Post deleted" };
}

// Add Comment
export async function addBlogComment(postId, userId, content) {
  await connectDB();

  const post = await Blog.findById(postId);
  if (!post) throw new ApiError("Post not found", 404);

  post.comments.push({ author: userId, content });
  await post.save();

  const updated = await Blog.findById(postId).populate("comments.author", "username avatar");
  return updated.comments[updated.comments.length - 1];
}

// Like Post 
export async function likeBlogPost(postId, userId) {
  await connectDB();

  const post = await Blog.findById(postId);
  if (!post) throw new ApiError("Post not found", 404);

  const liked = post.likes.includes(userId);
  liked ? post.likes.pull(userId) : post.likes.addToSet(userId);
  await post.save();

  return { liked: !liked, totalLikes: post.likes.length };
}
