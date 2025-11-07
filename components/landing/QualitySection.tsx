import Image from 'next/image'

const examples = [
  { id: 1, image: '/images/gallery/example1.jpg', alt: 'Portrait sketch' },
  { id: 2, image: '/images/gallery/example2.jpg', alt: 'Flower painting' },
  { id: 3, image: '/images/gallery/example3.jpg', alt: 'Architecture drawing' },
  { id: 4, image: '/images/gallery/example4.jpg', alt: 'Landscape painting' },
]

export default function QualitySection() {
  return (
    <section className="py-20 bg-[#1a1212]">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-white mb-12">
          See the Quality of Feedback
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {examples.map((example) => (
            <div
              key={example.id}
              className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-800 hover:scale-105 transition-transform"
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

