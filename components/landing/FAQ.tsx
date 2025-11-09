type FAQItem = {
  question: string
  answer: string
}

type FAQContent = {
  questions: FAQItem[]
}

export default function FAQ({ content }: { content?: FAQContent }) {
  const faqs = content?.questions || []
  return (
    <section id="faq">
        <h2 className="text-white text-[22px] font-bold tracking-[-0.015em] px-4 pb-3 pt-5 border-b-2 border-[#d41111]/30">
          Frequently Asked Questions
        </h2>
        <div className="flex flex-col gap-4 p-4 pt-8">
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

