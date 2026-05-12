// Register Validation
export function validateRegister({ username, email, password }) {
  if (!username || username.trim().length < 3) {
    return { error: "Username must be at least 3 characters" };
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return { error: "Username can only contain letters, numbers, underscores, and hyphens" };
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Valid email required" };
  }
  if (!password || password.length < 8) {
    return { error: "Password must be at least 8 characters" };
  }
  return { error: null };
}

// Product Validation 
export function validateProduct({ title, description, category }) {
  if (!title?.trim())       return { error: "Title is required" };
  if (!description?.trim()) return { error: "Description is required" };
  if (!category?.trim())    return { error: "Category is required" };
  return { error: null };
}

// Blog Validation 
export function validateBlogPost({ title, content }) {
  if (!title?.trim())   return { error: "Title is required" };
  if (!content?.trim()) return { error: "Content is required" };
  return { error: null };
}
