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
    <section id="how-it-works">
        <h2 className="text-white text-[22px] font-bold tracking-[-0.015em] px-4 pb-3 pt-5 border-b-2 border-[#d41111]/30">
          How It Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 p-4 pt-10 md:p-8 md:pt-12 text-center text-white">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center justify-center size-24 bg-[#A45D40]/20 rounded-full border-2 border-[#D8753B]/50 p-4 backdrop-blur-sm">
              <svg className="w-12 h-12 text-[#D8753B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-bold">1. Send Your Sketch</h3>
              <p className="text-white/80 text-sm">Upload your artwork easily through our secure portal.</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center justify-center size-24 bg-[#A45D40]/20 rounded-full border-2 border-[#D8753B]/50 p-4 backdrop-blur-sm">
              <svg className="w-12 h-12 text-[#D8753B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-bold">2. Select Feedback Type</h3>
              <p className="text-white/80 text-sm">Choose between detailed written notes or a personal audio critique.</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center justify-center size-24 bg-[#A45D40]/20 rounded-full border-2 border-[#D8753B]/50 p-4 backdrop-blur-sm">
              <svg className="w-12 h-12 text-[#D8753B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-bold">3. Get Feedback</h3>
              <p className="text-white/80 text-sm">Receive actionable insights from a professional artist to improve your skills.</p>
            </div>
          </div>
        </div>
    </section>
  )
}

