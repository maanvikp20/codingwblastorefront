"use client";
import { useState, useEffect, useCallback } from "react";

const TABS = ["overview", "products", "blogs", "users", "reports"];

const fetcher = async (url, token, opts = {}) => {
  const res = await fetch(url, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...opts.headers,
    },
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || "Request failed");
  return json;
};

export default function AdminPage() {
  const [token, setToken] = useState(() =>
    typeof window !== "undefined" ? localStorage.getItem("token") || "" : "",
  );
  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);


  // fast admin aactions and gets everything for all documents
  const load = useCallback(
    async (t = tab, p = 1) => {
      if (!token) return;
      setLoading(true);
      setError("");
      try {
        if (t === "overview") {
          const d = await fetcher("/api/admin", token);
          setStats({
            totalProducts: d.totalProducts ?? 0,
            pendingProducts: d.pendingProducts ?? 0,
            totalUsers: d.totalUsers ?? 0,
            totalBlogs: d.totalBlogs ?? 0,
            pendingBlogs: d.pendingBlogs ?? 0,
            openReports: d.openReports ?? 0,
          });
        } else if (t === "products") {
          const d = await fetcher(
            `/api/admin/products?page=${p}&limit=20`,
            token,
          );
          setProducts(d.products);
          setPages(d.pages ?? 1);
        } else if (t === "blogs") {
          const d = await fetcher(`/api/blogs?page=${p}&limit=20`, token);
          setBlogs(d.blogs);
          setPages(d.pages ?? 1);
        } else if (t === "users") {
          const q = search ? `&search=${encodeURIComponent(search)}` : "";
          const d = await fetcher(
            `/api/admin/users?page=${p}&limit=20${q}`,
            token,
          );
          setUsers(d.users);
          setPages(d.pages ?? 1);
        } else if (t === "reports") {
          const d = await fetcher(
            `/api/admin/reports?page=${p}&limit=20`,
            token,
          );
          setReports(d.reports);
          setPages(d.pages ?? 1);
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    },
    [token, tab, search],
  );

  useEffect(() => {
    load(tab, 1);
    setPage(1);
  }, [tab, token]);

  const switchTab = (t) => {
    setTab(t);
    setSearch("");
    setPage(1);
  };

  const reviewReport = async (id, status) => {
    try {
      const d = await fetcher(`/api/admin/reports/${id}`, token, {
        method: "PATCH", body: JSON.stringify({ status }),
      });
      setReports(p => p.map(x => x._id === id ? d.report : x));
    } catch (e) { alert(e.message); }
  };

  const setFeatured = async (id, featured) => {
    try {
      await fetcher(`/api/admin/products/${id}`, token, {
        method: "PATCH",
        body: JSON.stringify({ featured }),
      });
      setProducts((p) => p.map((x) => (x._id === id ? { ...x, featured } : x)));
    } catch (e) {
      alert(e.message);
    }
  };

  const reviewBlog = async (id, action) => {
    try {
      await fetcher(`/api/admin/blogs/${id}/review`, token, {
        method: "PATCH",
        body: JSON.stringify({ action }),
      });
      setBlogs((p) =>
        p.map((x) => (x._id === id ? { ...x, status: action } : x)),
      );
    } catch (e) {
      alert(e.message);
    }
  };

  const deleteBlog = async (id) => {
    if (!confirm("Delete this blog?")) return;
    try {
      await fetcher(`/api/blogs/${id}`, token, { method: "DELETE" });
      setBlogs((p) => p.filter((x) => x._id !== id));
    } catch (e) {
      alert(e.message);
    }
  };

  const updateUserRole = async (id, role) => {
    try {
      const d = await fetcher(`/api/admin/users/${id}`, token, {
        method: "PATCH",
        body: JSON.stringify({ role }),
      });
      setUsers((p) =>
        p.map((x) => (x._id === id ? { ...x, role: d.user.role } : x)),
      );
    } catch (e) {
      alert(e.message);
    }
  };

  const deleteUser = async (id) => {
    if (!confirm("Delete this user and all their content?")) return;
    try {
      await fetcher(`/api/admin/users/${id}`, token, { method: "DELETE" });
      setUsers((p) => p.filter((x) => x._id !== id));
    } catch (e) {
      alert(e.message);
    }
  };

  const goPage = (p) => {
    setPage(p);
    load(tab, p);
  };

  
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#e8e8e8] font-mono">
      <div className="border-b border-[#333] px-8 py-4 flex items-center justify-between">
        <h1 className="text-xl tracking-widest uppercase text-[#c8a96e]">
          Admin Panel
        </h1>
        <div className="flex gap-1">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => switchTab(t)}
              className={`px-4 py-1.5 text-xs uppercase tracking-widest transition-colors ${
                tab === t
                  ? "bg-[#c8a96e] text-[#1a1a1a] font-bold"
                  : "text-[#888] hover:text-[#e8e8e8]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="px-8 py-6">
        {error && (
          <div className="mb-4 px-4 py-2 bg-red-900/40 border border-red-700 text-red-300 text-sm">
            {error}
          </div>
        )}
        {loading && (
          <div className="text-[#888] text-sm tracking-widest">Loading...</div>
        )}

        {!loading && tab === "overview" && stats && (
          <div>
            <h2 className="text-lg uppercase tracking-widest mb-6 text-[#c8a96e]">
              Overview
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {[
                ["Total Products", stats.totalProducts],
                ["Pending Review", stats.pendingProducts],
                ["Total Users", stats.totalUsers],
                ["Total Blogs", stats.totalBlogs],
                ["Draft Blogs", stats.pendingBlogs],
                ["Open Reports", stats.openReports],
              ].map(([label, val]) => (
                <div key={label} className="border border-[#333] p-4">
                  <div className="text-2xl font-bold text-[#c8a96e]">
                    {val ?? "—"}
                  </div>
                  <div className="text-xs uppercase tracking-widest text-[#666] mt-1">
                    {label}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-4 flex-wrap">
              {stats.pendingProducts > 0 && (
                <button
                  onClick={() => switchTab("products")}
                  className="px-4 py-2 text-xs uppercase tracking-widest border border-[#c8a96e] text-[#c8a96e] hover:bg-[#c8a96e] hover:text-[#1a1a1a] transition-colors"
                >
                  Review {stats.pendingProducts} pending product
                  {stats.pendingProducts !== 1 ? "s" : ""}
                </button>
              )}
              {stats.openReports > 0 && (
                <button
                  onClick={() => switchTab("reports")}
                  className="px-4 py-2 text-xs uppercase tracking-widest border border-red-500 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                >
                  {stats.openReports} open report
                  {stats.openReports !== 1 ? "s" : ""}
                </button>
              )}
            </div>
          </div>
        )}

        {!loading && tab === "products" && (
          <div>
            <h2 className="text-lg uppercase tracking-widest mb-6 text-[#c8a96e]">
              Products
            </h2>
            {products.length === 0 && (
              <p className="text-[#666] text-sm">No products.</p>
            )}
            <div className="space-y-3">
              {products.map((p) => (
                <div
                  key={p._id}
                  className="border border-[#333] p-4 flex flex-col lg:flex-row lg:items-center gap-4"
                >
                  <div className="flex-1">
                    <div className="font-bold">{p.name}</div>
                    <div className="text-xs text-[#888] mt-0.5">
                      by {p.author?.name ?? "Unknown"} · {p.category ?? "—"} ·{" "}
                      <StatusBadge status={p.status} />
                    </div>
                    {p.description && (
                      <div className="text-xs text-[#666] mt-1 line-clamp-2">
                        {p.description}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 items-center flex-wrap">
                    <button
                      onClick={() => setFeatured(p._id, !p.featured)}
                      className={`px-3 py-1 text-xs uppercase tracking-widest border transition-colors ${
                        p.featured
                          ? "border-[#c8a96e] bg-[#c8a96e]/20 text-[#c8a96e]"
                          : "border-[#444] text-[#666] hover:border-[#c8a96e] hover:text-[#c8a96e]"
                      }`}
                    >
                      {p.featured ? "★ Featured" : "☆ Feature"}
                    </button>
                    {p.status === "pending" && (
                      <>
                        <button
                          onClick={() => reviewProduct(p._id, "approved")}
                          className="px-3 py-1 text-xs uppercase tracking-widest border border-green-600 text-green-400 hover:bg-green-600 hover:text-white transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => reviewProduct(p._id, "rejected")}
                          className="px-3 py-1 text-xs uppercase tracking-widest border border-red-700 text-red-400 hover:bg-red-700 hover:text-white transition-colors"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <Pagination page={page} pages={pages} onPage={goPage} />
          </div>
        )}

        {!loading && tab === "blogs" && (
          <div>
            <h2 className="text-lg uppercase tracking-widest mb-6 text-[#c8a96e]">
              Blogs
            </h2>
            {blogs.length === 0 && (
              <p className="text-[#666] text-sm">No blogs.</p>
            )}
            <div className="space-y-3">
              {blogs.map((b) => (
                <div
                  key={b._id}
                  className="border border-[#333] p-4 flex flex-col lg:flex-row lg:items-center gap-4"
                >
                  <div className="flex-1">
                    <div className="font-bold">{b.title}</div>
                    <div className="text-xs text-[#888] mt-0.5">
                      by {b.author?.name ?? "Unknown"} ·{" "}
                      <StatusBadge status={b.status} /> · {b.views ?? 0} views
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {b.status !== "published" && (
                      <button
                        onClick={() => reviewBlog(b._id, "published")}
                        className="px-3 py-1 text-xs uppercase tracking-widest border border-green-600 text-green-400 hover:bg-green-600 hover:text-white transition-colors"
                      >
                        Publish
                      </button>
                    )}
                    {b.status !== "archived" && (
                      <button
                        onClick={() => reviewBlog(b._id, "archived")}
                        className="px-3 py-1 text-xs uppercase tracking-widest border border-yellow-600 text-yellow-400 hover:bg-yellow-600 hover:text-white transition-colors"
                      >
                        Archive
                      </button>
                    )}
                    <button
                      onClick={() => deleteBlog(b._id)}
                      className="px-3 py-1 text-xs uppercase tracking-widest border border-red-700 text-red-400 hover:bg-red-700 hover:text-white transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <Pagination page={page} pages={pages} onPage={goPage} />
          </div>
        )}

        {!loading && tab === "users" && (
          <div>
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-lg uppercase tracking-widest text-[#c8a96e]">
                Users
              </h2>
              <input
                className="bg-transparent border border-[#333] px-3 py-1 text-sm text-[#e8e8e8] placeholder-[#555] focus:outline-none focus:border-[#c8a96e]"
                placeholder="Search name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && load("users", 1)}
              />
              <button
                onClick={() => load("users", 1)}
                className="px-3 py-1 text-xs uppercase tracking-widest border border-[#444] hover:border-[#c8a96e] text-[#888] hover:text-[#c8a96e] transition-colors"
              >
                Search
              </button>
            </div>
            {users.length === 0 && (
              <p className="text-[#666] text-sm">No users found.</p>
            )}
            <div className="space-y-2">
              {users.map((u) => (
                <div
                  key={u._id}
                  className="border border-[#333] p-4 flex flex-col lg:flex-row lg:items-center gap-4"
                >
                  <div className="flex-1">
                    <div className="font-bold">{u.name}</div>
                    <div className="text-xs text-[#888] mt-0.5">
                      {u.email} · joined{" "}
                      {new Date(u.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2 mt-1">
                      <StatusBadge status={u.role} />
                      <StatusBadge
                        status={u.isActive ? "active" : "inactive"}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 items-center flex-wrap">
                    <select
                      value={u.role}
                      onChange={(e) => updateUserRole(u._id, e.target.value)}
                      className="bg-[#1a1a1a] border border-[#444] text-[#e8e8e8] text-xs px-2 py-1 focus:outline-none focus:border-[#c8a96e]"
                    >
                      {["customer", "curator", "partner", "admin"].map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => deleteUser(u._id)}
                      className="px-3 py-1 text-xs uppercase tracking-widest border border-red-700 text-red-400 hover:bg-red-700 hover:text-white transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <Pagination page={page} pages={pages} onPage={goPage} />
          </div>
        )}

        {!loading && tab === "reports" && (
          <div>
            <h2 className="text-lg uppercase tracking-widest mb-6 text-[#c8a96e]">
              Reports
            </h2>
            {reports.length === 0 && (
              <p className="text-[#666] text-sm">No reports.</p>
            )}
            <div className="space-y-3">
              {reports.map((r) => (
                <div
                  key={r._id}
                  className="border border-[#333] p-4 flex flex-col lg:flex-row lg:items-start gap-4"
                >
                  <div className="flex-1">
                    <div className="flex gap-2 items-center">
                      <span className="font-bold text-sm">
                        {r.product?.name ?? "Deleted product"}
                      </span>
                      <StatusBadge status={r.status} />
                    </div>
                    <div className="text-xs text-[#888] mt-0.5">
                      Category: {r.category} · by{" "}
                      {r.reporter?.name ?? "Unknown"} (
                      {r.reporter?.email ?? "—"})
                    </div>
                    <div className="text-xs text-[#aaa] mt-1">{r.details}</div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {r.status !== "under_review" && (
                      <button
                        onClick={() => reviewReport(r._id, "under_review")}
                        className="px-3 py-1 text-xs uppercase tracking-widest border border-yellow-600 text-yellow-400 hover:bg-yellow-600 hover:text-white transition-colors"
                      >
                        Under Review
                      </button>
                    )}
                    {r.status !== "resolved" && (
                      <button
                        onClick={() => reviewReport(r._id, "resolved")}
                        className="px-3 py-1 text-xs uppercase tracking-widest border border-green-600 text-green-400 hover:bg-green-600 hover:text-white transition-colors"
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <Pagination page={page} pages={pages} onPage={goPage} />
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    approved: "text-green-400 border-green-800",
    published: "text-green-400 border-green-800",
    active: "text-green-400 border-green-800",
    pending: "text-yellow-400 border-yellow-800",
    draft: "text-yellow-400 border-yellow-800",
    open: "text-red-400 border-red-800",
    rejected: "text-red-400 border-red-800",
    archived: "text-[#888] border-[#444]",
    resolved: "text-[#888] border-[#444]",
    inactive: "text-[#888] border-[#444]",
    under_review: "text-blue-400 border-blue-800",
    admin: "text-[#c8a96e] border-[#c8a96e]/40",
    curator: "text-purple-400 border-purple-800",
    partner: "text-blue-400 border-blue-800",
    customer: "text-[#888] border-[#444]",
  };
  return (
    <span
      className={`text-[10px] uppercase tracking-widest border px-1.5 py-0.5 ${colors[status] ?? "text-[#888] border-[#444]"}`}
    >
      {status}
    </span>
  );
}

function Pagination({ page, pages, onPage }) {
  if (pages <= 1) return null;
  return (
    <div className="flex gap-2 mt-6">
      <button
        onClick={() => onPage(page - 1)}
        disabled={page <= 1}
        className="px-3 py-1 text-xs border border-[#333] text-[#888] hover:text-[#e8e8e8] disabled:opacity-30"
      >
        ←
      </button>
      <span className="px-3 py-1 text-xs text-[#666]">
        {page} / {pages}
      </span>
      <button
        onClick={() => onPage(page + 1)}
        disabled={page >= pages}
        className="px-3 py-1 text-xs border border-[#333] text-[#888] hover:text-[#e8e8e8] disabled:opacity-30"
      >
        →
      </button>
    </div>
  );
}