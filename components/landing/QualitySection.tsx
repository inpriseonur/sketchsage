type QualityItem = {
  image_url: string
  alt: string
  order: number
}

type QualityContent = {
  items: QualityItem[]
}

export default function QualitySection({ content }: { content?: QualityContent }) {
  const items = content?.items || []
  
  return (
    <section>
        <h2 className="text-white text-[22px] font-bold tracking-[-0.015em] px-4 pb-3 pt-5 border-b-2 border-[#d41111]/30">
          See the Quality of Feedback
        </h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6 p-4 pt-8">
          {items.map((item, index) => (
            <div key={index} className="flex flex-col gap-3">
              <div
                className="w-full bg-center bg-no-repeat aspect-[3/4] bg-cover rounded-lg"
                style={{ backgroundImage: `url(${item.image_url})` }}
                aria-label={item.alt}
              />
            </div>
          ))}
        </div>
    </section>
  )
}

