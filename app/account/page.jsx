"use client";

const suggestedItems = [
  {
    id: 1,
    title: "[item]",
    image: "https://media.printables.com/media/prints/22d443ae-b102-45af-803b-7de9cdfd5d16/images/9866247_cbe3ab97-398b-4b59-85a4-ea4c97cd5487_42b934d3-fc55-450a-bc6a-0d6ab3125102/thumbs/inside/1280x960/jpg/ligthroom-472-kopie.webp",
    creator: "[username]",
    likes: 130,
    dislikes: 10,
  },
]

const prints = [
  {
    id: 1,
    title: "[item]",
    image: "https://media.printables.com/media/prints/22d443ae-b102-45af-803b-7de9cdfd5d16/images/9866247_cbe3ab97-398b-4b59-85a4-ea4c97cd5487_42b934d3-fc55-450a-bc6a-0d6ab3125102/thumbs/inside/1280x960/jpg/ligthroom-472-kopie.webp",
    creator: "[username]",
    likes: 130,
    dislikes: 10,
  },
  {
    id: 2,
    title: "[item]",
    image: "https://media.printables.com/media/prints/22d443ae-b102-45af-803b-7de9cdfd5d16/images/9866247_cbe3ab97-398b-4b59-85a4-ea4c97cd5487_42b934d3-fc55-450a-bc6a-0d6ab3125102/thumbs/inside/1280x960/jpg/ligthroom-472-kopie.webp",
    creator: "[username]",
    likes: 130,
    dislikes: 10,
  },
]

const ItemCard = ({item}) =>{
  return(
    <div className="overflow-hidden rounded-[20px] border-2 border-black bg-[#d99555]">
      <div className="flex items-center justify-between border-b-2 border-black px-3 py-2 text-sm">
        <span>{item.title}</span>

        <div className="flex gap-3">
          <span>{item.likes} 👍</span>
          <span>{item.dislikes} 👎</span>
        </div>
      </div>

      <img src={item.image} alt={item.title} className="h-44 w-full object-cover"/>

      <div className="border-t-2 border-black py-2 text-center text-sm">
        by {item.creator}
      </div>
    </div>
  )
}

export default function AccountPage(){
  return(
    <main className="min-h-screen bg-[#cfcfcf] p-4 text-black">
      <div className="mx-auto max-w-7xl border-2 border-black bg-[#3b3b3b]">
        

        <div className="grid gap-4 p-4 lg:grid-cols-[340px_1fr]">
          <div className="space-y-4">
            <section className="border-2 border-black bg-[#d99555] p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-4xl">Account</h2>

                  <p className="mt-20 text-2xl">Date Created:</p>
                </div>

                <div className="flex h-32 w-32 items-center justify-center rounded-full border-2 border-black bg-cyan-400 text-xl font-bold">
                  [profile]
                </div>
              </div>
            </section>

            <section className="border-2 border-black bg-[#d99555] p-4">
              <h2 className="mb-4 text-3xl">Suggested For You:</h2>

              <ItemCard item={suggestedItems[0]}/>
            </section>
          </div>

          <section className="border-2 border-black bg-[#d3d3d3] p-4">
            <h2 className="mb-4 text-4xl">Prints:</h2>

            <div className="grid gap-6 md:grid-cols-2">
              {prints.map((item) =>(
                <ItemCard key={item.id} item={item}/>
              ))}
            </div>
          </section>
        </div>       
      </div>
    </main>
  )
}