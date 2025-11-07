import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-[#A45D40]/30 py-6 px-4">
      <div className="max-w-[960px] mx-auto flex flex-col sm:flex-row justify-between items-center text-center gap-4">
        <p className="text-sm text-white/60">© 2024 SketchSage. All rights reserved.</p>
        <div className="flex gap-6 text-sm">
          <Link className="text-white/60 hover:text-white transition-colors" href="#">Terms of Service</Link>
          <Link className="text-white/60 hover:text-white transition-colors" href="#">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  )
}

