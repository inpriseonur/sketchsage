import Image from 'next/image'

const examples = [
  { id: 1, image: '/images/gallery/example1.jpg', alt: 'Portrait sketch' },
  { id: 2, image: '/images/gallery/example2.jpg', alt: 'Flower painting' },
  { id: 3, image: '/images/gallery/example3.jpg', alt: 'Architecture drawing' },
  { id: 4, image: '/images/gallery/example4.jpg', alt: 'Landscape painting' },
]

export default function QualitySection() {
  return (
    <section className="py-16 bg-[#1b0f0f]">
      <div className="max-w-6xl mx-auto px-5">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-[#f0e6e6]">See the Quality of Feedback</h2>
          <div className="h-0.5 w-24 bg-[#a43a2b] mt-3" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {examples.map((example) => (
            <div
              key={example.id}
              className="relative aspect-square rounded-xl overflow-hidden bg-[#2a1717]"
            >
              <Image
                src={example.image}
                alt={example.alt}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

