'use client'

import { useState } from 'react'

const faqs = [
  {
    question: 'What kind of art can I submit?',
    answer: 'You can submit any form of sketches, including pencil, charcoal, ink, watercolor studies, and digital sketches. Our experts specialize in foundational art skills applicable to any medium.',
  },
  {
    question: 'How long does feedback take?',
    answer: 'Our standard turnaround time is 48-72 hours. We also offer an expedited option for feedback within 24 hours for an additional fee.',
  },
  {
    question: 'Who are the Sages?',
    answer: 'Our Sages are a curated team of professional artists, illustrators, and art educators with years of experience in both creating and teaching art. Each has a proven track record of providing constructive, actionable feedback.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="py-20 bg-[#1a1212]">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-white mb-12">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-[#2a1a1a] border border-gray-800 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-[#3a2a2a] transition-colors"
              >
                <span className="text-lg font-semibold text-white pr-8">
                  {faq.question}
                </span>
                <svg
                  className={`w-5 h-5 text-orange-500 transition-transform flex-shrink-0 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-5">
                  <p className="text-gray-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

