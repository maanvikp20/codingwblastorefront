"use client"

const purchases = [
  {
    id: 1,
    title: "Sports Car",
    price: "Cost: 190$",
    image:
      "https://media.printables.com/media/prints/22d443ae-b102-45af-803b-7de9cdfd5d16/images/9866247_cbe3ab97-398b-4b59-85a4-ea4c97cd5487_42b934d3-fc55-450a-bc6a-0d6ab3125102/thumbs/inside/1280x960/jpg/ligthroom-472-kopie.webp",
  },
  {
    id: 2,
    title: "Sports Car",
    price: "Cost: 190$",
    image:
      "https://media.printables.com/media/prints/22d443ae-b102-45af-803b-7de9cdfd5d16/images/9866247_cbe3ab97-398b-4b59-85a4-ea4c97cd5487_42b934d3-fc55-450a-bc6a-0d6ab3125102/thumbs/inside/1280x960/jpg/ligthroom-472-kopie.webp",
  },
  {
    id: 3,
    title: "Boat",
    price: "Cost: 190$",
    image:
      "https://www.3dbenchy.com/wp-content/uploads/2017/11/3DBenchy-A-small-giant-in-the-world-of-3D-printing-v01-1024x576.jpg",
  },
]

const PurchaseCard = ({item}) =>{
  return(
    <div className="overflow-hidden rounded-[20px] border-2 border-black bg-[#d99555]">
      <div className="flex items-center justify-between border-b-2 border-black px-3 py-2 text-sm">
        <span>{item.title}</span>

        <span>{item.price}</span>
      </div>

      <img src={item.image} alt={item.title} className="h-48 w-full object-cover"/>

      <div className="border-t-2 border-black py-2 text-center text-sm">
        By: Bob174
      </div>
    </div>
  )
}

export default function UserAccountPage(){
  return(
    <main className="min-h-screen bg-[#cfcfcf] p-4 text-black">
      <div className="mx-auto max-w-md border-2 border-black bg-[#3b3b3b]">

        <div className="space-y-4 p-4">
          <section className="border-2 border-black bg-[#d99555] p-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-4xl">My User</h2>

                <p className="mt-16 text-2xl">Date Created: May 2026</p>
              </div>

              <div className="flex h-28 w-28 items-center justify-center rounded-full border-2 border-black bg-cyan-400 text-lg font-bold">
                  <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" alt="placeholder" className="rounded-full"/>
              </div>
            </div>
          </section>

          <section className="border-2 border-black bg-[#d3d3d3] p-4">
            <h2 className="mb-4 text-3xl">Past Purchases:</h2>

            <div className="space-y-5">
              {purchases.map((item) =>(
                <PurchaseCard key={item.id} item={item}/>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
