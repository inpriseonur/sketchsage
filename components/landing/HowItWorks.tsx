const steps = [
  {
    number: 1,
    title: 'Send Your Sketch',
    description: 'Upload your artwork easily through our secure portal.',
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    ),
  },
  {
    number: 2,
    title: 'Select Feedback Type',
    description: 'Choose between detailed written notes or a personal audio critique.',
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    number: 3,
    title: 'Get Feedback',
    description: 'Receive actionable insights from a professional artist to improve your skills.',
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 bg-[#1b0f0f]">
      <div className="max-w-6xl mx-auto px-5">
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-[#f0e6e6]">How It Works</h2>
          <div className="h-0.5 w-24 bg-[#a43a2b] mt-3" />
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="mx-auto mb-5 inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-900/30 border border-orange-700 text-orange-500">
                {step.icon}
              </div>
              <h3 className="text-base font-semibold text-white mb-2">
                {step.number}. {step.title}
              </h3>
              <p className="text-sm text-gray-400 max-w-xs mx-auto leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

