import AccountSidebar from "@/components/account/AccountSidebar"
import ProductCard from "@/components/account/ProductCard"
import SectionHeader from "@/components/account/SectionHeader"
import StatsCard from "@/components/account/StatsCard"

const featuredPrints = [
  {
    id: 1,
    title: "Sports Car",
    creator: "Bob174",
    price: 190,
    image:
      "https://media.printables.com/media/prints/22d443ae-b102-45af-803b-7de9cdfd5d16/images/9866247_cbe3ab97-398b-4b59-85a4-ea4c97cd5487_42b934d3-fc55-450a-bc6a-0d6ab3125102/thumbs/inside/1280x960/jpg/ligthroom-472-kopie.webp",
  },
  {
    id: 2,
    title: "3D Benchy",
    creator: "PrinterLab",
    price: 75,
    image:
      "https://www.3dbenchy.com/wp-content/uploads/2017/11/3DBenchy-A-small-giant-in-the-world-of-3D-printing-v01-1024x576.jpg",
  },
]

export default function AccountPage(){
  return (
    <main className="min-h-screen bg-[#0a0a0a] px-4 py-8 text-white">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[320px_1fr]">
        <AccountSidebar/>

        <div className="space-y-6">
          <section className="rounded-3xl border border-neutral-800 bg-gradient-to-br from-[#171717] to-[#101010] p-8 shadow-2xl">
            <p className="text-sm uppercase tracking-[0.3em] text-orange-300">
              Welcome Back
            </p>

            <h1 className="mt-4 text-5xl font-black">
              Your Creator Dashboard
            </h1>

            <p className="mt-4 max-w-2xl text-lg text-neutral-400">
              Track purchases, discover trending prints, and manage your storefront activity.
            </p>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            <StatsCard
              title="Saved Prints"
              value="42"
              subtitle="+8 this week"
            />

            <StatsCard
              title="Orders"
              value="18"
              subtitle="3 currently processing"
            />

            <StatsCard
              title="Reviews"
              value="4.9"
              subtitle="Average storefront rating"
            />
          </section>

          <section className="rounded-3xl border border-neutral-800 bg-[#111111] p-6">
            <SectionHeader
              title="Recommended Prints"
              description="Based on your recent activity and saved products."
            />

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {featuredPrints.map((item) =>(
                <ProductCard
                  key={item.id}
                  item={item}
                />
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-neutral-800 bg-[#111111] p-6">
            <SectionHeader
              title="Recent Activity"
              description="Latest actions on your storefront account."
            />

            <div className="space-y-4">
              <div className="rounded-2xl border border-neutral-800 bg-[#171717] p-4">
                <p className="font-semibold text-white">
                  Purchased "Sports Car"
                </p>

                <p className="mt-1 text-sm text-neutral-400">
                  2 hours ago
                </p>
              </div>

              <div className="rounded-2xl border border-neutral-800 bg-[#171717] p-4">
                <p className="font-semibold text-white">
                  Saved "3D Benchy" to favorites
                </p>

                <p className="mt-1 text-sm text-neutral-400">
                  Yesterday
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}