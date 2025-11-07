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
    <section id="faq" className="mt-2">
        <h2 className="text-white text-[22px] font-bold tracking-[-0.015em] px-4 pb-3 pt-5 border-b-2 border-[#d41111]/30">
          Frequently Asked Questions
        </h2>
        <div className="flex flex-col gap-4 p-4">
          {faqs.map((faq, i) => (
            <div key={i} className="flex flex-col gap-2 border-b border-white/10 pb-4">
              <h3 className="text-lg font-bold text-white">{faq.question}</h3>
              <p className="text-white/80 text-base">{faq.answer}</p>
            </div>
          ))}
        </div>
    </section>
  )
}

