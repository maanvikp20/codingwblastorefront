/**
 * Success
 */
export function success(data = {}, status = 200) {
  return Response.json({ success: true, ...data }, { status });
}

/**
 * Error
 */
export function error(message, status = 400) {
  return Response.json({ success: false, message }, { status });
}

/**
 * Pagination
 */
export function paginate(total, page, limit) {
  const pages = Math.ceil(total / limit);
  return {
    total,
    page:     Number(page),
    limit:    Number(limit),
    pages,
    hasNext:  Number(page) < pages,
    hasPrev:  Number(page) > 1,
  };
}
