'use client'

const faqs = [
  {
    question: 'What kind of art can I submit?',
    answer:
      'You can submit any form of sketches, including pencil, charcoal, ink, watercolor studies, and digital sketches. Our experts specialize in foundational art skills applicable to any medium.',
  },
  {
    question: 'How long does feedback take?',
    answer:
      'Our standard turnaround time is 48-72 hours. We also offer an expedited option for feedback within 24 hours for an additional fee.',
  },
  {
    question: 'Who are the Sages?',
    answer:
      'Our Sages are a curated team of professional artists, illustrators, and art educators with years of experience in both creating and teaching art. Each has a proven track record of providing constructive, actionable feedback.',
  },
]

export default function FAQ() {
  return (
    <section id="faq" className="py-16 bg-[#1b0f0f]">
      <div className="max-w-4xl mx-auto px-5">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-[#f0e6e6]">Frequently Asked Questions</h2>
          <div className="h-0.5 w-24 bg-[#a43a2b] mt-3" />
        </div>

        <div className="divide-y divide-[#382121] border-y border-[#382121]">
          {faqs.map((faq, index) => (
            <div key={index} className="py-6">
              <h3 className="text-sm font-semibold text-white mb-2">{faq.question}</h3>
              <p className="text-sm leading-relaxed text-gray-400">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

