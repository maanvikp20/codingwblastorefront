"use client";

const stats = [
  {
    title: "Total Users",
    value: "1,240",
  },
  {
    title: "Products",
    value: "382",
  },
  {
    title: "Orders",
    value: "4,921",
  },
  {
    title: "Revenue",
    value: "$48,120",
  },
]

export default function AdminPage(){
  return(
    <main className="min-h-screen bg-[#cfcfcf] p-4 text-black">
      <div className="mx-auto max-w-6xl border-2 border-black bg-[#3b3b3b]">
        
        <div className="space-y-4 p-4">
          <section className="border-2 border-black bg-[#d99555] p-4">
            <h1 className="mb-4 text-4xl">Admin Dashboard</h1>

            <p className="text-lg">Manage storefront systems and statistics.</p>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) =>(
              <div
                key={stat.title}
                className="border-2 border-black bg-[#d99555] p-4"
              >
                <p className="text-lg">{stat.title}</p>

                <h2 className="mt-6 text-5xl font-bold">{stat.value}</h2>
              </div>
            ))}
          </section>

          <section className="border-2 border-black bg-[#d3d3d3] p-4">
            <h2 className="mb-6 text-3xl">Quick Actions</h2>

            <div className="grid gap-4 md:grid-cols-3">
              <button className="border-2 border-black bg-[#d99555] px-4 py-6 text-xl transition hover:bg-[#c98545]">
                Add Product
              </button>

              <button className="border-2 border-black bg-[#d99555] px-4 py-6 text-xl transition hover:bg-[#c98545]">
                Manage Users
              </button>

              <button className="border-2 border-black bg-[#d99555] px-4 py-6 text-xl transition hover:bg-[#c98545]">
                Review Reports
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}