import AccountSidebar from "@/components/account/AccountSidebar"
import ProductCard from "@/components/account/ProductCard"
import SectionHeader from "@/components/account/SectionHeader"

const purchases = [
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

const UserAccountPage = () =>{
  return(
    <main className="min-h-screen bg-[#0a0a0a] px-4 py-8 text-white">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[320px_1fr]">
        <AccountSidebar/>

        <div className="space-y-6">
          <section className="rounded-3xl border border-neutral-800 bg-[#111111] p-6">
            <SectionHeader title="Purchase History" description="Everything you've purchased from the storefront."/>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {purchases.map((item) =>(
                <ProductCard key={item.id} item={item}/>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-neutral-800 bg-[#111111] p-6">
            <SectionHeader title="Order Tracking" description="Monitor current print and shipping status."/>

            <div className="space-y-4">
              <div className="rounded-2xl border border-neutral-800 bg-[#171717] p-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold">
                      Custom Resin Print
                    </h3>

                    <p className="mt-1 text-sm text-neutral-400">
                      Order #WBLA-2042
                    </p>
                  </div>

                  <span className="rounded-full bg-orange-500 px-4 py-2 text-sm font-bold text-black">
                    In Production
                  </span>
                </div>

                <div className="mt-5 h-3 overflow-hidden rounded-full bg-black/40">
                  <div className="h-full w-[65%] rounded-full bg-orange-400"/>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
)}

export default UserAccountPage