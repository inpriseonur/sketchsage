import { createClient } from '@/lib/supabase/server'
import HowItWorksEditor from '@/components/admin/HowItWorksEditor'

export default async function HowItWorksPage() {
  const supabase = await createClient()
  
  const { data: enData } = await supabase
    .from('landing_content')
    .select('content')
    .eq('section', 'how_it_works')
    .eq('language', 'en')
    .single()

  const { data: trData } = await supabase
    .from('landing_content')
    .select('content')
    .eq('section', 'how_it_works')
    .eq('language', 'tr')
    .single()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">How It Works Yönetimi</h1>
        <p className="mt-2 text-sm text-white/60">
          Nasıl çalışır bölümünü düzenleyin
        </p>
      </div>

      <HowItWorksEditor 
        enContent={enData?.content as any} 
        trContent={trData?.content as any} 
      />
    </div>
  )
}

